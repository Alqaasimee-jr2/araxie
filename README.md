# Araxie — The Student Digital Economy Powered by Agentic Commerce

[![PayPal AI Hackathon](https://img.shields.io/badge/PayPal_AI_Hackathon-Devpost_Submission-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://paypalaihackathon.devpost.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Production-black?style=for-the-badge&logo=vercel)](https://araxie.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> **"Whop for Students"** — An autonomous, AI-driven digital marketplace where student-built tools, Chrome extensions, Anki study packs, and micro-software meet intelligent multi-item bundling, instant **PayPal Sandbox checkout**, and automated peer-to-peer creator payouts.
> 
> 🌐 **Live Production Deployment**: [https://araxie.vercel.app](https://araxie.vercel.app)

---

## 🌟 Overview & Video Pitch

Every semester, student developers and campus innovators build high-utility software: Chrome extensions automating LMS deadlines, interactive algorithm visualizers, pre-med study workspaces, and research CLI tools. 

Yet, student builders have no dedicated platform to distribute and monetize their work, and student buyers waste hours searching fragmented forums. **Araxie** solves this by establishing a campus digital marketplace powered by **Agentic Commerce** and **PayPal’s Developer Platform**.

---

## 🚀 Key Features

### 1. 🤖 Autonomous AI Concierge (Agentic Commerce)
- **Natural Language Student Advisor**: Students describe their major, courses, or study goals (e.g., *"Sophomore CS student taking Algorithms with a $20 budget"*).
- **Dynamic Asymptotic Bundling**: Evaluates student inventory and bundles complementary tools using an asymptotic discount function:
  $$\delta(k) = \min\left(0.25, \; 0.12 \cdot \ln(1 + k)\right)$$
- **1-Click Checkout Creation**: The AI agent calls the **PayPal Orders API** directly from conversation context, presenting an instant sandbox checkout.

### 2. 💳 Deep PayPal Developer Platform Integration
- **PayPal v2 Orders REST API** (`/v2/checkout/orders`): Generates orders with itemized breakdowns and student discount lines.
- **PayPal v2 Capture API** (`/v2/checkout/orders/{id}/capture`): Verifies payment completion, mints unique cryptographic license keys (`ARX-STUDENT-XXXX-XXXX`), and provisions instant asset delivery.
- **PayPal v1 Payouts API** (`/v1/payments/payouts`): Programmatically disburses a 95% net royalty to student creators in real-time when transactions settle.
- **Built-in Sandbox Test Mode**: Pre-configured with zero friction for hackathon judges to test end-to-end purchasing flows instantly.

### 3. 💼 Closed-Loop Creator Studio & PayPal Payouts
- **Creator Earnings Hub**: Itemized financial breakdown tracking Lifetime Gross Sales, 5% campus network fee, and 95% net creator payouts.
- **Instant PayPal Payouts Rails**: Student developers can disburse their earnings directly into their PayPal account with real-time PayPal Payout Batch IDs (`/v1/payments/payouts`).
- **Creator Tool Publishing & AI Polish**: Publish tools to the campus marketplace in under 60 seconds with live **Google Gemini 2.5 Flash** copy optimization.

### 4. ⭐ Verified Student Reviews & Ratings
- **Closed-Loop Feedback**: Only students who have purchased and unlocked a tool in their Locker can submit verified ratings (1–5 stars) and peer reviews.
- **Dynamic Storefront Recalculation**: Ratings and review counters automatically update in real-time across the marketplace feed and product details drawer.

### 5. 🎨 Whop-Grade UI / UX & Mobile First
- **Muted Matte Aesthetic**: Modeled on Whop's signature muted dark-slate design system (`#0b0c0e`, `#121317`, `#1e2027`) without distracting neon glows.
- **Interactive In-Browser Tool Execution**: Working web apps (*CanvasAutoPilot*, *AlgoVisualizer Pro*, and *Academic Writing Engine*) run directly in-app.
- **Multi-Item Cart Bundling**: Dynamic cart drawer automatically recalculates bundle discounts on the fly when 2+ items are added.
- **Native Mobile Bottom Navigation Bar**: Fixed bottom bar (*Explore, Locker, AI Concierge, Cart, Creator, Profile*) on screens `< 640px`.

---

## 🛠️ Architecture & Technical Stack

```
araxie/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/concierge/         # Autonomous AI tool matching & dynamic bundling
│   │   │   └── paypal/
│   │   │       ├── create-order/     # PayPal v2 order creation
│   │   │       ├── capture-order/    # PayPal capture & license key issuance
│   │   │       └── payout/           # PayPal v1 creator payouts
│   │   ├── globals.css               # Whop-grade dark theme design system
│   │   ├── layout.tsx                # Next.js 16 root layout & Geist fonts
│   │   └── page.tsx                  # Interactive marketplace storefront
│   ├── components/
│   │   ├── Navbar.tsx                # Navigation, search, & PayPal status
│   │   ├── ProductCard.tsx           # Whop-style student tool cards
│   │   ├── ProductDetailDrawer.tsx   # Detailed product view & specifications
│   │   ├── AIConciergeModal.tsx      # Agentic commerce conversation interface
│   │   ├── PayPalCheckoutModal.tsx   # Native PayPal Sandbox payment modal
│   │   ├── StudentLocker.tsx         # User's unlocked tools & licenses (@me)
│   │   ├── CreatorStudioModal.tsx    # Tool publishing with AI copy polish
│   │   ├── OrderHistoryModal.tsx     # Transaction receipts & ledger
│   │   ├── PayPalConfigModal.tsx     # Sandbox credentials & endpoints manager
│   │   └── CartDrawer.tsx            # Multi-tool cart with dynamic bundle savings
│   ├── data/
│   │   └── mockProducts.ts           # Curated student catalog
│   ├── lib/
│   │   └── paypal.ts                 # PayPal REST API SDK integration
│   └── types/
│       └── index.ts                  # Shared TypeScript interfaces
├── LICENSE                           # MIT Open Source License
└── package.json
```

---

## ⚡ Quick Start & Local Run Instructions

### Prerequisites
- Node.js 18+ (tested on Node.js 24 LTS)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/Alqaasimee-jr2/araxie.git
cd araxie
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Configured Test Credentials (For Hackathon Judges)

You can log in directly using the pre-configured evaluator accounts below, or click **[Auto-fill Judge Credentials]** inside the Sign In modal:

| Persona | Email | Password | Pre-Seeded State |
| :--- | :--- | :--- | :--- |
| **Student Buyer (Alex Chen)** | `judge.sandbox@araxie.edu` | `PayPalHackathon2026!` | Stanford '26 verified profile, active student locker, past PayPal Sandbox receipts. |
| **Student Creator (Marcus Chen)** | `creator.sandbox@araxie.edu` | `PayPalHackathon2026!` | MIT '25 verified developer, author of *AlgoVisualizer Pro*, live PayPal Payouts ledger. |

---

## 🧪 Testing the Live PayPal & AI Workflow

1. **Sign In**:
   - Click **"Sign In"** in the top navigation bar.
   - Click **"Alex Chen (Buyer)"** to auto-fill the credentials and sign in.
2. **Autonomous Agentic Commerce (AI Concierge)**:
   - Click **"Ask AI"** or the hero query bar and pick a prompt (e.g. *"Sophomore CS student, budget $20"*).
   - Observe the live **Google Gemini 2.5 Flash** agent analyze the catalog, compute the dynamic bundle discount ($\delta(k) = \min(0.25, 0.12 \cdot \ln(1+k))$), and construct a 1-click PayPal checkout order.
3. **PayPal Sandbox Checkout & Instant Creator Payout**:
   - Click **"Pay with PayPal"**.
   - In the modal, click the **"PayPal Sandbox"** button to execute order creation and capture.
   - Observe the cryptographic license key (`ARX-STUDENT-XXXX-XXXX-2026`) and instant 95% creator payout confirmation dispatched via the **PayPal Payouts API**.
4. **Live In-Browser Tool Execution**:
   - Navigate to **@me Locker** and click **"Launch Tool"** to run *CanvasAutoPilot*, *AlgoVisualizer*, or the *Academic Writing Studio* directly in your browser.
5. **Creator Studio Publishing & AI Polish**:
   - Switch to the Creator persona or open **Creator Studio**.
   - Enter a tool title and click **"✨ Polish with Gemini"** to auto-generate product copy, feature tags, and pricing, then publish it directly to the live marketplace feed.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
