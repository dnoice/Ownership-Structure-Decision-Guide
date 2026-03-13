/* ═══════════════════════════════════════════════════════
   Storage — localStorage persistence for partner results
   ═══════════════════════════════════════════════════════ */

// ─── Local Storage ───
export function saveResults(partner, data) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  // Increment submission count
  const countKey = partner + "_count";
  stored[countKey] = (stored[countKey] || 0) + 1;
  stored[partner] = data;
  stored[partner + "_date"] = new Date().toISOString();
  localStorage.setItem("digispace-decision", JSON.stringify(stored));
}

export function getSubmissionCount(partner) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return stored[partner + "_count"] || 0;
}

export function getResults(partner) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return stored[partner] || null;
}

export function getBothResults() {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  return { danny: stored.danny || null, benny: stored.benny || null };
}

export function clearResults(partner) {
  const stored = JSON.parse(localStorage.getItem("digispace-decision") || "{}");
  delete stored[partner];
  delete stored[partner + "_date"];
  // Keep the count — we want the running total
  localStorage.setItem("digispace-decision", JSON.stringify(stored));
}
