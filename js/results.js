/* ═══════════════════════════════════════════════════════
   Results — Results display, scorecard text builder,
   and drilldown toggling
   ═══════════════════════════════════════════════════════ */

import { QUESTIONS, FACTORS, FACTOR_INSIGHTS } from './config.js';
import { calculateScores, encodeResults, getFactorQuestionIndices, getConviction, calculateAlignment, detectPatterns, assessRisks } from './scoring.js';
import { getBothResults } from './storage.js';
import { state } from './app.js';
import { showScreen } from './app.js';

// ─── Results Display ───
export function showResults() {
  const both = getBothResults();
  const hasBoth = both.danny && both.benny;
  const fqMap = getFactorQuestionIndices();

  // Check for admin test data if no real data exists
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  const testData = stored["_test_" + state.currentPartner];
  if (!both.danny && !both.benny && !testData) {
    alert("No results to display. Complete the questionnaire first.");
    showScreen("landing");
    return;
  }

  // Determine which answers to analyze
  let activeAnswers; // the answer set used for insight generation
  let combinedScores;
  let subtitle;
  let dannyScoresObj = null, bennyScoresObj = null;

  if (hasBoth) {
    dannyScoresObj = both.danny.scores;
    bennyScoresObj = both.benny.scores;
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
    activeAnswers = both.danny.answers;
    subtitle = "Combined results for Danny Barcelo & Benny Rodriguez";
  } else if (both.danny || both.benny) {
    const partner = both.danny ? "danny" : "benny";
    const name = partner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
    const other = partner === "danny" ? "Benny Rodriguez" : "Danny Barcelo";
    combinedScores = both[partner].scores;
    activeAnswers = both[partner].answers;
    subtitle = `Results for ${name} — waiting for ${other} to complete their questionnaire`;
  } else {
    // Admin test mode — use test data
    const name = state.currentPartner === "danny" ? "Danny Barcelo" : "Benny Rodriguez";
    combinedScores = testData.scores;
    activeAnswers = testData.answers;
    subtitle = `[Admin Test] Results for ${name}`;
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

  // ─── Partnership Alignment Score (combined only) ───
  const alignmentEl = document.getElementById("alignment-section");
  if (hasBoth) {
    const alignment = calculateAlignment(dannyScoresObj.normalized, bennyScoresObj.normalized);
    alignmentEl.style.display = "block";
    alignmentEl.innerHTML = `
      <div class="alignment-card">
        <div class="alignment-header">
          <span class="alignment-label">Partnership Alignment</span>
          <span class="alignment-score">${alignment.alignmentPct}%</span>
        </div>
        <div class="alignment-bar-track">
          <div class="alignment-bar-fill" style="width: ${alignment.alignmentPct}%;"></div>
        </div>
        <div class="alignment-meta">
          <span class="alignment-badge">${alignment.label}</span>
          <span class="alignment-stats">${alignment.strongAgreeCount} strong agreements · ${alignment.agreementCount} total agreements · ${alignment.divergeCount} divergences</span>
        </div>
        <p class="alignment-detail">${alignment.detail}</p>
      </div>
    `;
  } else {
    alignmentEl.style.display = "none";
  }

  // ─── Factor Breakdown — with granular insights, confidence, per-partner ───
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
    const conviction = getConviction(norm);

    // Get granular insight from factor function
    const insight = FACTOR_INSIGHTS[i](norm, activeAnswers, fqMap[i]);
    insights.push({ factor: name, ...insight, norm, conviction });
    if (insight.flag) flags.push({ factor: name, flag: insight.flag });

    let winnerClass;
    if (insight.label.includes("50/50")) winnerClass = "fifty";
    else if (insight.label.includes("51/49")) winnerClass = "fifty-one";
    else winnerClass = "even";

    // Per-partner breakdown for combined results
    let partnerBreakdownHtml = "";
    let agreementHtml = "";
    if (hasBoth) {
      const dScore = both.danny.scores.factorScores[i];
      const bScore = both.benny.scores.factorScores[i];
      const dNorm = both.danny.scores.factorCounts[i] > 0 ? dScore / (both.danny.scores.factorCounts[i] * 2) : 0;
      const bNorm = both.benny.scores.factorCounts[i] > 0 ? bScore / (both.benny.scores.factorCounts[i] * 2) : 0;
      const sameDirection = (dNorm > 0.1 && bNorm > 0.1) || (dNorm < -0.1 && bNorm < -0.1) || (Math.abs(dNorm) <= 0.1 && Math.abs(bNorm) <= 0.1);
      const divergence = Math.abs(dNorm - bNorm);

      const dConv = getConviction(dNorm);
      const bConv = getConviction(bNorm);
      const dDir = dNorm > 0.1 ? "50/50" : dNorm < -0.1 ? "51/49" : "Neutral";
      const bDir = bNorm > 0.1 ? "50/50" : bNorm < -0.1 ? "51/49" : "Neutral";
      const dClass = dNorm > 0.1 ? "fifty" : dNorm < -0.1 ? "fifty-one" : "even";
      const bClass = bNorm > 0.1 ? "fifty" : bNorm < -0.1 ? "fifty-one" : "even";

      partnerBreakdownHtml = `
        <div class="partner-breakdown">
          <div class="partner-lean">
            <span class="partner-name-small">Danny</span>
            <span class="partner-dir ${dClass}">${dDir}</span>
            <span class="partner-conv ${dConv.css}">${dConv.level}</span>
          </div>
          <div class="partner-lean">
            <span class="partner-name-small">Benny</span>
            <span class="partner-dir ${bClass}">${bDir}</span>
            <span class="partner-conv ${bConv.css}">${bConv.level}</span>
          </div>
        </div>
      `;

      if (sameDirection && divergence < 0.3) {
        agreementHtml = `<span class="agreement-tag agree">Partners agree</span>`;
      } else if (sameDirection) {
        agreementHtml = `<span class="agreement-tag partial">Partners mostly agree</span>`;
      } else {
        agreementHtml = `<span class="agreement-tag disagree">Partners diverge</span>`;
        flags.push({ factor: name, flag: `Danny and Benny answered differently on ${name} — discuss this factor before deciding.` });
      }
    }

    // Question-level drill-down
    const qIndices = fqMap[i];
    let drilldownHtml = "";
    if (hasBoth) {
      const qRows = qIndices.map(qi => {
        const q = QUESTIONS[qi];
        const dAns = both.danny.answers[qi];
        const bAns = both.benny.answers[qi];
        const match = dAns === bAns;
        return `
          <div class="drill-question ${match ? 'drill-match' : 'drill-differ'}">
            <p class="drill-q-text">${q.text}</p>
            <div class="drill-answers">
              <div class="drill-answer">
                <span class="drill-partner">Danny:</span>
                <span class="drill-response">${q.options[dAns].label}</span>
              </div>
              <div class="drill-answer">
                <span class="drill-partner">Benny:</span>
                <span class="drill-response">${q.options[bAns].label}</span>
              </div>
            </div>
            <span class="drill-match-tag ${match ? 'match' : 'differ'}">${match ? 'Same answer' : 'Different answers'}</span>
          </div>
        `;
      }).join("");
      drilldownHtml = `
        <div class="factor-drilldown">
          <button class="drill-toggle" onclick="toggleDrilldown(this)" aria-expanded="false">
            <span class="drill-icon">▶</span> View question-level detail
          </button>
          <div class="drill-content" style="display:none;">
            ${qRows}
          </div>
        </div>
      `;
    } else {
      // Single partner — show their answers
      const qRows = qIndices.map(qi => {
        const q = QUESTIONS[qi];
        const ans = activeAnswers[qi];
        return `
          <div class="drill-question drill-single">
            <p class="drill-q-text">${q.text}</p>
            <div class="drill-answers">
              <div class="drill-answer">
                <span class="drill-partner">Your answer:</span>
                <span class="drill-response">${q.options[ans].label}</span>
              </div>
            </div>
          </div>
        `;
      }).join("");
      drilldownHtml = `
        <div class="factor-drilldown">
          <button class="drill-toggle" onclick="toggleDrilldown(this)" aria-expanded="false">
            <span class="drill-icon">▶</span> View question detail
          </button>
          <div class="drill-content" style="display:none;">
            ${qRows}
          </div>
        </div>
      `;
    }

    return `
      <div class="factor-card">
        <div class="factor-header">
          <span class="factor-name">${name}</span>
          <div class="factor-tags">
            <span class="factor-winner ${winnerClass}">${insight.label}</span>
            <span class="factor-conviction ${conviction.css}">${conviction.level}</span>
            ${agreementHtml}
          </div>
        </div>
        <div class="factor-bar">
          <div class="bar-fifty" style="width: ${fiftyBar}%"></div>
          <div class="bar-fifty-one" style="width: ${fiftyOneBar}%"></div>
        </div>
        ${partnerBreakdownHtml}
        <p class="factor-note">${insight.detail}</p>
        ${insight.flag ? `<p class="factor-flag">${insight.flag}</p>` : ""}
        ${drilldownHtml}
      </div>
    `;
  }).join("");

  // ─── Cross-Factor Patterns ───
  const patternsEl = document.getElementById("patterns-section");
  const patterns = detectPatterns(activeAnswers, combinedScores.normalized);
  if (patterns.length > 0) {
    patternsEl.style.display = "block";
    patternsEl.innerHTML = `
      <h3 class="section-heading">Cross-Factor Patterns</h3>
      <p class="section-sub">Patterns detected across multiple factors that may influence the structure decision.</p>
      ${patterns.map(p => `
        <div class="pattern-card pattern-${p.severity}">
          <div class="pattern-header">
            <span class="pattern-icon">${p.icon}</span>
            <span class="pattern-name">${p.name}</span>
            <span class="pattern-severity severity-${p.severity}">${p.severity === 'warning' ? 'Needs attention' : p.severity === 'positive' ? 'Positive signal' : 'Notable'}</span>
          </div>
          <p class="pattern-detail">${p.description}</p>
          <p class="pattern-factors">Related factors: ${p.factors.join(", ")}</p>
        </div>
      `).join("")}
    `;
  } else {
    patternsEl.style.display = "none";
  }

  // ─── Risk Assessment ───
  const risksEl = document.getElementById("risks-section");
  const risks = assessRisks(
    activeAnswers,
    combinedScores.normalized,
    hasBoth,
    hasBoth ? both.danny.answers : null,
    hasBoth ? both.benny.answers : null,
    hasBoth ? dannyScoresObj.normalized : null,
    hasBoth ? bennyScoresObj.normalized : null
  );
  const hasNonLowRisk = risks.some(r => r.level !== "low");
  risksEl.style.display = "block";
  risksEl.innerHTML = `
    <h3 class="section-heading">Risk Assessment</h3>
    <p class="section-sub">Potential areas of concern based on response patterns.</p>
    <div class="risk-grid">
      ${risks.map(r => {
        const pct = (r.score / r.maxScore) * 100;
        return `
          <div class="risk-card risk-${r.level}">
            <div class="risk-header">
              <span class="risk-name">${r.name}</span>
              <span class="risk-level level-${r.level}">${r.level}</span>
            </div>
            <div class="risk-bar-track">
              <div class="risk-bar-fill risk-fill-${r.level}" style="width: ${pct}%;"></div>
            </div>
            <p class="risk-detail">${r.detail}</p>
          </div>
        `;
      }).join("")}
    </div>
  `;

  // ─── Build narrative verdict (5-tier) ───
  const fiftyFactors = insights.filter(f => f.label.includes("50/50")).map(f => f.factor);
  const fiftyOneFactors = insights.filter(f => f.label.includes("51/49")).map(f => f.factor);
  const neutralFactors = insights.filter(f => !f.label.includes("50/50") && !f.label.includes("51/49")).map(f => f.factor);
  const strongFifty = insights.filter(f => f.label === "Strong 50/50").map(f => f.factor);
  const strongFiftyOne = insights.filter(f => f.label === "Strong 51/49").map(f => f.factor);

  // Helper: format a list of items with proper English punctuation
  function formatList(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
  }

  const vBox = document.getElementById("verdict-box");
  let verdictClass, verdictTitle, verdictText, verdictDetails;

  // 5-tier verdict system
  if (fiftyPct >= 65) {
    // Strong 50/50
    verdictClass = "fifty";
    const allAlign = fiftyFactors.length === 8;
    verdictTitle = allAlign
      ? "Unanimous alignment toward a 50/50 Split"
      : "Strong alignment toward a 50/50 Split";
    let signalNote = "";
    if (strongFifty.length > 3) {
      signalNote = ` Strong signals emerged across ${strongFifty.length} factors — notably ${formatList(strongFifty.slice(0, 3))} — indicating deep alignment on equal partnership.`;
    } else if (strongFifty.length > 0) {
      signalNote = ` Strong signals in ${formatList(strongFifty)} reinforce this direction.`;
    }
    verdictText = allAlign
      ? `Every factor points toward equal ownership.${signalNote} This partnership consistently values shared control, mutual veto power, and collaborative decision-making.`
      : `${fiftyFactors.length} of 8 factors favor equal ownership.${signalNote} The overall pattern reflects a partnership built on shared authority and balanced power.`;
    verdictDetails = `<strong>What this means for the agreement:</strong> A 50/50 LLC is the natural fit. The operating agreement should include a robust deadlock-resolution ladder (negotiation → mediation → binding arbitration → shotgun buy-sell) to ensure disagreements never paralyze the business.`;
  } else if (fiftyPct > 55) {
    // Moderate 50/50
    verdictClass = "fifty";
    verdictTitle = "Responses lean toward a 50/50 Split";
    let signalNote = strongFifty.length > 0
      ? ` Strong signals in ${formatList(strongFifty)} point toward equal ownership, though other factors show flexibility.`
      : "";
    verdictText = `${fiftyFactors.length} of 8 factors favor equal ownership, but the margin is moderate.${signalNote} The partnership values shared control while showing some openness to delegated authority on specific issues.`;
    verdictDetails = `<strong>What this means for the agreement:</strong> A 50/50 LLC is a good fit, but consider a <strong>managing-member carve-out</strong> — equal ownership with one partner designated to handle routine decisions (within defined budget limits) to prevent minor deadlocks. Major decisions still require unanimity.`;
  } else if (fiftyOnePct >= 65) {
    // Strong 51/49
    verdictClass = "fifty-one";
    const allAlign = fiftyOneFactors.length === 8;
    verdictTitle = allAlign
      ? "Unanimous alignment toward a 51/49 Split"
      : "Strong alignment toward a 51/49 Split";
    let signalNote = "";
    if (strongFiftyOne.length > 3) {
      signalNote = ` Strong signals emerged across ${strongFiftyOne.length} factors — notably ${formatList(strongFiftyOne.slice(0, 3))} — reflecting a clear preference for defined leadership.`;
    } else if (strongFiftyOne.length > 0) {
      signalNote = ` Strong signals in ${formatList(strongFiftyOne)} reinforce this direction.`;
    }
    verdictText = allAlign
      ? `Every factor points toward a majority/minority structure.${signalNote} This partnership prioritizes operational efficiency, clear leadership, and agile decision-making.`
      : `${fiftyOneFactors.length} of 8 factors favor a majority/minority structure.${signalNote} The overall pattern reflects a partnership that values speed and clarity over structural symmetry.`;
    verdictDetails = `<strong>What this means for the agreement:</strong> A 51/49 LLC with robust minority protections — supermajority thresholds on major decisions, information rights, mandatory tax distributions, and a no-discount buyout clause for the 49% partner.`;
  } else if (fiftyOnePct > 55) {
    // Moderate 51/49
    verdictClass = "fifty-one";
    verdictTitle = "Responses lean toward a 51/49 Split";
    let signalNote = strongFiftyOne.length > 0
      ? ` Strong signals in ${formatList(strongFiftyOne)} point toward defined leadership, though other factors show desire for equality.`
      : "";
    verdictText = `${fiftyOneFactors.length} of 8 factors favor a majority/minority structure, but the margin is moderate.${signalNote} The partnership values operational efficiency while wanting to preserve a sense of shared ownership.`;
    verdictDetails = `<strong>What this means for the agreement:</strong> A 51/49 LLC is a good fit, with emphasis on <strong>strong minority protections</strong>. Consider: supermajority thresholds for all major decisions, comprehensive information rights, mandatory quarterly tax distributions, and a defined scope for managing-member authority that doesn't extend to strategic decisions.`;
  } else {
    // Balanced / Hybrid
    verdictClass = "even";
    verdictTitle = "Responses are balanced — consider a hybrid structure";
    verdictText = `The results are split: ${fiftyFactors.length} factors favor 50/50, ${fiftyOneFactors.length} favor 51/49, and ${neutralFactors.length} are neutral. Neither structure holds a clear mandate from the responses.`;
    verdictDetails = `<strong>Recommended hybrid approach:</strong> 50/50 economic split (equal profits and distributions) paired with 51/49 governance — one partner holds tiebreaker authority on routine decisions, while major decisions (debt, new members, dissolution, IP changes) require unanimous consent. This preserves the equality both partners value while preventing deadlock on daily operations.`;
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
    const alignment = calculateAlignment(dannyScoresObj.normalized, bennyScoresObj.normalized);
    agreementSummary = `<p class="verdict-agreement">Partner alignment: Danny and Benny agree on <strong>${alignment.agreementCount} of 8</strong> factors (${alignment.alignmentPct}% overall alignment).</p>`;
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

// ─── Build Combined Scorecard Text ───
export function buildScorecardText(dannyAnswers, bennyAnswers) {
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

  // Partnership alignment
  const alignment = calculateAlignment(dannyScores.normalized, bennyScores.normalized);

  let lines = [];
  lines.push("═══════════════════════════════════════════════");
  lines.push("  COMBINED DECISION SCORECARD");
  lines.push("  Danny Barcelo & Benny Rodriguez");
  lines.push("═══════════════════════════════════════════════");
  lines.push("");
  lines.push(`  50/50 Alignment:  ${fiftyPct}%`);
  lines.push(`  51/49 Alignment:  ${fiftyOnePct}%`);
  lines.push(`  Partner Alignment: ${alignment.alignmentPct}% (${alignment.label})`);
  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  FACTOR-BY-FACTOR ANALYSIS");
  lines.push("───────────────────────────────────────────────");

  const allFlags = [];

  FACTORS.forEach((name, i) => {
    const norm = normalized[i];
    const insight = FACTOR_INSIGHTS[i](norm, dannyAnswers, fqMap[i]);
    const conviction = getConviction(norm);
    const bar50 = Math.round(Math.max(0, norm) * 5);
    const bar51 = Math.round(Math.max(0, -norm) * 5);

    // Per-partner leans
    const dNorm = dannyScores.normalized[i];
    const bNorm = bennyScores.normalized[i];
    const dDir = dNorm > 0.1 ? "50/50" : dNorm < -0.1 ? "51/49" : "Neutral";
    const bDir = bNorm > 0.1 ? "50/50" : bNorm < -0.1 ? "51/49" : "Neutral";

    // Agreement check
    const sameDir = (dNorm > 0.1 && bNorm > 0.1) || (dNorm < -0.1 && bNorm < -0.1) || (Math.abs(dNorm) <= 0.1 && Math.abs(bNorm) <= 0.1);
    const agreeTag = sameDir ? "[AGREE]" : "[DIVERGE]";

    lines.push("");
    lines.push(`  ${name}  →  ${insight.label} (${conviction.level})  ${agreeTag}`);
    lines.push(`    Danny: ${dDir}  |  Benny: ${bDir}`);
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
  const scorecardInsights = FACTORS.map((name, i) => FACTOR_INSIGHTS[i](normalized[i], dannyAnswers, fqMap[i]));
  const fiftyCount = scorecardInsights.filter(f => f.label.includes("50/50")).length;
  const fiftyOneCount = scorecardInsights.filter(f => f.label.includes("51/49")).length;
  const neutralCount = FACTORS.length - fiftyCount - fiftyOneCount;

  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  SUMMARY");
  lines.push("───────────────────────────────────────────────");
  lines.push(`  Factors favoring 50/50:  ${fiftyCount}`);
  lines.push(`  Factors favoring 51/49:  ${fiftyOneCount}`);
  lines.push(`  Neutral factors:         ${neutralCount}`);
  lines.push(`  Partner alignment:       ${alignment.alignmentPct}% — ${alignment.label}`);
  lines.push(`  Partner agreement:       ${alignment.agreementCount} of 8 factors`);

  // Patterns
  const patterns = detectPatterns(dannyAnswers, normalized);
  if (patterns.length > 0) {
    lines.push("");
    lines.push("───────────────────────────────────────────────");
    lines.push("  CROSS-FACTOR PATTERNS");
    lines.push("───────────────────────────────────────────────");
    patterns.forEach(p => {
      lines.push(`  ${p.icon} ${p.name}: ${p.description.replace(/<\/?strong>/g, '')}`);
    });
  }

  // Risks
  const risks = assessRisks(dannyAnswers, normalized, true, dannyAnswers, bennyAnswers, dannyScores.normalized, bennyScores.normalized);
  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  RISK ASSESSMENT");
  lines.push("───────────────────────────────────────────────");
  risks.forEach(r => {
    const bar = "█".repeat(r.score) + "░".repeat(r.maxScore - r.score);
    lines.push(`  ${r.name}: ${bar} ${r.level.toUpperCase()}`);
    lines.push(`    ${r.detail}`);
  });

  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  VERDICT");
  lines.push("───────────────────────────────────────────────");

  if (fiftyPct >= 65) {
    lines.push(`  ${fiftyCount} of 8 factors strongly favor 50/50.`);
    lines.push("  → Recommend 50/50 LLC with robust deadlock");
    lines.push("    resolution ladder in operating agreement.");
  } else if (fiftyPct > 55) {
    lines.push(`  ${fiftyCount} of 8 factors favor 50/50.`);
    lines.push("  → Recommend 50/50 LLC with managing-member");
    lines.push("    carve-out for routine decisions.");
  } else if (fiftyOnePct >= 65) {
    lines.push(`  ${fiftyOneCount} of 8 factors strongly favor 51/49.`);
    lines.push("  → Recommend 51/49 LLC with supermajority");
    lines.push("    protections for the minority partner.");
  } else if (fiftyOnePct > 55) {
    lines.push(`  ${fiftyOneCount} of 8 factors favor 51/49.`);
    lines.push("  → Recommend 51/49 LLC with strong minority");
    lines.push("    protections and defined managing-member scope.");
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

  // Question-level detail
  lines.push("");
  lines.push("───────────────────────────────────────────────");
  lines.push("  QUESTION-BY-QUESTION DETAIL");
  lines.push("───────────────────────────────────────────────");
  QUESTIONS.forEach((q, qi) => {
    const dAnswer = dannyAnswers[qi];
    const bAnswer = bennyAnswers[qi];
    const match = dAnswer === bAnswer ? "✓ MATCH" : "✗ DIFFER";
    lines.push(`  Q${qi + 1}. ${q.text}`);
    lines.push(`    Danny: "${q.options[dAnswer].label}"`);
    lines.push(`    Benny: "${q.options[bAnswer].label}"`);
    lines.push(`    ${match}`);
    lines.push("");
  });

  lines.push("───────────────────────────────────────────────");
  lines.push("  Danny's code: " + encodeResults("danny", dannyAnswers));
  lines.push("  Benny's code: " + encodeResults("benny", bennyAnswers));
  lines.push("═══════════════════════════════════════════════");

  return lines.join("\n");
}

export function toggleDrilldown(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector(".drill-icon");
  const expanded = content.style.display !== "none";
  content.style.display = expanded ? "none" : "block";
  icon.textContent = expanded ? "▶" : "▼";
  btn.setAttribute("aria-expanded", !expanded);
}
