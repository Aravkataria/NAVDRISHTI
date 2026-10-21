# SkillBridge AI — Campus-to-Business Micro-Freelance Hub

> **Where College Digital Talent Meets Small Business Budgets.**  
> A micro-freelancing platform designed for Indian college students to build commercial portfolios while local small businesses (bakeries, salons, gyms, tutors) get affordable digital services (₹500–₹2,500).

---

## 🌟 Multi-Page Application Architecture

SkillBridge AI features a full-fledged **multi-page portal architecture** with unified state persistence, seamless navigation, and dark mode support:

1. **[index.html](file:///C:/Users/LENOVO/Desktop/startup/index.html) — Home / Front Page:**
   * High-converting SaaS landing page with hero banner, live student earnings ticker, top matched gig preview, and quick portals.
2. **[jobs.html](file:///C:/Users/LENOVO/Desktop/startup/jobs.html) — Job Finding & Discovery Page:**
   * Search bar with live keyword filtering, category tabs (Design, Web, Video, Content, Social Media), smart AI match ranking, and 1-click application modal.
3. **[student-dashboard.html](file:///C:/Users/LENOVO/Desktop/startup/student-dashboard.html) — Student Career Hub:**
   * Priya Sharma's college-verified profile, skill tag manager, availability preferences, applications milestone tracker, and simulated UPI withdrawal ledger.
4. **[post-job.html](file:///C:/Users/LENOVO/Desktop/startup/post-job.html) — Business Merchant Hub:**
   * Sweet Delights Bakery portal to post new micro-gigs, inspect student drafts, release escrow payouts, and generate GST-ready tax invoices.
5. **[how-it-works.html](file:///C:/Users/LENOVO/Desktop/startup/how-it-works.html) — Economics & Legal Guide:**
   * Interactive 10% platform revenue calculator slider, legal micro-contract explanation (automatic IP copyright assignment), and tax compliance (TDS & 18% GST).

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
3. Routes available: `/`, `/jobs`, `/student-dashboard`, `/post-job`, `/how-it-works`.

### Method 2: Instant Static Mode (Zero Setup)
1. Double-click [index.html](file:///C:/Users/LENOVO/Desktop/startup/index.html) in your file explorer.
2. Navigate seamlessly between pages with `localStorage` state persistence.

---

## 🛠️ Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & database connection status |
| `POST`| `/api/vajra/chat` | VAJRA SLM Copilot conversational reasoning endpoint |
| `GET` | `/api/student` | Fetch verified student profile & active skill tags |
| `GET` | `/api/projects` | Fetch all active micro-gigs with server-calculated AI match % |
| `POST` | `/api/projects` | Post a new micro-gig and deposit simulated escrow into SQLite |
| `GET` | `/api/applications`| List student applications and review statuses |
| `POST` | `/api/applications`| Submit student application with standard IP transfer agreement |
| `POST` | `/api/escrow/release`| Release escrow: 90% to student wallet, 10% platform fee |

---

## 🌐 100% Free Hosting Deployment

* **GitHub Pages:**
  1. Push code to `https://github.com/Aravkataria/NAVDRISHTI`.
  2. Go to **Settings** > **Pages** > Select `main` branch > Click **Save**.
  3. Live URL: `https://aravkataria.github.io/NAVDRISHTI/`
* **Netlify Drop:** Drag and drop this folder directly into [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 📁 Repository Structure
```
├── index.html              # Home / Front Page
├── jobs.html               # Job Finding & Discovery Page
├── student-dashboard.html  # Student Career & Portfolio Hub
├── post-job.html           # Merchant Hub & Post a Gig
├── how-it-works.html       # Unit Economics & Legal Escrow Guide
├── server.py               # Python Flask backend with multi-page routing & SQLite
├── run_server.bat          # 1-Click Windows launcher for Python server
├── requirements.txt        # Python dependencies
├── styles.css              # Dark/Light SaaS design system & responsive styling
├── app.js                  # Multi-page state manager & VAJRA AI copilot engine
├── README.md               # Documentation and pitch guide
└── .gitignore              # Standard git ignore file
```
