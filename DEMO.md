# Araxie — Evaluation & Demonstration Guide

This guide provides hackathon evaluators with instructions for verifying **Araxie** across all key technical dimensions: **PayPal Developer Platform integration**, **Server-Side Price Integrity**, **Agentic Commerce (Google Gemini 2.5 Flash)**, **Creator Studio & Payout Rails**, and **Production Security & Abuse Defenses**.

---

## 🌐 Live Deployments & Endpoints

- **Production URL**: [https://araxie.vercel.app](https://araxie.vercel.app)
- **GitHub Repository**: [https://github.com/Alqaasimee-jr2/araxie](https://github.com/Alqaasimee-jr2/araxie)
- **License Verification API**: `GET https://araxie.vercel.app/api/licenses/verify?key={licenseKey}`
- **PayPal Webhook Listener**: `POST https://araxie.vercel.app/api/paypal/webhook`
- **AI Health & Rate Limit Telemetry**: `GET https://araxie.vercel.app/api/ai/status`

---

## ⚡ 1-Click Evaluator Access & Personas

Judges do not need to copy and paste passwords:

1. Click **"Sign In"** in the navigation bar (or **"Join with Campus ID"** on the hero banner).
2. Click **"⚡ One-Click Hackathon Evaluator Sign-In"** in the modal.
3. You are instantly authenticated as the pre-seeded student evaluator!

### Pre-Seeded Evaluation Accounts:

| Persona | Email | Password | Role & Pre-Seeded State |
| :--- | :--- | :--- | :--- |
| **Student Evaluator (Buyer)** | `judge.sandbox@araxie.edu` | `PayPalHackathon2026!` | Stanford '26 verified student profile. Pre-configured with active locker items, verified PayPal transaction receipts, and purchase history. |
| **Student Developer (Creator)** | `creator.sandbox@araxie.edu` | `PayPalHackathon2026!` | MIT '25 verified creator profile. Author of *AlgoVisualizer Pro*. Pre-seeded with sales balance, 95% creator payout ledger, and publishing tools. |

---

## 🧪 Comprehensive Evaluation Walkthrough

### Walkthrough 1: Autonomous Agentic Commerce (AI Concierge)
1. Navigate to the marketplace storefront at [https://araxie.vercel.app](https://araxie.vercel.app).
2. Click **"AI Concierge"** in the navigation bar or click the prompt bar in the hero banner.
3. Submit an academic goal or scenario, such as:
   - *"Sophomore CS student taking algorithms and web dev with a $20 budget."*
   - *"Pre-med student studying for MCAT and organic chemistry."*
   - Or click any of the quick prompt suggestion pills.
4. **Observe the Agentic Workflow**:
   - The AI Concierge parses requirements, retrieves matching student-built tools, and applies Araxie's **capped logarithmic bundle discount model**:
     $$\delta(k) = \min\left(0.25, \; 0.12 \cdot \ln(1 + k)\right)$$
   - Yields ~13% discount at $k=2$, ~17% at $k=3$, reaching the 25% cap at $k=8$.
   - **Deterministic Fallback**: If Gemini encounters an upstream quota blip (HTTP 429), the concierge automatically falls back to deterministic semantic scoring so the checkout proposal never dead-ends.

---

### Walkthrough 2: Server-Side Price Integrity & PayPal Orders v2 Checkout
1. Select any tool from the Explore catalog or accept a curated bundle from the AI Concierge.
2. Click **"Proceed to PayPal Checkout"** or **"Buy with PayPal"**.
3. **Server-Side Price Integrity**:
   - The client never dictates the transaction total. When creating the order (`POST /api/paypal/create-order`), the server validates product IDs against the official database and recomputes the exact cart total and discount percentage.
4. Click **"PayPal"** to execute the checkout:
   - **Order Creation**: Invokes PayPal REST Orders v2 API (`POST /v2/checkout/orders`) with payment intent `CAPTURE`.
   - **Order Capture & Idempotency**: Invokes `POST /v2/checkout/orders/{id}/capture`. Replaying the same order ID returns the existing settled transaction without charging or paying creators twice.
   - **Amount Integrity Verification**: Compares the settled PayPal amount with the server-expected total to prevent client-side price tampering.
   - **HMAC Cryptographic License Generation**: Generates a verifiable license key (`ARX-{PROD}-{TIMESTAMP}-{HMAC}`) signed with HMAC-SHA256.
   - **Instant Provisioning**: The purchased tool is immediately unlocked in the user's **Student Locker (`@me`)**.

---

### Walkthrough 3: Cryptographic License Verification API
To verify the authenticity of any issued license key:
1. Open the receipt in **Orders** or copy any license key from your **Locker**.
2. Query the verification endpoint:
   ```bash
   curl "https://araxie.vercel.app/api/licenses/verify?key=ARX-FLOW-XXXX-XXXX"
   ```
3. The server validates the cryptographic HMAC signature and returns the associated order status, product name, and issuance timestamp.

---

### Walkthrough 4: In-Browser Interactive Tool Execution
Araxie provides full in-browser tool previews for verified campus software without requiring local installation:
1. Click **"Preview"** on any eligible card in the catalog, or open an unlocked tool from your **Locker**.
2. Available interactive environments:
   - **Flow7 (Performance Awareness Layer)**: Live calm work session stopwatch, 4 cognitive focus domains (*Deep Work*, *Academic Research*, *Architecture*, *Problem Sets*), real-time 7-day cognitive load heatmap (39.2 hrs total matrix), objective session ledger, and 1-click Markdown timesheet exporter (`.md`).
   - **CI-Guardian (Pre-Flight AST Gate)**: Interactive syntax AST security scanner detecting hardcoded secrets, `eval()` vulnerabilities, and unthrottled routes with SARIF 2.1.0 report generation and `npx ci-guardian` zero-config runner.
   - **CanvasAutoPilot**: Chrome extension simulator tracking Canvas LMS deadlines, GPA forecast curves, and 1-click `.ics` calendar sync.
   - **AlgoVisualizer Pro**: Interactive step-by-step pathfinding visualizer (Dijkstra and A* algorithm matrix).
   - **Academic Writing Studio**: Scholarly prompt transformer converting research notes into formal APA/IEEE citations using Gemini 2.5 Flash.

*(Note: Cards without a working browser runner cleanly hide the preview button to prevent misleading or broken interfaces.)*

---

### Walkthrough 5: Creator Studio & PayPal Payouts v1 API
1. Sign in as `creator.sandbox@araxie.edu` and open **Creator Studio**.
2. **Transparent Financial Model**:
   - Araxie creators receive **95% of the net captured amount** per product (pro-rated if sold within a multi-tool bundle), with Araxie retaining a 5% platform fee.
3. **Idempotent PayPal Creator Payouts**:
   - Click **"Disburse Payout to PayPal"**.
   - Invokes PayPal Payouts REST API v1 (`POST /v1/payments/payouts`) with a deterministic `sender_batch_id` (`arx_batch_{orderId}_{creatorEmailHash}`).
   - PayPal's payout engine enforces idempotency so retries cannot duplicate disbursements.
4. **Publishing a New Tool with AI Polish**:
   - In Creator Studio, navigate to **"Publish New Student Tool"**.
   - Enter a title and category (e.g., *"Notion Syllabus Importer"*, *"Chrome Extensions"*).
   - Click **"✨ Polish with Gemini"** to generate collegiate descriptions, feature lists, and recommended student pricing.

---

## 🛡️ Security, Rate Limiting & Anti-Abuse Defenses

1. **Server-Side Price Integrity (`src/lib/pricing.ts`)**:
   - Model outputs and client payloads are never trusted with pricing. All cart calculations and pro-rated creator payouts are computed strictly on the backend.
2. **Deterministic Payout Batching (`src/lib/paypal.ts`)**:
   - Uses deterministic `sender_batch_id` and unique order tracking in the database to prevent duplicate payouts or wash trading.
3. **Gemini Free-Tier Budget Protection (`src/lib/geminiRateLimiter.ts`)**:
   - Enforces 8 RPM, 200 requests/day, and per-IP throttling with an LRU cache (1-hour TTL) to eliminate redundant API consumption and protect against quota overages.
4. **Content-Security-Policy & Security Headers (`next.config.ts`)**:
   - Full `Content-Security-Policy` header restricting script, style, frame, and connect sources to trusted endpoints (PayPal, Supabase, Google AI, GitHub).
   - `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.
5. **Verified Buyer Review Guard (`src/app/api/reviews/route.ts`)**:
   - Cross-checks student review submissions against the actual captured order ledger before awarding "Verified Buyer" standing.

---

## 🧪 Automated Unit Testing & CI Gate

Araxie includes an automated test suite verifying pricing calculations, discount math, and cryptographic license signatures.

Run tests locally:
```bash
npm test
```

Expected output:
```
✔ Server-Side Price Integrity & Capped Logarithmic Discount Model (8 tests passing)
✔ Cryptographic HMAC License Key Generation & Verification
```
A GitHub Actions CI workflow (`.github/workflows/ci.yml`) runs on every commit, executing unit tests, CI-Guardian AST security checks, and Next.js production builds.
