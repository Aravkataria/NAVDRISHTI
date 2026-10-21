# Deploying SkillBridge AI to Render (Free 24/7 Hosting)

Render provides free hosting for Python/Flask web services. By default, free services sleep after 15 minutes of inactivity. Using a **Cloudflare Worker Cron Trigger** or **Cron-job.org / UptimeRobot**, you can ping the server every 10 minutes to keep it awake 24/7 at zero cost!

---

## 🚀 Part 1: Deploy on Render (Takes 2 Minutes)

1. Sign up / Log in to [render.com](https://render.com) (using your GitHub account).
2. Click **New +** $\rightarrow$ select **Web Service**.
3. Select your repository: `Aravkataria/NAVDRISHTI`.
   *(Render supports Private repositories for free! Just grant permission to your repo)*.
4. Fill in the settings (Render will auto-detect from `render.yaml`):
   * **Name:** `skillbridge-ai`
   * **Language:** `Python 3`
   * **Branch:** `main`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `gunicorn server:app`
   * **Instance Type:** `Free`
5. Click **Create Web Service**.
6. In ~90 seconds, Render will deploy your service and give you a live URL:
   `https://skillbridge-ai.onrender.com`

---

## ⚡ Part 2: Keep Render Awake 24/7 with Cloudflare Worker

### Option A: Cloudflare Worker Cron Trigger (100% Free)

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com) $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Worker**.
2. Name it `render-keep-alive`.
3. In the Worker code editor, paste this exact script:

```javascript
export default {
  // Runs automatically on the Cron schedule
  async scheduled(event, env, ctx) {
    const renderUrl = "https://skillbridge-ai.onrender.com/api/health";
    try {
      const response = await fetch(renderUrl, {
        headers: { "User-Agent": "Cloudflare-KeepAlive-Worker" }
      });
      console.log(`Pinged Render at ${new Date().toISOString()}: Status ${response.status}`);
    } catch (err) {
      console.error("Keep-alive ping failed:", err);
    }
  },

  // Optional manual test via browser URL
  async fetch(request, env, ctx) {
    return new Response("SkillBridge Render Keep-Alive Worker is Active!");
  }
};
```

4. Click **Deploy**.
5. Go to your Worker's **Settings** $\rightarrow$ **Triggers** $\rightarrow$ **Add Cron Trigger**.
6. Set the Cron Schedule to:
   ```cron
   */10 * * * *
   ```
   *(This triggers every 10 minutes, preventing Render's 15-minute sleep threshold!)*

---

### Option B: Even Simpler Alternative (UptimeRobot / Cron-Job.org — 30 Seconds)

If you don't want to write Cloudflare Worker code:
1. Go to [cron-job.org](https://cron-job.org) or [uptimerobot.com](https://uptimerobot.com) (both 100% free forever).
2. Create a new monitor/job:
   * **URL:** `https://skillbridge-ai.onrender.com/api/health`
   * **Interval:** Every 10 minutes.
3. Save. It will ping your Render backend every 10 minutes 24/7 with zero maintenance.
