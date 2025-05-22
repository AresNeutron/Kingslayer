# ♟️ Kingslayer — Fully Custom Chess Engine & UI

**Kingslayer** is a fully self-built chess web application, developed from scratch without relying on external APIs or engines. Every component — from the chess engine logic to the frontend interface — is handcrafted and included in this repository. This project is a testament to full-stack engineering, combining clean architecture, interactive UI, and optimized logic.

---

## 🚀 Tech Stack

### 🔧 Backend

* **Language:** Python
* **Framework:** FastAPI
* **Chess Engine Logic:**

  * Built on **bitboards**, following principles used in high-performance engines like Stockfish and Komodo.
  * Implements the **Negamax** algorithm, a refined variant of minimax, designed to simulate strong opponent moves. The engine mimics alpha-beta pruning performance without using third-party libraries.

### 🎨 Frontend

* **Framework:** Next.js
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Interactivity Features:**

  * Responsive and interactive chessboard that highlights **legal moves** upon piece selection.
  * Clear feedback for **check**, **checkmate**, and threats to the king, delivering an intuitive and immersive user experience.

---

## 🧠 Project Philosophy

This project is a commitment to hands-on software craftsmanship. Every line of code was written with intent — proving it's possible to build a complete chess system (engine, rules, and UI) without shortcuts, external dependencies, or copy-pasted solutions. It’s about owning every part of the codebase.

---

## ⚙️ System Architecture

```text
┌───────────────────────────┐
│        Frontend           │
│   (Next.js + Tailwind)    │
└───────┬────────┬──────────┘
        │        │
        ▼        ▼
  Board Rendering   UI Interaction
        │                │
        └─────► API ◄────┘
             (FastAPI)
                ▲
                │
    ┌───────────┴───────────┐
    │      Chess Engine     │
    │ (Bitboards + Negamax)│
    └───────────────────────┘
```

---

## 🕹️ Features

* ♛ 100% custom chess engine, with no use of third-party chess libraries.
* ♚ Legal move generation and real-time check/checkmate detection.
* ♞ Visual display of threats targeting the king.
* ♟️ Smooth gameplay with immediate visual feedback.
* 🛠️ Clean, modular codebase ready for future upgrades (e.g. multiplayer mode, difficulty levels, mobile support).

---

## 📦 Current Status

✅ MVP completed
🚧 Next steps: production deployment, graphic enhancements, multiplayer mode

---

## 🧑‍💻 Author

Developed with passion by AresNeutron, as part of a personal journey in self-improvement through technical mastery and creativity. 
Of course, it's worth to mention the assistance of AI tools, in this case ChatGPT and Gemini, which helped to clarify ideas,
debug logic, and refine the overall design and documentation. Credit where credit is due — AI deserves recognition too.

---

Ready to challenge a chess engine that you can actually understand and control? Welcome to **Kingslayer**.
