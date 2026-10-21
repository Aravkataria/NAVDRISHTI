/**
 * SkillBridge AI — Core Prototype Application Engine
 * Pure Vanilla JavaScript (ES6+) • Dual-Mode Architecture (Flask SQLite API + LocalStorage Fallback)
 */

// Initial Seed Data (Used for LocalStorage fallback or offline mode)
const DEFAULT_STUDENT = {
  name: "Priya Sharma",
  college: "St. Xavier's College, Mumbai",
  rollNo: "2024-BCA-084",
  degree: "2nd Year BCA",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Passionate graphic designer & frontend developer. Looking to build real commercial portfolio items for local cafes, startups, and bakeries.",
  skills: ["Graphic Design", "Canva", "HTML/CSS", "Instagram Reels", "Figma", "Social Media"],
  weeklyHours: 8,
  minBudget: 500,
  maxBudget: 2500,
  walletBalance: 450,
  completedGigs: 3,
  rating: 4.9,
  isIdVerified: true
};

const DEFAULT_PROJECTS = [
  {
    id: "proj-101",
    title: "Design 3 Festive Instagram Carousel Posters for Sourdough Sale",
    client: "Sweet Delights Artisan Bakery",
    clientType: "Bakery / Cafe",
    category: "Graphic Design",
    skills: ["Graphic Design", "Canva", "Social Media", "Figma"],
    budget: 500,
    deadline: "2 Days",
    estHours: "4 Hours",
    description: "We are running a 20% discount on sourdough loaves this weekend. Need 3 mouth-watering 1080x1350 Instagram carousel slides following our pastel warm brand tones.",
    escrowFunded: true,
    status: "in-progress",
    hasSubmission: true,
    submissionNotes: "Here is the finalized Instagram poster set for the Weekend Sourdough Special. Created in high-resolution 1080x1350 with bakery branding guidelines applied!",
    submissionImage: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "proj-102",
    title: "Build Responsive 1-Page Landing Page for Local Tuition Center",
    client: "Apex Scholars Academy",
    clientType: "Education / Coaching",
    category: "Web Development",
    skills: ["HTML/CSS", "Web Development", "JavaScript"],
    budget: 1500,
    deadline: "4 Days",
    estHours: "8 Hours",
    description: "Need a clean, mobile-first landing page with an admissions inquiry form, batch timings table, and WhatsApp contact button for 10th/12th grade coaching.",
    escrowFunded: true,
    status: "open",
    hasSubmission: false
  },
  {
    id: "proj-103",
    title: "Edit 30-Second High-Energy Instagram Reel for CrossFit Gym",
    client: "IronFit CrossFit Studio",
    clientType: "Fitness & Gym",
    category: "Video Editing",
    skills: ["Video Editing", "Instagram Reels", "CapCut"],
    budget: 1000,
    deadline: "3 Days",
    estHours: "5 Hours",
    description: "We have raw phone footage of our morning workout session. Need quick cuts, trending upbeat audio sync, captions, and our gym logo overlay.",
    escrowFunded: true,
    status: "open",
    hasSubmission: false
  },
  {
    id: "proj-104",
    title: "Diwali WhatsApp Promo Flyer & Price Menu Card",
    client: "Meera Designer Boutique",
    clientType: "Retail / Fashion",
    category: "Graphic Design",
    skills: ["Graphic Design", "Canva"],
    budget: 500,
    deadline: "1 Day",
    estHours: "3 Hours",
    description: "Single-page elegant PDF and PNG flyer showcasing Diwali ethnic wear discount bundles. Clean typography and festive golden accents required.",
    escrowFunded: true,
    status: "open",
    hasSubmission: false
  },
  {
    id: "proj-105",
    title: "Write 3 Engaging Local SEO Articles for Pet Care Clinic",
    client: "Happy Paws Veterinary Clinic",
    clientType: "Pet Healthcare",
    category: "Content Writing",
    skills: ["Content Writing", "Social Media", "SEO Basics"],
    budget: 800,
    deadline: "5 Days",
    estHours: "6 Hours",
    description: "Write three 600-word beginner-friendly pet care guides: puppy vaccination schedules, monsoon tick prevention, and basic cat nutrition.",
    escrowFunded: true,
    status: "open",
    hasSubmission: false
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: "app-1",
    projectId: "proj-101",
    projectTitle: "Design 3 Festive Instagram Carousel Posters for Sourdough Sale",
    client: "Sweet Delights Artisan Bakery",
    budget: 500,
    studentPayout: 450,
    platformFee: 50,
    status: "Submitted & In Review",
    appliedDate: "Today",
    canReview: true
  }
];

// Determine API Base URL dynamically
const API_BASE = window.location.origin.includes(":5000") 
  ? "/api" 
  : "http://127.0.0.1:5000/api";

// App State Management
class AppState {
  constructor() {
    this.useBackend = false;
    this.student = this.load("sb_student", DEFAULT_STUDENT);
    this.projects = this.load("sb_projects", DEFAULT_PROJECTS);
    this.applications = this.load("sb_applications", DEFAULT_APPLICATIONS);
    this.currentPersona = "student"; // 'student' or 'business'
    this.activeCategory = "all";
    this.sortBy = "match-desc";
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save() {
    localStorage.setItem("sb_student", JSON.stringify(this.student));
    localStorage.setItem("sb_projects", JSON.stringify(this.projects));
    localStorage.setItem("sb_applications", JSON.stringify(this.applications));
  }

  reset() {
    localStorage.removeItem("sb_student");
    localStorage.removeItem("sb_projects");
    localStorage.removeItem("sb_applications");
    this.student = JSON.parse(JSON.stringify(DEFAULT_STUDENT));
    this.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    this.applications = JSON.parse(JSON.stringify(DEFAULT_APPLICATIONS));
    this.save();
  }

  async checkBackend() {
    const badge = document.getElementById("backendStatusBadge");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const info = await res.json();
        this.useBackend = true;
        badge.className = "backend-badge connected";
        badge.innerHTML = `<i class="fa-solid fa-server"></i> Python API (SQLite Active)`;
        badge.title = "Connected to Flask + SQLite server at 127.0.0.1:5000";
        await this.syncWithBackend();
        return true;
      }
    } catch (e) {
      // Backend not running; gracefully fallback to localStorage
    }

    this.useBackend = false;
    badge.className = "backend-badge offline";
    badge.innerHTML = `<i class="fa-solid fa-database"></i> LocalStorage Mode`;
    badge.title = "Running locally in-browser. Start server.py to enable Python + SQLite API.";
    return false;
  }

  async syncWithBackend() {
    if (!this.useBackend) return;
    try {
      const [projRes, appRes, stRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/applications`),
        fetch(`${API_BASE}/student`)
      ]);

      if (projRes.ok) this.projects = await projRes.json();
      if (appRes.ok) this.applications = await appRes.json();
      if (stRes.ok) this.student = { ...this.student, ...(await stRes.json()) };

      this.save();
    } catch (err) {
      console.warn("Backend sync failed, using cached state", err);
    }
  }
}

const state = new AppState();

// Smart Matching Engine (Client-Side Deterministic Scoring)
function calculateMatchScore(project, student) {
  // If backend already calculated it, prefer it
  if (project.matchData && typeof project.matchData.score === "number") {
    return project.matchData;
  }

  const projectSkills = (project.skills || []).map(s => s.toLowerCase());
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());

  let matchedSkills = [];
  projectSkills.forEach(reqSkill => {
    const isDirect = studentSkills.includes(reqSkill);
    const isFuzzy = studentSkills.some(s => s.includes(reqSkill) || reqSkill.includes(s));
    if (isDirect || isFuzzy) {
      matchedSkills.push(reqSkill);
    }
  });

  const skillRatio = projectSkills.length > 0 ? (matchedSkills.length / projectSkills.length) : 0;
  const skillScore = Math.min(skillRatio, 1) * 60;

  let budgetScore = 25;
  if (project.budget < (student.minBudget || 500)) budgetScore = 15;
  else if (project.budget > (student.maxBudget || 2500)) budgetScore = 10;

  let availabilityScore = student.isIdVerified ? 15 : 8;
  const totalScore = Math.round(skillScore + budgetScore + availabilityScore);
  const clampedScore = Math.min(Math.max(totalScore, 42), 98);

  return {
    score: clampedScore,
    matchedCount: matchedSkills.length,
    totalRequired: projectSkills.length,
    matchedSkills: matchedSkills
  };
}

// DOM Rendering Functions
function renderStudentProfile() {
  const s = state.student;
  document.getElementById("studentName").textContent = s.name;
  document.getElementById("studentEarningsDisplay").textContent = `₹${s.walletBalance + 900}`;
  document.getElementById("navWalletBalance").textContent = `Wallet: ₹${s.walletBalance}`;

  // Skills tags
  const skillsContainer = document.getElementById("studentSkillsList");
  skillsContainer.innerHTML = "";
  (s.skills || []).forEach(skill => {
    const chip = document.createElement("span");
    chip.className = "tag-chip matched";
    chip.innerHTML = `<i class="fa-solid fa-check"></i> ${skill}`;
    skillsContainer.appendChild(chip);
  });

  // Verification Pill
  const pill = document.getElementById("verificationStatusPill");
  if (s.isIdVerified) {
    pill.innerHTML = `ID: Verified ✓`;
    pill.className = "text-success";
  } else {
    pill.innerHTML = `Verify ID`;
    pill.className = "text-warning";
  }
}

function renderProjectsFeed() {
  const container = document.getElementById("projectsContainer");
  container.innerHTML = "";

  let list = [...state.projects];
  if (state.activeCategory !== "all") {
    list = list.filter(p => p.category === state.activeCategory);
  }

  // Calculate Match Score for each
  list = list.map(p => {
    const match = calculateMatchScore(p, state.student);
    return { ...p, matchData: match };
  });

  // Sort
  if (state.sortBy === "match-desc") {
    list.sort((a, b) => b.matchData.score - a.matchData.score);
  } else if (state.sortBy === "budget-desc") {
    list.sort((a, b) => b.budget - a.budget);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <i class="fa-regular fa-folder-open" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px;"></i>
        <p style="color: #64748b;">No projects found in this category. Post one to test!</p>
      </div>
    `;
    return;
  }

  list.forEach(project => {
    const card = document.createElement("div");
    card.className = `project-card ${project.matchData.score >= 85 ? "high-match" : ""}`;

    const hasApplied = state.applications.some(a => a.projectId === project.id);
    const takeHome = Math.round(project.budget * 0.9);

    const skillsHtml = (project.skills || []).map(sk => {
      const isMatched = (state.student.skills || []).some(s => s.toLowerCase() === sk.toLowerCase());
      return `<span class="tag-chip ${isMatched ? 'matched' : ''}">${isMatched ? '✓ ' : ''}${sk}</span>`;
    }).join("");

    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="client-name"><i class="fa-solid fa-store"></i> ${project.client}</span>
          <span class="match-score-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i> ${project.matchData.score}% AI Match
          </span>
        </div>
        <h4>${project.title}</h4>
        <p class="project-desc">${project.description || 'No description provided.'}</p>
        <div class="project-skills">${skillsHtml}</div>
        <div class="match-explain">
          <i class="fa-solid fa-bolt text-primary"></i> 
          ${project.matchData.matchedCount} of ${project.matchData.totalRequired} skills match • Est: ${project.estHours || '4-6 Hours'}
        </div>
      </div>
      <div class="card-bottom">
        <div class="budget-box">
          <span class="budget-val">₹${project.budget}</span>
          <span class="budget-escrow"><i class="fa-solid fa-lock"></i> Escrow Secured</span>
        </div>
        <div>
          ${hasApplied 
            ? `<button class="btn btn-outline-sm" disabled><i class="fa-solid fa-check"></i> Applied</button>` 
            : `<button class="btn btn-primary btn-sm apply-btn" data-id="${project.id}">Apply (Earn ₹${takeHome})</button>`
          }
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach Apply Listeners
  document.querySelectorAll(".apply-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const projId = btn.getAttribute("data-id");
      openApplyModal(projId);
    });
  });
}

function renderStudentApplications() {
  const tbody = document.getElementById("studentApplicationsBody");
  tbody.innerHTML = "";

  if (state.applications.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 24px;">No applications submitted yet. Browse projects above!</td></tr>`;
    return;
  }

  state.applications.forEach(app => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${app.projectTitle}</strong></td>
      <td>${app.client}</td>
      <td><strong>₹${app.budget}</strong> <span class="text-muted" style="font-size:0.75rem;">(Take-home: ₹${app.studentPayout})</span></td>
      <td>
        <span class="badge ${app.status.includes('Completed') ? 'badge-success' : 'badge-primary'}">
          ${app.status}
        </span>
      </td>
      <td>
        ${app.canReview 
          ? `<button class="btn btn-outline-sm inspect-submission-btn" data-id="${app.projectId}"><i class="fa-solid fa-eye"></i> View Draft</button>` 
          : `<span class="text-muted" style="font-size:0.8rem;">Awaiting Client Review</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".inspect-submission-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      openReviewModal(btn.getAttribute("data-id"));
    });
  });
}

function renderBusinessDashboard() {
  const container = document.getElementById("businessProjectsContainer");
  container.innerHTML = "";

  state.projects.forEach(project => {
    const item = document.createElement("div");
    item.className = "business-project-item";

    const isSubmitted = project.hasSubmission && project.status === "in-progress";
    const isCompleted = project.status === "completed";

    item.innerHTML = `
      <div class="biz-top-row">
        <div>
          <h4>${project.title}</h4>
          <span class="text-muted" style="font-size: 0.8rem;"><i class="fa-solid fa-calendar"></i> Category: ${project.category}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 1.25rem; font-weight: 800; font-family: 'Space Grotesk', sans-serif;">₹${project.budget}</span>
          <div><span class="badge ${isCompleted ? 'badge-success' : 'badge-primary'}">${project.status.toUpperCase()}</span></div>
        </div>
      </div>
      
      <!-- Submissions / Applicant Card -->
      ${project.hasSubmission ? `
        <div class="biz-applicant-card">
          <div class="applicant-profile">
            <img src="${state.student.avatar}" alt="Priya">
            <div>
              <strong>${state.student.name}</strong> 
              <span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> College Verified</span>
              <p class="text-muted" style="font-size:0.8rem;">Submitted 1 draft file • Fast turnaround</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${isCompleted ? `
              <button class="btn btn-outline-sm view-invoice-btn" data-id="${project.id}">
                <i class="fa-solid fa-file-invoice"></i> View Tax Invoice
              </button>
            ` : `
              <button class="btn btn-primary-sm inspect-submission-btn" data-id="${project.id}">
                <i class="fa-solid fa-magnifying-glass"></i> Inspect & Release Escrow
              </button>
            `}
          </div>
        </div>
      ` : `
        <div style="font-size: 0.82rem; color: #64748b; background: #f8fafc; padding: 8px 12px; border-radius: 6px;">
          <i class="fa-solid fa-user-clock"></i> AI Matching active: 3 students notified in Mumbai area.
        </div>
      `}
    `;

    container.appendChild(item);
  });

  // Attach buttons
  document.querySelectorAll(".inspect-submission-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      openReviewModal(btn.getAttribute("data-id"));
    });
  });

  document.querySelectorAll(".view-invoice-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      openInvoiceModal(btn.getAttribute("data-id"));
    });
  });
}

// Modal Handlers
let selectedProjectId = null;

function openApplyModal(projectId) {
  selectedProjectId = projectId;
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;

  const studentTakeHome = Math.round(project.budget * 0.9);

  document.getElementById("modalProjectTitle").textContent = project.title;
  document.getElementById("modalProjectClient").textContent = project.client;
  document.getElementById("modalProjectBudget").textContent = `₹${project.budget}`;
  document.getElementById("modalStudentTakeHome").textContent = `₹${studentTakeHome}`;

  document.getElementById("applyModal").classList.add("active-modal");
}

function closeApplyModal() {
  document.getElementById("applyModal").classList.remove("active-modal");
}

function openReviewModal(projectId) {
  selectedProjectId = projectId;
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;

  document.getElementById("submissionProjectName").textContent = project.title;
  if (project.submissionNotes) {
    document.getElementById("submissionNotesText").textContent = `"${project.submissionNotes}"`;
  }
  if (project.submissionImage) {
    document.getElementById("submissionMockImg").src = project.submissionImage;
  }

  document.getElementById("submissionReviewModal").classList.add("active-modal");
}

function closeReviewModal() {
  document.getElementById("submissionReviewModal").classList.remove("active-modal");
}

function openInvoiceModal(projectId) {
  const project = state.projects.find(p => p.id === projectId) || state.projects[0];
  const fee = Math.round(project.budget * 0.1);
  const payout = project.budget - fee;
  const netBeforeTax = (fee / 1.18).toFixed(2);
  const gst = (fee - parseFloat(netBeforeTax)).toFixed(2);

  document.getElementById("invoiceProjectItem").textContent = project.title;
  document.getElementById("invoiceGross").textContent = `₹${project.budget}.00`;
  document.getElementById("invoiceStudentPart").textContent = `- ₹${payout}.00`;
  document.getElementById("invoiceNetFee").textContent = `₹${netBeforeTax}`;
  document.getElementById("invoiceGst").textContent = `₹${gst}`;

  document.getElementById("invoiceModal").classList.add("active-modal");
}

function closeInvoiceModal() {
  document.getElementById("invoiceModal").classList.remove("active-modal");
}

// Toast Notifications
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "fa-circle-info";
  if (type === "success") icon = "fa-circle-check";
  if (type === "warning") icon = "fa-triangle-exclamation";

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Persona Switcher Logic
function setPersona(persona) {
  state.currentPersona = persona;

  const studentBtn = document.getElementById("studentPersonaBtn");
  const businessBtn = document.getElementById("businessPersonaBtn");
  const studentSection = document.getElementById("studentDashboardSection");
  const businessSection = document.getElementById("businessDashboardSection");

  if (persona === "student") {
    studentBtn.classList.add("active");
    businessBtn.classList.remove("active");
    studentSection.classList.add("active-view");
    businessSection.classList.remove("active-view");
    showToast("Switched to Student Mode: Priya Sharma", "info");
  } else {
    businessBtn.classList.add("active");
    studentBtn.classList.remove("active");
    businessSection.classList.add("active-view");
    studentSection.classList.remove("active-view");
    renderBusinessDashboard();
    showToast("Switched to Business Mode: Sweet Delights Bakery", "info");
  }
}

// Interactive Revenue Calculator
function setupRevenueCalculator() {
  const slider = document.getElementById("calcProjectBudget");
  const budgetVal = document.getElementById("calcBudgetValue");
  const studentCut = document.getElementById("calcStudentCut");
  const platformCut = document.getElementById("calcPlatformCut");
  const totalEscrow = document.getElementById("calcTotalEscrow");

  function update() {
    const val = parseInt(slider.value, 10);
    const pFee = Math.round(val * 0.1);
    const sPay = val - pFee;

    budgetVal.textContent = `₹${val}`;
    studentCut.textContent = `₹${sPay}`;
    platformCut.textContent = `₹${pFee}`;
    totalEscrow.textContent = `₹${val}`;
  }

  slider.addEventListener("input", update);
  update();
}

// Event Listeners Initialization
function initEventListeners() {
  // Persona switcher
  document.getElementById("studentPersonaBtn").addEventListener("click", () => setPersona("student"));
  document.getElementById("businessPersonaBtn").addEventListener("click", () => setPersona("business"));

  // Category filters
  document.querySelectorAll(".cat-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.activeCategory = tab.getAttribute("data-category");
      renderProjectsFeed();
    });
  });

  // Sort dropdown
  document.getElementById("sortProjectsSelect").addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderProjectsFeed();
  });

  // Hero Quick CTAs
  document.getElementById("heroExploreBtn").addEventListener("click", () => {
    setPersona("student");
    document.getElementById("studentDashboardSection").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("heroPostProjectBtn").addEventListener("click", () => {
    setPersona("business");
    document.getElementById("postProjectModal").classList.add("active-modal");
  });

  document.getElementById("heroHowItWorksBtn").addEventListener("click", () => {
    document.getElementById("howItWorksSection").scrollIntoView({ behavior: "smooth" });
  });

  // Apply Form Submit
  document.getElementById("applyProjectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    const project = state.projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    const payout = Math.round(project.budget * 0.9);
    const fee = project.budget - payout;

    const newApp = {
      id: "app-" + Date.now(),
      projectId: project.id,
      projectTitle: project.title,
      client: project.client,
      budget: project.budget,
      studentPayout: payout,
      platformFee: fee,
      status: "Submitted & In Review",
      appliedDate: "Just now",
      canReview: true
    };

    if (state.useBackend) {
      try {
        await fetch(`${API_BASE}/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newApp)
        });
      } catch (err) {
        console.warn("Backend apply error, using local fallback", err);
      }
    }

    state.applications.unshift(newApp);
    state.save();

    closeApplyModal();
    renderProjectsFeed();
    renderStudentApplications();
    showToast(`Application saved! ₹${payout} queued for milestone approval.`, "success");
  });

  document.getElementById("closeApplyModalBtn").addEventListener("click", closeApplyModal);
  document.getElementById("cancelApplyBtn").addEventListener("click", closeApplyModal);

  // Business Post Project Modal
  document.getElementById("openPostProjectModalBtn").addEventListener("click", () => {
    document.getElementById("postProjectModal").classList.add("active-modal");
  });

  document.getElementById("closePostModalBtn").addEventListener("click", () => {
    document.getElementById("postProjectModal").classList.remove("active-modal");
  });

  document.getElementById("cancelPostBtn").addEventListener("click", () => {
    document.getElementById("postProjectModal").classList.remove("active-modal");
  });

  document.getElementById("postProjectForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("postTitle").value.trim();
    const category = document.getElementById("postCategory").value;
    const budget = parseInt(document.getElementById("postBudget").value, 10);
    const skills = document.getElementById("postSkills").value.split(",").map(s => s.trim()).filter(Boolean);
    const deadline = document.getElementById("postDeadline").value.trim();
    const estHours = document.getElementById("postEstHours").value.trim();
    const description = document.getElementById("postDescription").value.trim();

    const newProj = {
      id: "proj-" + Date.now(),
      title,
      client: "Sweet Delights Artisan Bakery",
      clientType: "Bakery / Merchant",
      category,
      skills,
      budget,
      deadline,
      estHours,
      description,
      escrowFunded: true,
      status: "open",
      hasSubmission: false
    };

    if (state.useBackend) {
      try {
        await fetch(`${API_BASE}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProj)
        });
      } catch (err) {
        console.warn("Backend post error, using local fallback", err);
      }
    }

    state.projects.unshift(newProj);
    state.save();

    document.getElementById("postProjectForm").reset();
    document.getElementById("postProjectModal").classList.remove("active-modal");

    renderProjectsFeed();
    renderBusinessDashboard();
    showToast(`Project published! ₹${budget} secured in escrow.`, "success");
  });

  // Escrow Release & Review Buttons
  document.getElementById("closeReviewModalBtn").addEventListener("click", closeReviewModal);

  document.getElementById("confirmReleaseEscrowBtn").addEventListener("click", async () => {
    if (!selectedProjectId) return;
    const project = state.projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    project.status = "completed";
    const payout = Math.round(project.budget * 0.9);
    state.student.walletBalance += payout;

    const app = state.applications.find(a => a.projectId === project.id);
    if (app) {
      app.status = "Completed & Paid";
      app.canReview = false;
    }

    if (state.useBackend) {
      try {
        await fetch(`${API_BASE}/escrow/release`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: project.id })
        });
      } catch (err) {
        console.warn("Backend escrow release error, using local fallback", err);
      }
    }

    state.save();
    closeReviewModal();

    renderStudentProfile();
    renderStudentApplications();
    renderBusinessDashboard();

    showToast(`Approved! ₹${payout} released to student wallet. ₹50 fee captured.`, "success");

    setTimeout(() => {
      openInvoiceModal(project.id);
    }, 800);
  });

  document.getElementById("requestRevisionBtn").addEventListener("click", () => {
    showToast("Feedback sent to student: 'Please adjust font contrast'.", "warning");
    closeReviewModal();
  });

  // Invoice Modal
  document.getElementById("closeInvoiceModalBtn").addEventListener("click", closeInvoiceModal);

  // ID Verification Modal Flow
  const verifyModal = document.getElementById("verifyIdModal");
  document.getElementById("verifyIdNavBtn").addEventListener("click", () => {
    verifyModal.classList.add("active-modal");
  });
  document.getElementById("closeVerifyIdModalBtn").addEventListener("click", () => {
    verifyModal.classList.remove("active-modal");
  });

  document.getElementById("idFileInput").addEventListener("change", () => {
    document.getElementById("dropZoneBox").style.display = "none";
    const ocrBox = document.getElementById("ocrStatusBox");
    ocrBox.style.display = "block";

    setTimeout(() => {
      ocrBox.style.display = "none";
      document.getElementById("verifiedCard").style.display = "block";
      state.student.isIdVerified = true;
      state.save();
      renderStudentProfile();
      showToast("College Identity Verified via OCR!", "success");
    }, 1200);
  });

  document.getElementById("finishVerificationBtn").addEventListener("click", () => {
    verifyModal.classList.remove("active-modal");
  });

  // Wallet nav shortcut
  document.getElementById("walletNavBtn").addEventListener("click", () => {
    setPersona("student");
    document.getElementById("studentEarningsDisplay").scrollIntoView({ behavior: "smooth" });
    showToast(`Current Student Balance: ₹${state.student.walletBalance}`, "info");
  });

  // Reset Demo State
  document.getElementById("resetDataBtn").addEventListener("click", () => {
    if (confirm("Reset demo data to initial factory state?")) {
      state.reset();
      renderStudentProfile();
      renderProjectsFeed();
      renderStudentApplications();
      renderBusinessDashboard();
      showToast("Demo state reset successfully!", "info");
    }
  });

  // Add Skill quick button
  document.getElementById("addSkillBtn").addEventListener("click", () => {
    const newSkill = prompt("Enter new skill tag (e.g. Video Editing, Python, UI/UX):");
    if (newSkill && newSkill.trim()) {
      state.student.skills.push(newSkill.trim());
      state.save();
      renderStudentProfile();
      renderProjectsFeed();
      showToast(`Skill '${newSkill}' added! Match scores recalculated.`, "success");
    }
  });

  // VAJRA AI Assistant Drawer Listeners
  initVajraAssistant();
}

// VAJRA AI Copilot Implementation
function initVajraAssistant() {
  const launcher = document.getElementById("vajraToggleBtn");
  const drawer = document.getElementById("vajraDrawer");
  const closeBtn = document.getElementById("closeVajraDrawerBtn");
  const form = document.getElementById("vajraForm");
  const input = document.getElementById("vajraInput");
  const messagesContainer = document.getElementById("vajraMessages");
  const chipsContainer = document.getElementById("vajraQuickChips");

  launcher.addEventListener("click", () => {
    drawer.classList.toggle("active-drawer");
    if (drawer.classList.contains("active-drawer")) {
      input.focus();
    }
  });

  closeBtn.addEventListener("click", () => {
    drawer.classList.remove("active-drawer");
  });

  // Quick Chips
  chipsContainer.querySelectorAll(".vajra-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const promptText = chip.getAttribute("data-prompt");
      input.value = promptText;
      form.dispatchEvent(new Event("submit"));
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // Append User Message
    appendVajraMessage(query, "vajra-user");
    input.value = "";

    // Append Typing Indicator
    const typingId = "vajra-typing-" + Date.now();
    const typingElem = document.createElement("div");
    typingElem.id = typingId;
    typingElem.className = "vajra-msg vajra-bot";
    typingElem.innerHTML = `<div class="vajra-msg-bubble vajra-typing"><span></span><span></span><span></span></div>`;
    messagesContainer.appendChild(typingElem);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    let botReply = "";
    if (state.useBackend) {
      try {
        const res = await fetch(`${API_BASE}/vajra/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, persona: state.currentPersona })
        });
        if (res.ok) {
          const data = await res.json();
          botReply = data.reply;
        }
      } catch (err) {
        console.warn("Backend VAJRA chat failed, using local engine", err);
      }
    }

    if (!botReply) {
      botReply = localVajraFallback(query, state.currentPersona);
    }

    // Remove typing
    const el = document.getElementById(typingId);
    if (el) el.remove();

    // Append Bot Message
    appendVajraMessage(botReply, "vajra-bot");
  });
}

function appendVajraMessage(text, type) {
  const container = document.getElementById("vajraMessages");
  const msgWrapper = document.createElement("div");
  msgWrapper.className = `vajra-msg ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "vajra-msg-bubble";

  // Simple Markdown formatting
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");

  bubble.innerHTML = formatted;

  // If response contains a proposal, add an action button to copy into Apply modal
  if (type === "vajra-bot" && (text.includes("Proposal Draft") || text.includes("Namaste! I saw your requirement"))) {
    const actionBtn = document.createElement("button");
    actionBtn.className = "vajra-bot-action-btn";
    actionBtn.innerHTML = `<i class="fa-solid fa-file-pen"></i> Insert into Proposal Box`;
    actionBtn.addEventListener("click", () => {
      openApplyModal("proj-101");
      const coverText = "Hi! I saw your requirement for the Instagram carousel posters. I am a 2nd-year BCA student with active experience in Canva and Figma. I can deliver 3 high-converting 1080x1350 slides within 24-48 hours with 1 free revision.";
      document.getElementById("applyCoverLetter").value = coverText;
      document.getElementById("vajraDrawer").classList.remove("active-drawer");
      showToast("VAJRA proposal inserted into application!", "success");
    });
    bubble.appendChild(document.createElement("br"));
    bubble.appendChild(actionBtn);
  }

  msgWrapper.appendChild(bubble);
  container.appendChild(msgWrapper);
  container.scrollTop = container.scrollHeight;
}

function localVajraFallback(prompt, persona) {
  const p = prompt.toLowerCase();
  if (p.includes("proposal") || p.includes("pitch") || p.includes("bakery") || p.includes("apply")) {
    return "⚡ **VAJRA Proposal Draft:**\n\n\"Namaste! I saw your requirement for the Instagram carousel posters. I am a 2nd-year BCA student at St. Xavier's with active experience in Canva and Figma. I will create 3 high-converting 1080x1350 slides using warm bakery colors and readable font pairings for mobile screens.\n\n✅ Delivery: Within 24-48 hours\n✅ Free Revisions: 1 included\n✅ Full Commercial IP Rights transferred upon milestone approval.\"\n\n*Click below to insert this into the proposal form!*";
  }
  if (p.includes("price") || p.includes("budget") || p.includes("website") || p.includes("charge")) {
    return "⚡ **VAJRA Pricing Guidance for Micro-Gigs:**\n\n• **Basic 1-Page Landing Page:** ₹1,200 – ₹1,800\n• **Instagram Carousel (3 slides):** ₹500 – ₹800\n• **30-sec Reel Video Edit:** ₹800 – ₹1,200\n• **Diwali / Event Flyer:** ₹400 – ₹600\n\n💡 *Tip: ₹500–₹1,500 is the sweet spot for neighborhood shops and gives students fast portfolio proofs!*";
  }
  if (p.includes("skill") || p.includes("learn") || p.includes("earn")) {
    return "⚡ **VAJRA High-Value Skill Roadmap:**\n\n1. **Figma (from Canva):** Boosts average design gig from ₹500 to ₹1,200.\n2. **CapCut / Reels:** High demand for local gym and restaurant short videos.\n3. **HTML/Tailwind:** Landing pages pay ₹1,500–₹2,500.\n\nAdding these tags to your profile will bump your match score to 98%!";
  }
  if (p.includes("job") || p.includes("post") || p.includes("hire") || p.includes("business")) {
    return "⚡ **VAJRA Job Post Template (For Businesses):**\n\n**Title:** Instagram Reel Editor for Fitness Studio\n**Category:** Video Editing\n**Budget:** ₹1,000 (Escrow Protected)\n**Deliverable:** 1x 30s vertical reel with upbeat music and captions.\n**Deadline:** 2 Days\n\nClick 'Post New Micro-Gig' to publish this in 1 click!";
  }
  return `⚡ **VAJRA Copilot is active!**\n\nI can help you:\n• Draft winning student proposals\n• Recommend high-paying digital skills\n• Help businesses write gig specifications\n• Calculate fair micro-budgets (₹500–₹2,000)\n\nTry tapping one of the quick chips below!`;
}

// Startup
document.addEventListener("DOMContentLoaded", async () => {
  renderStudentProfile();
  renderProjectsFeed();
  renderStudentApplications();
  renderBusinessDashboard();
  setupRevenueCalculator();
  initEventListeners();

  // Async backend detection & initial sync
  await state.checkBackend();
  renderStudentProfile();
  renderProjectsFeed();
  renderStudentApplications();
  renderBusinessDashboard();
});
