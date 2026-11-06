# Araxie — The Student Digital Economy Powered by Agentic Commerce

[![PayPal AI Hackathon](https://img.shields.io/badge/PayPal_AI_Hackathon-Devpost_Submission-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://paypalaihackathon.devpost.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> **"Whop for Students"** — An autonomous, AI-driven digital marketplace where student-built tools, Chrome extensions, Anki study packs, and micro-software meet intelligent multi-item bundling, instant **PayPal Sandbox checkout**, and automated peer-to-peer creator payouts.

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

### 3. 🎨 Whop-Grade UI / UX
- Designed specifically for the student demographic with high-density, dark-mode elegance inspired by Whop and Raycast.
- **Explore Feed**: Filter by *Chrome Extensions, AI Prompts, Study Packs, Code & Scripts, Micro-SaaS*.
- **Student Locker (`@me`)**: Hub storing all purchased software, 1-click license key copy, and direct asset download links.
- **Creator Studio**: Enables any student to list a digital product in 2 minutes, featuring an **AI Polish** button to generate marketing copy and tags.
- **Order History & Receipts**: Complete audit trail showing transaction IDs, PayPal Capture IDs, and timestamped purchase receipts.

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
git clone https://github.com/your-username/araxie.git
cd araxie
npm install
```

### 2. Environment Configuration (Optional)
The application includes a pre-configured, resilient **PayPal Sandbox Test Mode** that works out-of-the-box with zero configuration required.

If you wish to test with your personal PayPal Developer sandbox credentials, create a `.env.local` file:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the PayPal Sandbox Flow (For Judges)

1. **Browse or Inquire**:
   - Open the app and click **"Ask AI"** or select a sample prompt (e.g. *"Sophomore CS student, budget $20"*).
   - Observe the AI evaluate the catalog, apply an asymptotic bundle discount, and generate an order.
2. **Execute Checkout**:
   - Click **"Pay with PayPal"**.
   - Review the order breakdown and click the **"PayPal Sandbox"** button.
3. **Inspect Real-Time Capture & Payout**:
   - Watch the transaction complete with celebratory confetti.
   - Note the generated PayPal Capture ID and cryptographic student license key (`ARX-XXXX-XXXX-2026`).
   - Notice the status message confirming real-time payout dispatch to the student creator(s).
4. **Access the Locker (`@me`)**:
   - Switch to **@me Locker** to copy the license key, access tool downloads, and inspect past PayPal receipts in the **Orders** ledger.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
