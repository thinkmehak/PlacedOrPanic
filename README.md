<div align="center">

# 🎯 PlacedOrPanic
### *Beat the clock, crack the code, secure the package.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-10b981.svg?style=for-the-badge)](#)
[![Design: Clay + Skeuo](https://img.shields.io/badge/UI%20Design-Claymorphism%20%2B%20Skeuomorphism-6366f1.svg?style=for-the-badge)](#)
[![Stack: Vanilla Web](https://img.shields.io/badge/Architecture-100%25%20Client--Side-f59e0b.svg?style=for-the-badge)](#)

<br/>

<p align="center">
  <b>A hyper-responsive, interactive frontend exam simulation engine tailored for campus placement aptitude screening and technical rounds — featuring realistic countdown timers, tactile hardware switchboards, panic-state triggers, and automated instant scorecards.</b>
</p>

[Explore Topics](#-quiz-topics) • [UI Architecture](#-design-dna-claymorphism--skeuomorphism) • [Live Engine Mechanics](#-features--engine-mechanics) • [Roadmap](#-upcoming-features-coming-soon)

---

</div>

<br/>

## ⚡ The Placement Dilemma

Every engineering graduate knows the feeling: you know the concept, but the placement portal timer is ticking down with 90 seconds left, negative marking is lurking, and the questions keep coming.

**PlacedOrPanic** is designed to eliminate that exam-day paralysis. By recreating high-stakes countdown conditions with instant automated scoring, accuracy tracking, and clear explanations, students master both speed and accuracy before stepping into interview test rooms.

<br/>

---

## 🎨 Design DNA: Claymorphism + Skeuomorphism

PlacedOrPanic features a hybrid design system that blends physical tactile realism with inflatable 3D depth:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PLACED OR PANIC UI                            │
├──────────────────────────────────┬─────────────────────────────────────┤
│      CLAYMORPHISM LAYER          │        SKEUOMORPHISM LAYER          │
│  • Puffy 3D dual-shadow cards    │  • Realistic metallic chassis rims  │
│  • Soft inflatable pill buttons  │  • Dark gauge glass chronometer     │
│  • Rounded pastel elevated pads  │  • Physical keypad switchboard      │
│  • Organic floating micro-states │  • Pulsing LED status indicators    │
└──────────────────────────────────┴─────────────────────────────────────┘
```

> **Design Modularity**: All styles are strictly divided into standalone files ([`css/theme-claymorphism.css`](./css/theme-claymorphism.css) and [`css/theme-skeuomorphism.css`](./css/theme-skeuomorphism.css)) so you can modify or switch design themes effortlessly.

<br/>

---

## 📚 Quiz Topics

| Topic | Focus Areas | Question Type | Format |
| :--- | :--- | :--- | :--- |
| **🧮 General Aptitude** | Speed-Distance, Time & Work, Profit/Loss, Probability, Permutations, Number Series | Quantitative MCQs | 10 Mins • Timed |
| **💻 Basic C Programming** | Pointers, Dynamic Memory (`free`/`malloc`), Sequence Points, Recursion, Formats | Code Snippets & Concepts | 10 Mins • Timed |
| **🖥️ Computer Fundamentals** | OSI 7 Layers, Deadlock Coffman Conditions, DBMS ACID, CPU Registers, Thrashing | Theoretical & Systems MCQs | 10 Mins • Timed |
| **🌐 Web Basics** | CSS Box Model (`border-box`), HTTP Status Codes, JS Microtask Queue, `Object.freeze` | Frontend Architecture MCQs | 10 Mins • Timed |

<br/>

---

## 🛠️ Features & Engine Mechanics

### ⏱️ Skeuomorphic Countdown Chronometer & "Panic Mode"
- Live digital clock encased in a tinted glass screen with reflective highlights.
- **Dynamic Panic Trigger**: When time dips below **2 minutes**, the timer turns crimson and starts pulsing with a subtle warning shake.

### 🎛️ Tactile Question Navigation Switchboard (Palette)
- Jump to any question instantly with keyboard-styled tactile push buttons.
- Color-coded hardware states:
  - ⚪ **Unvisited**
  - 🔵 **Visited & Unanswered**
  - 🟢 **Confirmed Answered**
  - 🟡 **Marked for Review (Panic Tag)**
  - 🔰 **Answered & Marked for Review**

### 📊 Instant Automated Test Evaluation
- Negative marking evaluation: `+4` for correct, `-1` for incorrect, `0` for unattempted.
- Calculates:
  - **Total Score** (Raw & Scaled)
  - **Accuracy Percentage** (`[Correct / Attempted] * 100`)
  - **Time Taken** (Minutes & seconds utilized)
- **Placement Status Verdict**:
  - 💼 **PLACED!** (≥ 75%) — *Interview Shortlist Cleared!*
  - ⚠️ **BORDERLINE** (50% - 74%) — *Cutoff Met, Accuracy Needs Work*
  - 🚨 **PANIC MODE!** (< 50%) — *Revision & Drill Practice Required*
- **Detailed Question Explanations**: Review all question breakdowns with placement hints and rationales.

<br/>

---

## 🚀 Upcoming Features (Coming Soon)

We've built native teasers and coming-soon badges right into the interface for our next semester rollout:

- [ ] 🤖 **AI Placement Mock Interviewer** — Interactive verbal/chat viva evaluation.
- [ ] 🌳 **DSA Mastery Module** — Dynamic Programming, Trees & Graph algorithmic MCQs.
- [ ] 📝 **Custom Question Paper Builder** — Allows college clubs and professors to configure custom quizzes with custom negative marking.
- [ ] ⚡ **Panic Speedrun Mode** — 30-second rapid fire per question with audible countdown heartbeat.
- [ ] 📥 **Verified Placement PDF Certificate** — Instant exportable scorecard report card for resumes.

<br/>

---

## 📁 Repository Structure

```tree
PlacedOrPanic/
├── index.html                     # Semantic HTML5 application shell & screens
├── package.json                   # Project metadata & convenience scripts
├── IMPLEMENTATION_PLAN.md         # Full architectural design document
├── README.md                      # Documentation & showcase
├── css/
│   ├── base.css                   # Variables, typography (Outfit & Space Grotesk), layout
│   ├── theme-claymorphism.css     # Puffy 3D depths, soft inset/drop shadows
│   ├── theme-skeuomorphism.css    # Metallic bezels, inset grooves, glass chronometer
│   ├── components.css             # Grid layouts, option cards, palette switchboard, scorecard
│   └── coming-soon.css            # Tactile upcoming feature badges & interactive teasers
├── js/
│   ├── questions.js               # Placement MCQ question bank (Aptitude, C, OS/Networks, Web)
│   ├── quizEngine.js              # State machine: timer, palette mapping, scoring logic
│   ├── storage.js                 # LocalStorage persistence for recent attempts
│   └── app.js                     # View orchestrator, modal handlers & event listeners
└── assets/                        # Icons and graphic resources
```

<br/>

---

## ⚡ Quick Start (Zero Dependencies Required)

Because **PlacedOrPanic** is built on pure modular web standards without heavy backend dependencies, you can run it anywhere instantly:

### Option 1: Direct in Browser
Simply double-click `index.html` or open it with any modern browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 2: Local Dev Server (Optional)
```bash
# Using Node
npx serve .

# Using Python
python -m http.server 3000
```

<br/>

---

## 🤝 Contributing

Contributions to question banks, new subjects, or tactile UI themes are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewPlacementTopic`)
3. Commit your Changes (`git commit -m 'Add DBMS & SQL Question Bank'`)
4. Push to the Branch (`git push origin feature/NewPlacementTopic`)
5. Open a Pull Request

<br/>

---

<div align="center">

Crafted with ❤️ for students preparing for placements.  
*Remember: Don't panic, get placed!*

</div>
