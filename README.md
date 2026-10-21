<div align="center">

<img src="assets/banner.svg" alt="HostelPay AI — split hostel expenses fairly, settle in seconds" width="100%"/>

<br>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-22C55E?style=for-the-badge)](#-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-8B5CF6?style=for-the-badge&logo=github)](https://github.com/sujitkr268/Hostel-Pay-AI/pulls)

<br>

### 💸 Split hostel expenses fairly. Settle in seconds.

🧪 **100% demo-safe** — realistic hostel data, simulated UPI payments, **no real money**. It all runs in your browser.

</div>

---

## 🎬 See it work

<img src="assets/flow.svg" alt="Money flow: add expense → split engine → app state → debt graph → AI simplifier → settle up" width="100%"/>

<div align="center">

*One expense goes in… fair splits, clean debts and settled receipts come out. See the animated ₹ coin travel the pipeline.* 🪙

</div>

---

## ✨ What's inside

<img src="assets/features.svg" alt="Six animated feature cards: Smart Splits, AI Debt Fix, UPI-style Settle, AI Insights, Groups & Rooms, Saved in Browser" width="100%"/>

<details>
<summary><small>📖 prefer text? read the six cards here</small></summary>

- 🍰 **Smart Splits** — equal, exact or percent splits with penny-perfect remainders
- 🧹 **AI Debt Fix** — collapses the who-owes-whom web into the fewest fair transfers
- 💸 **UPI-style Settle** — scan the QR, copy the UPI ID, get a receipts ledger
- 📊 **AI Insights** — spend trends per category + personalized saving tips
- 🏠 **Groups & Rooms** — Room 204, invite codes, spend & your share at a glance
- 💾 **Saved in Browser** — refresh-proof localStorage state, one-tap Reset Demo Data

</details>

---

## 🤖 The magic trick 🔮

A month ends with *"Saan owes Sujit ₹430, Prakalpa owes Saan ₹180, Garvit owes someone something…"* 😵‍💫

**One tap** on the Settlement page → and `lib/expenseSplitter.js` runs a greedy **min-cash-flow** pass that turns the tangle into **just 3 direct payments**. Same balances. Zero circular drama. ✅

---

## 🚀 Run it locally

```bash
git clone https://github.com/sujitkr268/Hostel-Pay-AI.git
cd Hostel-Pay-AI
npm install
npm run dev        # → http://localhost:3000
```

<div align="center">

🔓 Sign in with **any credentials** — the login screen is part of the demo.

</div>

---

## 🧪 Fun things to try

1. ➕ Add a **₹583** expense → watch the leftover penny get dropped fairly
2. 💸 Simulate a **UPI settle** → balances and statuses flip instantly
3. 🤯 Tangle up some debts → hit the **AI fix** → watch 5 payments become 3
4. 🔥 Break Room 204? **Reset Demo Data** from Profile — good as new

---

## 🗺 What's next

- [ ] 🔌 Real UPI deep-links (Razorpay / Cashfree)
- [ ] 🔥 Firebase / Supabase multi-user sync
- [ ] 📱 PWA offline mode
- [ ] 📈 Monthly insights PDF export

---

## 🤝 Contributing

Fork → branch → PR. It's a small, friendly Next.js codebase to hack on. 🙌

<details>
<summary>📂 curious peek at the project layout</summary>

```
app/        → Next.js routes (dashboard, groups, add-expense, settle, ai-insights, profile, login)
components/ → UI shells, sidebar, toasts & modals (payment, QR, create group)
context/    → AppContext — global state + localStorage persistence
data/       → seeded demo data for Room 204, Tagore Hostel
lib/        → split math + AI debt simplifier
assets/     → this README's SVG art
```

</details>

## 🔐 License

MIT © Sujit Kumar

---

<div align="center">

**HostelPay AI** — *Split hostel expenses fairly. Settle in seconds.*

⭐️ Star this repo if it saved you from a *"tu ye nahi dete kya?"* argument

</div>
