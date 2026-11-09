# Araxie — The Student Digital Economy Powered by Agentic Commerce

[![PayPal AI Hackathon](https://img.shields.io/badge/PayPal_AI_Hackathon-Devpost_Submission-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://paypalaihackathon.devpost.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Production-black?style=for-the-badge&logo=vercel)](https://araxie.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-14%20Passing-emerald?style=for-the-badge&logo=vitest)](https://github.com/Alqaasimee-jr2/araxie)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> **"Whop for Students"** — An autonomous, AI-driven digital marketplace where student-built tools, Chrome extensions, Anki study packs, and micro-software meet intelligent multi-item bundling, instant **PayPal Orders v2 checkout**, and automated peer-to-peer creator payouts.
> 
> 🌐 **Live Production Deployment**: [https://araxie.vercel.app](https://araxie.vercel.app)

---

## 🌟 Overview & Platform Vision

Every semester, student developers and campus innovators build high-utility software: Chrome extensions automating LMS deadlines, AST security pre-flight gates, interactive algorithm visualizers, pre-med study workspaces, and research CLI tools. 

Yet, student builders have had no dedicated platform to distribute and monetize their work, and student buyers waste hours searching fragmented forums. **Araxie** solves this by establishing a campus digital marketplace powered by **Agentic Commerce** and **PayPal’s Developer Platform**.

---

## 🚀 Key Technical Highlights

### 1. 🤖 Autonomous AI Concierge (Agentic Commerce)
- **Natural Language Student Advisor**: Students describe their major, courses, or study goals (e.g., *"Sophomore CS student taking Algorithms with a $20 budget"*).
- **Capped Logarithmic Multi-Tool Discount Model**: Evaluates student inventory and bundles complementary tools using a mathematically capped logarithmic discount function:
  $$\delta(k) = \min\left(0.25, \; 0.12 \cdot \ln(1 + k)\right)$$
  Yields ~13% discount at $k=2$, ~17% at $k=3$, reaching the 25% cap at $k=8$.
- **Deterministic Semantic Fallback**: If Gemini rate limits or upstream network blips occur, deterministic keyword scoring takes over so checkout proposals never dead-end.

### 2. 🛡️ Server-Side Price Integrity & PayPal Orders v2
- **Server Recomputed Pricing**: Client and LLM price amounts are never trusted blindly. All totals and discounts are strictly recomputed on the backend from verified product catalog IDs (`src/lib/pricing.ts`).
- **Capture Amount Integrity & Idempotency**: Compares settled PayPal amounts against expected totals to block client-side tampering, and enforces capture idempotency to prevent double-capture replays.
- **HMAC-SHA256 Cryptographic License Keys**: Every transaction mints an HMAC-signed license (`ARX-{PROD}-{TIME}-{HMAC}`) verifiable via `/api/licenses/verify?key={key}`.

### 3. 💼 Creator Studio & Payouts v1 Rails
- **95% Net Creator Royalties**: Creators receive 95% of the pro-rated net captured amount per product, with Araxie retaining a 5% platform fee.
- **Deterministic Idempotent Payouts**: Uses deterministic `sender_batch_id` (`arx_batch_{orderId}_{creatorEmailHash}`) on PayPal Payouts REST API v1 (`/v1/payments/payouts`) to guarantee retries can never disburse twice.
- **Creator Tool Publishing & AI Polish**: Publish tools to the campus marketplace in under 60 seconds with live **Google Gemini 2.5 Flash** copy optimization.

### 4. 🧪 In-Browser Interactive Tool Execution
- Working browser tools run directly in-app without local setup:
  - **Flow7**: Calm work stopwatch, 4 focus domains, 7-day cognitive load heatmap, and 1-click Markdown exporter.
  - **CI-Guardian**: AST syntax security scanner detecting hardcoded secrets and `eval()` with SARIF 2.1.0 report generation.
  - **CanvasAutoPilot**: Chrome extension simulator tracking Canvas deadlines and GPA forecasts.
  - **AlgoVisualizer Pro**: Interactive step-by-step pathfinding matrix (Dijkstra and A*).
  - **Academic Writing Studio**: Scholarly prompt transformer with Gemini citation optimization.

### 5. ⚖️ Campus Trust Center, Student Privacy (FERPA) & Honor Code (`/terms`)
- **Student Creator IP & 95% Royalties**: Student developers retain 100% intellectual property ownership of their work and receive 95% of net captured sales disbursed directly via PayPal Payouts v1.
- **Campus Honor Code & Academic Integrity**: Prohibits tools designed for academic dishonesty, lockdown browser evasion, or unauthorized LMS credential harvesting, while encouraging legitimate productivity and study aids.
- **Student Privacy & FERPA Alignment**: Zero credential retention (LMS API keys remain 100% client-side in browser storage), no data selling, and minimal telemetry.
- **Cryptographic License Revocation**: Transparent refund policy tied to automated HMAC license invalidation and PayPal Purchase Protection.

---

## 🛠️ Architecture & Technical Stack

```
araxie/
├── .github/workflows/
│   └── ci.yml                        # GitHub Actions CI (build, tests & AST security check)
├── supabase/
│   └── schema.sql                    # Supabase PostgreSQL schema with Row-Level Security (RLS)
├── tests/
│   └── pricing-and-security.test.ts  # 8 unit tests (price integrity, log discount, HMAC keys)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/concierge/         # Autonomous AI tool matching & dynamic bundling
│   │   │   ├── licenses/verify/      # Cryptographic HMAC license verification API
│   │   │   └── paypal/
│   │   │       ├── create-order/     # PayPal v2 order creation (server price integrity)
│   │   │       ├── capture-order/    # PayPal capture, HMAC licenses, & creator payouts
│   │   │       ├── payout/           # PayPal v1 creator payouts
│   │   │       └── webhook/          # PayPal webhook listener
│   │   ├── globals.css               # Whop-grade dark theme design system
│   │   ├── layout.tsx                # Next.js 16 root layout, SEO metadata, & Geist fonts
│   │   └── page.tsx                  # Interactive marketplace storefront & first-time flow
│   ├── components/
│   │   ├── Navbar.tsx                # Navigation, search, & profile menu
│   │   ├── ProductCard.tsx           # Whop-style tool cards with conditional preview
│   │   ├── ProductDetailDrawer.tsx   # Detailed product view & specifications
│   │   ├── AIConciergeModal.tsx      # Agentic commerce conversation interface
│   │   ├── PayPalCheckoutModal.tsx   # Native PayPal payment modal
│   │   ├── UserSettingsModal.tsx     # Student profile & PayPal payout settings
│   │   ├── StudentLocker.tsx         # User's unlocked tools & licenses (@me)
│   │   ├── CreatorStudioModal.tsx    # Tool publishing with AI copy polish
│   │   ├── OrderHistoryModal.tsx     # Transaction receipts & ledger
│   │   └── CartDrawer.tsx            # Multi-tool cart with dynamic bundle savings
│   ├── lib/
│   │   ├── pricing.ts                # Server-side price integrity & discount model
│   │   ├── licenses.ts               # Cryptographic HMAC-SHA256 license generator
│   │   ├── paypal.ts                 # PayPal Orders v2 & Payouts v1 SDK integration
│   │   ├── geminiRateLimiter.ts      # Token bucket rate limiter & LRU cache
│   │   └── security.ts               # Prompt injection sanitizer & input defenses
│   └── types/
│       └── index.ts                  # Shared TypeScript interfaces
├── .env.example                      # Documented environment variables
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Start & Local Run Instructions

### Prerequisites
- Node.js 18+ (tested on Node.js 24 LTS)
- npm or pnpm

### 1. Clone & Configure
```bash
git clone https://github.com/Alqaasimee-jr2/araxie.git
cd araxie
cp .env.example .env.local
npm install
```

### 2. Run Automated Unit Tests
```bash
npm test
```
Executes 14 automated unit tests covering pricing integrity, discount formulas, HMAC license verification, prompt injection defense, and legal terms compliance.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Evaluation & Testing Guide

For hackathon evaluators, step-by-step testing instructions, 1-click evaluator sign-in, and pre-seeded sandbox accounts are detailed in [**DEMO.md**](DEMO.md).

### ⚡ 1-Click Evaluator Sign-In
1. Navigate to [https://araxie.vercel.app](https://araxie.vercel.app).
2. Click **"Sign In"** in the top navigation bar.
3. Click **"⚡ One-Click Hackathon Evaluator Sign-In"** to log in instantly as `judge.sandbox@araxie.edu` with pre-configured orders, locker tools, and verified purchase status.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
