/* ═══════════════════════════════════════════════════════
   digiSpace — Ownership Structure Decision Tool
   Interactive Questionnaire & Automated Scorecard
   Author: Dennis Smaltz
   ═══════════════════════════════════════════════════════ */

// ─── Questions ───
// Each question maps to one of the 8 comparison factors from the Decision Guide.
// Scores: positive = leans 50/50, negative = leans 51/49
const QUESTIONS = [
  // ── 1. Decision-Making Authority ──
  {
    category: "Decision-Making Authority",
    factor: 0,
    text: "How do you prefer routine operational decisions to be made?",
    context: "Think about daily calls like ingredient orders, booth setup changes, or menu tweaks at the farmers market.",
    options: [
      { label: "Both partners must agree on every decision, no matter how small.", score: 2 },
      { label: "Both should discuss, but if we disagree, one person should be able to make the final call.", score: -1 },
      { label: "One partner should handle daily operations independently within agreed budget limits.", score: -2 },
    ]
  },
  {
    category: "Decision-Making Authority",
    factor: 0,
    text: "How concerned are you about deadlock — where neither partner can break a tie?",
    context: "In a 50/50 structure, every disagreement is a potential deadlock. In 51/49, the majority partner breaks ties on routine matters.",
    options: [
      { label: "I'm not worried. We communicate well and will always find consensus.", score: 2 },
      { label: "I'm somewhat concerned. We agree most of the time, but not always.", score: 0 },
      { label: "I'm very concerned. We need a clear tiebreaker to keep the business moving.", score: -2 },
    ]
  },

  // ── 2. Partner Protections ──
  {
    category: "Partner Protections",
    factor: 1,
    text: "How important is it that neither partner can be overruled on major decisions?",
    context: "Major decisions include taking on debt, adding new members, selling assets, or dissolving the LLC.",
    options: [
      { label: "Extremely important. I need automatic veto power on everything.", score: 2 },
      { label: "Important for big decisions only — routine stuff doesn't need veto power.", score: -1 },
      { label: "I trust my partner to make good calls even without my explicit approval.", score: -2 },
    ]
  },
  {
    category: "Partner Protections",
    factor: 1,
    text: "How do you feel about your partner having more formal control than you?",
    context: "In a 51/49, the minority partner relies on negotiated supermajority protections rather than built-in equal power.",
    options: [
      { label: "I would not be comfortable with that. Equal control is non-negotiable.", score: 2 },
      { label: "I'd accept it if strong protections are written into the operating agreement.", score: -1 },
      { label: "I'm fine with it — I trust my partner and care more about the business running smoothly.", score: -2 },
    ]
  },

  // ── 3. Deadlock Resolution ──
  {
    category: "Deadlock Resolution",
    factor: 2,
    text: "If you and your partner reach an impasse on a major decision, what's your preferred resolution?",
    context: "Options range from mediation to buy-sell clauses. In 50/50, deadlock resolution is existentially important; in 51/49, it's needed only for major decisions.",
    options: [
      { label: "We'll work it out ourselves — we're good at talking things through.", score: 1 },
      { label: "We should have a formal escalation process (mediation → arbitration → buy-sell).", score: 0 },
      { label: "I'd rather avoid deadlocks entirely by giving one partner the tiebreaker.", score: -2 },
    ]
  },

  // ── 4. IP & Recipes ──
  {
    category: "IP & Recipe Ownership",
    factor: 3,
    text: "Is one partner contributing original recipes or intellectual property to the venture?",
    context: "Recipe ownership is often the most valuable asset in a food business. The structure affects how IP is protected.",
    options: [
      { label: "Yes, I am the recipe creator.", score: 2 },
      { label: "Yes, my partner is the recipe creator.", score: 1 },
      { label: "We're developing recipes together, or using existing public recipes.", score: 0 },
    ]
  },
  {
    category: "IP & Recipe Ownership",
    factor: 3,
    text: "How should recipe ownership be handled if the partnership ends?",
    context: "In a 50/50, equal veto protects IP naturally. In a 51/49, the recipe creator should license (not assign) recipes to the LLC.",
    options: [
      { label: "The recipe creator should retain full ownership no matter what.", score: 2 },
      { label: "Recipes belong to the LLC, but with clear exit provisions.", score: 0 },
      { label: "Whatever is standard — I trust the operating agreement to handle it.", score: -1 },
    ]
  },

  // ── 5. Compensation & Distributions ──
  {
    category: "Compensation & Distributions",
    factor: 4,
    text: "How should profits be split?",
    context: "A 50/50 split means equal profit sharing. A 51/49 can still have equal (50/50) profit distribution despite unequal governance — this is called a hybrid structure.",
    options: [
      { label: "Exactly 50/50 — equal profits for equal partners.", score: 2 },
      { label: "Proportional to ownership percentage (51/49).", score: -1 },
      { label: "Based on each partner's actual contribution (time, capital, IP) — regardless of ownership split.", score: 0 },
    ]
  },
  {
    category: "Compensation & Distributions",
    factor: 4,
    text: "Are you concerned about 'phantom income' — owing taxes on profits that haven't been distributed to you?",
    context: "In a 51/49, the managing member could retain cash in the business while both members owe taxes on allocated income.",
    options: [
      { label: "Very concerned — I want guaranteed distributions to cover my tax liability.", score: 1 },
      { label: "Somewhat concerned — but I trust my partner to be fair about distributions.", score: 0 },
      { label: "Not worried. I'm comfortable reinvesting profits into the business.", score: -1 },
    ]
  },

  // ── 6. Exit Strategies ──
  {
    category: "Exit Strategies",
    factor: 5,
    text: "If one partner wants out, how should the buyout be valued?",
    context: "In a 50/50, interests are equal so no minority discount applies. In a 51/49, the minority partner's interest may be discounted.",
    options: [
      { label: "Pro-rata share of total business value — no discounts for anyone.", score: 2 },
      { label: "Fair market value with standard minority/marketability discounts if applicable.", score: -1 },
      { label: "Whatever an independent appraiser determines.", score: 0 },
    ]
  },
  {
    category: "Exit Strategies",
    factor: 5,
    text: "How important is it that neither partner can unilaterally dissolve the business?",
    context: "Under RULLCA, the 51% member could unilaterally dissolve the LLC unless a higher threshold is negotiated.",
    options: [
      { label: "Critical — dissolution should require both partners to agree.", score: 2 },
      { label: "Important, but I trust the agreement will have proper protections.", score: 0 },
      { label: "Less important — if one partner wants out, forcing them to stay helps nobody.", score: -1 },
    ]
  },

  // ── 7. Regulatory Compliance ──
  {
    category: "Regulatory Compliance",
    factor: 6,
    text: "Who should be responsible for managing permits, health inspections, and regulatory filings?",
    context: "Santa Monica vendor permits are non-transferable. Both structures face identical regulatory requirements.",
    options: [
      { label: "Both partners equally — shared responsibility.", score: 1 },
      { label: "The partner who works the booth most — they're closest to the operations.", score: -1 },
      { label: "Doesn't matter as long as one person is clearly designated.", score: 0 },
    ]
  },

  // ── 8. Trust & Relationship ──
  {
    category: "Trust & Relationship",
    factor: 7,
    text: "How would you describe the trust level between you and your partner?",
    context: "50/50 works best with high trust and strong communication. 51/49 provides structural safeguards when trust is still developing.",
    options: [
      { label: "Complete trust — I'd go into this with a handshake if I could.", score: 2 },
      { label: "Strong trust, but I want everything documented properly.", score: 0 },
      { label: "Growing trust — we're still building the relationship and I want clear protections.", score: -2 },
    ]
  },
  {
    category: "Trust & Relationship",
    factor: 7,
    text: "Are your contributions to the venture roughly equal?",
    context: "Equal contributions (cash + labor + IP) naturally support a 50/50 split. Asymmetric contributions may warrant 51/49.",
    options: [
      { label: "Yes — we're both contributing similar value in capital, labor, and expertise.", score: 2 },
      { label: "Mostly equal, but one of us contributes slightly more in one area.", score: 0 },
      { label: "Clearly unequal — one partner is contributing significantly more capital or labor.", score: -2 },
    ]
  },
  {
    category: "Trust & Relationship",
    factor: 7,
    text: "Is one partner significantly more operationally active than the other?",
    context: "If one partner runs the booth full-time while the other is more passive, giving the operator decision authority may match reality.",
    options: [
      { label: "We'll both be equally active in daily operations.", score: 2 },
      { label: "One of us will be more active, but both will be involved.", score: 0 },
      { label: "One partner will be the full-time operator; the other is more of an investor.", score: -2 },
    ]
  },
];

// Factor names (index-aligned)
const FACTORS = [
  "Decision-Making Authority",
  "Partner Protections",
  "Deadlock Resolution",
  "IP & Recipe Ownership",
  "Compensation & Distributions",
  "Exit Strategies",
  "Regulatory Compliance",
  "Trust & Relationship"
];

// Factor insight generators — return specific text based on actual answer patterns
// Each function receives (norm, answerIndices, questionIndices) where norm is -1 to +1
const FACTOR_INSIGHTS = {
  0: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // routine decisions
    const q1 = answers[qis[1]]; // deadlock concern
    if (norm > 0.5) return { label: "Strong 50/50", detail: "Both responses favor joint decision-making. This partnership wants consensus on everything — a 50/50 structure with a robust deadlock clause is essential.", flag: null };
    if (norm > 0.1) return { label: "Leans 50/50", detail: "Preference for shared decisions, but some openness to tiebreakers. A 50/50 with a managing-member carve-out for small routine calls could work.", flag: null };
    if (norm < -0.5) return { label: "Strong 51/49", detail: "Clear preference for one partner to handle daily operations and break ties. Supermajority protections for the 49% partner are critical here.", flag: q1 === 2 ? "High deadlock concern — tiebreaker authority is important to this respondent." : null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Comfort with delegated authority on routine matters. The operating agreement should clearly define which decisions require unanimity vs. managing-member authority.", flag: null };
    return { label: "Neutral", detail: "Mixed signals — comfortable with shared control but also sees value in clear leadership. A hybrid approach (50/50 economics, 51/49 governance) may fit best.", flag: null };
  },
  1: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // veto importance
    const q1 = answers[qis[1]]; // comfort with unequal control
    if (norm > 0.5) return { label: "Strong 50/50", detail: "Veto power and equal control are non-negotiable. This respondent would be uncomfortable in a minority position without structural equality.", flag: q1 === 0 ? "Equal control was explicitly marked as non-negotiable." : null };
    if (norm > 0.1) return { label: "Leans 50/50", detail: "Values protections but shows some flexibility. Strong supermajority provisions could satisfy this partner's needs in either structure.", flag: null };
    if (norm < -0.5) return { label: "Strong 51/49", detail: "Trust-based approach — comfortable with unequal formal control as long as the business runs smoothly. Less concerned about structural power.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Would accept unequal governance if protections are written in. Key provisions: supermajority thresholds on major decisions, information rights, anti-dilution.", flag: null };
    return { label: "Neutral", detail: "Wants protections but isn't rigid about how they're delivered. Either structure works with proper drafting.", flag: null };
  },
  2: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // impasse resolution preference
    if (q0 === 0) return { label: norm >= 0 ? "Leans 50/50" : "Neutral", detail: "Prefers informal resolution — believes the partnership can talk through disagreements. In a 50/50, this confidence is essential but the agreement should still have a formal escalation ladder as backup.", flag: "Relying solely on good communication is risky. The agreement must include mediation → arbitration → buy-sell regardless." };
    if (q0 === 1) return { label: "Structure-aware", detail: "Wants a formal escalation process (mediation → arbitration → buy-sell). This is the correct approach for either structure, but is particularly critical in a 50/50 where deadlocks can paralyze the business.", flag: null };
    return { label: "Leans 51/49", detail: "Wants to avoid deadlocks entirely by having a clear tiebreaker. This strongly suggests 51/49 governance where the managing member can break routine ties while major decisions still require both.", flag: null };
  },
  3: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // IP contributor
    const q1 = answers[qis[1]]; // IP exit handling
    const isCreator = q0 === 0;
    const retainIP = q1 === 0;
    if (isCreator && retainIP) return { label: "Strong 50/50", detail: "This respondent is the recipe creator AND wants to retain full ownership. In a 50/50, equal veto power naturally protects IP. In a 51/49, a license-not-assign model is non-negotiable.", flag: "IP ownership is a high-stakes factor. The operating agreement must explicitly address recipe ownership, licensing terms, and post-departure rights." };
    if (isCreator) return { label: "Leans 50/50", detail: "Recipe creator who is somewhat flexible on exit provisions. Either structure works, but the license model should be included regardless to protect the creator's interests.", flag: null };
    if (norm > 0.1) return { label: "Leans 50/50", detail: "Values IP protection and equal say over how recipes are used. A 50/50 gives both partners automatic blocking rights over IP decisions.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Less concerned about IP control — trusts the agreement to handle it. The license-not-assign model should still be used to protect the recipe creator.", flag: null };
    return { label: "Neutral", detail: "Joint recipe development or standard recipes. IP is less of a differentiating factor — either structure works with proper IP provisions.", flag: null };
  },
  4: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // profit split preference
    const q1 = answers[qis[1]]; // phantom income concern
    if (q0 === 0 && q1 === 0) return { label: "Strong 50/50", detail: "Wants exactly equal profits AND is concerned about phantom income. A 50/50 with mandatory tax distributions and equal quarterly distributions is the cleanest fit.", flag: "Phantom income concern means the agreement MUST include mandatory tax distributions at the highest marginal rate." };
    if (q0 === 0) return { label: "Leans 50/50", detail: "Prefers equal profit sharing. Note: this is achievable in either structure — a 51/49 can still distribute profits 50/50 (the 'hybrid' model).", flag: null };
    if (q0 === 1) return { label: "Leans 51/49", detail: "Comfortable with proportional profit sharing based on ownership percentage. In a 51/49, this means the majority member receives slightly more.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Prefers contribution-based compensation and is comfortable with profit reinvestment. This flexibility supports a 51/49 where the managing member has more discretion on distributions.", flag: null };
    return { label: "Neutral", detail: "Flexible on profit distribution. The key takeaway: regardless of structure, mandatory tax distributions and a clear distribution schedule should be in the agreement.", flag: q1 === 0 ? "Phantom income concern noted — include mandatory tax distribution clause." : null };
  },
  5: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // buyout valuation
    const q1 = answers[qis[1]]; // dissolution protection
    if (q0 === 0 && q1 === 0) return { label: "Strong 50/50", detail: "Wants pro-rata buyout with no minority discount AND strong dissolution protections. A 50/50 delivers both by design — neither partner's interest can be discounted.", flag: null };
    if (q0 === 0) return { label: "Leans 50/50", detail: "Pro-rata valuation preference. In a 51/49, the agreement must explicitly waive minority/marketability discounts to achieve the same fairness.", flag: "If going 51/49: include a 'no-discount' clause for buyouts to protect the minority partner." };
    if (norm < -0.5) return { label: "Strong 51/49", detail: "Comfortable with standard market valuations and flexible on dissolution. This respondent prioritizes business continuity over structural protections.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Pragmatic on exit. Either structure works, but dissolution threshold should still require unanimity regardless.", flag: null };
    return { label: "Neutral", detail: "Trusts an independent appraiser for valuation. Either structure works — the buy-sell provisions are what matter most, not the ownership split.", flag: null };
  },
  6: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // regulatory responsibility
    if (q0 === 0) return { label: "Leans 50/50", detail: "Prefers shared regulatory responsibility. Both structures face identical permit/compliance requirements — the difference is who takes point.", flag: null };
    if (q0 === 1) return { label: "Leans 51/49", detail: "Wants the active operator to handle permits and compliance. This aligns with 51/49 where the managing member naturally owns regulatory responsibility.", flag: "Santa Monica vendor permits are non-transferable and personal. Both partners should be listed regardless of structure." };
    return { label: "Neutral", detail: "Indifferent on who handles compliance — just wants clear designation. Either structure works; the Regulatory Compliance Officer role should be defined in the agreement.", flag: null };
  },
  7: (norm, answers, qis) => {
    const q0 = answers[qis[0]]; // trust level
    const q1 = answers[qis[1]]; // contribution equality
    const q2 = answers[qis[2]]; // operational activity
    const highTrust = q0 === 0;
    const equalContrib = q1 === 0;
    const equalActive = q2 === 0;
    if (highTrust && equalContrib && equalActive) return { label: "Strong 50/50", detail: "Complete trust, equal contributions, equal operational involvement — this is the textbook case for a 50/50 split.", flag: null };
    if (norm > 0.3) return { label: "Leans 50/50", detail: "High trust and mostly equal partnership dynamics. A 50/50 structure reflects the relationship reality.", flag: null };
    if (q2 === 2) return { label: "Strong 51/49", detail: "One partner is clearly the full-time operator while the other is more passive. A 51/49 with the operator as managing member aligns governance with day-to-day reality.", flag: "Asymmetric involvement is the strongest predictor of 51/49 suitability." };
    if (norm < -0.3) return { label: "Leans 51/49", detail: "Growing trust or unequal contributions suggest the partnership is still developing. A 51/49 with strong protections provides structure while the relationship matures.", flag: q0 === 2 ? "Trust is still developing — the agreement should include more guardrails (regular meetings, detailed reporting, approval thresholds)." : null };
    return { label: "Neutral", detail: "Mixed relationship signals. The partnership has elements that support both structures. Key question: will both partners be equally involved day-to-day?", flag: null };
  },
};

// Helper: get question indices belonging to each factor
function getFactorQuestionIndices() {
  const map = {};
  QUESTIONS.forEach((q, qi) => {
    if (!map[q.factor]) map[q.factor] = [];
    map[q.factor].push(qi);
  });
  return map;
}

// ─── EmailJS Configuration ───
const EMAILJS = {
  serviceId: "service_wabtt69",
  templateId: "template_7mektik",
  publicKey: "130PuCIb_6PfT82tZ",
};

// ─── Access Codes ───
// Each partner has a unique access code to prevent cross-access
const ACCESS_CODES = {
  danny: "DB2026",
  benny: "BR2026",
  admin: "DS2026",
};

// ─── State ───
let currentPartner = "";
let currentQ = 0;
let answers = new Array(QUESTIONS.length).fill(null);
let isAdminTest = false;

// ─── Local Storage ───
function saveResults(partner, data) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  // Increment submission count
  const countKey = partner + "_count";
  stored[countKey] = (stored[countKey] || 0) + 1;
  stored[partner] = data;
  stored[partner + "_date"] = new Date().toISOString();
  localStorage.setItem("digispace-decision", JSON.stringify(stored));
}

function getSubmissionCount(partner) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return stored[partner + "_count"] || 0;
}

function getResults(partner) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return stored[partner] || null;
}

function getBothResults() {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return { danny: stored.danny || null, benny: stored.benny || null };
}

function clearResults(partner) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  delete stored[partner];
  delete stored[partner + "_date"];
  // Keep the count — we want the running total
  localStorage.setItem("digispace-decision", JSON.stringify(stored));
}

// ─── Screen Management ───
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

// ─── Partner Selection (with access code verification) ───
function selectPartner(partner) {
  const names = { danny: "Danny Barcelo", benny: "Benny Rodriguez", admin: "Admin Mode" };
  const name = names[partner] || partner;
  const isAdmin = partner === "admin";

  // Show access code modal
  const overlay = document.createElement("div");
  overlay.id = "access-overlay";
  overlay.innerHTML = `
    <div class="access-modal">
      <h3 class="access-title">${isAdmin ? "Admin Access" : "Identity Verification"}</h3>
      <p class="access-text">${isAdmin
        ? "Enter your admin code to test the questionnaire. Submissions in this mode are tagged as test runs and do not affect client results."
        : `Enter your personal access code to continue as <strong>${name}</strong>.`
      }</p>
      <input type="text" id="access-input" class="access-input" placeholder="Enter access code" maxlength="10" autocomplete="off">
      <p class="access-error" id="access-error"></p>
      <div class="access-actions">
        <button class="btn btn-outline" onclick="closeAccessModal()">Cancel</button>
        <button class="btn btn-primary" onclick="verifyCode('${partner}')">Verify</button>
      </div>
      <p class="access-hint">${isAdmin
        ? "Enter the admin code provided during setup."
        : "Your access code was provided by Dennis Smaltz.<br>Contact him if you don't have it."
      }</p>
    </div>
  `;
  document.body.appendChild(overlay);

  // Focus input and allow Enter key
  setTimeout(() => {
    const input = document.getElementById("access-input");
    input.focus();
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") verifyCode(partner);
    });
  }, 50);
}

function verifyCode(partner) {
  const input = document.getElementById("access-input");
  const error = document.getElementById("access-error");
  const code = input.value.trim().toUpperCase();

  if (partner === "admin") {
    if (code === ACCESS_CODES.admin.toUpperCase()) {
      // Code verified — now show partner selection
      closeAccessModal();
      showAdminPartnerSelect();
    } else {
      error.textContent = "Incorrect admin code.";
      input.value = "";
      input.focus();
    }
    return;
  }

  if (code === ACCESS_CODES[partner].toUpperCase()) {
    closeAccessModal();
    isAdminTest = false;
    startQuestionnaire(partner);
  } else if (code === ACCESS_CODES[partner === "danny" ? "benny" : "danny"].toUpperCase()) {
    error.textContent = "That code belongs to the other partner. Please use your own access code.";
    input.value = "";
    input.focus();
  } else {
    error.textContent = "Incorrect access code. Please try again.";
    input.value = "";
    input.focus();
  }
}

function closeAccessModal() {
  const overlay = document.getElementById("access-overlay");
  if (overlay) overlay.remove();
}

function showAdminPartnerSelect() {
  // Check current submission status
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  const dannyStatus = stored.danny ? "Submitted" : "Not submitted";
  const bennyStatus = stored.benny ? "Submitted" : "Not submitted";
  const dannyCount = stored.danny_submission_count || 0;
  const bennyCount = stored.benny_submission_count || 0;

  const overlay = document.createElement("div");
  overlay.id = "access-overlay";
  overlay.innerHTML = `
    <div class="access-modal">
      <h3 class="access-title">Admin Mode</h3>

      <div style="background:var(--light); border-radius:6px; padding:12px; margin-bottom:16px; font-size:.85rem; text-align:left;">
        <strong style="display:block; margin-bottom:6px;">Submission Status:</strong>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Danny Barcelo</span>
          <span style="color:${stored.danny ? 'var(--gold)' : 'var(--slate)'};">${dannyStatus}${dannyCount ? ' (#' + dannyCount + ')' : ''}</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>Benny Rodriguez</span>
          <span style="color:${stored.benny ? 'var(--gold)' : 'var(--slate)'};">${bennyStatus}${bennyCount ? ' (#' + bennyCount + ')' : ''}</span>
        </div>
      </div>

      <p class="access-text">Test the questionnaire as:</p>
      <div class="access-actions" style="flex-direction:column; gap:10px; margin-top:8px;">
        <button class="btn btn-primary" onclick="adminStartAs('danny')" style="width:100%;">Test as Danny Barcelo</button>
        <button class="btn btn-secondary" onclick="adminStartAs('benny')" style="width:100%;">Test as Benny Rodriguez</button>
      </div>

      <div style="border-top:1px solid #ddd; margin-top:20px; padding-top:14px;">
        <p class="access-text" style="font-size:.8rem; color:var(--slate); margin-bottom:8px;">Reset stored data:</p>
        <div class="access-actions" style="flex-direction:column; gap:8px;">
          <button class="btn btn-outline" onclick="adminReset('danny')" style="width:100%; font-size:.8rem;">Reset Danny's Results</button>
          <button class="btn btn-outline" onclick="adminReset('benny')" style="width:100%; font-size:.8rem;">Reset Benny's Results</button>
          <button class="btn btn-outline" onclick="adminReset('all')" style="width:100%; font-size:.8rem; color:#c0392b; border-color:#c0392b;">Reset All Data</button>
        </div>
      </div>

      <div class="access-actions" style="margin-top:16px;">
        <button class="btn btn-outline" onclick="closeAccessModal()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function adminReset(target) {
  if (target === "all") {
    if (!confirm("This will clear ALL stored results for both partners. Are you sure?")) return;
    localStorage.removeItem("digispace-decision");
  } else {
    const name = target === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
    if (!confirm(`This will clear ${name}'s stored results. Are you sure?`)) return;
    const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
    delete stored[target];
    delete stored[target + "_date"];
    delete stored[target + "_submission_count"];
    localStorage.setItem("digispace-decision", JSON.stringify(stored));
  }
  // Refresh the admin panel to show updated status
  closeAccessModal();
  showAdminPartnerSelect();
}

function adminStartAs(partner) {
  closeAccessModal();
  isAdminTest = true;
  startQuestionnaire(partner);
}

function startQuestionnaire(partner) {
  const existing = getResults(partner);
  const name = partner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";

  if (existing) {
    // Partner already submitted — confirm retake
    const count = getSubmissionCount(partner);
    const overlay = document.createElement("div");
    overlay.id = "retake-overlay";
    overlay.innerHTML = `
      <div class="access-modal">
        <h3 class="access-title">Retake Questionnaire?</h3>
        <p class="access-text"><strong>${name}</strong>, you've already submitted (${count} submission${count !== 1 ? "s" : ""} on record).</p>
        <p class="access-text" style="margin-top:8px;">Starting over will <strong>replace</strong> your previous answers. Only your latest submission will count.</p>
        <div class="access-actions">
          <button class="btn btn-outline" onclick="document.getElementById('retake-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="document.getElementById('retake-overlay').remove(); beginFresh('${partner}')">Start Fresh</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    return;
  }

  beginFresh(partner);
}

function beginFresh(partner) {
  clearResults(partner);
  currentPartner = partner;
  currentQ = 0;
  answers = new Array(QUESTIONS.length).fill(null);

  const name = partner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
  document.getElementById("q-partner-name").textContent = `${name}'s Questionnaire`;

  renderQuestion();
  showScreen("questionnaire");
}

// ─── Question Rendering ───
function renderQuestion() {
  const q = QUESTIONS[currentQ];
  const total = QUESTIONS.length;

  // Progress
  document.getElementById("progress-fill").style.width = `${((currentQ + 1) / total) * 100}%`;
  document.getElementById("progress-text").textContent = `Question ${currentQ + 1} of ${total}`;

  // Build card
  const body = document.getElementById("q-body");
  body.innerHTML = `
    <div class="q-card">
      <p class="q-category">${q.category}</p>
      <p class="q-text">${q.text}</p>
      <p class="q-context">${q.context}</p>
      <div class="q-options">
        ${q.options.map((opt, i) => `
          <label class="q-option ${answers[currentQ] === i ? 'selected' : ''}" onclick="selectOption(${i})">
            <input type="radio" name="q${currentQ}" value="${i}" ${answers[currentQ] === i ? 'checked' : ''}>
            <span class="q-option-label">${opt.label}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `;

  // Nav buttons
  document.getElementById("btn-prev").disabled = currentQ === 0;
  if (currentQ === total - 1) {
    document.getElementById("btn-next").style.display = "none";
    document.getElementById("btn-submit").style.display = "";
    document.getElementById("btn-submit").disabled = answers[currentQ] === null;
  } else {
    document.getElementById("btn-next").style.display = "";
    document.getElementById("btn-submit").style.display = "none";
    document.getElementById("btn-next").disabled = answers[currentQ] === null;
  }
}

function selectOption(i) {
  answers[currentQ] = i;
  renderQuestion();
}

function nextQuestion() {
  if (answers[currentQ] === null) return;
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

// ─── Scoring ───
function calculateScores(answerIndices) {
  // Per-factor scores
  const factorScores = new Array(FACTORS.length).fill(0);
  const factorCounts = new Array(FACTORS.length).fill(0);

  answerIndices.forEach((ai, qi) => {
    if (ai === null) return;
    const q = QUESTIONS[qi];
    factorScores[q.factor] += q.options[ai].score;
    factorCounts[q.factor]++;
  });

  // Normalize each factor to a -1 to +1 range
  const normalized = factorScores.map((s, i) => {
    if (factorCounts[i] === 0) return 0;
    const maxPossible = factorCounts[i] * 2; // max score per question is 2
    return s / maxPossible;
  });

  // Total score: sum of all raw scores
  const totalRaw = factorScores.reduce((a, b) => a + b, 0);

  return { factorScores, factorCounts, normalized, totalRaw };
}

// ─── Result Code Encoding/Decoding ───
// Encodes answers into a compact string: partner initial + answer indices as hex
function encodeResults(partner, answerIndices) {
  const prefix = partner === "danny" ? "D" : "B";
  const hex = answerIndices.map(a => a.toString(16)).join("");
  return prefix + hex;
}

function decodeResults(code) {
  const partner = code[0] === "D" ? "danny" : code[0] === "B" ? "benny" : null;
  if (!partner) return null;
  const hex = code.slice(1);
  const answerIndices = hex.split("").map(h => parseInt(h, 16));
  if (answerIndices.length !== QUESTIONS.length) return null;
  if (answerIndices.some(a => isNaN(a))) return null;
  return { partner, answers: answerIndices };
}

// ─── Build Combined Scorecard Text ───
function buildScorecardText(dannyAnswers, bennyAnswers) {
  const dannyScores = calculateScores(dannyAnswers);
  const bennyScores = calculateScores(bennyAnswers);
  const fqMap = getFactorQuestionIndices();

  const combined = { factorScores: new Array(FACTORS.length).fill(0), factorCounts: new Array(FACTORS.length).fill(0) };
  FACTORS.forEach((_, i) => {
    combined.factorScores[i] = dannyScores.factorScores[i] + bennyScores.factorScores[i];
    combined.factorCounts[i] = dannyScores.factorCounts[i] + bennyScores.factorCounts[i];
  });
  const totalRaw = combined.factorScores.reduce((a, b) => a + b, 0);
  const normalized = combined.factorScores.map((s, i) =>
    combined.factorCounts[i] === 0 ? 0 : s / (combined.factorCounts[i] * 2)
  );

  const maxRaw = QUESTIONS.length * 2 * 2;
  const fiftyPct = totalRaw > 0 ? Math.round(((totalRaw / maxRaw) * 50) + 50) : totalRaw < 0 ? Math.round(50 - (Math.abs(totalRaw) / maxRaw) * 50) : 50;
  const fiftyOnePct = 100 - fiftyPct;

  let lines = [];
  lines.push("═══════════════════════════════════════════════");
  lines.push("  COMBINED DECISION SCORECARD");
  lines.push("  Danny Barcelo & Benny Rodriguez");
  lines.push("═══════════════════════════════════════════════");
  lines.push("");
  lines.push(`  50/50 Alignment:  ${fiftyPct}%`);
  lines.push(`  51/49 Alignment:  ${fiftyOnePct}%`);
  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  FACTOR-BY-FACTOR ANALYSIS");
  lines.push("───────────────────────────────────────────────");

  const allFlags = [];

  FACTORS.forEach((name, i) => {
    const norm = normalized[i];
    const insight = FACTOR_INSIGHTS[i](norm, dannyAnswers, fqMap[i]);
    const bar50 = Math.round(Math.max(0, norm) * 5);
    const bar51 = Math.round(Math.max(0, -norm) * 5);

    // Agreement check
    const dNorm = dannyScores.factorCounts[i] > 0 ? dannyScores.factorScores[i] / (dannyScores.factorCounts[i] * 2) : 0;
    const bNorm = bennyScores.factorCounts[i] > 0 ? bennyScores.factorScores[i] / (bennyScores.factorCounts[i] * 2) : 0;
    const sameDir = (dNorm > 0.1 && bNorm > 0.1) || (dNorm < -0.1 && bNorm < -0.1) || (Math.abs(dNorm) <= 0.1 && Math.abs(bNorm) <= 0.1);
    const agreeTag = sameDir ? "[AGREE]" : "[DIVERGE]";

    lines.push("");
    lines.push(`  ${name}  →  ${insight.label}  ${agreeTag}`);
    lines.push(`    50/50 ${"█".repeat(bar50)}${"░".repeat(5 - bar50)}  51/49 ${"█".repeat(bar51)}${"░".repeat(5 - bar51)}`);
    lines.push(`    ${insight.detail}`);
    if (insight.flag) {
      lines.push(`    ⚠ ${insight.flag}`);
      allFlags.push({ factor: name, flag: insight.flag });
    }
    if (!sameDir) {
      lines.push(`    ⚠ Partners diverge on this factor — discuss before deciding.`);
      allFlags.push({ factor: name, flag: "Danny and Benny answered differently." });
    }
  });

  // Tally
  const insights = FACTORS.map((name, i) => FACTOR_INSIGHTS[i](normalized[i], dannyAnswers, fqMap[i]));
  const fiftyCount = insights.filter(f => f.label.includes("50/50")).length;
  const fiftyOneCount = insights.filter(f => f.label.includes("51/49")).length;
  const neutralCount = FACTORS.length - fiftyCount - fiftyOneCount;
  const agreeCount = FACTORS.filter((_, i) => {
    const dN = dannyScores.factorCounts[i] > 0 ? dannyScores.factorScores[i] / (dannyScores.factorCounts[i] * 2) : 0;
    const bN = bennyScores.factorCounts[i] > 0 ? bennyScores.factorScores[i] / (bennyScores.factorCounts[i] * 2) : 0;
    return (dN > 0.1 && bN > 0.1) || (dN < -0.1 && bN < -0.1) || (Math.abs(dN) <= 0.1 && Math.abs(bN) <= 0.1);
  }).length;

  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  SUMMARY");
  lines.push("───────────────────────────────────────────────");
  lines.push(`  Factors favoring 50/50:  ${fiftyCount}`);
  lines.push(`  Factors favoring 51/49:  ${fiftyOneCount}`);
  lines.push(`  Neutral factors:         ${neutralCount}`);
  lines.push(`  Partner agreement:       ${agreeCount} of 8 factors`);

  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  VERDICT");
  lines.push("───────────────────────────────────────────────");

  if (fiftyPct > 58) {
    lines.push(`  ${fiftyCount} of 8 factors favor 50/50.`);
    lines.push("  The partnership values equal control,");
    lines.push("  mutual veto power, and shared decisions.");
    lines.push("  → Recommend 50/50 LLC with robust deadlock");
    lines.push("    resolution ladder in operating agreement.");
  } else if (fiftyOnePct > 58) {
    lines.push(`  ${fiftyOneCount} of 8 factors favor 51/49.`);
    lines.push("  The partnership values operational speed,");
    lines.push("  clear leadership, and agile decisions.");
    lines.push("  → Recommend 51/49 LLC with supermajority");
    lines.push("    protections for the minority partner.");
  } else {
    lines.push("  Responses are balanced — neither structure");
    lines.push("  has a clear mandate.");
    lines.push("  → Recommend hybrid: 50/50 economics with");
    lines.push("    51/49 governance (tiebreaker on routine,");
    lines.push("    unanimity on major decisions).");
  }

  if (allFlags.length > 0) {
    lines.push("");
    lines.push("───────────────────────────────────────────────");
    lines.push("  KEY CONSIDERATIONS");
    lines.push("───────────────────────────────────────────────");
    allFlags.forEach(f => {
      lines.push(`  • ${f.factor}: ${f.flag}`);
    });
  }

  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  Danny's code: " + encodeResults("danny", dannyAnswers));
  lines.push("  Benny's code: " + encodeResults("benny", bennyAnswers));
  lines.push("═══════════════════════════════════════════════");

  return lines.join("\n");
}

// ─── Submit ───
function submitAnswers() {
  if (answers.some(a => a === null)) return;

  const scores = calculateScores(answers);
  const partnerName = currentPartner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  if (isAdminTest) {
    // Admin test — don't save to real localStorage, email tagged as TEST
    const resultCode = encodeResults(currentPartner, answers);
    if (typeof emailjs !== "undefined") {
      emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        partner_name: `[ADMIN TEST] as ${partnerName}`,
        result_code: resultCode,
        timestamp: timestamp,
      }, EMAILJS.publicKey).then(
        () => console.log("Admin test results emailed."),
        (err) => console.warn("Email send failed:", err)
      );
    }
    // Save temporarily so showResults works, but under a test key
    const testData = { answers, scores };
    const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
    stored["_test_" + currentPartner] = testData;
    localStorage.setItem("digispace-decision", JSON.stringify(stored));
    showResults();
    return;
  }

  // Real submission
  saveResults(currentPartner, { answers, scores });

  const resultCode = encodeResults(currentPartner, answers);
  const count = getSubmissionCount(currentPartner);
  const attemptTag = `Submission #${count}${count > 1 ? " (retake)" : ""}`;

  if (typeof emailjs !== "undefined") {
    // Send individual submission email — includes attempt number
    emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
      partner_name: `${partnerName}  [${attemptTag}]`,
      result_code: resultCode,
      timestamp: timestamp,
    }, EMAILJS.publicKey).then(
      () => console.log("Individual results emailed."),
      (err) => console.warn("Email send failed:", err)
    );

    // Check if both partners have now submitted — if so, send combined scorecard
    const both = getBothResults();
    if (both.danny && both.benny) {
      const dannyCount = getSubmissionCount("danny");
      const bennyCount = getSubmissionCount("benny");
      const scorecard = buildScorecardText(both.danny.answers, both.benny.answers);
      const scorecardWithMeta = `Danny: Submission #${dannyCount}  |  Benny: Submission #${bennyCount}\n\n${scorecard}`;
      emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        partner_name: "COMBINED SCORECARD",
        result_code: scorecardWithMeta,
        timestamp: timestamp,
      }, EMAILJS.publicKey).then(
        () => console.log("Combined scorecard emailed."),
        (err) => console.warn("Scorecard email failed:", err)
      );
    }
  }

  showResults();
}

// ─── Results Display ───
function showResults() {
  const both = getBothResults();
  const hasBoth = both.danny && both.benny;
  const fqMap = getFactorQuestionIndices();

  // Determine which answers to analyze
  let activeAnswers; // the answer set used for insight generation
  let combinedScores;
  let subtitle;

  if (hasBoth) {
    const combined = { factorScores: new Array(FACTORS.length).fill(0), normalized: [] };
    FACTORS.forEach((_, i) => {
      combined.factorScores[i] = both.danny.scores.factorScores[i] + both.benny.scores.factorScores[i];
    });
    const totalRaw = combined.factorScores.reduce((a, b) => a + b, 0);
    combined.normalized = combined.factorScores.map((s, i) => {
      const count = (both.danny.scores.factorCounts[i] + both.benny.scores.factorCounts[i]);
      return count === 0 ? 0 : s / (count * 2);
    });
    combinedScores = { ...combined, totalRaw };
    // For insights, average the answer indices (we'll pass danny's for pattern detection)
    activeAnswers = both.danny.answers;
    subtitle = "Combined results for Danny Barcelo & Benny Rodriguez";
  } else {
    const partner = both.danny ? "danny" : "benny";
    const name = partner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
    const other = partner === "danny" ? "Benny Rodriguez" : "Danny Barcelo";
    combinedScores = both[partner].scores;
    activeAnswers = both[partner].answers;
    subtitle = `Results for ${name} — waiting for ${other} to complete their questionnaire`;
  }

  document.getElementById("results-sub").textContent = subtitle;

  // Score summary blocks
  const totalRaw = combinedScores.totalRaw;
  const maxRaw = hasBoth ? QUESTIONS.length * 2 * 2 : QUESTIONS.length * 2;
  const fiftyPct = totalRaw > 0 ? Math.round(((totalRaw / maxRaw) * 50) + 50) : totalRaw < 0 ? Math.round(50 - (Math.abs(totalRaw) / maxRaw) * 50) : 50;
  const fiftyOnePct = 100 - fiftyPct;

  document.getElementById("score-summary").innerHTML = `
    <div class="score-block fifty">
      <div class="score-label">50/50 Split</div>
      <div class="score-value">${fiftyPct}%</div>
      <div class="score-unit">alignment</div>
    </div>
    <div class="score-block fifty-one">
      <div class="score-label">51/49 Split</div>
      <div class="score-value">${fiftyOnePct}%</div>
      <div class="score-unit">alignment</div>
    </div>
  `;

  // Factor breakdown — now with granular insights
  const breakdown = document.getElementById("factor-breakdown");
  const insights = []; // collect for verdict narrative
  const flags = []; // collect flags/warnings

  breakdown.innerHTML = FACTORS.map((name, i) => {
    const norm = combinedScores.normalized[i];
    const fiftyW = Math.max(0, norm);
    const fiftyOneW = Math.max(0, -norm);
    const total = fiftyW + fiftyOneW || 1;
    const fiftyBar = (fiftyW / total) * 100;
    const fiftyOneBar = (fiftyOneW / total) * 100;

    // Get granular insight from factor function
    const insight = FACTOR_INSIGHTS[i](norm, activeAnswers, fqMap[i]);
    insights.push({ factor: name, ...insight, norm });
    if (insight.flag) flags.push({ factor: name, flag: insight.flag });

    let winnerClass;
    if (insight.label.includes("50/50")) winnerClass = "fifty";
    else if (insight.label.includes("51/49")) winnerClass = "fifty-one";
    else winnerClass = "even";

    // Agreement analysis for combined results
    let agreementHtml = "";
    if (hasBoth) {
      const dScore = both.danny.scores.factorScores[i];
      const bScore = both.benny.scores.factorScores[i];
      const dNorm = both.danny.scores.factorCounts[i] > 0 ? dScore / (both.danny.scores.factorCounts[i] * 2) : 0;
      const bNorm = both.benny.scores.factorCounts[i] > 0 ? bScore / (both.benny.scores.factorCounts[i] * 2) : 0;
      const sameDirection = (dNorm > 0.1 && bNorm > 0.1) || (dNorm < -0.1 && bNorm < -0.1) || (Math.abs(dNorm) <= 0.1 && Math.abs(bNorm) <= 0.1);
      const divergence = Math.abs(dNorm - bNorm);

      if (sameDirection && divergence < 0.3) {
        agreementHtml = `<span class="agreement-tag agree">Partners agree</span>`;
      } else if (sameDirection) {
        agreementHtml = `<span class="agreement-tag partial">Partners mostly agree</span>`;
      } else {
        agreementHtml = `<span class="agreement-tag disagree">Partners diverge</span>`;
        flags.push({ factor: name, flag: `Danny and Benny answered differently on ${name} — discuss this factor before deciding.` });
      }
    }

    return `
      <div class="factor-card">
        <div class="factor-header">
          <span class="factor-name">${name}</span>
          <span class="factor-winner ${winnerClass}">${insight.label}</span>
          ${agreementHtml}
        </div>
        <div class="factor-bar">
          <div class="bar-fifty" style="width: ${fiftyBar}%"></div>
          <div class="bar-fifty-one" style="width: ${fiftyOneBar}%"></div>
        </div>
        <p class="factor-note">${insight.detail}</p>
        ${insight.flag ? `<p class="factor-flag">${insight.flag}</p>` : ""}
      </div>
    `;
  }).join("");

  // Build narrative verdict based on factor insights
  const fiftyFactors = insights.filter(f => f.label.includes("50/50")).map(f => f.factor);
  const fiftyOneFactors = insights.filter(f => f.label.includes("51/49")).map(f => f.factor);
  const neutralFactors = insights.filter(f => !f.label.includes("50/50") && !f.label.includes("51/49")).map(f => f.factor);
  const strongFifty = insights.filter(f => f.label === "Strong 50/50").map(f => f.factor);
  const strongFiftyOne = insights.filter(f => f.label === "Strong 51/49").map(f => f.factor);

  const vBox = document.getElementById("verdict-box");
  let verdictClass, verdictTitle, verdictText, verdictDetails;

  if (fiftyPct > 58) {
    verdictClass = "fifty";
    verdictTitle = "Responses lean toward a 50/50 Split";
    verdictText = `${fiftyFactors.length} of 8 factors favor equal ownership${strongFifty.length > 0 ? `, with strong signals in ${strongFifty.join(" and ")}` : ""}. This partnership values equal control, mutual veto power, and shared decision-making.`;
    verdictDetails = `<strong>What this means for the agreement:</strong> A 50/50 LLC is the natural fit, but the operating agreement must include a robust deadlock-resolution ladder (negotiation → mediation → binding arbitration → shotgun buy-sell) since every disagreement is a potential impasse.`;
  } else if (fiftyOnePct > 58) {
    verdictClass = "fifty-one";
    verdictTitle = "Responses lean toward a 51/49 Split";
    verdictText = `${fiftyOneFactors.length} of 8 factors favor majority/minority structure${strongFiftyOne.length > 0 ? `, with strong signals in ${strongFiftyOne.join(" and ")}` : ""}. This partnership values operational speed, clear leadership, and practical decision-making.`;
    verdictDetails = `<strong>What this means for the agreement:</strong> A 51/49 LLC with robust minority protections — supermajority thresholds on major decisions, information rights, mandatory tax distributions, and a no-discount buyout clause for the 49% partner.`;
  } else {
    verdictClass = "even";
    verdictTitle = "Responses are balanced — consider a hybrid structure";
    verdictText = `${fiftyFactors.length} factors favor 50/50, ${fiftyOneFactors.length} favor 51/49, and ${neutralFactors.length} are neutral. Neither structure has a clear mandate.`;
    verdictDetails = `<strong>Recommended hybrid approach:</strong> 50/50 economic split (equal profits and distributions) with 51/49 governance (one partner has tiebreaker authority on routine decisions, but major decisions — debt, new members, dissolution, IP changes — require unanimous consent). This captures the equality both partners value while avoiding deadlock on daily operations.`;
  }

  // Add flags/warnings section if any
  let flagsHtml = "";
  if (flags.length > 0) {
    flagsHtml = `
      <div class="verdict-flags">
        <strong>Key considerations:</strong>
        <ul>${flags.map(f => `<li><strong>${f.factor}:</strong> ${f.flag}</li>`).join("")}</ul>
      </div>
    `;
  }

  // Agreement summary for combined results
  let agreementSummary = "";
  if (hasBoth) {
    const agreeCount = insights.filter((_, i) => {
      const dN = both.danny.scores.factorCounts[i] > 0 ? both.danny.scores.factorScores[i] / (both.danny.scores.factorCounts[i] * 2) : 0;
      const bN = both.benny.scores.factorCounts[i] > 0 ? both.benny.scores.factorScores[i] / (both.benny.scores.factorCounts[i] * 2) : 0;
      return (dN > 0.1 && bN > 0.1) || (dN < -0.1 && bN < -0.1) || (Math.abs(dN) <= 0.1 && Math.abs(bN) <= 0.1);
    }).length;
    agreementSummary = `<p class="verdict-agreement">Partner alignment: Danny and Benny agree on <strong>${agreeCount} of 8</strong> factors.</p>`;
  }

  vBox.className = `verdict-box ${verdictClass}`;
  vBox.innerHTML = `
    <h3 class="verdict-heading">${verdictTitle}</h3>
    <p class="verdict-text">${verdictText}</p>
    <p class="verdict-details">${verdictDetails}</p>
    ${agreementSummary}
    ${flagsHtml}
    <p class="verdict-disclaimer">This is a decision-support tool, not legal advice. Consult with independent legal counsel before finalizing your ownership structure.</p>
  `;

  showScreen("results");
}

// ─── Utilities ───
function goHome() {
  showScreen("landing");
}

function printResults() {
  window.print();
}

// ─── Check for existing results on load ───
(function init() {
  const both = getBothResults();
  if (both.danny && both.benny) {
    // Both have submitted — show a "View Results" option
    const card = document.querySelector(".landing-card");
    const existing = document.createElement("div");
    existing.style.cssText = "margin-top: 24px; padding: 16px; background: #E8F5E9; border: 1px solid #2E6B4F; border-radius: 4px;";
    existing.innerHTML = `
      <p style="font-family: var(--font-display); font-weight: 700; color: #2E6B4F; margin-bottom: 8px;">Both partners have submitted!</p>
      <p style="font-size: .85rem; color: #3D4F5F; margin-bottom: 12px;">View the combined scorecard or retake the questionnaire.</p>
      <button class="btn btn-submit" onclick="showResults()" style="margin-right: 8px;">View Combined Results</button>
    `;
    card.appendChild(existing);
  } else if (both.danny || both.benny) {
    const who = both.danny ? "Danny Barcelo" : "Benny Rodriguez";
    const card = document.querySelector(".landing-card");
    const existing = document.createElement("div");
    existing.style.cssText = "margin-top: 24px; padding: 16px; background: #EBF2FA; border: 1px solid #1B2A4A; border-radius: 4px;";
    existing.innerHTML = `
      <p style="font-family: var(--font-display); font-weight: 700; color: #1B2A4A; margin-bottom: 4px;">${who} has completed the questionnaire.</p>
      <p style="font-size: .85rem; color: #3D4F5F;">Waiting for the other partner to submit.</p>
    `;
    card.appendChild(existing);
  }
})();
