"""
SkillBridge AI — Lightweight Python Flask + SQLite Backend API
Provides REST API endpoints, SQLite persistence, and Python heuristic matching.
Can also serve the frontend directly at http://127.0.0.1:5000
"""

import json
import os
import sqlite3
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

DB_PATH = os.path.join(os.path.dirname(__file__), 'skillbridge.db')

# CORS Header Injection (No extra pip library needed)
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

    # 1. Projects Table
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

    # 2. Applications Table
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

    # 3. Student Profile Table
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

    # Seed initial data if table is empty
    cursor.execute('SELECT COUNT(*) FROM projects')
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    # Seed Student
    cursor.execute('''
        INSERT OR REPLACE INTO student (id, name, college, roll_no, degree, skills, wallet_balance, rating, is_id_verified)
        VALUES (1, 'Priya Sharma', 'St. Xavier''s College, Mumbai', '2024-BCA-084', '2nd Year BCA',
                '["Graphic Design", "Canva", "HTML/CSS", "Instagram Reels", "Figma", "Social Media"]',
                450, 4.9, 1)
    ''')

    # Seed Projects
    initial_projects = [
        ("proj-101", "Design 3 Festive Instagram Carousel Posters for Sourdough Sale", "Sweet Delights Artisan Bakery",
         "Bakery / Cafe", "Graphic Design", json.dumps(["Graphic Design", "Canva", "Social Media", "Figma"]),
         500, "2 Days", "4 Hours",
         "We are running a 20% discount on sourdough loaves this weekend. Need 3 mouth-watering 1080x1350 Instagram carousel slides following our pastel warm brand tones.",
         1, "in-progress", 1,
         "Here is the finalized Instagram poster set for the Weekend Sourdough Special. Created in high-resolution 1080x1350 with bakery branding guidelines applied!",
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

    # Seed Application
    cursor.execute('''
        INSERT INTO applications (id, project_id, project_title, client, budget, student_payout, platform_fee, status, applied_date, can_review)
        VALUES ('app-1', 'proj-101', 'Design 3 Festive Instagram Carousel Posters for Sourdough Sale', 'Sweet Delights Artisan Bakery', 500, 450, 50, 'Submitted & In Review', 'Today', 1)
    ''')

# Python AI Matching Function
def python_match_score(project_skills, student_skills, budget):
    matched = [s for s in project_skills if any(s.lower() in st.lower() or st.lower() in s.lower() for st in student_skills)]
    ratio = len(matched) / max(len(project_skills), 1)
    skill_score = min(ratio, 1.0) * 60
    budget_score = 25 if 500 <= budget <= 2000 else 15
    availability_score = 15
    total = int(round(skill_score + budget_score + availability_score))
    return min(max(total, 45), 98), matched

# --- REST API ROUTES ---

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "backend": "Python Flask + SQLite",
        "database": "skillbridge.db",
        "version": "1.0.0"
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
    
    # Also fetch student skills to compute server-side AI match scores
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
        
        # Calculate Python heuristic match score
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

    # Update project status
    conn.execute('UPDATE projects SET status = "completed" WHERE id = ?', (proj_id,))
    # Update application status
    conn.execute('UPDATE applications SET status = "Completed & Paid", can_review = 0 WHERE project_id = ?', (proj_id,))
    # Credit student wallet
    conn.execute('UPDATE student SET wallet_balance = wallet_balance + ? WHERE id = 1', (payout,))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "releasedToStudent": payout,
        "platformCommission": fee,
        "message": f"Released ₹{payout} to Student Wallet and captured ₹{fee} (10%) platform revenue."
    })

# Serve Frontend Root & Assets
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    init_db()
    print("=" * 60)
    print("🚀 SkillBridge AI Backend running on http://127.0.0.1:5000")
    print("💾 SQLite Database: skillbridge.db")
    print("=" * 60)
    app.run(host='127.0.0.1', port=5000, debug=True)
