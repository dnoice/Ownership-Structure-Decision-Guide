/* ═══════════════════════════════════════════════════════
   Config — Questions, factors, insights, credentials
   ═══════════════════════════════════════════════════════ */

// ─── Questions ───
// Each question maps to one of the 8 comparison factors from the Decision Guide.
// Scores: positive = leans 50/50, negative = leans 51/49
export const QUESTIONS = [
  // ── 1. Decision-Making Authority ──
  {
    category: "Decision-Making Authority",
    factor: 0,
    text: "How do you prefer routine operational decisions to be made?",
    context: "Think about daily calls like ingredient orders, booth setup changes, or menu tweaks at the farmers market.",
    learnMore: "In business law, decisions fall into two tiers: <strong>routine/ordinary</strong> (daily purchasing, scheduling, minor pricing) and <strong>major/extraordinary</strong> (taking on debt, signing leases, bringing in new partners). In a 50/50, both partners must agree on everything unless the operating agreement delegates routine authority. In a 51/49, the managing member typically handles routine decisions unilaterally, while major decisions still require both partners. The operating agreement defines exactly which decisions fall into which tier.",
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
    learnMore: "Deadlock occurs when co-equal partners disagree and no mechanism exists to break the tie. In a farmers market business, this could mean: one partner wants to add a new product line and the other doesn't, one wants to hire staff while the other doesn't, or they disagree on which markets to attend. Without a resolution mechanism, the business literally cannot act. Prolonged deadlock is the #1 reason 50/50 ventures fail. The antidote is a <strong>deadlock-resolution ladder</strong> written into the operating agreement — typically: good-faith negotiation → professional mediation → binding arbitration → shotgun buy-sell as a last resort.",
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
    text: "How important is it that you have veto power over major business decisions?",
    context: "Veto power means nothing happens without your consent — financing, new partners, selling the business, etc.",
    learnMore: "Veto power (also called <strong>blocking rights</strong>) means a decision cannot proceed without your affirmative vote. In a 50/50, both partners automatically have veto power over everything. In a 51/49, the minority partner only has veto power over decisions the operating agreement designates as 'Major Decisions' requiring unanimity or supermajority (e.g., 75%) consent. Common Major Decisions include: taking on debt over a threshold, selling or pledging assets, admitting new members, changing the business purpose, amending the operating agreement, or dissolving the company. Without explicit protections, the 51% member could make these decisions alone under California's default RULLCA rules.",
    options: [
      { label: "Essential. I should be able to block any decision I disagree with.", score: 2 },
      { label: "Important for big decisions, but not for day-to-day operations.", score: 1 },
      { label: "Not critical. I trust my partner to make good calls even if I'm not consulted on everything.", score: -1 },
    ]
  },
  {
    category: "Partner Protections",
    factor: 1,
    text: "Would you be comfortable if your partner held more formal control than you?",
    context: "In a 51/49, one partner is the 'managing member' with day-to-day authority. Minority protections can still be built in.",
    learnMore: "The <strong>managing member</strong> in an LLC holds authority to bind the company in daily operations — signing vendor contracts, managing the bank account, hiring/firing. In a 51/49, this is typically the 51% member. However, 'formal control' can be heavily constrained by the operating agreement. Minority protections include: <strong>supermajority thresholds</strong> (requiring 75%+ for major decisions, which effectively requires both partners), <strong>information rights</strong> (access to all financial records), <strong>anti-dilution provisions</strong> (preventing the majority member from issuing new interests to reduce the minority), and <strong>removal provisions</strong> (ability to remove the managing member for cause). A well-drafted 51/49 with strong protections can feel very similar to a 50/50 in practice.",
    options: [
      { label: "No — equal control is non-negotiable for me.", score: 2 },
      { label: "Yes, if strong protections are written into the operating agreement.", score: -1 },
      { label: "Yes — I'm comfortable with one of us leading as long as the business is successful.", score: -2 },
    ]
  },

  // ── 3. Deadlock Resolution ──
  {
    category: "Deadlock Resolution",
    factor: 2,
    text: "If you and your partner reach an impasse on a critical decision, how should it be resolved?",
    context: "Every partnership faces disagreements. The question is how to break them without breaking the partnership.",
    learnMore: "There are three common escalation mechanisms: <strong>Mediation</strong> — a neutral third party facilitates discussion (non-binding, ~$2,000–$5,000, preserves the relationship). <strong>Binding Arbitration</strong> — a neutral arbitrator makes a final decision both parties must accept (faster and cheaper than court, typically $5,000–$15,000). <strong>Shotgun Buy-Sell (Texas Shootout)</strong> — one partner names a price, the other must either buy at that price or sell at that price. This is a nuclear option that ends the deadlock by ending the partnership. Most well-drafted operating agreements use all three in sequence: 30-day negotiation → 60-day mediation → binding arbitration, with a shotgun clause as an absolute last resort.",
    options: [
      { label: "We'll work it out between ourselves — we don't need formal escalation.", score: 1 },
      { label: "A structured process: mediation first, then arbitration if needed, then buy-sell as last resort.", score: 0 },
      { label: "One partner should have final say to prevent the business from stalling.", score: -2 },
    ]
  },

  // ── 4. IP & Recipe Ownership ──
  {
    category: "IP & Recipe Ownership",
    factor: 3,
    text: "Who is bringing the recipes, brand concepts, or other intellectual property?",
    context: "If one partner created the recipes, licensing (not assigning) them to the business protects the creator's long-term rights.",
    learnMore: "There's a critical legal distinction: <strong>Assignment</strong> means the creator transfers full ownership of the IP to the business — the recipes belong to the LLC, and if the creator leaves, the recipes stay. <strong>Licensing</strong> means the creator retains ownership but grants the business permission to use them, typically through an exclusive license during the partnership and a non-exclusive or terminated license after departure. In food businesses, recipes often represent years of development and personal brand identity. The license-not-assign model is strongly recommended when one partner is the primary creator. The IP schedule (an exhibit to the operating agreement) should list every recipe, brand name, and concept being contributed, along with whether it's assigned or licensed.",
    options: [
      { label: "I am the primary recipe/IP creator.", score: 2 },
      { label: "We're both contributing equally to recipes and branding.", score: 1 },
      { label: "Recipes will be developed jointly after formation — neither of us has prior IP.", score: 0 },
    ]
  },
  {
    category: "IP & Recipe Ownership",
    factor: 3,
    text: "If the partnership ends, what should happen to the recipes?",
    context: "This is one of the most contentious exit issues in food businesses.",
    learnMore: "Post-departure IP rights are where partnerships often break down. Consider: if one partner created a signature dish that built the business's reputation, should the other partner be able to use that exact recipe at a competing booth? California's general rule (Business & Professions Code §16600) prohibits non-compete clauses — but there is a critical exception: <strong>BPC § 16602.5</strong> permits non-competes upon termination of an LLC membership interest. This means the operating agreement <strong>can</strong> include a non-compete (e.g., restricting the departing member from competing at the same farmers markets for a defined period), but only if the departing member receives full Fair Value for their interest — a discounted buyout voids the restriction entirely (see <em>Samuelian v. Life Generations Healthcare</em>, 2024). Beyond non-competes, the agreement should also restrict use of specific recipes and trade secrets through IP licensing provisions. Key questions to answer before formation: Does the business retain any rights to the recipes? Can the departing creator use them immediately or is there a cooling-off period? What about recipes developed jointly during the partnership?",
    options: [
      { label: "The creator keeps full ownership. The business gets a non-exclusive license only during the partnership.", score: 2 },
      { label: "Both partners retain equal rights to use the recipes independently.", score: 0 },
      { label: "Recipes should stay with the business, regardless of who created them.", score: -2 },
    ]
  },

  // ── 5. Compensation & Distributions ──
  {
    category: "Compensation & Distributions",
    factor: 4,
    text: "How should profits be split?",
    context: "A 50/50 split means equal profit sharing. A 51/49 can still have equal (50/50) profit distribution despite unequal governance — this is called a hybrid structure.",
    learnMore: "LLCs have flexibility that corporations don't: profit distributions <strong>don't have to match ownership percentages</strong>. Under IRC §704(b), an LLC can allocate profits in any ratio as long as it has 'substantial economic effect' — meaning it reflects the economic reality of the partnership. This enables the <strong>hybrid model</strong>: 51/49 governance (one partner has tiebreaker authority) with 50/50 economics (profits split equally). This is increasingly popular because it resolves the deadlock problem while preserving the sense of equal partnership. The operating agreement should define: base profit allocation, guaranteed payments (if any partner draws a salary), distribution frequency (quarterly is standard), and what happens when cash isn't available for distribution (the phantom income problem).",
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
    learnMore: "LLCs are pass-through entities: profits are taxed on each member's personal return regardless of whether cash was actually distributed. If the LLC earns $100K and retains it all for equipment purchases, both partners still owe income tax on their allocated share. This is <strong>phantom income</strong>. The solution is a <strong>mandatory tax distribution clause</strong> — the operating agreement requires the LLC to distribute at least enough cash to cover each member's estimated tax liability (typically calculated at the highest marginal rate, currently 37% federal + 13.3% California = ~50.3%). Additionally, the operating agreement authorizes a <strong>PTE Elective Tax</strong> under California SB 132 — a 9.3% entity-level tax that bypasses the federal $10,000 SALT deduction cap, effectively saving each member thousands in federal taxes. When the PTE election is made, mandatory distributions are reduced by the pro-rata PTE tax already paid at entity level, so members aren't double-taxed. Without a mandatory tax distribution clause, the managing member in a 51/49 could theoretically retain all cash in the business, leaving the minority member with a tax bill and no distribution to pay it.",
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
    learnMore: "Business valuation methods include: <strong>Book value</strong> (assets minus liabilities — simplest but often undervalues the business), <strong>Multiple of earnings</strong> (net profit × industry multiple, typically 2–4x for food businesses), and <strong>Independent appraisal</strong> (a certified business appraiser determines fair market value). The critical issue in a 51/49 is the <strong>minority discount</strong> — the principle that a 49% interest is worth less than 49% of total value because it doesn't carry control. This discount typically ranges from 15–35%. To protect the minority partner, the operating agreement can include a <strong>no-discount clause</strong> requiring pro-rata valuation. The buy-sell provisions should also specify: valuation method, payment terms (lump sum vs. installment), right of first refusal timeline, and what triggers a mandatory buyout (the 'Five D's': death, disability, divorce, departure, default).",
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
    learnMore: "Under California's Revised Uniform Limited Liability Company Act (RULLCA), an LLC can be dissolved by members holding more than 50% of the profits interest — meaning in a 51/49, the majority member could dissolve the company without the minority member's consent. This is a <strong>default rule</strong> that can be overridden in the operating agreement. Best practice: require <strong>unanimous consent</strong> for voluntary dissolution, and define specific involuntary dissolution triggers (judicial dissolution for deadlock, dissolution upon bankruptcy of a member, etc.). The operating agreement should also include <strong>continuation rights</strong> — if dissolution is triggered, the remaining member has the right to buy out the departing member and continue the business rather than winding down.",
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
    learnMore: "For a Santa Monica Farmers Market food vendor, the regulatory stack includes: <strong>City of Santa Monica vendor permit</strong> (non-transferable, must be in an individual's name), <strong>LA County Department of Public Health permit</strong> (Temporary Food Facility or Community Event permit), <strong>California Seller's Permit</strong> (Board of Equalization), <strong>Business License</strong> (City of Santa Monica), <strong>Commissary kitchen agreement</strong> (all food must be prepared in a licensed commissary), and <strong>food handler certifications</strong> for anyone handling food. <strong>Important:</strong> Because Santa Monica vendor permits and DPH TFF permits are non-transferable, the operating agreement includes a <strong>Permit Change-of-Control Notice</strong> — any equity transfer requires 60 days' written notice to the City of Santa Monica and 30 days' notice to LA County DPH before the transfer closes. The LLC must be named as the Responsible Party on all permits. The operating agreement should also designate a <strong>Regulatory Compliance Officer</strong> (one member who ensures all permits, inspections, and filings remain current). This doesn't change the legal requirements — both structures face identical obligations — but it clarifies who is accountable.",
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
    learnMore: "Trust isn't binary — it exists on a spectrum, and the right business structure should match where you are on that spectrum. <strong>High trust</strong> partnerships can thrive in a 50/50 because both partners are willing to compromise and communicate through disagreements. However, even high-trust partnerships should have formal protections — trust can erode under financial pressure, and the agreement protects the relationship by providing clear rules before emotions run high. <strong>Developing trust</strong> partnerships benefit from a 51/49 because it provides structure and clarity: everyone knows who decides what, reducing the surface area for conflict. The key insight: the operating agreement isn't a sign of distrust — it's a sign of professionalism. The best time to negotiate these terms is when both partners are optimistic and collaborative, not when they're in conflict.",
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
    learnMore: "Contributions come in several forms: <strong>Capital</strong> (cash invested), <strong>Sweat equity</strong> (labor and time), <strong>Intellectual property</strong> (recipes, brand concepts), and <strong>Industry relationships</strong> (vendor contacts, market connections). Equal doesn't mean identical — one partner might contribute more capital while the other contributes more IP and labor. The operating agreement should document each partner's initial capital contribution and assign a fair value to non-cash contributions. If contributions are significantly unequal, the operating agreement can use <strong>preferred returns</strong> (the partner who invested more cash gets their money back first from profits) or <strong>guaranteed payments</strong> (the partner who works more receives a salary-like payment before profit distributions). These mechanisms allow a 50/50 ownership split even when contributions aren't perfectly equal.",
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
    learnMore: "The <strong>operator vs. investor</strong> dynamic is the strongest predictor of whether a 51/49 structure makes sense. If one partner is at the booth 5 days a week while the other has a separate full-time job, giving the operator managing-member authority aligns governance with daily reality. The operator needs to make quick decisions (staffing, purchasing, customer issues) without waiting for the investor's input. However, the investor's capital contribution means they need protections: <strong>information rights</strong> (monthly financial reports, real-time access to books), <strong>major decision consent</strong> (any expenditure over a threshold requires both), and <strong>removal rights</strong> (ability to remove the managing member for cause — e.g., self-dealing, gross negligence, or criminal conduct). A 50/50 can still work here with a <strong>managing member carve-out</strong> — equal ownership but one partner designated as managing member with defined operational authority.",
    options: [
      { label: "We'll both be equally active in daily operations.", score: 2 },
      { label: "One of us will be more active, but both will be involved.", score: 0 },
      { label: "One partner will be the full-time operator; the other is more of an investor.", score: -2 },
    ]
  },
];

// Factor names (index-aligned)
export const FACTORS = [
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
export const FACTOR_INSIGHTS = {
  0: (norm, answers, qis) => {
    if (norm > 0.5) return { label: "Strong 50/50", detail: "Both responses favor joint decision-making. This partnership wants consensus on everything — a 50/50 structure with a robust deadlock clause is essential.", flag: null };
    if (norm > 0.1) return { label: "Leans 50/50", detail: "Preference for shared decisions, but some openness to tiebreakers. A 50/50 with a managing-member carve-out for small routine calls could work.", flag: null };
    if (norm < -0.5) return { label: "Strong 51/49", detail: "Clear preference for one partner to handle daily operations and break ties. Supermajority protections for the 49% partner are critical here.", flag: answers[qis[1]] === 2 ? "High deadlock concern — tiebreaker authority is important to this respondent." : null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Comfort with delegated authority on routine matters. The operating agreement should clearly define which decisions require unanimity vs. managing-member authority.", flag: null };
    return { label: "Neutral", detail: "Mixed signals — comfortable with shared control but also sees value in clear leadership. A hybrid approach (50/50 economics, 51/49 governance) may fit best.", flag: null };
  },
  1: (norm, answers, qis) => {
    if (norm > 0.5) return { label: "Strong 50/50", detail: "Veto power and equal control are non-negotiable. This respondent would be uncomfortable in a minority position without structural equality.", flag: answers[qis[1]] === 0 ? "Equal control was explicitly marked as non-negotiable." : null };
    if (norm > 0.1) return { label: "Leans 50/50", detail: "Values protections but shows some flexibility. Strong supermajority provisions could satisfy this partner's needs in either structure.", flag: null };
    if (norm < -0.5) return { label: "Strong 51/49", detail: "Trust-based approach — comfortable with unequal formal control as long as the business runs smoothly. Less concerned about structural power.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Would accept unequal governance if protections are written in. Key provisions: supermajority thresholds on major decisions, information rights, anti-dilution.", flag: null };
    return { label: "Neutral", detail: "Wants protections but isn't rigid about how they're delivered. Either structure works with proper drafting.", flag: null };
  },
  2: (norm, answers, qis) => {
    const q0 = answers[qis[0]];
    if (q0 === 0) return { label: norm >= 0 ? "Leans 50/50" : "Neutral", detail: "Prefers informal resolution — believes the partnership can talk through disagreements. In a 50/50, this confidence is essential but the agreement should still have a formal escalation ladder as backup.", flag: "Relying solely on good communication is risky. The agreement must include mediation → arbitration → buy-sell regardless." };
    if (q0 === 1) return { label: "Structure-aware", detail: "Wants a formal escalation process (mediation → arbitration → buy-sell). This is the correct approach for either structure, but is particularly critical in a 50/50 where deadlocks can paralyze the business.", flag: null };
    return { label: "Leans 51/49", detail: "Wants to avoid deadlocks entirely by having a clear tiebreaker. This strongly suggests 51/49 governance where the managing member can break routine ties while major decisions still require both.", flag: null };
  },
  3: (norm, answers, qis) => {
    const isCreator = answers[qis[0]] === 0;
    const retainIP = answers[qis[1]] === 0;
    if (isCreator && retainIP) return { label: "Strong 50/50", detail: "This respondent is the recipe creator AND wants to retain full ownership. In a 50/50, equal veto power naturally protects IP. In a 51/49, a license-not-assign model is non-negotiable.", flag: "IP ownership is a high-stakes factor. The operating agreement must explicitly address recipe ownership, licensing terms, and post-departure rights." };
    if (isCreator) return { label: "Leans 50/50", detail: "Recipe creator who is somewhat flexible on exit provisions. Either structure works, but the license model should be included regardless to protect the creator's interests.", flag: null };
    if (norm > 0.1) return { label: "Leans 50/50", detail: "Values IP protection and equal say over how recipes are used. A 50/50 gives both partners automatic blocking rights over IP decisions.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Less concerned about IP control — trusts the agreement to handle it. The license-not-assign model should still be used to protect the recipe creator.", flag: null };
    return { label: "Neutral", detail: "Joint recipe development or standard recipes. IP is less of a differentiating factor — either structure works with proper IP provisions.", flag: null };
  },
  4: (norm, answers, qis) => {
    const q0 = answers[qis[0]];
    const q1 = answers[qis[1]];
    if (q0 === 0 && q1 === 0) return { label: "Strong 50/50", detail: "Wants exactly equal profits AND is concerned about phantom income. A 50/50 with mandatory tax distributions and equal quarterly distributions is the cleanest fit.", flag: "Phantom income concern means the agreement MUST include mandatory tax distributions at the highest marginal rate." };
    if (q0 === 0) return { label: "Leans 50/50", detail: "Prefers equal profit sharing. Note: this is achievable in either structure — a 51/49 can still distribute profits 50/50 (the 'hybrid' model).", flag: null };
    if (q0 === 1) return { label: "Leans 51/49", detail: "Comfortable with proportional profit sharing based on ownership percentage. In a 51/49, this means the majority member receives slightly more.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Prefers contribution-based compensation and is comfortable with profit reinvestment. This flexibility supports a 51/49 where the managing member has more discretion on distributions.", flag: null };
    return { label: "Neutral", detail: "Flexible on profit distribution. The key takeaway: regardless of structure, mandatory tax distributions and a clear distribution schedule should be in the agreement.", flag: q1 === 0 ? "Phantom income concern noted — include mandatory tax distribution clause." : null };
  },
  5: (norm, answers, qis) => {
    const q0 = answers[qis[0]];
    const q1 = answers[qis[1]];
    if (q0 === 0 && q1 === 0) return { label: "Strong 50/50", detail: "Wants pro-rata buyout with no minority discount AND strong dissolution protections. A 50/50 delivers both by design — neither partner's interest can be discounted.", flag: null };
    if (q0 === 0) return { label: "Leans 50/50", detail: "Pro-rata valuation preference. In a 51/49, the agreement must explicitly waive minority/marketability discounts to achieve the same fairness.", flag: "If going 51/49: include a 'no-discount' clause for buyouts to protect the minority partner." };
    if (norm < -0.5) return { label: "Strong 51/49", detail: "Comfortable with standard market valuations and flexible on dissolution. This respondent prioritizes business continuity over structural protections.", flag: null };
    if (norm < -0.1) return { label: "Leans 51/49", detail: "Pragmatic on exit. Either structure works, but dissolution threshold should still require unanimity regardless.", flag: null };
    return { label: "Neutral", detail: "Trusts an independent appraiser for valuation. Either structure works — the buy-sell provisions are what matter most, not the ownership split.", flag: null };
  },
  6: (norm, answers, qis) => {
    const q0 = answers[qis[0]];
    if (q0 === 0) return { label: "Leans 50/50", detail: "Prefers shared regulatory responsibility. Both structures face identical permit/compliance requirements — the difference is who takes point.", flag: null };
    if (q0 === 1) return { label: "Leans 51/49", detail: "Wants the active operator to handle permits and compliance. This aligns with 51/49 where the managing member naturally owns regulatory responsibility.", flag: "Santa Monica vendor permits and DPH TFF permits are non-transferable. The operating agreement requires 60-day notice before any equity transfer to protect permit continuity." };
    return { label: "Neutral", detail: "Indifferent on who handles compliance — just wants clear designation. Either structure works; the Regulatory Compliance Officer role should be defined in the agreement.", flag: null };
  },
  7: (norm, answers, qis) => {
    const highTrust = answers[qis[0]] === 0;
    const equalContrib = answers[qis[1]] === 0;
    const equalActive = answers[qis[2]] === 0;
    if (highTrust && equalContrib && equalActive) return { label: "Strong 50/50", detail: "Complete trust, equal contributions, equal operational involvement — this is the textbook case for a 50/50 split.", flag: null };
    if (norm > 0.3) return { label: "Leans 50/50", detail: "High trust and mostly equal partnership dynamics. A 50/50 structure reflects the relationship reality.", flag: null };
    if (answers[qis[2]] === 2) return { label: "Strong 51/49", detail: "One partner is clearly the full-time operator while the other is more passive. A 51/49 with the operator as managing member aligns governance with day-to-day reality.", flag: "Asymmetric involvement is the strongest predictor of 51/49 suitability." };
    if (norm < -0.3) return { label: "Leans 51/49", detail: "Growing trust or unequal contributions suggest the partnership is still developing. A 51/49 with strong protections provides structure while the relationship matures.", flag: answers[qis[0]] === 2 ? "Trust is still developing — the agreement should include more guardrails (regular meetings, detailed reporting, approval thresholds)." : null };
    return { label: "Neutral", detail: "Mixed relationship signals. The partnership has elements that support both structures. Key question: will both partners be equally involved day-to-day?", flag: null };
  },
};

// EmailJS configuration
export const EMAILJS = {
  serviceId: "service_wabtt69",
  templateId: "template_7mektik",
  publicKey: "130PuCIb_6PfT82tZ",
};

// Partner access codes
export const ACCESS_CODES = {
  danny: "DB2026",
  benny: "BR2026",
};
