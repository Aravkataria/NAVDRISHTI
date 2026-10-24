# SkillBridge — Evidence-Driven Campus Micro-Freelancing & Escrow Hub

> **Where College Digital Talent Meets Small Business Budgets.**  
> A micro-freelancing platform designed for college students to build commercial portfolios while local small businesses (bakeries, salons, gyms, tutors, startups) get affordable digital services (₹500–₹2,500) backed by instant smart escrow and automated milestone verification.

---

## 📁 Clean Multi-Page Project Structure

```
startup/
│
├── index.html                   # 🏠 Main Front / Overview Page
├── logo.jpeg                    # 🛡️ Official SkillBridge Brand Identity Logo
├── styles.css                   # 🎨 Design System (Minimalist Dark & Light Theme)
├── app.js                       # ⚡ Unified Router, State Manager & SkillBridge AI
├── server.py                    # 🐍 Python Flask Backend API & SQLite Database (skillbridge.db)
├── run_server.bat               # 🚀 1-Click Server Launcher
├── requirements.txt             # 📦 Python Dependencies (Flask)
├── README.md                    # 📖 Project Overview & Quick Start Guide
│
├── js/
│   └── wasm-image-optimizer.js  # ⚡ Hardware-accelerated WASM/Canvas image pipeline
│
├── jobs/                        # 🔍 Marketplace Directory (/jobs/)
│   ├── index.html
│   └── logo.jpeg
├── student/                     # 🎓 Student Career Hub (/student/)
│   ├── index.html
│   └── logo.jpeg
├── post-job/                    # 🏪 Merchant Portal (/post-job/)
│   ├── index.html
│   └── logo.jpeg
├── economics/                   # 📊 Unit Economics & Escrow Guide (/economics/)
│   ├── index.html
│   └── logo.jpeg
├── chatbot/                     # ⚡ Full-Screen SkillBridge AI Copilot (/chatbot/)
│   ├── index.html
│   └── logo.jpeg
│
├── pages/                       # 📄 Mirror Portal Pages (Legacy support)
│   ├── jobs.html
│   ├── student-dashboard.html
│   ├── post-job.html
│   └── how-it-works.html
│
└── docs/                        # 📚 Pitch Deck & Technical Documentation
    ├── PITCH_DECK_SCRIPT.md     # 🏆 3-Minute Pitch Script & Judge Q&A
    ├── SYSTEM_ARCHITECTURE.md   # 🏗️ Architecture Flow & Data Diagram
    └── LEGAL_AND_COMPLIANCE.md  # ⚖️ Micro-Contract, IP & Tax Guide
```

---

## 🌟 Multi-Page Application Breakdown

1. **[index.html](file:///C:/Users/LENOVO/Desktop/startup/index.html) — Main Front Page:**
   * High-impact hero banner, campus earnings metrics ticker, top AI matched micro-gigs preview, interactive escrow pipeline, and quick access portals.
2. **[jobs/index.html](file:///C:/Users/LENOVO/Desktop/startup/jobs/index.html) — Marketplace:**
   * Real-time search bar, category filter pills (*Design, Web, Social, Video, Writing*), AI match percentage ranking, and 1-click application modal.
3. **[student/index.html](file:///C:/Users/LENOVO/Desktop/startup/student/index.html) — Student Career Hub:**
   * College-verified profile, skill tag manager, application milestone tracker, and simulated UPI withdrawal balance.
4. **[post-job/index.html](file:///C:/Users/LENOVO/Desktop/startup/post-job/index.html) — Merchant Portal:**
   * Portal to post micro-gigs, inspect student drafts, release escrow payouts, and generate GST-ready tax receipts.
5. **[economics/index.html](file:///C:/Users/LENOVO/Desktop/startup/economics/index.html) — Economics & Escrow Guide:**
   * Interactive 10% platform revenue calculator slider, legal micro-contract explanation (automatic IP copyright assignment), and tax compliance.
6. **[chatbot/index.html](file:///C:/Users/LENOVO/Desktop/startup/chatbot/index.html) — SkillBridge AI Copilot:**
   * Dedicated full-screen AI workspace for drafting winning proposals, pricing guidance, and job scoping.

---

## ⚡ Client-Side WASM Image Optimization

SkillBridge includes a non-blocking WebAssembly/Canvas image optimizer engine (`js/wasm-image-optimizer.js`):
* **Hardware-Accelerated Downsampling:** Automatically converts and compresses `logo.jpeg` and user deliverable uploads into high-efficiency WebP format in memory.
* **Non-Destructive Zero-Latency Swapping:** Automatically scans all `img.brand-logo` and `img[data-wasm-optimize]` elements at load time.
* **Data Savings Calculation:** Reports precise payload reductions in browser console.

---

## 🌙 Dark / Light Mode Support

* Includes a persistent **Theme Switcher** in the navigation bar (`🌙 / ☀️`).
* Respects system preferences and saves user choice in `localStorage`.
* Custom CSS variables for pitch black (`#000000`), spark amber (`#f5b400`), clean cards, and smooth transitions.

---

## ⚡ SkillBridge AI Copilot

Present across **every page** via the floating drawer (`⚡ Ask SkillBridge AI`) and standalone workspace at `/chatbot/`:
* **Student Proposals:** Automatically writes tailored pitches with 1-click insertion into project applications.
* **Skill Recommendations:** Advises which skills to learn to upgrade earnings from ₹500 to ₹2,500.
* **Pricing & Job Scoping:** Helps merchants price micro-gigs fairly.
* **Dual-Engine:** Uses local **Ollama** (`qwen2.5-coder:7b-instruct`) when running, or instant built-in domain reasoning engine when offline.

---

## 🚀 How to Run

### Method 1: Full-Stack Mode (Python + Flask + SQLite)
1. Double-click [run_server.bat](file:///C:/Users/LENOVO/Desktop/startup/run_server.bat) or run:
   ```powershell
   python server.py
   ```
2. Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser.

### Method 2: Instant Static Mode (Zero Setup)
1. Double-click [index.html](file:///C:/Users/LENOVO/Desktop/startup/index.html) in your file explorer.
2. Navigate seamlessly between pages with `localStorage` state persistence.

---

## 🌐 100% Free Hosting Deployment

* **GitHub Pages:**
  1. Push code to `https://github.com/Aravkataria/NAVDRISHTI`.
  2. Go to **Settings** > **Pages** > Select `main` branch > Click **Save**.
  3. Live URL: `https://aravkataria.github.io/NAVDRISHTI/`
* **Netlify Drop:** Drag and drop this folder directly into [app.netlify.com/drop](https://app.netlify.com/drop).
* **Student Proposals:** Automatically writes tailored pitches with 1-click insertion into project applications.
* **Skill Recommendations:** Advises which skills to learn to upgrade earnings from ₹500 to ₹2,500.
* **Pricing & Job Scoping:** Helps merchants price micro-gigs fairly.
* **Dual-Engine:** Uses local **Ollama** (`qwen2.5-coder:7b-instruct`) when running, or instant built-in domain reasoning engine when offline.

---

## 🚀 How to Run

### Method 1: Full-Stack Mode (Python + Flask + SQLite)
1. Double-click [run_server.bat](file:///C:/Users/LENOVO/Desktop/startup/run_server.bat) or run:
   ```powershell
   python server.py
   ```
2. Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser.

### Method 2: Instant Static Mode (Zero Setup)
1. Double-click [index.html](file:///C:/Users/LENOVO/Desktop/startup/index.html) in your file explorer.
2. Navigate seamlessly between pages with `localStorage` state persistence.

---

## 🌐 100% Free Hosting Deployment

* **GitHub Pages:**
  1. Push code to `https://github.com/Aravkataria/NAVDRISHTI`.
  2. Go to **Settings** > **Pages** > Select `main` branch > Click **Save**.
  3. Live URL: `https://aravkataria.github.io/NAVDRISHTI/`
* **Netlify Drop:** Drag and drop this folder directly into [app.netlify.com/drop](https://app.netlify.com/drop).
