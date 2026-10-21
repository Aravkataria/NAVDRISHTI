# SkillBridge AI — Campus-to-Business Micro-Freelance Hub

> **Where College Digital Talent Meets Small Business Budgets.**  
> A micro-freelancing platform designed for Indian college students to build commercial portfolios while local small businesses (bakeries, salons, gyms, tutors) get affordable digital services (₹500–₹2,500).

---

## 📁 Clean Project & Folder Structure

```
startup/
│
├── index.html                   # 🏠 Main Front / Landing Page
├── styles.css                   # 🎨 Design System (Light & Dark Theme)
├── app.js                       # ⚡ Unified Router, State Manager & VAJRA AI
├── server.py                    # 🐍 Python Flask Backend API & SQLite Database
├── run_server.bat               # 🚀 1-Click Server Launcher
├── requirements.txt             # 📦 Python Dependencies (Flask)
├── README.md                    # 📖 Project Overview & Quick Start Guide
│
├── pages/                       # 📄 Interior Portal Pages
│   ├── jobs.html                # 🔍 Job Finding & Discovery Page
│   ├── student-dashboard.html   # 🎓 Student Career Hub & Portfolio
│   ├── post-job.html            # 🏪 Business Merchant Hub & Post a Gig
│   └── how-it-works.html        # 📊 Unit Economics & Escrow Guide
│
└── docs/                        # 📚 Pitch Deck & Technical Documentation
    ├── PITCH_DECK_SCRIPT.md     # 🏆 3-Minute Pitch Script & Judge Q&A
    ├── SYSTEM_ARCHITECTURE.md   # 🏗️ Architecture Flow & Data Diagram
    └── LEGAL_AND_COMPLIANCE.md  # ⚖️ Indian Contract Act, IP & Tax Guide
```

---

## 🌟 Multi-Page Application Breakdown

1. **[index.html](file:///C:/Users/LENOVO/Desktop/startup/index.html) — Main Front Page:**
   * SaaS hero banner with value proposition, student earnings metrics ticker, top AI matched micro-gigs preview, and quick access portals.
2. **[pages/jobs.html](file:///C:/Users/LENOVO/Desktop/startup/pages/jobs.html) — Job Finding & Discovery:**
   * Live search bar, category filter pills (*Design, Web, Social, Video, Writing*), AI match percentage ranking, and 1-click application modal.
3. **[pages/student-dashboard.html](file:///C:/Users/LENOVO/Desktop/startup/pages/student-dashboard.html) — Student Career Hub:**
   * Priya Sharma's college-verified profile, skill tag manager, application milestone tracker, and simulated UPI withdrawal balance.
4. **[pages/post-job.html](file:///C:/Users/LENOVO/Desktop/startup/pages/post-job.html) — Business Merchant Hub:**
   * Sweet Delights Bakery portal to post micro-gigs, inspect student drafts, release escrow payouts, and generate GST-ready tax receipts.
5. **[pages/how-it-works.html](file:///C:/Users/LENOVO/Desktop/startup/pages/how-it-works.html) — Economics & Escrow Guide:**
   * Interactive 10% platform revenue calculator slider, legal micro-contract explanation (automatic IP copyright assignment), and tax compliance.

---

## 🌙 Dark / Light Mode Support

* Includes a persistent **Theme Switcher** in the navigation bar (`🌙 / ☀️`).
* Respects system preferences and saves the user choice in `localStorage`.
* Custom CSS variables for deep contrast, smooth transitions, and glowing dark-mode accents.

---

## ⚡ VAJRA AI — The Freelance Copilot

Present across **every page** via the floating lightning widget (`⚡ Ask VAJRA AI`):
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
