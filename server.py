"""
SkillBridge — Lightweight Python Flask + SQLite Backend API
Includes REST API endpoints, SQLite persistence, and SkillBridge AI Chatbot Copilot.
"""

import json
import os
import sqlite3
import urllib.request
import urllib.error
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

DB_PATH = os.path.join(os.path.dirname(__file__), 'skillbridge.db')
OLLAMA_API_URL = "http://127.0.0.1:11434"

# CORS Header Injection
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

# Database Initialization
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            client TEXT NOT NULL,
            client_type TEXT,
            category TEXT NOT NULL,
            skills TEXT NOT NULL,
            budget INTEGER NOT NULL,
            deadline TEXT,
            est_hours TEXT,
            description TEXT,
            escrow_funded INTEGER DEFAULT 1,
            status TEXT DEFAULT 'open',
            has_submission INTEGER DEFAULT 0,
            submission_notes TEXT,
            submission_image TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            project_title TEXT,
            client TEXT,
            budget INTEGER,
            student_payout INTEGER,
            platform_fee INTEGER,
            status TEXT,
            applied_date TEXT,
            can_review INTEGER DEFAULT 1
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS student (
            id INTEGER PRIMARY KEY,
            name TEXT,
            college TEXT,
            roll_no TEXT,
            degree TEXT,
            skills TEXT,
            wallet_balance INTEGER,
            rating REAL,
            is_id_verified INTEGER
        )
    ''')

    cursor.execute('SELECT COUNT(*) FROM projects')
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    cursor.execute('''
        INSERT OR REPLACE INTO student (id, name, college, roll_no, degree, skills, wallet_balance, rating, is_id_verified)
        VALUES (1, 'Student Freelancer', 'State Technical University', '2024-BCA-084', '2nd Year BCA',
                '["Graphic Design", "Canva", "HTML/CSS", "Instagram Reels", "Figma", "Social Media"]',
                450, 4.9, 1)
    ''')

    initial_projects = [
        ("proj-101", "Design 3 Festive Social Media Carousel Posters", "Company Client",
         "Local Business Partner", "Graphic Design", json.dumps(["Graphic Design", "Canva", "Social Media", "Figma"]),
         500, "2 Days", "4 Hours",
         "We are launching a promotional campaign this weekend. Need 3 high-impact 1080x1350 carousel slides following our modern brand tones.",
         1, "in-progress", 1,
         "Here is the finalized deliverable set for the promotional campaign. Created in high-resolution 1080x1350 with company branding guidelines applied!",
         "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80"),

        ("proj-102", "Build Responsive 1-Page Landing Page for Local Tuition Center", "Apex Scholars Academy",
         "Education / Coaching", "Web Development", json.dumps(["HTML/CSS", "Web Development", "JavaScript"]),
         1500, "4 Days", "8 Hours",
         "Need a clean, mobile-first landing page with an admissions inquiry form, batch timings table, and WhatsApp contact button for 10th/12th grade coaching.",
         1, "open", 0, None, None),

        ("proj-103", "Edit 30-Second High-Energy Instagram Reel for CrossFit Gym", "IronFit CrossFit Studio",
         "Fitness & Gym", "Video Editing", json.dumps(["Video Editing", "Instagram Reels", "CapCut"]),
         1000, "3 Days", "5 Hours",
         "We have raw phone footage of our morning workout session. Need quick cuts, trending upbeat audio sync, captions, and our gym logo overlay.",
         1, "open", 0, None, None),

        ("proj-104", "Diwali WhatsApp Promo Flyer & Price Menu Card", "Meera Designer Boutique",
         "Retail / Fashion", "Graphic Design", json.dumps(["Graphic Design", "Canva"]),
         500, "1 Day", "3 Hours",
         "Single-page elegant PDF and PNG flyer showcasing Diwali ethnic wear discount bundles. Clean typography and festive golden accents required.",
         1, "open", 0, None, None),

        ("proj-105", "Write 3 Engaging Local SEO Articles for Pet Care Clinic", "Happy Paws Veterinary Clinic",
         "Pet Healthcare", "Content Writing", json.dumps(["Content Writing", "Social Media", "SEO Basics"]),
         800, "5 Days", "6 Hours",
         "Write three 600-word beginner-friendly pet care guides: puppy vaccination schedules, monsoon tick prevention, and basic cat nutrition.",
         1, "open", 0, None, None)
    ]

    for p in initial_projects:
        cursor.execute('''
            INSERT INTO projects (id, title, client, client_type, category, skills, budget, deadline, est_hours, description, escrow_funded, status, has_submission, submission_notes, submission_image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', p)

    cursor.execute('''
        INSERT INTO applications (id, project_id, project_title, client, budget, student_payout, platform_fee, status, applied_date, can_review)
        VALUES ('app-1', 'proj-101', 'Design 3 Festive Social Media Carousel Posters', 'Company Client', 500, 450, 50, 'Submitted & In Review', 'Today', 1)
    ''')

# Python AI Matching
def python_match_score(project_skills, student_skills, budget):
    matched = [s for s in project_skills if any(s.lower() in st.lower() or st.lower() in s.lower() for st in student_skills)]
    ratio = len(matched) / max(len(project_skills), 1)
    skill_score = min(ratio, 1.0) * 60
    budget_score = 25 if 500 <= budget <= 2000 else 15
    availability_score = 15
    total = int(round(skill_score + budget_score + availability_score))
    return min(max(total, 45), 98), matched

# --- VAJRA SLM / LLM ASSISTANT LOGIC ---
def is_ollama_online():
    try:
        req = urllib.request.Request(f"{OLLAMA_API_URL}/api/tags", headers={"User-Agent": "SkillBridge"})
        with urllib.request.urlopen(req, timeout=1.0) as res:
            return res.status == 200
    except Exception:
        return False

def query_ollama(prompt, model="qwen2.5-coder:7b-instruct"):
    try:
        payload = json.dumps({
            "model": model,
            "prompt": prompt,
            "stream": False,
            "system": "You are SkillBridge AI, an intelligent AI assistant embedded in SkillBridge. You help college students write winning proposals, learn high-paying digital skills, and help local businesses scope micro-projects."
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{OLLAMA_API_URL}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10.0) as res:
            data = json.loads(res.read().decode("utf-8"))
            return data.get("response", "").strip()
    except Exception as e:
        return None

def vajra_domain_fallback(prompt, persona="student"):
    p_lower = prompt.lower()

    if any(k in p_lower for k in ["fee", "10%", "20%", "commission", "economic", "escrow", "cut", "split"]):
        return (
            "⚡ **SkillBridge Unit Economics & Fair Fee Structure:**\n\n"
            "• **SkillBridge Platform Fee:** Flat **10%** (Includes 18% GST invoice for businesses).\n"
            "• **Traditional Freelance Fee (Upwork/Fiverr):** Up to **20%**.\n\n"
            "📊 **Example on a ₹500 Standard Micro-Gig:**\n"
            "• *SkillBridge (10%):* Student receives **₹450**, Platform fee is **₹50**.\n"
            "• *Traditional (20%):* Student receives **₹400**, Platform fee is **₹100**.\n"
            "• *Student Advantage:* Student retains **+₹50 extra cash (+12.5% more net earnings!)**.\n\n"
            "🔒 All escrow funds are secured upfront and released upon deliverable sign-off."
        )

    if "proposal" in p_lower or "pitch" in p_lower or "apply" in p_lower or "bakery" in p_lower:
        return (
            "⚡ **SkillBridge Proposal Draft:**\n\n"
            "\"Namaste! I saw your requirement for the design deliverables. I am a college student specializing in digital design and modern media with active experience in Canva and Figma. "
            "I will create 3 high-converting 1080x1350 slides using modern brand colors and readable font pairings for mobile screens.\n\n"
            "✅ Delivery: Within 24-48 hours\n"
            "✅ Free Revisions: 1 included\n"
            "✅ Full Commercial IP Rights transferred upon milestone approval.\"\n\n"
            "*Tip: Click 'Insert into Proposal' to use this draft!*"
        )

    if "price" in p_lower or "budget" in p_lower or "charge" in p_lower or "website" in p_lower:
        return (
            "⚡ **SkillBridge Pricing Guidance for Micro-Gigs:**\n\n"
            "• **Basic 1-Page Landing Page:** ₹1,200 – ₹1,800 (HTML/CSS + Contact Form)\n"
            "• **Instagram Poster / Carousel (3 slides):** ₹500 – ₹800\n"
            "• **30-sec Short/Reel Edit:** ₹800 – ₹1,200 (Cut + Music + Captions)\n"
            "• **Diwali / Event Flyer:** ₹400 – ₹600\n\n"
            "💡 *Why this works:* Local shops cannot pay ₹15,000 agency rates, but ₹500–₹1,500 is an easy yes for them and builds your portfolio!"
        )

    if "skill" in p_lower or "learn" in p_lower or "earn" in p_lower:
        return (
            "⚡ **SkillBridge Student Skill Roadmap (2026-2027):**\n\n"
            "1. **From Canva ➔ Figma:** Local businesses pay 2x for Figma UI designs and social media design systems.\n"
            "2. **CapCut / Premiere Pro:** Short-form video reels are the #1 highest demanded micro-gig in Mumbai & Delhi.\n"
            "3. **Tailwind CSS + React/Vite:** Upgrades your landing page earnings from ₹1,500 to ₹4,000 per site.\n\n"
            "🎯 *Adding Figma and CapCut to your profile will boost your AI Match score to 98%!*"
        )

    if "post" in p_lower or "job" in p_lower or "hire" in p_lower or "business" in p_lower:
        return (
            "⚡ **SkillBridge Job Posting Template (For Businesses):**\n\n"
            "**Title:** Short-form Reel Editor for Fitness Studio\n"
            "**Category:** Video Editing\n"
            "**Budget:** ₹1,000 (Secured in SkillBridge Escrow)\n"
            "**Deliverables:** 1x 30-second vertical reel, background music sync, subtitles, and logo intro.\n"
            "**Deadline:** 2 Days\n\n"
            "Post this on SkillBridge and verified student editors will be matched within 5 minutes!"
        )

    # General default response
    return (
        f"⚡ **SkillBridge Copilot is active!**\n\n"
        f"I am analyzing your context ({persona.capitalize()} Mode). Here is what I can do for you:\n\n"
        f"• **Write high-converting proposals** for active micro-gigs\n"
        f"• **Recommend high-paying digital skills** to boost student match scores\n"
        f"• **Suggest fair micro-budgets** for small business digital tasks\n"
        f"• **Draft clean project descriptions** for ₹500–₹2,000 gigs\n\n"
        f"Ask me anything, or tap one of the quick prompts below!"
    )

# --- REST API ROUTES ---

@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health():
    ollama_ready = is_ollama_online()
    return jsonify({
        "status": "healthy",
        "backend": "Python Flask + SQLite",
        "database": "skillbridge.db",
        "vajraAssistant": {
            "name": "SkillBridge AI Copilot",
            "ollamaConnected": ollama_ready,
            "engine": "qwen2.5-coder:7b-instruct" if ollama_ready else "SkillBridge Heuristic Engine"
        },
        "version": "1.1.0"
    })

@app.route('/api/vajra/chat', methods=['POST'])
def vajra_chat():
    data = request.json or {}
    message = data.get('message', '').strip()
    persona = data.get('persona', 'student')

    if not message:
        return jsonify({"error": "Message is required"}), 400

    reply = None
    engine_used = "VAJRA Domain SLM"

    # Attempt query to local Ollama if running
    if is_ollama_online():
        prompt = f"User role: {persona}. User query: {message}"
        res = query_ollama(prompt)
        if res:
            reply = res
            engine_used = "qwen2.5-coder:7b-instruct (Ollama Local)"

    # Fallback to rich domain intelligence
    if not reply:
        reply = vajra_domain_fallback(message, persona)

    return jsonify({
        "reply": reply,
        "engine": engine_used,
        "assistant": "VAJRA AI"
    })

@app.route('/api/student', methods=['GET'])
def get_student():
    conn = get_db()
    row = conn.execute('SELECT * FROM student WHERE id = 1').fetchone()
    conn.close()
    if row:
        data = dict(row)
        data['skills'] = json.loads(data['skills'])
        data['isIdVerified'] = bool(data['is_id_verified'])
        data['walletBalance'] = data['wallet_balance']
        return jsonify(data)
    return jsonify({"error": "Student not found"}), 404

@app.route('/api/projects', methods=['GET'])
def get_projects():
    conn = get_db()
    rows = conn.execute('SELECT * FROM projects').fetchall()
    st_row = conn.execute('SELECT skills FROM student WHERE id = 1').fetchone()
    conn.close()

    student_skills = json.loads(st_row['skills']) if st_row else []

    projects = []
    for r in rows:
        p = dict(r)
        p['skills'] = json.loads(p['skills'])
        p['escrowFunded'] = bool(p['escrow_funded'])
        p['hasSubmission'] = bool(p['has_submission'])
        p['submissionNotes'] = p['submission_notes']
        p['submissionImage'] = p['submission_image']
        
        score, matched = python_match_score(p['skills'], student_skills, p['budget'])
        p['matchData'] = {
            "score": score,
            "matchedCount": len(matched),
            "totalRequired": len(p['skills']),
            "matchedSkills": matched
        }
        projects.append(p)

    return jsonify(projects)

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json or {}
    conn = get_db()
    proj_id = f"proj-{os.urandom(4).hex()}"
    skills_json = json.dumps(data.get('skills', []))

    conn.execute('''
        INSERT INTO projects (id, title, client, client_type, category, skills, budget, deadline, est_hours, description, escrow_funded, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'open')
    ''', (
        proj_id,
        data.get('title', 'Untitled Micro-Gig'),
        data.get('client', 'Verified Local Business'),
        data.get('clientType', 'Local Merchant'),
        data.get('category', 'General'),
        skills_json,
        data.get('budget', 500),
        data.get('deadline', '3 Days'),
        data.get('estHours', '4-6 Hours'),
        data.get('description', '')
    ))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "projectId": proj_id, "message": "Project deposited into escrow & saved to SQLite"}), 201

@app.route('/api/applications', methods=['GET'])
def get_applications():
    conn = get_db()
    rows = conn.execute('SELECT * FROM applications ORDER BY id DESC').fetchall()
    conn.close()
    apps = []
    for r in rows:
        a = dict(r)
        a['projectId'] = a['project_id']
        a['projectTitle'] = a['project_title']
        a['studentPayout'] = a['student_payout']
        a['platformFee'] = a['platform_fee']
        a['appliedDate'] = a['applied_date']
        a['canReview'] = bool(a['can_review'])
        apps.append(a)
    return jsonify(apps)

@app.route('/api/applications', methods=['POST'])
def apply_project():
    data = request.json or {}
    conn = get_db()
    app_id = f"app-{os.urandom(4).hex()}"

    budget = int(data.get('budget', 500))
    payout = int(round(budget * 0.9))
    fee = budget - payout

    conn.execute('''
        INSERT INTO applications (id, project_id, project_title, client, budget, student_payout, platform_fee, status, applied_date, can_review)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Submitted & In Review', 'Just now', 1)
    ''', (
        app_id,
        data.get('projectId'),
        data.get('projectTitle'),
        data.get('client'),
        budget,
        payout,
        fee
    ))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "applicationId": app_id, "takeHome": payout, "fee": fee}), 201

@app.route('/api/escrow/release', methods=['POST'])
def release_escrow():
    data = request.json or {}
    proj_id = data.get('projectId')

    conn = get_db()
    proj = conn.execute('SELECT * FROM projects WHERE id = ?', (proj_id,)).fetchone()
    if not proj:
        conn.close()
        return jsonify({"error": "Project not found"}), 404

    budget = proj['budget']
    payout = int(round(budget * 0.9))
    fee = budget - payout

    conn.execute('UPDATE projects SET status = "completed" WHERE id = ?', (proj_id,))
    conn.execute('UPDATE applications SET status = "Completed & Paid", can_review = 0 WHERE project_id = ?', (proj_id,))
    conn.execute('UPDATE student SET wallet_balance = wallet_balance + ? WHERE id = 1', (payout,))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "releasedToStudent": payout,
        "platformCommission": fee,
        "message": f"Released ₹{payout} to Student Wallet and captured ₹{fee} (10%) platform revenue."
    })

# Serve Frontend Root & Multi-Page Routes
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/jobs')
@app.route('/jobs/')
@app.route('/jobs/index.html')
@app.route('/pages/jobs.html')
def serve_jobs():
    if os.path.exists(os.path.join(os.path.dirname(__file__), 'jobs', 'index.html')):
        return send_from_directory('jobs', 'index.html')
    return send_from_directory('pages', 'jobs.html')

@app.route('/student')
@app.route('/student/')
@app.route('/student/index.html')
@app.route('/student-dashboard')
@app.route('/pages/student-dashboard.html')
def serve_student_dashboard():
    if os.path.exists(os.path.join(os.path.dirname(__file__), 'student', 'index.html')):
        return send_from_directory('student', 'index.html')
    return send_from_directory('pages', 'student-dashboard.html')

@app.route('/post-job')
@app.route('/post-job/')
@app.route('/post-job/index.html')
@app.route('/pages/post-job.html')
def serve_post_job():
    if os.path.exists(os.path.join(os.path.dirname(__file__), 'post-job', 'index.html')):
        return send_from_directory('post-job', 'index.html')
    return send_from_directory('pages', 'post-job.html')

@app.route('/economics')
@app.route('/economics/')
@app.route('/economics/index.html')
@app.route('/how-it-works')
@app.route('/pages/how-it-works.html')
def serve_how_it_works():
    if os.path.exists(os.path.join(os.path.dirname(__file__), 'economics', 'index.html')):
        return send_from_directory('economics', 'index.html')
    return send_from_directory('pages', 'how-it-works.html')

@app.route('/chatbot')
@app.route('/chatbot/')
@app.route('/chatbot/index.html')
def serve_chatbot():
    return send_from_directory('chatbot', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    init_db()
    print("=" * 60)
    print("🚀 SkillBridge Backend running on http://127.0.0.1:5000")
    print("⚡ SkillBridge AI Assistant API: http://127.0.0.1:5000/api/vajra/chat")
    print("💾 SQLite Database: skillbridge.db")
    print("=" * 60)
    app.run(host='127.0.0.1', port=5000, debug=True)
