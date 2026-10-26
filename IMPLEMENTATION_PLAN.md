# PlacedOrPanic - Timed Multiple-Choice Quiz Management System
## Architectural & Implementation Plan

### 1. Executive Summary & Objective
**PlacedOrPanic** is a responsive, interactive, client-side frontend quiz assessment engine tailored for students preparing for campus placement aptitude rounds and technical exams. The project addresses self-assessment without requiring a backend server.

---

### 2. Analysis of Approaches & Optimal Feasible Solution

| Approach | Technology & Architecture | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Approach 1: Heavy Framework SPA (Next.js / SSR)** | Next.js with React + Tailwind | Component ecosystem | Heavy build dependencies, setup overhead for pure client-side requirement | Overkill for pure client-side quiz without backend |
| **Approach 2: Modern Bundled SPA (Vite + React/Vue)** | Vite + Modular ES6 | Fast build, modern bundling | Requires Node/bundler runtime | Viable, but adds runtime compilation requirements |
| **Approach 3: Pure Modular Web Architecture (HTML5 + Modular Vanilla JS + Modular CSS Tokens)** | Pure HTML5, Modular CSS Design System (Theme-separated), ES6 Modules | Zero installation friction, 100% portable, blazing fast performance, clean separation of claymorphism & skeuomorphism design files | Requires clean manual state management (which we implement cleanly) | **Best & Most Reliable** (Completely robust, immediately testable in any browser) |

**Chosen Feasible Solution:**
A clean modular frontend web application utilizing:
1. **Core**: Semantic HTML5 and modular JavaScript (`app.js`, `quizEngine.js`, `questions.js`, `storage.js`).
2. **Theme Architecture (Separated Design Files)**:
   - `css/base.css`: Reset, layout variables, typography (Outfit & Space Grotesk via Google Fonts).
   - `css/theme-claymorphism.css`: Soft, puffy inner/outer dual shadows, rounded pastel & modern card depths, inflatable buttons.
   - `css/theme-skeuomorphism.css`: Realistic tactile textures, glossy gradients, pressed inset grooves, metallic bezels, physical-switch toggles, glass lenses for the countdown timer.
   - `css/components.css`: Question palette, option selector cards, timer ring, score cards, modal overlays.
   - `css/coming-soon.css`: Badges, tooltips, and interactive teaser modals for upcoming features.
   This fulfills the requirement: **"make separate files for the themes so that if later on we need to change so we can change it from that css or design file."**

---

### 3. Detailed Component Architecture

- **Topic Selection Screen**:
  - General Aptitude
  - Basic C Programming
  - Computer Fundamentals
  - Web Basics
  - Upcoming Feature Badges: Custom Test Builder, AI Mock Interviewer
- **Interactive Quiz Screen**:
  - Tactile Countdown Timer (Skeuo/Clay Digital Clock)
  - Progress Tracker & Panic Meter
  - Option Selector Cards with Tactile Pressed Feedback
  - Question Navigation Palette & Mark-For-Review Toggle
- **Evaluation & Scorecard Screen**:
  - Automated Scorecard: Total Score, Accuracy %, Time Taken
  - Placement Verdict: 'Placed!' vs 'Panic!'
  - Category-wise Performance Radar
  - Action Buttons: Detailed Review, Retake, Export Scorecard

---

### 4. Core Features & Functional Requirements

1. **Topic Selector (4 Required Categories + Upcoming Topics)**:
   - General Aptitude (Speed & distance, syllogisms, logic, percentages)
   - Basic C Programming (Pointers, recursion, data types, operators, memory)
   - Computer Fundamentals (OS scheduling, DBMS ACID, Networking layers, CPU registers)
   - Web Basics (HTTP status codes, DOM lifecycle, CSS box model, JS event loop)
   - *Marked Upcoming*: DSA Mastery, Python for Placements, System Design Fundamentals.

2. **Interactive Quiz Engine**:
   - Live Countdown Timer with automatic submission on expiry.
   - Dynamic **Panic State Trigger**: Clock turns from calm metallic emerald/amber to high-contrast vibrating crimson pulse when `< 2 minutes` remain.
   - Question Progress: e.g., `Question 04 / 15`.
   - Tactile Option Selectors with instant selection state and clear unselect/change capability.

3. **Question Navigation Palette (Skeuomorphic Switchboard / Clay Pad)**:
   - Color-coded tactile status buttons:
     - ⚪ Unvisited
     - 🔵 Visited & Unanswered
     - 🟢 Answered / Confirmed
     - 🟣 Marked for Review
     - 🟡 Answered & Marked for Review
   - Jump directly to any question by clicking its pad node.
   - 1-click **"Mark for Review (Panic Tag)"** toggle button.

4. **Instant Automated Test Evaluation**:
   - **Total Score**: Scaled marking (+4 for correct, -1 or 0 for incorrect/unanswered customizable).
   - **Accuracy Percentage**: `(Correct / Attempted) * 100`.
   - **Time Taken**: Total test time minus remaining time formatted in `MM:SS`.
   - **Placement Status**:
     - `>= 75%`: 💼 *Offer Letter Unlocked! (Placed)*
     - `50% - 74%`: ⚠️ *Borderline Candidate (Round 2 Call)*
     - `< 50%`: 🚨 *Panic Mode! Revision Required*

5. **Upcoming Features (Marked with polished "Coming Soon" clay/skeuo badges)**:
   - 🕒 *Custom Time Attack Mode (Speedrun 30s per question)*
   - 📑 *Download PDF Placement Scorecard / Certificate*
   - 🤖 *AI Explanation Assistant (Instant hint on tricky MCQs)*
   - 👥 *Multiplayer Live Aptitude Battleground*
   - 📈 *Historical Progress & Weak Topic Heatmap*
