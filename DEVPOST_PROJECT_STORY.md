# Araxie — The Student Digital Economy

> An online marketplace where student builders can sell the study tools, extensions, and code they build, paired with an AI assistant that bundles tools to save students money, and instant PayPal checkout that pays creators 95% of every sale.
>
> 🌐 **Live Demo**: [https://araxie.vercel.app](https://araxie.vercel.app)  
> 💻 **GitHub**: [https://github.com/Alqaasimee-jr2/araxie](https://github.com/Alqaasimee-jr2/araxie)

---

## 💡 Inspiration

If you walk into any computer lab, dorm room, or campus library during finals week, you will see students using tools made by other students:
- A Chrome extension someone wrote overnight to scrape Canvas and put assignment due dates onto Google Calendar.
- A quick Python script that checks code for secrets before uploading homework to GitHub.
- An interactive web app to help friends visualize Dijkstra and A* pathfinding algorithms for tech interviews.
- Super-organized Anki flashcard decks put together by top pre-med or law students.

These tools are genuinely helpful and save people dozens of hours every semester. But almost every single one of them gets shared once in a WhatsApp group or Discord server, and then disappears.

The student developers who spend nights building these tools have no simple way to sell them or earn side income. Meanwhile, other students waste hours searching for tools that actually work, or end up paying expensive monthly subscriptions for generic commercial apps that don't fit campus life.

We built **Araxie** to fix this. We wanted to build a simple campus marketplace where student creators can publish their tools in minutes, buyers can ask an AI assistant for recommendations within their student budget, and payments go straight to the creator's PayPal account with almost zero friction.

---

## ⚡ What It Does

1. **Talk to the AI Concierge**:  
   Instead of browsing through dozens of items, students can just tell the AI what they need in plain English:  
   *"I'm a sophomore taking Algorithms and Web Dev, and I only have $20 to spend."*  
   The AI (powered by Google Gemini 2.5 Flash) picks the right tools from the catalog and bundles them together at a discount.

2. **Try Tools in the Browser Before Buying**:  
   Nobody likes buying software without knowing if it works. Students can test out real interactive tools directly inside the website without installing anything:
   - **Flow7**: A quiet focus timer with a 7-day study heatmap and exportable notes.
   - **CI-Guardian**: A code scanner that catches leaked API keys and unsafe code.
   - **CanvasAutoPilot**: A preview of the Chrome extension that tracks class deadlines and predicts grades.
   - **AlgoVisualizer Pro**: A step-by-step interactive maze runner showing Dijkstra and A* algorithms.
   - **Academic Writing Studio**: A research tool that formats notes into clean academic citations.

3. **Safe Checkout with PayPal**:  
   Students can pay in seconds using PayPal. Every license key is digitally signed with HMAC-SHA256, so buyers immediately unlock the tool in their private Student Locker and creators know the purchase is real.

4. **Creators Keep 95%**:  
   Most app stores take 30% or more. Araxie gives student creators **95% of every sale**, taking only a small 5% platform fee to keep servers running. Creators can click one button in their dashboard to send their earnings directly to their PayPal account via PayPal Payouts.

5. **Built Around Campus Rules and Privacy**:  
   Araxie respects student privacy. Tools like calendar syncers store tokens strictly inside the user's browser (never on our backend), keeping us aligned with student privacy guidelines (FERPA). We also enforce a strict Honor Code that bans cheating tools or exam bypasses.

---

## 📐 How the Math Works

### 1. Bundle Discounts

When students buy more than one tool together, they get a discount. But instead of random guesses, we used a smooth logarithmic curve. It gives students a nice reward for buying bundles while keeping prices fair for creators:

$$\delta(k) = \min\left(0.25, \; 0.12 \cdot \ln(1 + k)\right)$$

Here:
- $k$ is the number of tools in the cart.
- $\ln$ is the natural logarithm.
- The discount tops out at a maximum of $25\%$.

What this means in practice:
- **1 item ($k=1$)**: Full price ($0\%$ discount).
- **2 items ($k=2$)**: $0.12 \cdot \ln(3) \approx 13\%$ off.
- **3 items ($k=3$)**: $0.12 \cdot \ln(4) \approx 17\%$ off.
- **8 items ($k=8$)**: $0.12 \cdot \ln(9) \approx 26.3\% \implies$ capped at the $25\%$ limit.

The final total price $P_{\text{final}}$ is:

$$P_{\text{final}} = \left( \sum_{i=1}^k p_i \right) \cdot (1 - \delta(k))$$

### 2. Fair Payouts for Creators

When a student buys a bundle of 2 or 3 tools, how do we split the money fairly between the different student creators?

We look at each item's normal list price $p_i$ as a fraction of the total:

$$w_i = \frac{p_i}{\sum_{j=1}^k p_j}$$

Each item gets its discounted share:

$$p_i' = P_{\text{final}} \cdot w_i$$

Then, each creator gets **95%** of their item's share sent to their PayPal:

$$\text{Creator Payout} = 0.95 \cdot p_i'$$

The remaining 5% is the platform fee:

$$\text{Platform Fee} = 0.05 \cdot p_i'$$

---

## 🛠️ How We Built It

- **Frontend**: Next.js 16 (App Router), React, and Tailwind CSS v4 for a clean, dark-mode design that feels fast and responsive.
- **AI Concierge**: Google Gemini 2.5 Flash, paired with a custom token bucket rate limiter and a keyword fallback system so the search never breaks even if an API limit is reached.
- **Payments**: PayPal Orders v2 REST API to create and capture purchases securely on the server.
- **Creator Payouts**: PayPal Payouts v1 REST API with unique batch IDs so creators get paid without any risk of double payouts.
- **License Keys**: Cryptographic HMAC-SHA256 signatures that generate unique license codes (like `ARX-FLOW-L8NZ9K-7A4B1C9F`) that buyers can verify at any time.
- **Testing**: 14 unit tests using Vitest covering pricing math, discount limits, license checks, and prompt safety.

---

## 🚧 Challenges We Faced

1. **Never Trusting the Client or the AI with Money**:  
   When using an AI model to build shopping carts, what happens if the AI hallucinates a price of $0.00, or a user modifies a request to say a $20 tool costs $1?  
   We made a strict rule: **The frontend and the AI are never allowed to set prices.** The client only sends product IDs. Our backend looks up verified catalog prices in the database, recalculates the logarithmic discount, and creates the PayPal order directly with PayPal's servers.

2. **Preventing Duplicate Payouts**:  
   When you send real money to multiple student creators through an API, network hiccups can cause requests to retry. If you're not careful, a creator might get paid twice for a single order.  
   We solved this by generating a unique, repeatable `sender_batch_id` using a hash of the order ID and creator's email:
   ```typescript
   sender_batch_id: `arx_batch_${orderId}_${creatorEmailHash}`
   ```
   PayPal checks this ID automatically and rejects any duplicate payment attempts.

3. **Protecting Student Privacy**:  
   We wanted students to be able to preview tools like CanvasAutoPilot, but educational data is sensitive (under laws like FERPA). We decided early on that student LMS tokens and calendar links must stay 100% inside the user's local browser storage. Nothing personal ever touches our servers.

---

## 🏆 Accomplishments That We're Proud Of

- **Real Working Demos**: You don't just read about tools; you can open Flow7 or CI-Guardian and run them right in your browser.
- **14 Passing Automated Tests**: We wrote unit tests that verify our discount math, test prompt injection protections, and ensure HMAC signatures can't be forged.
- **95% Goes to Students**: We built an honest payment flow where student builders take home almost all the revenue they generate.
- **1-Click Judge Sign-In**: Evaluators don't need to fill out forms or create new accounts. One click logs you in as a verified student buyer or creator with pre-loaded tools and order receipts.

---

## 📚 What We Learned

- **AI is great for talking, but bad at accounting**: Let the AI handle natural language recommendations, but let traditional, deterministic code do the math and handle the money.
- **Simplicity wins**: College students don't want a complicated setup. If getting a tool takes more than 60 seconds, they will just use a pirated PDF or an outdated Reddit thread. Simple PayPal checkout and in-browser previews make all the difference.
- **Idempotency is crucial in payments**: In software that moves money, you have to design every single API call around the assumption that the internet might drop out halfway through.

---

## 🚀 What's Next for Araxie

- **More Campuses**: Adding verified `.edu` and university email sign-ins for colleges around the world.
- **Semester Subscriptions**: Adding PayPal Subscriptions for study materials and question banks that update weekly throughout the term.
- **Command-Line Tool (`npx araxie`)**: Enabling student developers to publish developer CLI tools directly to Araxie, so buyers can run them locally with their license key in one terminal command.

---

### 🔗 Links
- **Live Website**: [https://araxie.vercel.app](https://araxie.vercel.app)
- **Source Code**: [https://github.com/Alqaasimee-jr2/araxie](https://github.com/Alqaasimee-jr2/araxie)
- **Evaluation Guide**: [DEMO.md](https://github.com/Alqaasimee-jr2/araxie/blob/main/DEMO.md)
