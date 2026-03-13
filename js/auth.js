/* ═══════════════════════════════════════════════════════
   Auth — Partner selection, access code verification,
   admin mode, and questionnaire initialization
   ═══════════════════════════════════════════════════════ */

import { ACCESS_CODES, QUESTIONS } from './config.js';
import { getResults, getSubmissionCount, clearResults } from './storage.js';
import { showScreen } from './app.js';
import { state, setCurrentPartner, setCurrentQ, setAnswers, setIsAdminTest } from './app.js';
import { renderQuestion } from './questionnaire.js';
import { showResults } from './results.js';

// ─── Partner Selection (with access code verification) ───
export function selectPartner(partner) {
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
      <input type="text" id="access-input" class="access-input ${isAdmin ? 'access-input--admin' : ''}" placeholder="Enter access code" ${isAdmin ? '' : 'maxlength="10"'} autocomplete="off">
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

export function verifyCode(partner) {
  const input = document.getElementById("access-input");
  const error = document.getElementById("access-error");
  const isAdmin = partner === "admin";
  const code = isAdmin ? input.value.trim() : input.value.trim().toUpperCase();

  if (isAdmin) {
    const btn = document.querySelector("#access-overlay .btn-primary");
    btn.disabled = true;
    btn.textContent = "Verifying…";
    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: input.value.trim() }),
    })
      .then((r) => r.json())
      .then((data) => {
        btn.disabled = false;
        btn.textContent = "Verify";
        if (data.valid) {
          closeAccessModal();
          showAdminPartnerSelect();
        } else {
          error.textContent = "Incorrect admin code.";
          input.value = "";
          input.focus();
        }
      })
      .catch(() => {
        btn.disabled = false;
        btn.textContent = "Verify";
        error.textContent = "Verification failed. Check your connection.";
      });
    return;
  }

  if (code === ACCESS_CODES[partner].toUpperCase()) {
    closeAccessModal();
    setIsAdminTest(false);
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

export function closeAccessModal() {
  const overlay = document.getElementById("access-overlay");
  if (overlay) overlay.remove();
}

export function showAdminPartnerSelect() {
  // Check current submission status
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  const dannyStatus = stored.danny ? "Submitted" : "Not submitted";
  const bennyStatus = stored.benny ? "Submitted" : "Not submitted";
  const dannyCount = stored.danny_count || 0;
  const bennyCount = stored.benny_count || 0;

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
        <button class="btn btn-outline" onclick="closeAccessModal()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

export function adminReset(target) {
  if (target === "all") {
    if (!confirm("This will clear ALL stored results for both partners. Are you sure?")) return;
    localStorage.removeItem("digispace-decision");
  } else {
    const name = target === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
    if (!confirm(`This will clear ${name}'s stored results. Are you sure?`)) return;
    const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
    delete stored[target];
    delete stored[target + "_date"];
    delete stored[target + "_count"];
    localStorage.setItem("digispace-decision", JSON.stringify(stored));
  }
  // Refresh the admin panel to show updated status
  closeAccessModal();
  showAdminPartnerSelect();
}

export function adminStartAs(partner) {
  closeAccessModal();
  setIsAdminTest(true);
  startQuestionnaire(partner);
}

export function startQuestionnaire(partner) {
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

export function beginFresh(partner) {
  clearResults(partner);
  setCurrentPartner(partner);
  setCurrentQ(0);
  setAnswers(new Array(QUESTIONS.length).fill(null));

  const name = partner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
  document.getElementById("q-partner-name").textContent = `${name}'s Questionnaire`;

  renderQuestion();
  showScreen("questionnaire");
}
