# Ownership Structure Decision Guide

**50/50 vs. 51/49 — Which Split Is Right for Your Farmers Market Venture?**

An interactive decision tool that helps prospective business partners evaluate whether a **50/50** or **51/49** LLC ownership structure best fits their joint venture. Built for Danny Barcelo and Benny Rodriguez as they prepare to launch a food retail venture at the Santa Monica Farmers Market.

> Prepared by **digiSpace** | Author: **Dennis Smaltz**

---

## How It Works

1. **Each partner visits the site independently** and selects their name
2. **Answer 16 questions** across 8 critical comparison factors drawn from four independent legal research reports
3. **Submit your responses** — answers are stored locally in your browser
4. **Once both partners have submitted**, the site generates a **combined scorecard** showing which ownership structure aligns with both partners' preferences

The tool is a conversation starter, not a legal recommendation. It is designed to be reviewed together with independent legal counsel before finalizing any ownership structure.

---

## The 8 Comparison Factors

| # | Factor | What It Evaluates |
|---|--------|-------------------|
| 1 | **Decision-Making Authority** | How routine and major decisions are made; deadlock risk |
| 2 | **Partner Protections** | Veto power, risk of oppression, fiduciary duties |
| 3 | **Deadlock Resolution** | How impasses are resolved; business continuity during disputes |
| 4 | **IP & Recipe Ownership** | Who controls recipes and brand assets; assignment vs. license |
| 5 | **Compensation & Distributions** | Profit splits, phantom income risk, guaranteed payments |
| 6 | **Exit Strategies** | Buyout valuation, dissolution power, community property risk |
| 7 | **Regulatory Compliance** | Permits, health inspections, Santa Monica vendor requirements |
| 8 | **Trust & Relationship** | Contribution equality, operational involvement, communication style |

---

## Research Reports

The interactive tool distills findings from four comprehensive legal research reports and a unified decision guide. PDF copies are available in the [`reports/`](reports/) directory:

| Report | Description |
|--------|-------------|
| [50/50 vs. 51/49 Decision Guide](reports/50-50%20vs.%2051-49%20Decision%20Guide.pdf) | Side-by-side comparison with visual scorecard across all 8 factors |
| [50/50 Joint Venture Research Report](reports/50-50%20Joint%20Venture%20Research%20Report.pdf) | Full research on equal-split LLC/GP structures under California law |
| [50/50 Works Cited Matrix](reports/50-50%20Joint%20Venture%20Research%20Report%20Works%20Cited%20Matrix.pdf) | 90-source reference matrix for the 50/50 report |
| [51/49 Joint Venture Research Report](reports/51-49%20Joint%20Venture%20Research%20Report.pdf) | Full research on majority/minority LLC structures under California law |
| [51/49 Works Cited Matrix](reports/51-49%20Joint%20Venture%20Research%20Report%20Works%20Cited%20Matrix.pdf) | 56-source reference matrix for the 51/49 report |

---

## Repository Structure

```
├── index.html          ← Landing page & app shell
├── style.css           ← Navy/gold/slate branded stylesheet
├── app.js              ← Questionnaire engine & scoring algorithm
├── reports/            ← PDF research reports & works cited matrices
│   ├── 50-50 vs. 51-49 Decision Guide.pdf
│   ├── 50-50 Joint Venture Research Report.pdf
│   ├── 50-50 Joint Venture Research Report Works Cited Matrix.pdf
│   ├── 51-49 Joint Venture Research Report.pdf
│   └── 51-49 Joint Venture Research Report Works Cited Matrix.pdf
└── README.md
```

---

## Deployment

This site is designed for **GitHub Pages**. To deploy:

1. Go to **Settings → Pages** in this repository
2. Set Source to **Deploy from a branch**
3. Select **main** branch, root `/`
4. Save — the site will be live at `https://dnoice.github.io/Ownership-Structure-Decision-Guide/`

No build step required. The site is pure HTML/CSS/JS with zero dependencies.

---

## Privacy

All questionnaire responses are stored **locally in your browser** using `localStorage`. No data is transmitted to any server. Each partner's answers remain on their own device until presented together.

---

## Legal Disclaimer

This tool is a **decision-support framework**, not legal advice. The information contained in the research reports and this interactive tool is based on publicly available legal research and is provided for informational purposes only. Both partners should consult with **independent legal counsel** before finalizing any ownership structure or executing an operating agreement.

---

<p align="center">
  <code>︻デ═─── ✦ ✦ ✦ | Aim Twice, Shoot Once!</code><br>
  <em>Precision over Haste</em>
</p>
