# ◈ ESG Risk Agent

### AI-Powered Sustainability Intelligence Platform

An intelligent web application that automates comprehensive ESG risk assessments for any publicly traded company. Enter a stock ticker — the AI agent handles the rest.

![AI-Powered](https://img.shields.io/badge/AI-Powered-0096D6?style=for-the-badge) ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-0B1929?style=for-the-badge) ![ESG](https://img.shields.io/badge/ESG-Sustainability-00875A?style=for-the-badge)

---

## The Problem

ESG risk assessments are essential for corporate decision-making, but the traditional process is painfully manual:

- **Hours** reading through 100+ page sustainability reports
- **Days** cross-referencing CSRD, GRI, TCFD, and SASB frameworks
- **Tedious** aggregation of ratings from MSCI, EcoVadis, CDP, Moody's, and SBTi
- **More time** formatting findings into executive deliverables

**ESG Risk Agent reduces this from days to minutes.**

---

## How It Works

1. **Enter a stock ticker** (e.g., `AAPL`, `JPM`, `TSLA`) — that's it
2. The AI agent autonomously conducts 4 parallel research tasks:
   - **Ratings Research** — Retrieves ESG scores from MSCI, EcoVadis, CDP, Moody's, and SBTi
   - **Framework Analysis** — Assesses compliance with CSRD, GRI, TCFD, and SASB
   - **Risk Evaluation** — Analyzes environmental, social, governance, climate, and regulatory risks
   - **Executive Synthesis** — Generates summary, recommendations, and source citations
3. **Receive a comprehensive assessment** including:
   - Overall ESG risk rating with color-coded severity
   - External ratings dashboard (5 major providers)
   - Framework alignment status with compliance details
   - Category-level risk breakdown with descriptions
   - Climate & environmental analysis with key emissions metrics
   - Financial risk implications with factor-level detail
   - Executive summary and prioritized recommendations
   - Full source citations

---

## Architecture

The application uses a **multi-call agentic architecture** for reliability and depth:

```
User Input (Ticker)
       │
       ├──→ Call 1: Company Info + ESG Ratings (with web search)
       ├──→ Call 2: Framework Compliance Analysis (with web search)
       ├──→ Call 3: Risk + Climate + Financial Analysis (with web search)
       └──→ Call 4: Executive Summary + Recommendations
       │
       ▼
  Assembled Assessment → Rendered Dashboard
```

Each call is focused and returns structured JSON, which is then assembled into a unified assessment. This approach is significantly more reliable than a single monolithic API call.

---

## Frameworks & Ratings Covered

| Category | Standards & Ratings |
|----------|-------------------|
| **Reporting Frameworks** | CSRD, GRI Standards, TCFD, SASB |
| **ESG Ratings** | MSCI ESG, EcoVadis, Moody's ESG |
| **Climate** | CDP Climate Scores, SBTi Targets |
| **Risk Categories** | Environmental, Social, Governance, Climate Transition, Regulatory |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, Vite |
| AI Engine | Anthropic Claude API with real-time Web Search |
| Architecture | Multi-call agentic pattern with structured JSON output |
| Styling | Custom component system (MSCI-inspired design) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/esg-risk-agent.git
cd esg-risk-agent
npm install
npm run dev
```

Open `http://localhost:5173` and enter any stock ticker.

### Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Click Deploy — live in 60 seconds

---

## Design

Inspired by **MSCI's** data-rich report aesthetic:

- Deep navy palette with strategic color-coded risk indicators
- Institutional typography with clear information hierarchy
- Data-forward layout designed for executive consumption
- Responsive cards with color-coded ratings and risk levels

---

## Use Cases

- **Corporate Consultancies** — Automate ESG assessments for client engagements
- **Investment Analysts** — Quick ESG due diligence by ticker
- **Sustainability Teams** — Benchmark against frameworks and peers
- **Supply Chain Risk** — Assess ESG exposure across suppliers
- **Academic Research** — Rapid ESG data aggregation

---

## Roadmap

- [ ] Downloadable executive PowerPoint deck
- [ ] PDF export
- [ ] Company comparison mode (side-by-side tickers)
- [ ] Historical assessment tracking
- [ ] Custom scoring methodology
- [ ] Batch ticker assessment

---

## Author

Built by an ESG/Sustainability professional demonstrating the practical intersection of AI and sustainability expertise. This project showcases how domain knowledge combined with agentic AI architecture can automate complex analytical workflows that traditionally require days of manual research.

---

## License

MIT — see [LICENSE](LICENSE)
