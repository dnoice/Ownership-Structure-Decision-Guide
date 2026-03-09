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

// Factor explanations for results
const FACTOR_NOTES = {
  0: { fifty: "Both partners must agree on everything — maximum fairness, maximum deadlock risk.", fiftyOne: "The 51% member breaks ties on routine decisions — faster operations, less gridlock." },
  1: { fifty: "Built-in veto power for both partners. The structure itself is the protection.", fiftyOne: "The 49% member must negotiate supermajority protections into the agreement." },
  2: { fifty: "Deadlock resolution is the operative heart of the entire agreement.", fiftyOne: "Deadlock is rarer — the business continues operating while major disputes are resolved." },
  3: { fifty: "Equal veto protects IP naturally. Neither partner can unilaterally control recipes.", fiftyOne: "Recipe creator should LICENSE (not assign) to the LLC for protection." },
  4: { fifty: "Neither partner can starve the other of distributions. Equal financial control.", fiftyOne: "Mandatory tax distributions and unanimity on compensation changes are non-negotiable." },
  5: { fifty: "Pro-rata buyout with no minority discount. Clean and equal.", fiftyOne: "The 49% member's interest may be subject to minority/marketability discounts." },
  6: { fifty: "Shared responsibility for permits and compliance.", fiftyOne: "Managing member takes point on regulatory matters — clearer chain of responsibility." },
  7: { fifty: "Works best with high trust, equal contributions, and both partners equally active.", fiftyOne: "Better when contributions are asymmetric or one partner is the primary operator." },
};

// ─── EmailJS Configuration ───
const EMAILJS = {
  serviceId: "service_aq3hvcj",
  templateId: "template_7mektik",
  publicKey: "130PuCIb_6PfT82tZ",
};

// ─── Access Codes ───
// Each partner has a unique access code to prevent cross-access
const ACCESS_CODES = {
  danny: "DB2026",
  benny: "BR2026",
};

// ─── State ───
let currentPartner = "";
let currentQ = 0;
let answers = new Array(QUESTIONS.length).fill(null);

// ─── Local Storage ───
function saveResults(partner, data) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  stored[partner] = data;
  stored[partner + "_date"] = new Date().toISOString();
  localStorage.setItem("digispace-decision", JSON.stringify(stored));
}

function getResults(partner) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return stored[partner] || null;
}

function getBothResults() {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return { danny: stored.danny || null, benny: stored.benny || null };
}

// ─── Screen Management ───
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

// ─── Partner Selection (with access code verification) ───
function selectPartner(partner) {
  const name = partner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";

  // Show access code modal
  const overlay = document.createElement("div");
  overlay.id = "access-overlay";
  overlay.innerHTML = `
    <div class="access-modal">
      <h3 class="access-title">Identity Verification</h3>
      <p class="access-text">Enter your personal access code to continue as <strong>${name}</strong>.</p>
      <input type="text" id="access-input" class="access-input" placeholder="Enter access code" maxlength="10" autocomplete="off">
      <p class="access-error" id="access-error"></p>
      <div class="access-actions">
        <button class="btn btn-outline" onclick="closeAccessModal()">Cancel</button>
        <button class="btn btn-primary" onclick="verifyCode('${partner}')">Verify</button>
      </div>
      <p class="access-hint">Your access code was provided by Dennis Smaltz.<br>Contact him if you don't have it.</p>
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

  if (code === ACCESS_CODES[partner].toUpperCase()) {
    closeAccessModal();
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

function startQuestionnaire(partner) {
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
  lines.push("═══════════════════════════════════════");
  lines.push("  COMBINED DECISION SCORECARD");
  lines.push("  Danny Barcelo & Benny Rodriguez");
  lines.push("═══════════════════════════════════════");
  lines.push("");
  lines.push(`  50/50 Alignment:  ${fiftyPct}%`);
  lines.push(`  51/49 Alignment:  ${fiftyOnePct}%`);
  lines.push("");
  lines.push("───────────────────────────────────────");
  lines.push("  FACTOR BREAKDOWN");
  lines.push("───────────────────────────────────────");

  FACTORS.forEach((name, i) => {
    const norm = normalized[i];
    let winner;
    if (norm > 0.1) winner = "→ 50/50";
    else if (norm < -0.1) winner = "→ 51/49";
    else winner = "→ Even";
    const bar50 = Math.round(Math.max(0, norm) * 5);
    const bar51 = Math.round(Math.max(0, -norm) * 5);
    lines.push("");
    lines.push(`  ${name}  ${winner}`);
    lines.push(`    50/50 ${"█".repeat(bar50)}${"░".repeat(5 - bar50)}  51/49 ${"█".repeat(bar51)}${"░".repeat(5 - bar51)}`);
  });

  lines.push("");
  lines.push("───────────────────────────────────────");
  lines.push("  VERDICT");
  lines.push("───────────────────────────────────────");

  if (fiftyPct > 58) {
    lines.push("  Combined responses lean toward 50/50.");
    lines.push("  The partnership values equal control,");
    lines.push("  mutual veto power, and shared decisions.");
  } else if (fiftyOnePct > 58) {
    lines.push("  Combined responses lean toward 51/49.");
    lines.push("  The partnership values operational speed,");
    lines.push("  clear leadership, and agile decisions.");
  } else {
    lines.push("  Responses are balanced — either works.");
    lines.push("  Consider hybrid: 50/50 economics with");
    lines.push("  51/49 governance (tiebreaker on routine).");
  }

  lines.push("");
  lines.push("───────────────────────────────────────");
  lines.push("  Danny's code: " + encodeResults("danny", dannyAnswers));
  lines.push("  Benny's code: " + encodeResults("benny", bennyAnswers));
  lines.push("═══════════════════════════════════════");

  return lines.join("\n");
}

// ─── Submit ───
function submitAnswers() {
  if (answers.some(a => a === null)) return;

  const scores = calculateScores(answers);
  saveResults(currentPartner, { answers, scores });

  const resultCode = encodeResults(currentPartner, answers);
  const partnerName = currentPartner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  if (typeof emailjs !== "undefined") {
    // Send individual submission email
    emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
      partner_name: partnerName,
      result_code: resultCode,
      timestamp: timestamp,
    }, EMAILJS.publicKey).then(
      () => console.log("Individual results emailed."),
      (err) => console.warn("Email send failed:", err)
    );

    // Check if both partners have now submitted — if so, send combined scorecard
    const both = getBothResults();
    if (both.danny && both.benny) {
      const scorecard = buildScorecardText(both.danny.answers, both.benny.answers);
      emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        partner_name: "COMBINED SCORECARD",
        result_code: scorecard,
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

  let combinedScores;
  let subtitle;

  if (hasBoth) {
    // Combine both partners' scores
    const allAnswers = [...both.danny.answers, ...both.benny.answers];
    // Re-calculate with combined factor scores
    const combined = { factorScores: new Array(FACTORS.length).fill(0), normalized: [] };
    FACTORS.forEach((_, i) => {
      combined.factorScores[i] = both.danny.scores.factorScores[i] + both.benny.scores.factorScores[i];
    });
    const totalRaw = combined.factorScores.reduce((a, b) => a + b, 0);
    const maxPossible = QUESTIONS.length * 2 * 2; // 2 partners, max 2 per question
    combined.normalized = combined.factorScores.map((s, i) => {
      const count = (both.danny.scores.factorCounts[i] + both.benny.scores.factorCounts[i]);
      return count === 0 ? 0 : s / (count * 2);
    });
    combinedScores = { ...combined, totalRaw };
    subtitle = "Combined results for Danny Barcelo & Benny Rodriguez";
  } else {
    const partner = both.danny ? "danny" : "benny";
    const name = partner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
    const other = partner === "danny" ? "Benny Rodriguez" : "Danny Barcelo";
    combinedScores = both[partner].scores;
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

  // Factor breakdown
  const breakdown = document.getElementById("factor-breakdown");
  breakdown.innerHTML = FACTORS.map((name, i) => {
    const norm = combinedScores.normalized[i]; // -1 to +1
    const fiftyW = Math.max(0, norm);
    const fiftyOneW = Math.max(0, -norm);
    const total = fiftyW + fiftyOneW || 1;
    const fiftyBar = (fiftyW / total) * 100;
    const fiftyOneBar = (fiftyOneW / total) * 100;

    let winnerClass, winnerLabel;
    if (norm > 0.1) { winnerClass = "fifty"; winnerLabel = "50/50"; }
    else if (norm < -0.1) { winnerClass = "fifty-one"; winnerLabel = "51/49"; }
    else { winnerClass = "even"; winnerLabel = "Even"; }

    const note = norm > 0.1 ? FACTOR_NOTES[i].fifty :
                 norm < -0.1 ? FACTOR_NOTES[i].fiftyOne :
                 "Your responses suggest either structure works for this factor.";

    return `
      <div class="factor-card">
        <div class="factor-header">
          <span class="factor-name">${name}</span>
          <span class="factor-winner ${winnerClass}">${winnerLabel}</span>
        </div>
        <div class="factor-bar">
          <div class="bar-fifty" style="width: ${fiftyBar}%"></div>
          <div class="bar-fifty-one" style="width: ${fiftyOneBar}%"></div>
        </div>
        <p class="factor-note">${note}</p>
      </div>
    `;
  }).join("");

  // Verdict
  const vBox = document.getElementById("verdict-box");
  let verdictClass, verdictTitle, verdictText;

  if (fiftyPct > 58) {
    verdictClass = "fifty";
    verdictTitle = "Your responses lean toward a 50/50 Split";
    verdictText = "Based on your answers, you value equal control, mutual veto power, and shared decision-making. A 50/50 LLC with a strong deadlock-resolution clause and detailed operating agreement would align with your partnership preferences.";
  } else if (fiftyOnePct > 58) {
    verdictClass = "fifty-one";
    verdictTitle = "Your responses lean toward a 51/49 Split";
    verdictText = "Based on your answers, you value operational speed, clear leadership, and practical decision-making. A 51/49 LLC with robust supermajority protections for the minority partner would align with your partnership preferences.";
  } else {
    verdictClass = "even";
    verdictTitle = "Your responses suggest either structure could work";
    verdictText = "Your answers are balanced between both structures. Consider the hybrid option: 50/50 economic split (equal profits) with 51/49 governance (one partner has tiebreaker on routine decisions, but major decisions require both). This captures the best of both worlds.";
  }

  vBox.className = `verdict-box ${verdictClass}`;
  vBox.innerHTML = `
    <h3 class="verdict-heading">${verdictTitle}</h3>
    <p class="verdict-text">${verdictText}</p>
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
