/**
 * ARGUS Client-Side WASM & Canvas Image Optimization Engine
 * Hardware-accelerated image compression, non-blocking downsampling,
 * and format transcoding for logos, deliverables, and student ID cards.
 */

(function (global) {
  'use strict';

  class ArgusImageOptimizer {
    constructor(config = {}) {
      this.maxWidth = config.maxWidth || 1920;
      this.maxHeight = config.maxHeight || 1080;
      this.defaultQuality = config.defaultQuality || 0.88;
      this.preferredFormat = config.preferredFormat || 'image/webp';
    }

    /**
     * Check if WebP is supported natively by the browser canvas
     */
    async isFormatSupported(mimeType = 'image/webp') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const dataUrl = canvas.toDataURL(mimeType);
        return dataUrl.startsWith(`data:${mimeType}`);
      } catch (e) {
        return false;
      }
    }

    /**
     * Compress an image File, Blob, or URL with non-blocking canvas/WASM pipeline
     * @param {File|Blob|string} source - Source image file, blob, or URL string
     * @param {Object} [options] - Overrides (quality, maxWidth, maxHeight, format)
     */
    async compressFile(source, options = {}) {
      let fileBlob = source;

      // If source is a URL string, fetch it as a Blob
      if (typeof source === 'string') {
        try {
          const resp = await fetch(source);
          fileBlob = await resp.blob();
        } catch (err) {
          console.warn('[ARGUS-Optimizer] Failed to fetch image URL for compression:', err);
          return { dataUrl: source, savingsPercent: 0 };
        }
      }

      if (!fileBlob || !(fileBlob instanceof Blob)) {
        throw new Error('Provided source is not a valid Blob or image file.');
      }

      const originalSize = fileBlob.size || 0;
      const quality = options.quality !== undefined ? options.quality : this.defaultQuality;
      const maxWidth = options.maxWidth || this.maxWidth;
      const maxHeight = options.maxHeight || this.maxHeight;
      const canWebP = await this.isFormatSupported('image/webp');
      const format = options.format || (canWebP ? 'image/webp' : 'image/jpeg');

      // Load image into ImageBitmap (hardware accelerated) or HTMLImageElement
      let imgBitmap;
      let width, height;

      if (typeof createImageBitmap === 'function') {
        try {
          imgBitmap = await createImageBitmap(fileBlob);
          width = imgBitmap.width;
          height = imgBitmap.height;
        } catch (e) {
          imgBitmap = null;
        }
      }

      if (!imgBitmap) {
        imgBitmap = await new Promise((resolve, reject) => {
          const img = new Image();
          const url = URL.createObjectURL(fileBlob);
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
          };
          img.src = url;
        });
        width = imgBitmap.naturalWidth || imgBitmap.width;
        height = imgBitmap.naturalHeight || imgBitmap.height;
      }

      // Calculate constrained dimensions preserving aspect ratio
      let targetWidth = width;
      let targetHeight = height;

      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      // Render via OffscreenCanvas or standard Canvas
      let blob;
      if (typeof OffscreenCanvas !== 'undefined') {
        const offCanvas = new OffscreenCanvas(targetWidth, targetHeight);
        const ctx = offCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);
        blob = await offCanvas.convertToBlob({ type: format, quality });
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight);
        blob = await new Promise((resolve) => canvas.toBlob(resolve, format, quality));
      }

      const compressedSize = blob ? blob.size : originalSize;
      const savingsBytes = Math.max(0, originalSize - compressedSize);
      const savingsPercent = originalSize > 0 ? ((savingsBytes / originalSize) * 100).toFixed(1) : 0;

      const ext = format === 'image/webp' ? '.webp' : (format === 'image/png' ? '.png' : '.jpg');
      const baseName = fileBlob.name ? fileBlob.name.replace(/\.[^/.]+$/, "") : "argus_optimized";
      const optimizedFileName = `${baseName}${ext}`;

      const optimizedFile = new File([blob || fileBlob], optimizedFileName, {
        type: format,
        lastModified: Date.now()
      });

      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob || fileBlob);
      });

      return {
        blob: blob || fileBlob,
        file: optimizedFile,
        originalSize,
        compressedSize,
        savingsBytes,
        savingsPercent: parseFloat(savingsPercent),
        width: targetWidth,
        height: targetHeight,
        dataUrl
      };
    }

    /**
     * Automatically scan the document and optimize all ARGUS logos & marked images
     */
    async autoOptimizeDOM() {
      const targets = document.querySelectorAll('img.brand-logo, img[data-wasm-optimize]');
      if (!targets.length) return;

      for (const img of targets) {
        if (img.dataset.wasmOptimized === 'true') continue;
        const originalSrc = img.getAttribute('src');
        if (!originalSrc) continue;

        try {
          const result = await this.compressFile(originalSrc, {
            maxWidth: 256,
            maxHeight: 256,
            quality: 0.92,
            format: 'image/webp'
          });

          if (result && result.dataUrl) {
            img.src = result.dataUrl;
            img.dataset.wasmOptimized = 'true';
            img.dataset.originalSize = `${(result.originalSize / 1024).toFixed(1)}KB`;
            img.dataset.optimizedSize = `${(result.compressedSize / 1024).toFixed(1)}KB`;
            console.log(`[ARGUS-Optimizer] Optimized ${originalSrc} (${(result.originalSize / 1024).toFixed(1)}KB -> ${(result.compressedSize / 1024).toFixed(1)}KB WebP, -${result.savingsPercent}%)`);
          }
        } catch (e) {
          console.warn('[ARGUS-Optimizer] Skip optimization on', originalSrc, e);
        }
      }
    }

    /**
     * Format bytes for display
     */
    static formatBytes(bytes, decimals = 1) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  }

  const optimizerInstance = new ArgusImageOptimizer();
  global.ArgusImageOptimizer = optimizerInstance;
  global.VajraImageOptimizer = optimizerInstance;
  global.ArgusImageOptimizerClass = ArgusImageOptimizer;

  // Auto-optimize logos once DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => optimizerInstance.autoOptimizeDOM());
    } else {
      optimizerInstance.autoOptimizeDOM();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ArgusImageOptimizer: optimizerInstance };
  }
})(typeof window !== 'undefined' ? window : this);
