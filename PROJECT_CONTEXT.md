# 🎯 PlacedOrPanic - Comprehensive Project Knowledge Base & Context Handoff

> **Project Name**: PlacedOrPanic  
> **Repository**: [https://github.com/thinkmehak/PlacedOrPanic.git](https://github.com/thinkmehak/PlacedOrPanic.git)  
> **Live Production URL**: [https://placedorpanic.vercel.app/](https://placedorpanic.vercel.app/)  
> **Local Folder Path**: `C:\Users\Mehak Negi\Downloads\PlacedOrPanic`  
> **Author / Maintainer**: Mehak Negi  
> **Architecture**: 100% Client-Side Pure Web (Zero external backend dependencies)  
> **Current Version**: v1.2.0 (Post UX Polish, Sound Engine, and Dynamic Gatekeeper Verification)

---

## 1. Executive Summary & Problem Statement

### The Problem
Engineering graduates and college students preparing for campus placement screening rounds face acute anxiety and cognitive paralysis during timed multiple-choice assessments. Standard online practice tools either:
1. Lack realistic countdown pressure and panic-mode sensory simulation.
2. Force heavy login credentials or backend latency.
3. Lack tactile switchboards to flag tricky questions and navigate rapidly under time constraints.
4. Fail to provide instant, automated scorecards with negative marking calculations and tangible proof of completion (placement certificates).

### The Solution: PlacedOrPanic
**PlacedOrPanic** is a responsive, interactive, client-side frontend quiz assessment engine. It simulates real placement tests with active countdowns, skeuomorphic physical switchboards, tactile audio feedback, panic-state indicators, and automated instant scorecards with negative marking and downloadable verified certificates.

---

## 2. Design DNA & Aesthetic Philosophy

The design is a custom hybrid of **Claymorphism** and **Skeuomorphism**, structured into strictly separated CSS stylesheets to allow independent theme modifications:

### Theme Separation
- **[`css/base.css`](./css/base.css)**: Core resets, typography (Google Fonts: *Outfit*, *Space Grotesk*, and *JetBrains Mono*), CSS custom properties, and responsive container layout.
- **[`css/theme-claymorphism.css`](./css/theme-claymorphism.css)**: Soft, puffy 3D inner and outer drop shadows, inflatable pill badges, elevated pastel cards, and bouncy tactile buttons (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **[`css/theme-skeuomorphism.css`](./css/theme-skeuomorphism.css)**: Realistic tactile hardware textures, metallic rim bezels, dark tinted gauge screens with reflective glass lenses, push-key switchboard buttons, and pulsing red/green LED indicators.
- **[`css/components.css`](./css/components.css)**: Option cards, question counter, evaluation scorecard, and detailed question accordion.
- **[`css/coming-soon.css`](./css/coming-soon.css)**: Beta ribbons, upcoming feature badges, and interactive teaser modals.

---

## 3. Current Live Features & User Journey

### A. Landing Screen (`#screen-topic-select`)
1. **Hero Header**: High-impact brand typography, placement tagline, and clean minimalism.
2. **Core Topic Grid**: 4 fully loaded assessment categories with instant launch cards:
   - **🧮 General Aptitude**: Speed-distance-time, time & work, profit/loss, probability, permutations, and sequences.
   - **💻 Basic C Programming**: Pointers, dynamic memory allocation (`free`/`malloc`), sequence points, format specifiers, and recursion.
   - **🖥️ Computer Fundamentals**: OSI 7 layers, Coffman deadlock conditions, DBMS ACID, CPU program counter, and paging thrashing.
   - **🌐 Web Basics**: CSS box-model (`border-box`), HTTP status codes (401 vs 403), JS microtasks vs macrotasks, and `Object.freeze`.
3. **Upcoming Feature Teaser Cards**: Interactive cards for *DSA Mastery*, *Custom Quiz Builder*, and *Panic Speedrun*.

### B. Seamless Candidate Verification Gatekeeper (Prompt on Test Launch)
- When a user clicks **"Launch Test ⚡"** on any topic card:
  - If candidate name is not yet saved, a dedicated **Verification Modal** prompts them:
    - *"You are about to launch [Topic Name] (10 mins). Please enter your name for your certificate."*
  - **Edgecase Validation**:
    - Rejects empty strings and whitespace-only inputs (`"   "`).
    - Rejects names shorter than 2 characters.
    - Triggers red animated shake (`.input-error`) and tactile buzzer sound on invalid entry.
    - If valid, saves to `localStorage` and immediately transitions into the quiz stage.
  - If a user has already verified their name in a previous attempt, clicking launch starts the quiz immediately without friction.

### C. Interactive Timed Quiz Stage (`#screen-quiz-stage`)
1. **Skeuomorphic Chronometer / Timer Lens**:
   - Encased in a reflective tinted glass screen.
   - Displays real-time countdown (`MM:SS`).
   - **Dynamic Panic Trigger**: When remaining time drops under **2 minutes (120 seconds)**:
     - The clock digits switch to high-contrast red.
     - A pulsing crimson LED and subtle container shake activate.
     - An audible synthesized heartbeat (*lub-dub*) begins playing.
2. **Question Navigation Switchboard (Palette)**:
   - Tactile push keys for every question in the topic.
   - Live color-coded hardware statuses:
     - ⚪ **Unvisited**
     - 🔵 **Visited & Unanswered**
     - 🟢 **Confirmed Answered**
     - 🟡 **Marked for Review**
     - 🔰 **Answered & Marked for Review**
   - 1-click **"Mark for Review (Panic Tag)"** toggle with tactile mechanical switch audio.
3. **Option Selection Component**:
   - A/B/C/D option cards with instant tactile click feedback.
   - Clicking an already selected option safely **deselects** it.
   - "Clear Selection" button resets the option.
   - Code snippet box with syntax formatting for technical C and Web questions.
4. **Submission Confirmation Modal**:
   - Displays real-time count of Answered, Unanswered, and Marked-for-Review questions before finalizing.

### D. Automated Evaluation & Scorecard (`#screen-scorecard`)
1. **Scoring Model**: Standard placement exam negative marking (`+4` for correct, `-1` for incorrect, `0` for unattempted).
2. **Core Triple Metrics**:
   - **Total Score**: Scaled points earned vs maximum possible points.
   - **Accuracy Rate**: `(Correct / Attempted) * 100` percentage.
   - **Time Taken**: Formatted time utilized out of the total limit.
3. **Placement Verdict**:
   - 💼 **PLACED! (≥ 75%)**: Unlocks placement offer banner and victory triad arpeggio chime.
   - ⚠️ **BORDERLINE (50% - 74%)**: Cutoff cleared, accuracy drill recommended.
   - 🚨 **PANIC MODE! (< 50%)**: Revision and drill practice required with buzzer alert.
4. **Cumulative Placement Readiness Radar**:
   - Repositioned inside the Scorecard page to display student's overall topic mastery across Aptitude, C, Computer Fundamentals, and Web Basics.
5. **Detailed Question Explanations**:
   - Accordion review of every question with student answer, correct answer, status chip, and "Placement Note" explanation.
6. **One-Click Verified Scorecard Certificate Export**:
   - Generates a high-resolution downloadable image (`PlacedOrPanic_Scorecard_[Name].png`) with custom candidate credentials, date, score breakdown, and official status stamp.

### E. Floating Web Audio FAB
- Floating circular action button located at the **bottom-right corner** (`🔊` / `🔇`).
- Built completely using the native **HTML5 Web Audio API** (zero external mp3 assets, zero load latency).
- Synthesizes mechanical clicks, switch snaps, panic heartbeat oscillations, victory chimes, and warning buzzers.

---

## 4. Directory & File Structure

```tree
PlacedOrPanic/
├── index.html                     # Semantic HTML5 single-page application shell
├── package.json                   # Project metadata & npm serve script
├── IMPLEMENTATION_PLAN.md         # Initial architectural blueprint
├── README.md                      # GitHub public showcase with live Vercel badge
├── PROJECT_CONTEXT.md             # Complete project state, memory & knowledge base (This file)
├── css/
│   ├── base.css                   # Resets, variables, fonts, floating audio FAB styles
│   ├── theme-claymorphism.css     # Puffy 3D depths, dual drop-shadows, clay buttons
│   ├── theme-skeuomorphism.css    # Metallic bezels, inset grooves, glass gauge lens, keys
│   ├── components.css             # Grid layout, option cards, scorecard, palette, error shakes
│   └── coming-soon.css            # Tactile upcoming feature badges & interactive teasers
├── js/
│   ├── questions.js               # MCQ question bank across the 4 core topics
│   ├── soundEngine.js             # Web Audio API synthesizer (clicks, heartbeat, chime)
│   ├── pdfGenerator.js            # Certified Placement Scorecard export engine
│   ├── quizEngine.js              # State machine: timer, palette mapping, scoring logic
│   ├── storage.js                 # LocalStorage persistence for candidate profiles & attempts
│   └── app.js                     # View orchestrator, modal handlers & event listeners
└── assets/                        # Static assets & icons
```

---

## 5. Technology Stack & Key Decisions

| Aspect | Technology Chosen | Rationale |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic | Clean, accessible, zero build-step overhead |
| **Styling** | Vanilla CSS Tokens (Separated Themes) | Modular; allows toggling claymorphism and skeuomorphism without stylesheet conflicts |
| **Audio** | HTML5 Web Audio API | Pure programmatic synthesis; zero external audio files; no 404 or CORS issues |
| **State** | Vanilla ES6 Classes (`QuizEngine`) | Pure client-side state machine; instant reaction, zero network lag |
| **Persistence** | Browser `localStorage` | Seamless candidate identity and score history retention without sign-in friction |
| **Deployment** | Vercel (`https://placedorpanic.vercel.app/`) | Instant Git-triggered static edge deployment |

---

## 6. Planned Enhancements & Upcoming Roadmap

Items pre-wired into the UI with "Coming Soon" badges:

1. **🤖 AI Placement Mock Interviewer**:
   - Interactive conversational viva simulator providing instant verbal questions based on weak topics.
2. **🌳 DSA Mastery Module**:
   - Dedicated algorithmic MCQ track covering Trees, Graphs, Dynamic Programming, and Big-O analysis.
3. **📝 Custom Question Paper Builder (Faculty / Club Tool)**:
   - Upload question paper JSON or CSV with custom negative marking and custom countdown limits.
4. **⚡ Panic Speedrun Mode**:
   - 30-second hardcore timer per question with intense audible heartbeat and zero pauses.
5. **👥 Peer vs Peer Multiplayer Arena**:
   - Live socket-based synchronized quiz battleground for batchmates.

---

## 7. Context Restoration Instructions

If you are restarting a session with an AI assistant, provide this prompt:
```text
I am continuing work on my project "PlacedOrPanic".
All code is located at: C:\Users\Mehak Negi\Downloads\PlacedOrPanic
GitHub: https://github.com/thinkmehak/PlacedOrPanic.git
Live Vercel: https://placedorpanic.vercel.app/
Please read PROJECT_CONTEXT.md in the root directory to restore complete context of our features, architecture, design system, and recent changes.
```
