# Araxie — Evaluation & Demonstration Guide

This guide provides hackathon evaluators with instructions for verifying **Araxie** across all key technical dimensions: **PayPal Developer Platform integration**, **Agentic Commerce (Google Gemini 2.5 Flash)**, **Creator Studio & Payout Rails**, and **Production Security & Abuse Defenses**.

---

## 🌐 Live Deployments & Endpoints

- **Production URL**: [https://araxie.vercel.app](https://araxie.vercel.app)
- **GitHub Repository**: [https://github.com/Alqaasimee-jr2/araxie](https://github.com/Alqaasimee-jr2/araxie)
- **AI Health & Rate Limit Telemetry**: `GET https://araxie.vercel.app/api/ai/status`

---

## 👥 Evaluator Test Personas

Araxie supports real user sign-ups via email and Google OAuth (powered by Supabase Auth). For testing without needing to create new accounts from scratch, the following sandbox personas are pre-seeded in the database:

| Persona | Email | Password | Role & Pre-Seeded State |
| :--- | :--- | :--- | :--- |
| **Student Evaluator (Buyer)** | `judge.sandbox@araxie.edu` | `PayPalHackathon2026!` | Stanford '26 verified student profile. Pre-configured with active student locker items, past PayPal order receipts, and verified purchase status to test review submissions. |
| **Student Developer (Creator)** | `creator.sandbox@araxie.edu` | `PayPalHackathon2026!` | MIT '25 verified creator profile. Author of *AlgoVisualizer Pro*. Pre-seeded with live sales balance, 95% creator payout ledger, and creator publishing capabilities. |

> **Self-Service Accounts**: You can also register any new student account using the **Sign Up** tab in the authentication modal (e.g., `evaluator@university.edu`).

---

## 🧪 Comprehensive Evaluation Walkthrough

### Walkthrough 1: Autonomous Agentic Commerce (AI Concierge)
1. Navigate to the marketplace home page at [https://araxie.vercel.app](https://araxie.vercel.app).
2. Click **"Ask AI"** in the navigation bar or use the search prompt bar on the hero banner.
3. Submit an academic goal or scenario, such as:
   - *"Sophomore computer science student taking data structures and algorithms with a $20 budget."*
   - *"Pre-med student studying for MCAT and biochemistry."*
   - Or click any of the suggested student persona pills.
4. **Observe the Agentic Workflow**:
   - The AI Concierge parses the requirements, retrieves matching student-built tools from the catalog, and applies Araxie's **asymptotic bundle discount formula**:
     $$\delta(k) = \min\left(0.25, \; 0.12 \cdot \ln(1 + k)\right)$$
   - The agent outputs an itemized proposal with total savings and creates a 1-click PayPal checkout order ready for immediate settlement.

---

### Walkthrough 2: PayPal Developer Platform Checkout (Orders v2 API)
1. Select any tool from the Explore feed (e.g., *CanvasAutoPilot Chrome Extension* or an Anki study pack) or use the bundle from the AI Concierge.
2. Click **"Pay with PayPal"** (or add items to the cart and proceed to checkout).
3. The native PayPal Checkout Modal displays an itemized receipt with the campus license, subtotal, bundle discounts, and total.
4. Click the **"PayPal Sandbox"** button to execute the transaction:
   - **Order Creation**: The backend calls PayPal REST API v2 (`POST /v2/checkout/orders`) with payment intent `CAPTURE`.
   - **Payment Capture**: On confirmation, the backend invokes `POST /v2/checkout/orders/{id}/capture`.
   - **License Key Issuance**: Upon successful capture, Araxie generates an immutable, cryptographically verifiable student license key (`ARX-STUDENT-XXXX-XXXX-2026`).
   - **Instant Provisioning**: The purchased tool is immediately unlocked and provisioned into the user's **Student Locker**.

---

### Walkthrough 3: In-Browser Interactive Tool Execution
1. Open the **"Locker"** tab in the navigation bar (or mobile bottom navigation).
2. Locate any unlocked tool in your collection (such as *AlgoVisualizer Pro*, *CanvasAutoPilot*, or the *Academic Writing Studio*).
3. Click **"Launch Tool"**:
   - The tool runs in an interactive sandbox workspace directly within the browser.
   - For example, the **Academic Writing Studio** allows you to input raw text, select citation styles (APA, MLA, IEEE, Chicago), and execute live AI academic transformations using Gemini 2.5 Flash.

---

### Walkthrough 4: Verified Student Ratings & Closed-Loop Reviews
1. Open any tool detail drawer from the marketplace feed or locker.
2. Scroll to the **"Verified Student Reviews"** section.
3. If logged into a student account that owns the tool, the submission form unlocks:
   - Select a star rating (1–5 stars).
   - Enter a course tag (e.g. `CS 161`, `BIO 101`) and a peer review.
   - Click **"Submit Verified Review"**.
4. The review is instantly sanitized, validated against malicious payloads, and saved to the database. The product's overall rating and review count recalculate in real time.

---

### Walkthrough 5: Creator Studio & Automated PayPal Payouts (Payouts v1 API)
1. Sign in as `creator.sandbox@araxie.edu` (or click **"Creator"** in the navigation).
2. **Creator Financial Hub**:
   - Inspect the real-time financial ledger: Gross Revenue, 5% Araxie Platform Fee, and **95% Net Creator Earnings**.
3. **Instant PayPal Creator Payouts**:
   - Click **"Disburse Payout to PayPal"**.
   - The platform calls the **PayPal Payouts REST API v1** (`POST /v1/payments/payouts`) with an idempotent sender batch ID.
   - The payout executes on PayPal sandbox rails, returning a live PayPal Batch Status (`SUCCESS` / `PENDING`) and updating the creator's payout history.
4. **Publishing a New Tool with AI Polish**:
   - In Creator Studio, navigate to **"Publish New Student Tool"**.
   - Enter a title and category (e.g. *"Notion Syllabus Importer"*, *"Chrome Extensions"*).
   - Click **"✨ Polish with Gemini"**.
   - Gemini 2.5 Flash generates an optimized academic tool description, feature tags, and recommended student pricing.
   - Click **"Publish to Marketplace"** to publish the tool to the live feed.

---

## 🛡️ Security, Rate Limiting & Anti-Abuse Defenses

Araxie includes defense-in-depth measures against malicious inputs, automated abuse, and quota exhaustion:

1. **AI Prompt Injection & Jailbreak Defense (`src/lib/security.ts`)**:
   - All inbound queries to the AI Concierge, Academic Engine, and Creator Studio are inspected for prompt injection attempts, system prompt exfiltration directives, and delimiter manipulation (e.g. `ignore previous instructions`, `DAN mode`, `reveal secret keys`).
   - Flagged queries are safely deflected into helpful academic guidance without failing or exposing internal instructions.
2. **Gemini Free-Tier Credit Protection (`src/lib/geminiRateLimiter.ts`)**:
   - Strictly enforces limits well below Google AI's free-tier threshold:
     - Global rate limit: **8 RPM** (Free tier allows 15 RPM).
     - Daily hard budget cap: **200 requests/day** (Free tier allows 1,500 RPD).
     - Per-IP rate limit: **4 requests/min**.
   - Implements an LRU memoization cache (1-hour TTL) for common academic queries to eliminate redundant API consumption.
   - Automatic circuit breaker trips if an upstream HTTP 429 is encountered, preserving API quota.
   - Live health status can be queried at `/api/ai/status`.
3. **XSS & Input Sanitization**:
   - User reviews, course codes, and product submissions undergo strict sanitization stripping HTML tags, JavaScript event handlers (`onerror=`, `<script>`), and null-byte injection.
   - Review comments are length-bounded (max 400 characters) and rate-limited (max 4 reviews/min per client IP).
4. **HTTP Security Headers (`next.config.ts`)**:
   - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking).
   - `X-Content-Type-Options: nosniff` (prevents MIME sniffing).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
