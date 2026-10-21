# SkillBridge AI — System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (Dual-Mode SPA)"]
        Index["index.html (Home)"]
        Jobs["pages/jobs.html (Search & Feed)"]
        Student["pages/student-dashboard.html (Profile)"]
        Post["pages/post-job.html (Merchant Hub)"]
        How["pages/how-it-works.html (Economics)"]
        VajraWidget["VAJRA AI Chatbot (SLM Widget)"]
        ThemeEngine["Theme Controller (Dark / Light)"]
    end

    subgraph State["State & Routing Manager (app.js)"]
        LocalState["Browser LocalStorage (Offline Mode)"]
        APIChecker["Health & Dual-Mode Detector"]
    end

    subgraph Backend["Python Flask Backend (server.py)"]
        REST["REST API Endpoints (/api/...)"]
        Matcher["Python Heuristic Matching Engine"]
        VajraServer["VAJRA SLM Router (Ollama / Domain)"]
        SQLiteDB[("SQLite Database (skillbridge.db)")]
    end

    subgraph LLM["Local AI Models (Optional)"]
        OllamaLocal["Ollama (qwen2.5-coder:7b-instruct)"]
    end

    Index --> State
    Jobs --> State
    Student --> State
    Post --> State
    How --> State
    VajraWidget --> State

    State --> APIChecker
    APIChecker -- "Backend Offline" --> LocalState
    APIChecker -- "Backend Online" --> REST

    REST --> Matcher
    REST --> SQLiteDB
    VajraServer --> SQLiteDB
    VajraServer -- "If Ollama running" --> OllamaLocal
```

## Key Architectural Principles
1. **Zero-Failure Pitch:** If the Python server or internet fails, the application automatically degrades to in-browser `localStorage`.
2. **Deterministic Matching Formula:**
   $$\text{Score} = (\text{Skill Overlap Ratio} \times 60) + (\text{Budget Fit} \times 25) + (\text{Availability} \times 15)$$
3. **Multi-Page Separation:** Clear separation of concerns between Home, Discovery, Student Hub, Merchant Hub, and Economics.
