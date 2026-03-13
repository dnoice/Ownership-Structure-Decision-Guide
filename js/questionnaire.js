/* ═══════════════════════════════════════════════════════
   Questionnaire — Question rendering, navigation,
   option selection, and submission
   ═══════════════════════════════════════════════════════ */

import { QUESTIONS, EMAILJS } from './config.js';
import { state, setCurrentQ } from './app.js';
import { calculateScores, encodeResults } from './scoring.js';
import { saveResults, getSubmissionCount, getBothResults } from './storage.js';
import { buildScorecardText } from './results.js';
import { showScreen } from './app.js';
import { showResults } from './results.js';

// ─── Question Rendering ───
export function renderQuestion() {
  const q = QUESTIONS[state.currentQ];
  const total = QUESTIONS.length;

  // Progress
  document.getElementById("progress-fill").style.width = `${((state.currentQ + 1) / total) * 100}%`;
  document.getElementById("progress-text").textContent = `Question ${state.currentQ + 1} of ${total}`;

  // Build card with expandable learn-more
  const body = document.getElementById("q-body");
  body.innerHTML = `
    <div class="q-card">
      <p class="q-category">${q.category}</p>
      <p class="q-text">${q.text}</p>
      <p class="q-context">${q.context}</p>
      ${q.learnMore ? `
        <div class="q-learn-more">
          <button class="q-learn-more-toggle" onclick="toggleLearnMore(this)" aria-expanded="false">
            <span class="q-learn-more-icon">▶</span> Learn more about this topic
          </button>
          <div class="q-learn-more-content" style="display:none;">
            ${q.learnMore}
          </div>
        </div>
      ` : ''}
      <div class="q-options">
        ${q.options.map((opt, i) => `
          <label class="q-option ${state.answers[state.currentQ] === i ? 'selected' : ''}" onclick="selectOption(${i})">
            <input type="radio" name="q${state.currentQ}" value="${i}" ${state.answers[state.currentQ] === i ? 'checked' : ''}>
            <span class="q-option-label">${opt.label}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `;

  // Nav buttons
  document.getElementById("btn-prev").disabled = state.currentQ === 0;
  if (state.currentQ === total - 1) {
    document.getElementById("btn-next").style.display = "none";
    document.getElementById("btn-submit").style.display = "";
    document.getElementById("btn-submit").disabled = state.answers[state.currentQ] === null;
  } else {
    document.getElementById("btn-next").style.display = "";
    document.getElementById("btn-submit").style.display = "none";
    document.getElementById("btn-next").disabled = state.answers[state.currentQ] === null;
  }
}

export function toggleLearnMore(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector(".q-learn-more-icon");
  const expanded = content.style.display !== "none";
  content.style.display = expanded ? "none" : "block";
  icon.textContent = expanded ? "▶" : "▼";
  btn.setAttribute("aria-expanded", !expanded);
}

export function selectOption(i) {
  state.answers[state.currentQ] = i;
  renderQuestion();
}

export function nextQuestion() {
  if (state.answers[state.currentQ] === null) return;
  if (state.currentQ < QUESTIONS.length - 1) {
    setCurrentQ(state.currentQ + 1);
    renderQuestion();
  }
}

export function prevQuestion() {
  if (state.currentQ > 0) {
    setCurrentQ(state.currentQ - 1);
    renderQuestion();
  }
}

// ─── Submit ───
export function submitAnswers() {
  if (state.answers.some(a => a === null)) return;

  const scores = calculateScores(state.answers);
  const partnerName = state.currentPartner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  if (state.isAdminTest) {
    // Admin test — don't save to real localStorage, email tagged as TEST
    const resultCode = encodeResults(state.currentPartner, state.answers);
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
    const testData = { answers: state.answers, scores };
    const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
    stored["_test_" + state.currentPartner] = testData;
    localStorage.setItem("digispace-decision", JSON.stringify(stored));
    showResults();
    return;
  }

  // Real submission
  saveResults(state.currentPartner, { answers: state.answers, scores });

  const resultCode = encodeResults(state.currentPartner, state.answers);
  const count = getSubmissionCount(state.currentPartner);
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
