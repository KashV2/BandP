# BPCA CFO — Virtual CFO Dashboard

> Unlocking Growth | Powering IPOs | Enabling M&A & Fundraising

A premium Virtual CFO Dashboard built by **BPCA One** — a multidisciplinary consulting firm (CAs, CMAs, CS, and Lawyers). This client-facing SaaS product serves as an outsourced CFO for founders, promoters, and senior management of growth-stage Indian businesses.

## Tech Stack

- **React 18** + TypeScript
- **Tailwind CSS** for styling (dark-mode first)
- **Recharts** for all data visualizations
- **Lucide React** for icons
- **Framer Motion** for micro-animations

## Design System

- **Primary Background**: Deep Navy (#0A0F1E)
- **Accent 1**: Warm Gold (#C9A84C)
- **Accent 2**: Electric Teal (#00D4B4)
- **Typography**: DM Serif Display (headers), IBM Plex Mono (financial figures), DM Sans (body)

## Pages

1. **Overview** — Command center cockpit with KPIs, health tiles, and live ledger data
2. **Month-End Close** — Structured close management with task queue and progress tracking
3. **MIS Pack** — Management Information System with variance analysis
4. **Drilldowns** — Deep-dive ledger explorer with filtering and materiality thresholds
5. **Report Library** — Report management hub with scheduling and automation
6. **Financial Statements** — Schedule III Balance Sheet, P&L, Cash Flow, and more
7. **Working Capital** — Cash release simulator with CCC optimization
8. **Sales Performance** — Revenue analytics, pipeline tracking, and AR ageing
9. **FP&A Planning** — Scenario modeling with rolling forecasts

## Getting Started

```bash
cd bpca-cfo
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

## Notes

- All data is hardcoded as realistic demo data (no backend required)
- Indian number formatting used throughout (Cr / L / K)
- Dark mode by default with glassmorphism card design
- Responsive: desktop-first, tablet-compatible
