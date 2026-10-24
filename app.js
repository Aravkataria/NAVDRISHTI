/**
 * SkillBridge — Unified Core Application Engine
 * Supports Multi-Page Architecture • Dark Mode • Dual-Mode Backend/LocalStorage • SkillBridge AI Copilot
 */

// Initial Seed Data (General-purpose for any student and company)
const DEFAULT_STUDENT = {
  name: "Student Freelancer",
  college: "University Partner Campus",
  rollNo: "2024-UNIV-084",
  degree: "Digital Media & Tech Student",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "College freelancer skilled in graphic design, web development, and social media content creation. Open for paid digital micro-gigs.",
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
    title: "Design 3 Festive Social Media Carousel Posters",
    client: "Local Business Partner",
    clientType: "Retail & Services",
    category: "Graphic Design",
    skills: ["Graphic Design", "Canva", "Social Media", "Figma"],
    budget: 500,
    deadline: "2 Days",
    estHours: "4 Hours",
    description: "We are launching a promotional offer this weekend. Need 3 engaging 1080x1350 carousel slides following modern brand guidelines for Instagram and WhatsApp.",
    escrowFunded: true,
    status: "in-progress",
    hasSubmission: true,
    submissionNotes: "Here is the finalized promotional design set. Created in high-resolution with brand guidelines applied!",
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
    projectTitle: "Design 3 Festive Social Media Carousel Posters",
    client: "Local Business Partner",
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
    this.currentPersona = this.load("sb_persona", "student"); // 'student' or 'business'
    this.theme = this.load("sb_theme", "dark");
    this.activeCategory = "all";
    this.searchQuery = "";
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
    localStorage.setItem("sb_persona", JSON.stringify(this.currentPersona));
    localStorage.setItem("sb_theme", JSON.stringify(this.theme));
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
    if (!badge) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.useBackend = true;
        badge.className = "backend-badge connected";
        badge.innerHTML = `<i class="fa-solid fa-server"></i> Python API (SQLite Active)`;
        badge.title = "Connected to Flask + SQLite server at 127.0.0.1:5000";
        await this.syncWithBackend();
        return true;
      }
    } catch (e) {
      // Offline fallback
    }

    this.useBackend = false;
    badge.className = "backend-badge offline";
    badge.innerHTML = `<i class="fa-solid fa-database"></i> LocalStorage Mode`;
    badge.title = "Running in-browser. Start server.py to enable Python + SQLite API.";
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

// AI Smart Matching Engine
function calculateMatchScore(project, student) {
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

// Dark Mode Controller
function initTheme() {
  const savedTheme = state.theme || "dark";
  applyTheme(savedTheme);

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      state.theme = newTheme;
      state.save();
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, "info");
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.innerHTML = theme === "dark" ? `<i class="fa-solid fa-sun"></i>` : `<i class="fa-solid fa-moon"></i>`;
    themeBtn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
  }
}

// Persona Switcher Controller
function initPersonaSwitcher() {
  const studentBtn = document.getElementById("studentPersonaBtn");
  const businessBtn = document.getElementById("businessPersonaBtn");

  if (!studentBtn || !businessBtn) return;

  function updateButtons() {
    if (state.currentPersona === "student") {
      studentBtn.classList.add("active");
      businessBtn.classList.remove("active");
    } else {
      businessBtn.classList.add("active");
      studentBtn.classList.remove("active");
    }
  }

  studentBtn.addEventListener("click", () => {
    state.currentPersona = "student";
    state.save();
    updateButtons();
    showToast("Switched to Student Mode 🎓", "info");
    if (window.location.pathname.includes("post-job")) {
      window.location.href = window.location.pathname.includes("pages") ? "student-dashboard.html" : "pages/student-dashboard.html";
    } else {
      refreshActivePage();
    }
  });

  businessBtn.addEventListener("click", () => {
    state.currentPersona = "business";
    state.save();
    updateButtons();
    showToast("Switched to Company Mode 🏢", "info");
    if (window.location.pathname.includes("student-dashboard")) {
      window.location.href = window.location.pathname.includes("pages") ? "post-job.html" : "pages/post-job.html";
    } else {
      refreshActivePage();
    }
  });

  updateButtons();
}

// Refresh Active Page View
function refreshActivePage() {
  renderSharedNav();
  if (document.getElementById("projectsContainer")) renderProjectsFeed();
  if (document.getElementById("studentSkillsList")) renderStudentProfile();
  if (document.getElementById("studentApplicationsBody")) renderStudentApplications();
  if (document.getElementById("businessProjectsContainer")) renderBusinessDashboard();
}

// Shared Navigation Info (Wallet & ID pill & Profile Dropdown)
function renderSharedNav() {
  const isStudent = state.activePersona === "student";

  // Standalone wallet balance if present
  const wallet = document.getElementById("navWalletBalance");
  if (wallet) {
    wallet.textContent = `Wallet: ₹${state.student.walletBalance}`;
  }
  // Dropdown wallet balance
  const dropdownWallet = document.getElementById("dropdownWalletBalance");
  if (dropdownWallet) {
    dropdownWallet.textContent = `₹${state.student.walletBalance}`;
  }

  // ID Status
  const idStatus = document.getElementById("verificationStatusPill");
  if (idStatus) {
    if (state.student.isIdVerified) {
      idStatus.innerHTML = `ID: Verified ✓`;
      idStatus.className = "text-success";
    } else {
      idStatus.innerHTML = `Verify ID`;
      idStatus.className = "text-warning";
    }
  }
  const dropdownIdStatus = document.getElementById("dropdownIdStatus");
  if (dropdownIdStatus) {
    if (state.student.isIdVerified) {
      dropdownIdStatus.textContent = "Verified ✓";
      dropdownIdStatus.className = "badge badge-success";
    } else {
      dropdownIdStatus.textContent = "Verify ID";
      dropdownIdStatus.className = "badge badge-warning";
    }
  }

  // Profile Avatar & User Details in Dropdown & Nav
  const navAvatar = document.getElementById("navProfileAvatar");
  const dropAvatar = document.getElementById("dropdownAvatar");
  const dropName = document.getElementById("dropdownUserName");
  const dropRole = document.getElementById("dropdownUserRole");

  if (isStudent) {
    if (navAvatar) navAvatar.src = state.student.avatar;
    if (dropAvatar) dropAvatar.src = state.student.avatar;
    if (dropName) dropName.textContent = state.student.name;
    if (dropRole) dropRole.textContent = "College Verified Student";
  } else {
    const bizAvatar = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80";
    if (navAvatar) navAvatar.src = bizAvatar;
    if (dropAvatar) dropAvatar.src = bizAvatar;
    if (dropName) dropName.textContent = "Company Client";
    if (dropRole) dropRole.textContent = "Verified Business Partner";
  }
}

// Student Profile Rendering (Student Dashboard)
function renderStudentProfile() {
  const s = state.student;
  const nameEl = document.getElementById("studentName");
  if (nameEl) nameEl.textContent = s.name;

  const earnEl = document.getElementById("studentEarningsDisplay");
  if (earnEl) earnEl.textContent = `₹${s.walletBalance + 900}`;

  const skillsContainer = document.getElementById("studentSkillsList");
  if (skillsContainer) {
    skillsContainer.innerHTML = "";
    (s.skills || []).forEach(skill => {
      const chip = document.createElement("span");
      chip.className = "tag-chip matched";
      chip.innerHTML = `<i class="fa-solid fa-check"></i> ${skill}`;
      skillsContainer.appendChild(chip);
    });
  }
}

// Projects Feed (Jobs Page & Home Preview)
function renderProjectsFeed() {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = "";

  let list = [...state.projects];
  if (state.activeCategory !== "all") {
    list = list.filter(p => p.category === state.activeCategory);
  }

  if (state.searchQuery && state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.client.toLowerCase().includes(q) ||
      (p.skills || []).some(sk => sk.toLowerCase().includes(q))
    );
  }

  list = list.map(p => {
    const match = calculateMatchScore(p, state.student);
    return { ...p, matchData: match };
  });

  if (state.sortBy === "match-desc") {
    list.sort((a, b) => b.matchData.score - a.matchData.score);
  } else if (state.sortBy === "budget-desc") {
    list.sort((a, b) => b.budget - a.budget);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color);">
        <i class="fa-regular fa-folder-open" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px;"></i>
        <p style="color: var(--text-muted);">No micro-gigs match your criteria. Try adjusting filters or search keywords!</p>
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

  document.querySelectorAll(".apply-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      openApplyModal(btn.getAttribute("data-id"));
    });
  });
}

// Student Applications Tracker
function renderStudentApplications() {
  const tbody = document.getElementById("studentApplicationsBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (state.applications.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 24px;">No applications submitted yet. Browse gigs to apply!</td></tr>`;
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

// Business Active Projects (Post Job Page)
function renderBusinessDashboard() {
  const container = document.getElementById("businessProjectsContainer");
  if (!container) return;

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
      
      ${project.hasSubmission ? `
        <div class="biz-applicant-card">
          <div class="applicant-profile">
            <img src="${state.student.avatar}" alt="${state.student.name}">
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
        <div style="font-size: 0.82rem; color: var(--text-muted); background: var(--bg-subtle); padding: 8px 12px; border-radius: 6px;">
          <i class="fa-solid fa-user-clock"></i> AI Matching active: 3 students notified in Mumbai area.
        </div>
      `}
    `;

    container.appendChild(item);
  });

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

  const titleEl = document.getElementById("modalProjectTitle");
  if (titleEl) titleEl.textContent = project.title;

  const clientEl = document.getElementById("modalProjectClient");
  if (clientEl) clientEl.textContent = project.client;

  const budEl = document.getElementById("modalProjectBudget");
  if (budEl) budEl.textContent = `₹${project.budget}`;

  const takeEl = document.getElementById("modalStudentTakeHome");
  if (takeEl) takeEl.textContent = `₹${studentTakeHome}`;

  const modal = document.getElementById("applyModal");
  if (modal) modal.classList.add("active-modal");
}

function closeApplyModal() {
  const modal = document.getElementById("applyModal");
  if (modal) modal.classList.remove("active-modal");
}

function openReviewModal(projectId) {
  selectedProjectId = projectId;
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;

  const nameEl = document.getElementById("submissionProjectName");
  if (nameEl) nameEl.textContent = project.title;

  const notesEl = document.getElementById("submissionNotesText");
  if (notesEl && project.submissionNotes) notesEl.textContent = `"${project.submissionNotes}"`;

  const imgEl = document.getElementById("submissionMockImg");
  if (imgEl && project.submissionImage) imgEl.src = project.submissionImage;

  const modal = document.getElementById("submissionReviewModal");
  if (modal) modal.classList.add("active-modal");
}

function closeReviewModal() {
  const modal = document.getElementById("submissionReviewModal");
  if (modal) modal.classList.remove("active-modal");
}

function openInvoiceModal(projectId) {
  const project = state.projects.find(p => p.id === projectId) || state.projects[0];
  const fee = Math.round(project.budget * 0.1);
  const payout = project.budget - fee;
  const netBeforeTax = (fee / 1.18).toFixed(2);
  const gst = (fee - parseFloat(netBeforeTax)).toFixed(2);

  const itemEl = document.getElementById("invoiceProjectItem");
  if (itemEl) itemEl.textContent = project.title;

  const grossEl = document.getElementById("invoiceGross");
  if (grossEl) grossEl.textContent = `₹${project.budget}.00`;

  const partEl = document.getElementById("invoiceStudentPart");
  if (partEl) partEl.textContent = `- ₹${payout}.00`;

  const feeEl = document.getElementById("invoiceNetFee");
  if (feeEl) feeEl.textContent = `₹${netBeforeTax}`;

  const gstEl = document.getElementById("invoiceGst");
  if (gstEl) gstEl.textContent = `₹${gst}`;

  const modal = document.getElementById("invoiceModal");
  if (modal) modal.classList.add("active-modal");
}

function closeInvoiceModal() {
  const modal = document.getElementById("invoiceModal");
  if (modal) modal.classList.remove("active-modal");
}

// Toast Notifications
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

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

// Interactive Revenue Calculator (Home & How It Works Page)
function setupRevenueCalculator() {
  const slider = document.getElementById("calcProjectBudget");
  if (!slider) return;

  const budgetVal = document.getElementById("calcBudgetValue");
  const studentCut = document.getElementById("calcStudentCut");
  const platformCut = document.getElementById("calcPlatformCut");
  const totalEscrow = document.getElementById("calcTotalEscrow");

  function update() {
    const val = parseInt(slider.value, 10);
    const pFee = Math.round(val * 0.1);
    const sPay = val - pFee;

    if (budgetVal) budgetVal.textContent = `₹${val}`;
    if (studentCut) studentCut.textContent = `₹${sPay}`;
    if (platformCut) platformCut.textContent = `₹${pFee}`;
    if (totalEscrow) totalEscrow.textContent = `₹${val}`;
  }

  slider.addEventListener("input", update);
  update();
}

// Shared Listeners
function initSharedEventListeners() {
  initTheme();
  initPersonaSwitcher();
  initVajraAssistant();

  // Reset Demo State
  const resetBtn = document.getElementById("resetDataBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset demo data to initial factory state?")) {
        state.reset();
        refreshActivePage();
        showToast("Demo state reset successfully!", "info");
      }
    });
  }

  // Far-Right Profile Dropdown Toggle Logic
  const navProfileBtn = document.getElementById("navProfileBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  if (navProfileBtn && profileDropdown) {
    navProfileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!profileDropdown.contains(e.target) && !navProfileBtn.contains(e.target)) {
        profileDropdown.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        profileDropdown.classList.remove("show");
      }
    });
  }

  // ID Verification Modal Flow (from Profile Dropdown, Profile Card, or hash)
  const verifyTriggers = [
    document.getElementById("verifyIdNavBtn"),
    document.getElementById("dropdownVerifyIdTrigger"),
    document.getElementById("verifyIdCardBtn")
  ].filter(Boolean);

  const verifyModal = document.getElementById("verifyIdModal");
  if (verifyModal) {
    verifyTriggers.forEach(btn => {
      btn.addEventListener("click", () => {
        if (profileDropdown) profileDropdown.classList.remove("show");
        verifyModal.classList.add("active-modal");
      });
    });

    const closeVerifyBtn = document.getElementById("closeVerifyIdModalBtn");
    if (closeVerifyBtn) closeVerifyBtn.addEventListener("click", () => verifyModal.classList.remove("active-modal"));

    const idInput = document.getElementById("idFileInput");
    if (idInput) {
      idInput.addEventListener("change", () => {
        const dropBox = document.getElementById("dropZoneBox");
        if (dropBox) dropBox.style.display = "none";
        const ocrBox = document.getElementById("ocrStatusBox");
        if (ocrBox) ocrBox.style.display = "block";

        setTimeout(() => {
          if (ocrBox) ocrBox.style.display = "none";
          const card = document.getElementById("verifiedCard");
          if (card) card.style.display = "block";
          state.student.isIdVerified = true;
          state.save();
          renderSharedNav();
          renderStudentProfile();
          showToast("College Identity Verified via OCR!", "success");
        }, 1200);
      });
    }

    const finishBtn = document.getElementById("finishVerificationBtn");
    if (finishBtn) finishBtn.addEventListener("click", () => verifyModal.classList.remove("active-modal"));

    // If navigated with #verify hash, automatically open verify modal
    if (window.location.hash === "#verify") {
      verifyModal.classList.add("active-modal");
    }
  }

  // Apply Form Submit
  const applyForm = document.getElementById("applyProjectForm");
  if (applyForm) {
    applyForm.addEventListener("submit", async (e) => {
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
          console.warn("Backend apply error", err);
        }
      }

      state.applications.unshift(newApp);
      state.save();

      closeApplyModal();
      refreshActivePage();
      showToast(`Application saved! ₹${payout} queued for milestone approval.`, "success");
    });

    const closeApplyBtn = document.getElementById("closeApplyModalBtn");
    if (closeApplyBtn) closeApplyBtn.addEventListener("click", closeApplyModal);
    const cancelApplyBtn = document.getElementById("cancelApplyBtn");
    if (cancelApplyBtn) cancelApplyBtn.addEventListener("click", closeApplyModal);
  }

  // Post Project Form Submit
  const postForm = document.getElementById("postProjectForm");
  if (postForm) {
    postForm.addEventListener("submit", async (e) => {
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
        client: "Company Client",
        clientType: "Business / Employer",
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
          console.warn("Backend post error", err);
        }
      }

      state.projects.unshift(newProj);
      state.save();

      postForm.reset();
      const postModal = document.getElementById("postProjectModal");
      if (postModal) postModal.classList.remove("active-modal");

      refreshActivePage();
      showToast(`Project published! ₹${budget} secured in escrow.`, "success");
    });

    const openPostBtn = document.getElementById("openPostProjectModalBtn");
    if (openPostBtn) {
      openPostBtn.addEventListener("click", () => {
        document.getElementById("postProjectModal").classList.add("active-modal");
      });
    }

    const closePostBtn = document.getElementById("closePostModalBtn");
    if (closePostBtn) closePostBtn.addEventListener("click", () => document.getElementById("postProjectModal").classList.remove("active-modal"));
    const cancelPostBtn = document.getElementById("cancelPostBtn");
    if (cancelPostBtn) cancelPostBtn.addEventListener("click", () => document.getElementById("postProjectModal").classList.remove("active-modal"));
  }

  // Escrow Release Buttons
  const confirmReleaseBtn = document.getElementById("confirmReleaseEscrowBtn");
  if (confirmReleaseBtn) {
    confirmReleaseBtn.addEventListener("click", async () => {
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
          console.warn("Backend release error", err);
        }
      }

      state.save();
      closeReviewModal();
      refreshActivePage();

      showToast(`Approved! ₹${payout} released to student wallet. ₹50 fee captured.`, "success");
      setTimeout(() => openInvoiceModal(project.id), 800);
    });

    const closeReviewBtn = document.getElementById("closeReviewModalBtn");
    if (closeReviewBtn) closeReviewBtn.addEventListener("click", closeReviewModal);

    const revisionBtn = document.getElementById("requestRevisionBtn");
    if (revisionBtn) {
      revisionBtn.addEventListener("click", () => {
        showToast("Feedback sent to student: 'Please adjust font contrast'.", "warning");
        closeReviewModal();
      });
    }
  }

  const closeInvoiceBtn = document.getElementById("closeInvoiceModalBtn");
  if (closeInvoiceBtn) closeInvoiceBtn.addEventListener("click", closeInvoiceModal);

  // Search input on Jobs page
  const searchInput = document.getElementById("jobsSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProjectsFeed();
    });
  }

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
  const sortSelect = document.getElementById("sortProjectsSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProjectsFeed();
    });
  }

  // Add Skill quick button
  const addSkillBtn = document.getElementById("addSkillBtn");
  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", () => {
      const newSkill = prompt("Enter new skill tag (e.g. Video Editing, Python, UI/UX):");
      if (newSkill && newSkill.trim()) {
        state.student.skills.push(newSkill.trim());
        state.save();
        renderStudentProfile();
        if (document.getElementById("projectsContainer")) renderProjectsFeed();
        showToast(`Skill '${newSkill}' added! Match scores recalculated.`, "success");
      }
    });
  }
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

  if (!launcher || !drawer) return;

  function toggleDrawer(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isOpen = drawer.classList.contains("open") || drawer.classList.contains("active-drawer");
    if (isOpen) {
      drawer.classList.remove("open", "active-drawer");
    } else {
      drawer.classList.add("open", "active-drawer");
      if (input) setTimeout(() => input.focus(), 150);
    }
  }

  function closeDrawer() {
    drawer.classList.remove("open", "active-drawer");
  }

  launcher.addEventListener("click", toggleDrawer);

  document.querySelectorAll(".open-vajra-trigger").forEach(btn => {
    btn.addEventListener("click", toggleDrawer);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  // Close when clicking outside drawer
  document.addEventListener("click", (e) => {
    if (drawer.classList.contains("open") || drawer.classList.contains("active-drawer")) {
      if (!drawer.contains(e.target) && !launcher.contains(e.target) && !e.target.closest(".open-vajra-trigger")) {
        closeDrawer();
      }
    }
  });

  if (chipsContainer) {
    chipsContainer.querySelectorAll(".vajra-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const promptText = chip.getAttribute("data-prompt");
        input.value = promptText;
        form.dispatchEvent(new Event("submit"));
      });
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    appendVajraMessage(query, "vajra-user");
    input.value = "";

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

    const el = document.getElementById(typingId);
    if (el) el.remove();

    appendVajraMessage(botReply, "vajra-bot");
  });
}

function appendVajraMessage(text, type) {
  const container = document.getElementById("vajraMessages");
  if (!container) return;

  const msgWrapper = document.createElement("div");
  msgWrapper.className = `vajra-msg ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "vajra-msg-bubble";

  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");

  bubble.innerHTML = formatted;

  if (type === "vajra-bot" && (text.includes("Proposal Draft") || text.includes("Namaste! I saw your requirement"))) {
    const actionBtn = document.createElement("button");
    actionBtn.className = "vajra-bot-action-btn";
    actionBtn.innerHTML = `<i class="fa-solid fa-file-pen"></i> Insert into Proposal Box`;
    actionBtn.addEventListener("click", () => {
      openApplyModal("proj-101");
      const coverText = "Hi! I saw your requirement for the design project. I am a college student with active experience in graphic design and modern digital tools. I can deliver high-converting creative drafts within 24-48 hours with 1 free revision.";
      const inputEl = document.getElementById("applyCoverLetter");
      if (inputEl) inputEl.value = coverText;
      const drawer = document.getElementById("vajraDrawer");
      if (drawer) drawer.classList.remove("active-drawer");
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
  if (p.includes("proposal") || p.includes("pitch") || p.includes("gig") || p.includes("apply")) {
    return "⚡ **SkillBridge Proposal Draft:**\n\n\"Namaste! I saw your requirement for the creative design project. I am a university student with practical experience in graphic design and digital media tools. I can create professional, high-converting deliverables customized to your brand guidelines.\n\n✅ Delivery: Within 24-48 hours\n✅ Free Revisions: 1 included\n✅ Full Commercial IP Rights transferred upon milestone approval.\"\n\n*Click below to insert this into the proposal form!*";
  }
  if (p.includes("price") || p.includes("budget") || p.includes("website") || p.includes("charge")) {
    return "⚡ **SkillBridge Pricing Guidance for Micro-Gigs:**\n\n• **Basic 1-Page Landing Page:** ₹1,200 – ₹1,800\n• **Instagram Carousel (3 slides):** ₹500 – ₹800\n• **30-sec Reel Video Edit:** ₹800 – ₹1,200\n• **Diwali / Event Flyer:** ₹400 – ₹600\n\n💡 *Tip: ₹500–₹1,500 is the sweet spot for neighborhood shops and gives students fast portfolio proofs!*";
  }
  if (p.includes("skill") || p.includes("learn") || p.includes("earn")) {
    return "⚡ **SkillBridge High-Value Skill Roadmap:**\n\n1. **Figma (from Canva):** Boosts average design gig from ₹500 to ₹1,200.\n2. **CapCut / Reels:** High demand for local gym and restaurant short videos.\n3. **HTML/Tailwind:** Landing pages pay ₹1,500–₹2,500.\n\nAdding these tags to your profile will bump your match score to 98%!";
  }
  if (p.includes("job") || p.includes("post") || p.includes("hire") || p.includes("business")) {
    return "⚡ **SkillBridge Job Post Template (For Businesses):**\n\n**Title:** Instagram Reel Editor for Fitness Studio\n**Category:** Video Editing\n**Budget:** ₹1,000 (Escrow Protected)\n**Deliverable:** 1x 30s vertical reel with upbeat music and captions.\n**Deadline:** 2 Days\n\nClick 'Post New Micro-Gig' to publish this in 1 click!";
  }
  return `⚡ **SkillBridge Copilot is active!**\n\nI can help you:\n• Draft winning student proposals\n• Recommend high-paying digital skills\n• Help businesses write gig specifications\n• Calculate fair micro-budgets (₹500–₹2,500)\n\nTry tapping one of the quick chips below!`;
}

window.localSkillBridgeFallback = localVajraFallback;

// Startup
document.addEventListener("DOMContentLoaded", async () => {
  initSharedEventListeners();
  refreshActivePage();
  setupRevenueCalculator();

  // Async backend detection & initial sync
  await state.checkBackend();
  refreshActivePage();
});
