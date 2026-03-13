/* ═══════════════════════════════════════════════════════
   App — Entry point, shared state, screen management,
   global window bindings, and initialization
   ═══════════════════════════════════════════════════════ */

import { QUESTIONS } from './config.js';
import { getBothResults } from './storage.js';
import { selectPartner, verifyCode, closeAccessModal, adminStartAs, adminReset, beginFresh } from './auth.js';
import { selectOption, nextQuestion, prevQuestion, toggleLearnMore, submitAnswers } from './questionnaire.js';
import { showResults, toggleDrilldown } from './results.js';

// ─── Shared Mutable State ───
export const state = {
  currentPartner: "",
  currentQ: 0,
  answers: new Array(QUESTIONS.length).fill(null),
  isAdminTest: false
};

export function setCurrentPartner(v) { state.currentPartner = v; }
export function setCurrentQ(v) { state.currentQ = v; }
export function setAnswers(v) { state.answers = v; }
export function setIsAdminTest(v) { state.isAdminTest = v; }

// ─── Screen Management ───
export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

// ─── Utilities ───
export function goHome() {
  showScreen("landing");
}

export function printResults() {
  window.print();
}

// ─── Register all onclick-referenced functions on window ───
window.selectPartner = selectPartner;
window.verifyCode = verifyCode;
window.closeAccessModal = closeAccessModal;
window.adminStartAs = adminStartAs;
window.adminReset = adminReset;
window.beginFresh = beginFresh;
window.selectOption = selectOption;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.toggleLearnMore = toggleLearnMore;
window.submitAnswers = submitAnswers;
window.showResults = showResults;
window.toggleDrilldown = toggleDrilldown;
window.goHome = goHome;
window.printResults = printResults;

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
