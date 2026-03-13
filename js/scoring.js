/* ═══════════════════════════════════════════════════════
   Scoring — Factor calculations, encoding, alignment,
   pattern detection, and risk assessment
   ═══════════════════════════════════════════════════════ */

import { QUESTIONS, FACTORS, FACTOR_INSIGHTS } from './config.js';

// Helper: get question indices belonging to each factor
export function getFactorQuestionIndices() {
  const map = {};
  QUESTIONS.forEach((q, qi) => {
    if (!map[q.factor]) map[q.factor] = [];
    map[q.factor].push(qi);
  });
  return map;
}

// Returns a conviction object based on normalized score magnitude
export function getConviction(norm) {
  const abs = Math.abs(norm);
  if (abs > 0.7) return { level: "Strong", intensity: 3, css: "conviction-strong" };
  if (abs > 0.4) return { level: "Moderate", intensity: 2, css: "conviction-moderate" };
  if (abs > 0.1) return { level: "Slight", intensity: 1, css: "conviction-slight" };
  return { level: "Neutral", intensity: 0, css: "conviction-neutral" };
}

// Compute actual max positive and max negative raw scores from question data
export function getScoreBounds() {
  let maxPositive = 0, maxNegative = 0;
  QUESTIONS.forEach(q => {
    const scores = q.options.map(o => o.score);
    maxPositive += Math.max(...scores);
    maxNegative += Math.min(...scores);
  });
  return { maxPositive, maxNegative };
}

// ─── Scoring ───
export function calculateScores(answerIndices) {
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
export function encodeResults(partner, answerIndices) {
  const prefix = partner === "danny" ? "D" : "B";
  const hex = answerIndices.map(a => a.toString(16)).join("");
  return prefix + hex;
}

export function decodeResults(code) {
  const partner = code[0] === "D" ? "danny" : code[0] === "B" ? "benny" : null;
  if (!partner) return null;
  const hex = code.slice(1);
  const answerIndices = hex.split("").map(h => parseInt(h, 16));
  if (answerIndices.length !== QUESTIONS.length) return null;
  if (answerIndices.some(a => isNaN(a))) return null;
  return { partner, answers: answerIndices };
}

// ─── Partnership Alignment Score ───
export function calculateAlignment(dannyNorm, bennyNorm) {
  let totalDiff = 0;
  let agreementCount = 0;
  let strongAgreeCount = 0;
  let divergeCount = 0;

  FACTORS.forEach((_, i) => {
    const diff = Math.abs(dannyNorm[i] - bennyNorm[i]);
    totalDiff += diff;

    const sameDir = (dannyNorm[i] > 0.1 && bennyNorm[i] > 0.1) ||
                    (dannyNorm[i] < -0.1 && bennyNorm[i] < -0.1) ||
                    (Math.abs(dannyNorm[i]) <= 0.1 && Math.abs(bennyNorm[i]) <= 0.1);

    if (sameDir && diff < 0.3) {
      strongAgreeCount++;
      agreementCount++;
    } else if (sameDir) {
      agreementCount++;
    } else {
      divergeCount++;
    }
  });

  // Alignment percentage: 0 = completely opposed, 100 = identical
  const maxPossibleDiff = FACTORS.length * 2; // max diff per factor is 2 (-1 to +1)
  const alignmentPct = Math.round((1 - (totalDiff / maxPossibleDiff)) * 100);

  let label, detail;
  if (alignmentPct >= 85) {
    label = "Strong Alignment";
    detail = "Danny and Benny are highly aligned in their partnership expectations. The structure decision will likely be straightforward — both partners want similar things.";
  } else if (alignmentPct >= 70) {
    label = "Good Alignment";
    detail = "Mostly aligned with a few areas of difference. Focus the conversation on the divergent factors to find common ground before choosing a structure.";
  } else if (alignmentPct >= 55) {
    label = "Moderate Alignment";
    detail = "Meaningful differences exist on several factors. A facilitated discussion covering each divergent area is recommended before finalizing the ownership structure.";
  } else {
    label = "Needs Discussion";
    detail = "Significant divergence on key factors. Both partners should sit down together (ideally with a neutral facilitator) to align expectations before choosing a structure. The differences don't preclude either structure — they just need to be openly addressed.";
  }

  return { alignmentPct, agreementCount, strongAgreeCount, divergeCount, label, detail };
}

// ─── Cross-Factor Pattern Detection ───
export function detectPatterns(answerIndices, normalized) {
  const patterns = [];
  const fqMap = getFactorQuestionIndices();

  // 1. Governance Gap: wants equal ownership (high trust/equal contrib) but prefers delegated decisions
  const trustNorm = normalized[7]; // Trust & Relationship
  const decisionNorm = normalized[0]; // Decision-Making Authority
  if (trustNorm > 0.2 && decisionNorm < -0.2) {
    patterns.push({
      name: "Governance Gap",
      icon: "⚖",
      description: "High trust and equal contributions, but preference for delegated decision-making. This is a natural fit for a <strong>hybrid structure</strong> — 50/50 economics with a managing-member carve-out for routine decisions.",
      severity: "info",
      factors: ["Trust & Relationship", "Decision-Making Authority"]
    });
  }

  // 2. Trust-Structure Mismatch: high trust but wants heavy structural protections
  const protectionNorm = normalized[1]; // Partner Protections
  if (trustNorm > 0.3 && protectionNorm > 0.5) {
    patterns.push({
      name: "Belt-and-Suspenders",
      icon: "🔒",
      description: "Complete trust in the partner, yet strong demand for veto power and structural protections. This isn't contradictory — it's the <strong>smart approach</strong>. The agreement protects the relationship, not just the individuals. Both partners should welcome comprehensive protections.",
      severity: "positive",
      factors: ["Trust & Relationship", "Partner Protections"]
    });
  }

  // 3. IP Vulnerability: one partner is IP creator but willing to leave IP with business
  const ipCreator = answerIndices[fqMap[3][0]] === 0; // "I am the primary creator"
  const ipStaysWithBiz = answerIndices[fqMap[3][1]] === 2; // "Recipes stay with business"
  if (ipCreator && ipStaysWithBiz) {
    patterns.push({
      name: "IP Vulnerability",
      icon: "⚠",
      description: "The recipe creator is willing to let IP stay with the business on exit. This is <strong>high-risk for the creator</strong>. If the partnership ends, the creator would lose the right to use their own recipes. A license-not-assign model is strongly recommended regardless of the ownership structure chosen.",
      severity: "warning",
      factors: ["IP & Recipe Ownership"]
    });
  }

  // 4. Active-Passive Dynamic: one partner is the operator, contributions are unequal
  const isPassiveInvestor = answerIndices[fqMap[7][2]] === 2; // full-time operator / passive investor
  const unequalContrib = answerIndices[fqMap[7][1]] === 2; // clearly unequal contributions
  if (isPassiveInvestor || unequalContrib) {
    patterns.push({
      name: "Active-Passive Dynamic",
      icon: "👥",
      description: isPassiveInvestor && unequalContrib
        ? "One partner is the full-time operator with unequal contributions. This is the <strong>strongest signal for 51/49</strong> — the operator should be the managing member with the investor protected by supermajority thresholds, information rights, and mandatory distributions."
        : isPassiveInvestor
          ? "One partner will be significantly more operationally active. A <strong>51/49 with the operator as managing member</strong> aligns governance with day-to-day reality. The less active partner needs strong information rights and major-decision consent thresholds."
          : "Contributions are clearly unequal. The operating agreement should address this through <strong>preferred returns</strong> or <strong>guaranteed payments</strong> regardless of which ownership structure is chosen.",
      severity: "info",
      factors: ["Trust & Relationship", "Compensation & Distributions"]
    });
  }

  // 5. Deadlock Vulnerability: wants 50/50 control but relies on informal resolution
  const wantsEqualControl = protectionNorm > 0.3;
  const informalResolution = answerIndices[fqMap[2][0]] === 0; // "we'll work it out"
  if (wantsEqualControl && informalResolution) {
    patterns.push({
      name: "Deadlock Vulnerability",
      icon: "⚠",
      description: "Strong preference for equal control combined with reliance on informal dispute resolution. In a 50/50, this creates <strong>deadlock risk</strong>. Without a formal escalation ladder, a single unresolved disagreement can paralyze the business. The operating agreement must include mediation → arbitration → buy-sell provisions regardless of how confident both partners feel about communication.",
      severity: "warning",
      factors: ["Partner Protections", "Deadlock Resolution"]
    });
  }

  // 6. Exit Alignment: both exit questions lean same way strongly
  const exitNorm = normalized[5];
  if (Math.abs(exitNorm) > 0.6) {
    const dir = exitNorm > 0 ? "50/50" : "51/49";
    patterns.push({
      name: "Clear Exit Vision",
      icon: "✓",
      description: `Strong, consistent answers on exit strategy — both responses lean toward ${dir}. This clarity makes it easier to draft the buy-sell and dissolution provisions in the operating agreement.`,
      severity: "positive",
      factors: ["Exit Strategies"]
    });
  }

  // 7. Phantom Income + Equal Profit: specific combo that needs attention
  const wantsEqualProfit = answerIndices[fqMap[4][0]] === 0;
  const phantomConcern = answerIndices[fqMap[4][1]] === 0;
  if (wantsEqualProfit && phantomConcern) {
    patterns.push({
      name: "Distribution Priority",
      icon: "💰",
      description: "Wants equal profits AND is concerned about phantom income. The operating agreement <strong>must include</strong>: (1) mandatory quarterly tax distributions at the highest marginal rate (~50.3% for CA), reduced by any PTE tax already paid at entity level, (2) equal profit distributions on a defined schedule, (3) a minimum cash reserve threshold before distributions can be withheld, and (4) authorization for the PTE Elective Tax (SB 132, 9.3%) to bypass the federal SALT cap.",
      severity: "info",
      factors: ["Compensation & Distributions"]
    });
  }

  return patterns;
}

// ─── Risk Assessment ───
export function assessRisks(answerIndices, normalized, hasBoth, dannyAnswers, bennyAnswers, dannyNorm, bennyNorm) {
  const risks = [];
  const fqMap = getFactorQuestionIndices();

  // Deadlock Risk
  const decisionNorm = normalized[0];
  const deadlockNorm = normalized[2];
  let deadlockScore = 0;
  if (decisionNorm > 0.3) deadlockScore += 2; // wants equal decision-making
  if (answerIndices[fqMap[2][0]] === 0) deadlockScore += 2; // informal resolution only
  if (hasBoth) {
    // Partners diverge on decision-making authority
    const dDec = dannyNorm[0];
    const bDec = bennyNorm[0];
    if ((dDec > 0.1 && bDec < -0.1) || (dDec < -0.1 && bDec > 0.1)) deadlockScore += 1;
  }
  risks.push({
    name: "Deadlock Risk",
    score: Math.min(deadlockScore, 5),
    maxScore: 5,
    level: deadlockScore >= 4 ? "high" : deadlockScore >= 2 ? "moderate" : "low",
    detail: deadlockScore >= 4
      ? "High probability of deadlock without a formal resolution mechanism. The operating agreement needs a robust escalation ladder."
      : deadlockScore >= 2
        ? "Moderate deadlock risk. Standard mediation → arbitration provisions should be sufficient."
        : "Low deadlock risk. The partnership has clear decision-making preferences."
  });

  // Power Imbalance Risk
  let powerScore = 0;
  if (answerIndices[fqMap[1][1]] === 0 && normalized[0] < -0.2) powerScore += 2; // wants equal control but prefers delegated decisions — contradiction
  if (answerIndices[fqMap[7][2]] === 2) powerScore += 1; // one partner is passive
  if (hasBoth) {
    // One partner wants strong control, the other doesn't care
    const dProt = dannyNorm[1];
    const bProt = bennyNorm[1];
    if (Math.abs(dProt - bProt) > 0.6) powerScore += 2;
  }
  risks.push({
    name: "Power Imbalance",
    score: Math.min(powerScore, 5),
    maxScore: 5,
    level: powerScore >= 4 ? "high" : powerScore >= 2 ? "moderate" : "low",
    detail: powerScore >= 4
      ? "Significant risk of one partner feeling sidelined. The operating agreement needs explicit checks on managing-member authority."
      : powerScore >= 2
        ? "Some imbalance potential. Supermajority thresholds and information rights should address this."
        : "Low imbalance risk. Both partners have aligned expectations on control."
  });

  // Exit Complexity Risk
  let exitScore = 0;
  const ipCreator = answerIndices[fqMap[3][0]] === 0;
  if (ipCreator) exitScore += 1; // IP ownership complicates exit
  if (answerIndices[fqMap[5][0]] !== answerIndices[fqMap[5][1]]) exitScore += 1; // mixed exit preferences
  if (hasBoth) {
    const dExit = dannyNorm[5];
    const bExit = bennyNorm[5];
    if ((dExit > 0.1 && bExit < -0.1) || (dExit < -0.1 && bExit > 0.1)) exitScore += 2;
  }
  if (answerIndices[fqMap[3][1]] === 0) exitScore += 1; // creator retains IP = complex post-departure
  risks.push({
    name: "Exit Complexity",
    score: Math.min(exitScore, 5),
    maxScore: 5,
    level: exitScore >= 4 ? "high" : exitScore >= 2 ? "moderate" : "low",
    detail: exitScore >= 4
      ? "Exit provisions will require careful drafting. IP ownership, valuation method, and dissolution thresholds need specific attention."
      : exitScore >= 2
        ? "Moderate exit complexity. Standard buy-sell and IP licensing provisions should cover the key scenarios."
        : "Straightforward exit scenario. Standard buy-sell provisions should be sufficient."
  });

  // Financial Misalignment Risk
  let finScore = 0;
  if (hasBoth) {
    const dComp = dannyNorm[4];
    const bComp = bennyNorm[4];
    if ((dComp > 0.1 && bComp < -0.1) || (dComp < -0.1 && bComp > 0.1)) finScore += 2;
    // One partner wants equal profit, the other wants contribution-based
    if (dannyAnswers[fqMap[4][0]] !== bennyAnswers[fqMap[4][0]]) finScore += 1;
  }
  if (answerIndices[fqMap[4][1]] === 0 && answerIndices[fqMap[4][0]] !== 0) finScore += 1; // phantom concern + non-equal profit preference
  risks.push({
    name: "Financial Misalignment",
    score: Math.min(finScore, 5),
    maxScore: 5,
    level: finScore >= 3 ? "high" : finScore >= 1 ? "moderate" : "low",
    detail: finScore >= 3
      ? "Partners have different expectations about profit distribution. This must be resolved explicitly in the operating agreement before formation."
      : finScore >= 1
        ? "Minor financial preference differences. The operating agreement should clearly define the distribution formula."
        : "Financial expectations are aligned. Standard distribution provisions should work."
  });

  return risks;
}
