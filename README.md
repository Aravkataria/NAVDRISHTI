# SkillBridge AI — Campus-to-Business Micro-Freelance Hub

> **Where College Digital Talent Meets Small Business Budgets.**  
> A micro-freelancing platform designed for Indian college students to build commercial portfolios while local small businesses (bakeries, salons, gyms, tutors) get affordable digital services (₹500–₹2,500).

---

## ⚡ Dual-Mode Architecture (Best of Both Worlds)

SkillBridge AI is designed with an intelligent **Dual-Mode System**:
1. **With Python Backend (Full Stack Mode):**
   * Powered by **Python (Flask)** with a local **SQLite** database (`skillbridge.db`).
   * Provides REST API endpoints (`/api/projects`, `/api/applications`, `/api/escrow/release`) with server-side AI matching and database persistence.
2. **Without Backend (Static / GitHub Pages Mode):**
   * When hosted on GitHub Pages or run without Python, the frontend automatically detects that the server is offline and falls back to **browser `localStorage`**.
   * **Zero errors, 100% functionality**, whether online, offline, or hosted statically.

---

## 🚀 How to Run

### Method 1: Full-Stack Mode (Python + Flask + SQLite)
1. Double-click [run_server.bat](file:///C:/Users/LENOVO/Desktop/startup/run_server.bat), or run in your terminal:
   ```powershell
   python server.py
   ```
2. Open your browser at:
   **[http://127.0.0.1:5000](http://127.0.0.1:5000)**
3. The top announcement bar will show: `● Python API (SQLite Active)`.

### Method 2: Instant Static Mode (Zero Setup)
1. Simply double-click [index.html](file:///C:/Users/LENOVO/Desktop/startup/index.html) in your file explorer.
2. Works offline immediately with `localStorage` persistence!

---

## 🛠️ Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & database connection status |
| `GET` | `/api/student` | Fetch verified student profile & active skill tags |
| `GET` | `/api/projects` | Fetch all active micro-gigs with server-calculated AI match % |
| `POST` | `/api/projects` | Post a new micro-gig and deposit simulated escrow into SQLite |
| `GET` | `/api/applications`| List student applications and review statuses |
| `POST` | `/api/applications`| Submit student application with standard IP transfer agreement |
| `POST` | `/api/escrow/release`| Release escrow: 90% to student wallet, 10% platform fee |

---

## 🏆 3-Minute Winning Pitch Script (For Judges)

* **0:00 – 0:35 | The Problem:**
  > *"Every year, millions of Indian college students learn Canva, video editing, and web design, but they face a brutal Catch-22: Upwork and Fiverr won't hire them because they don't have reviews, but they can't get reviews without gigs. Meanwhile, our local neighborhood businesses—like sweet shops, gyms, and tuition centers—need Instagram posters and simple websites, but cannot afford 20,000-rupee agency retainers."*

* **0:35 – 1:30 | The Solution (Show Persona Switcher & AI Matching):**
  > *"Enter **SkillBridge AI**. We match verified college students with small businesses for micro-gigs between ₹500 and ₹2,000. Right now, we are viewing as Priya, a 2nd-year BCA student. Our AI Matching Engine immediately scans her skills against local demand, giving her an instantaneous 96% Match on an Instagram design project for a local artisan bakery."*

* **1:30 – 2:15 | The Micro-Contract & Safe Escrow (Show Apply & Release):**
  > *"When Priya applies, she signs a built-in micro-contract assigning commercial IP rights to the client. Now, let's switch to the bakery owner's view. Sweet Delights Bakery sees Priya's submitted draft. They inspect the work, click **Approve & Release**, and the simulated escrow distributes the funds: ₹450 goes straight to Priya's wallet, while SkillBridge captures a clean 10% fee (₹50)."*

* **2:15 – 3:00 | The Business Model & Defensibility:**
  > *"Our platform take-rate is a transparent 10%, generating a GST-compliant invoice instantly. Students stay on our platform because every completed project earns them a verified College Experience Certificate and public portfolio proof that directly helps them land full-time jobs during campus placements."*

---

## 🌐 100% Free Hosting Deployment

* **GitHub Pages:**
  1. Push this folder to `https://github.com/Aravkataria/NAVDRISHTI`.
  2. Go to **Settings** > **Pages** > Select `main` branch > Click **Save**.
  3. Live URL: `https://aravkataria.github.io/NAVDRISHTI/`
* **Netlify Drop:** Drag and drop this folder directly into [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 📁 Repository Structure
```
├── server.py        # Python Flask backend with REST API & SQLite database
├── run_server.bat   # 1-Click Windows launcher for the Python server
├── requirements.txt # Python dependencies (Flask)
├── index.html       # Main semantic single-page application structure & modals
├── styles.css       # Custom SaaS design system, animations & responsive styling
├── app.js           # Dual-mode engine (Flask API consumer + LocalStorage fallback)
├── README.md        # Documentation, pitch script, and architecture guide
└── .gitignore       # Standard git ignore file
```
