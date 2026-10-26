/**
 * PlacedOrPanic - Main Application Controller
 * Handles screen transitions, DOM events, UI updates, and interactive feedback.
 */

let activeQuiz = null;

// DOM Elements Cache
const DOM = {
  screens: {
    topic: document.getElementById('screen-topic-select'),
    quiz: document.getElementById('screen-quiz-stage'),
    scorecard: document.getElementById('screen-scorecard')
  },
  topicCardsContainer: document.getElementById('topics-grid-container'),
  quiz: {
    topicBadge: document.getElementById('quiz-topic-title'),
    timerContainer: document.getElementById('timer-pod'),
    timerDisplay: document.getElementById('timer-digits'),
    questionNumber: document.getElementById('current-q-index'),
    totalQuestions: document.getElementById('total-q-count'),
    reviewBtn: document.getElementById('btn-panic-review'),
    questionText: document.getElementById('question-text-content'),
    codeSnippet: document.getElementById('code-snippet-box'),
    optionsContainer: document.getElementById('options-list-container'),
    paletteGrid: document.getElementById('palette-keys-container'),
    btnPrev: document.getElementById('btn-prev-question'),
    btnNext: document.getElementById('btn-next-question'),
    btnClear: document.getElementById('btn-clear-selection'),
    btnSubmit: document.getElementById('btn-submit-quiz')
  },
  scorecard: {
    emblem: document.getElementById('score-emblem'),
    verdictTitle: document.getElementById('score-verdict-title'),
    verdictMessage: document.getElementById('score-verdict-msg'),
    metricScore: document.getElementById('metric-total-score'),
    metricAccuracy: document.getElementById('metric-accuracy'),
    metricTime: document.getElementById('metric-time-taken'),
    reviewList: document.getElementById('detailed-review-list'),
    btnRetake: document.getElementById('btn-retake-quiz'),
    btnHome: document.getElementById('btn-home-return')
  },
  modals: {
    teaserModal: document.getElementById('teaser-modal'),
    teaserTitle: document.getElementById('teaser-modal-title'),
    teaserDesc: document.getElementById('teaser-modal-desc'),
    btnCloseTeaser: document.getElementById('btn-close-teaser'),
    confirmModal: document.getElementById('confirm-submit-modal'),
    btnConfirmSubmit: document.getElementById('btn-confirm-submit-action'),
    btnCancelSubmit: document.getElementById('btn-cancel-submit-action')
  }
};

/* --------------------------------------------------------------------------
   1. Screen Navigation
   -------------------------------------------------------------------------- */
function showScreen(screenKey) {
  Object.values(DOM.screens).forEach(screen => {
    if (screen) screen.classList.remove('active');
  });
  if (DOM.screens[screenKey]) {
    DOM.screens[screenKey].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* --------------------------------------------------------------------------
   2. Render Topics
   -------------------------------------------------------------------------- */
function renderTopicCards() {
  if (!DOM.topicCardsContainer) return;
  DOM.topicCardsContainer.innerHTML = '';

  Object.values(QUIZ_TOPICS).forEach(topic => {
    const card = document.createElement('div');
    card.className = 'topic-card clay-card';
    card.setAttribute('data-topic-id', topic.id);

    card.innerHTML = `
      <div>
        <div class="topic-icon-wrap skeuo-bezel" style="box-shadow: 0 4px 10px ${topic.accentColor}33;">
          <span>${topic.icon}</span>
        </div>
        <h3>${topic.name}</h3>
        <p>${topic.description}</p>
      </div>
      <div class="topic-meta">
        <div class="topic-meta-tags">
          <span class="clay-pill">⏱️ ${topic.durationMinutes} Mins</span>
          <span class="clay-pill">🎯 ${topic.questions.length} MCQs</span>
        </div>
        <button class="clay-btn clay-btn-primary" style="padding: 0.5rem 1.1rem; font-size: 0.85rem;" data-start-topic="${topic.id}">
          Launch Test ⚡
        </button>
      </div>
    `;

    card.addEventListener('click', (e) => {
      // Allow clicking entire card or button
      startQuizSession(topic.id);
    });

    DOM.topicCardsContainer.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   3. Start Quiz Session
   -------------------------------------------------------------------------- */
function startQuizSession(topicId) {
  try {
    activeQuiz = new QuizEngine(topicId);

    // Setup callbacks
    activeQuiz.onTick = (remainingSecs, formatted) => {
      DOM.quiz.timerDisplay.textContent = formatted;
    };

    activeQuiz.onPanic = (isPanic) => {
      if (isPanic) {
        DOM.quiz.timerContainer.classList.add('panic-mode');
      } else {
        DOM.quiz.timerContainer.classList.remove('panic-mode');
      }
    };

    activeQuiz.onTimeExpired = () => {
      alert("⏱️ TIME'S UP! Your test is automatically being evaluated.");
      submitAndEvaluateQuiz();
    };

    // Header info
    DOM.quiz.topicBadge.textContent = activeQuiz.topicData.name;
    DOM.quiz.totalQuestions.textContent = activeQuiz.totalQuestions;
    DOM.quiz.timerContainer.classList.remove('panic-mode');
    DOM.quiz.timerDisplay.textContent = activeQuiz.getFormattedTime();

    activeQuiz.startTimer();
    renderCurrentQuestion();
    renderPalette();
    showScreen('quiz');
  } catch (err) {
    console.error("Failed to start quiz:", err);
  }
}

/* --------------------------------------------------------------------------
   4. Render Current Question & Option List
   -------------------------------------------------------------------------- */
function renderCurrentQuestion() {
  if (!activeQuiz) return;
  const q = activeQuiz.getCurrentQuestion();
  const qIndex = activeQuiz.currentIndex;

  DOM.quiz.questionNumber.textContent = String(qIndex + 1).padStart(2, '0');
  DOM.quiz.questionText.textContent = q.question;

  // Code snippet handling
  if (q.codeSnippet) {
    DOM.quiz.codeSnippet.style.display = 'block';
    DOM.quiz.codeSnippet.textContent = q.codeSnippet;
  } else {
    DOM.quiz.codeSnippet.style.display = 'none';
    DOM.quiz.codeSnippet.textContent = '';
  }

  // Mark for review button state
  const isMarked = !!activeQuiz.markedForReview[q.id];
  if (isMarked) {
    DOM.quiz.reviewBtn.classList.add('active');
    DOM.quiz.reviewBtn.innerHTML = '🚩 Marked for Review';
  } else {
    DOM.quiz.reviewBtn.classList.remove('active');
    DOM.quiz.reviewBtn.innerHTML = '🏳️ Mark for Review';
  }

  // Options rendering
  DOM.quiz.optionsContainer.innerHTML = '';
  const selectedOptionIndex = activeQuiz.answers[q.id];

  const optionLetters = ['A', 'B', 'C', 'D'];
  q.options.forEach((optText, idx) => {
    const isSelected = selectedOptionIndex === idx;
    const optionDiv = document.createElement('div');
    optionDiv.className = `option-item ${isSelected ? 'selected' : ''}`;
    
    optionDiv.innerHTML = `
      <div class="option-marker">${optionLetters[idx]}</div>
      <div class="option-label">${optText}</div>
    `;

    optionDiv.addEventListener('click', () => {
      activeQuiz.selectOption(idx);
      renderCurrentQuestion();
      renderPalette();
    });

    DOM.quiz.optionsContainer.appendChild(optionDiv);
  });

  // Prev/Next control buttons state
  DOM.quiz.btnPrev.disabled = qIndex === 0;
  DOM.quiz.btnPrev.style.opacity = qIndex === 0 ? '0.45' : '1';
  DOM.quiz.btnPrev.style.cursor = qIndex === 0 ? 'not-allowed' : 'pointer';

  const isLast = qIndex === activeQuiz.totalQuestions - 1;
  DOM.quiz.btnNext.innerHTML = isLast ? 'Next & Review ➔' : 'Next Question ➔';
}

/* --------------------------------------------------------------------------
   5. Render Palette (Switchboard)
   -------------------------------------------------------------------------- */
function renderPalette() {
  if (!activeQuiz) return;
  DOM.quiz.paletteGrid.innerHTML = '';

  for (let i = 0; i < activeQuiz.totalQuestions; i++) {
    const status = activeQuiz.getQuestionStatus(i);
    const key = document.createElement('button');
    key.className = `skeuo-key palette-btn ${status.state} ${status.isCurrent ? 'current' : ''}`;
    key.textContent = status.number;

    key.addEventListener('click', () => {
      activeQuiz.jumpToQuestion(i);
      renderCurrentQuestion();
      renderPalette();
    });

    DOM.quiz.paletteGrid.appendChild(key);
  }
}

/* --------------------------------------------------------------------------
   6. Submit & Automated Evaluation
   -------------------------------------------------------------------------- */
function submitAndEvaluateQuiz() {
  if (!activeQuiz) return;
  const results = activeQuiz.evaluateResults();
  StorageManager.saveAttempt(results);

  // Update Scorecard View
  const isPlaced = results.verdict === 'PLACED';
  DOM.scorecard.emblem.className = `status-emblem ${isPlaced ? 'placed' : 'panic'}`;
  DOM.scorecard.emblem.textContent = isPlaced ? '💼' : '🚨';

  DOM.scorecard.verdictTitle.textContent = results.verdictTitle;
  DOM.scorecard.verdictTitle.style.color = isPlaced ? 'var(--status-placed)' : 'var(--status-panic)';
  DOM.scorecard.verdictMessage.textContent = results.verdictMessage;

  DOM.scorecard.metricScore.textContent = `${results.rawScore} / ${results.maxScore}`;
  DOM.scorecard.metricAccuracy.textContent = `${results.accuracy}%`;
  DOM.scorecard.metricTime.textContent = results.formattedTimeTaken;

  // Render Detailed Explanations
  DOM.scorecard.reviewList.innerHTML = '';
  results.breakdown.forEach((item) => {
    const reviewCard = document.createElement('div');
    const statusClass = !item.isAnswered ? 'unanswered' : (item.isCorrect ? 'correct' : 'incorrect');
    reviewCard.className = `review-item ${statusClass}`;

    const optionLetters = ['A', 'B', 'C', 'D'];
    const userChoiceText = item.userAnswer !== null ? `${optionLetters[item.userAnswer]}: ${item.options[item.userAnswer]}` : 'Not Attempted';
    const correctChoiceText = `${optionLetters[item.correctAnswer]}: ${item.options[item.correctAnswer]}`;

    reviewCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <strong style="font-size: 1rem;">Q${item.index}. ${item.question}</strong>
        <span class="clay-pill" style="font-size: 0.75rem;">
          ${item.isCorrect ? '✅ Correct (+4)' : (item.isAnswered ? '❌ Incorrect (-1)' : '⚪ Unattempted (0)')}
        </span>
      </div>
      ${item.codeSnippet ? `<pre class="code-snippet" style="margin: 0.5rem 0;"><code>${item.codeSnippet}</code></pre>` : ''}
      <div style="font-size: 0.88rem; margin: 0.6rem 0; display: flex; flex-direction: column; gap: 0.25rem;">
        <div><strong>Your Answer:</strong> <span style="color: ${item.isCorrect ? 'var(--status-placed)' : 'var(--status-panic)'}; font-weight: 700;">${userChoiceText}</span></div>
        <div><strong>Correct Answer:</strong> <span style="color: var(--status-placed); font-weight: 700;">${correctChoiceText}</span></div>
      </div>
      <div style="background: rgba(255, 255, 255, 0.7); padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted); border-left: 3px solid var(--brand-primary);">
        💡 <strong>Placement Note:</strong> ${item.explanation}
      </div>
    `;

    DOM.scorecard.reviewList.appendChild(reviewCard);
  });

  showScreen('scorecard');
}

/* --------------------------------------------------------------------------
   7. Event Listeners Setup
   -------------------------------------------------------------------------- */
function initEventListeners() {
  // Navigation inside quiz
  DOM.quiz.btnNext.addEventListener('click', () => {
    if (activeQuiz) {
      if (activeQuiz.currentIndex < activeQuiz.totalQuestions - 1) {
        activeQuiz.nextQuestion();
        renderCurrentQuestion();
        renderPalette();
      } else {
        // At the last question, clicking next triggers submission confirmation
        openSubmitModal();
      }
    }
  });

  DOM.quiz.btnPrev.addEventListener('click', () => {
    if (activeQuiz) {
      activeQuiz.previousQuestion();
      renderCurrentQuestion();
      renderPalette();
    }
  });

  DOM.quiz.btnClear.addEventListener('click', () => {
    if (activeQuiz) {
      const q = activeQuiz.getCurrentQuestion();
      delete activeQuiz.answers[q.id];
      renderCurrentQuestion();
      renderPalette();
    }
  });

  DOM.quiz.reviewBtn.addEventListener('click', () => {
    if (activeQuiz) {
      activeQuiz.toggleMarkForReview();
      renderCurrentQuestion();
      renderPalette();
    }
  });

  // Submit test confirmation modal
  DOM.quiz.btnSubmit.addEventListener('click', openSubmitModal);

  function openSubmitModal() {
    if (!activeQuiz) return;
    const answeredCount = Object.keys(activeQuiz.answers).length;
    const unansweredCount = activeQuiz.totalQuestions - answeredCount;
    const reviewCount = Object.values(activeQuiz.markedForReview).filter(Boolean).length;

    const modalSummary = document.getElementById('confirm-modal-summary');
    if (modalSummary) {
      modalSummary.innerHTML = `
        <div style="margin: 1rem 0; font-size: 0.95rem; line-height: 1.6; text-align: left; background: #f8fafc; padding: 1rem; border-radius: 12px;">
          <div>✅ Answered: <strong>${answeredCount}</strong></div>
          <div>⚠️ Unanswered: <strong>${unansweredCount}</strong></div>
          <div>🚩 Marked for Review: <strong>${reviewCount}</strong></div>
        </div>
      `;
    }
    DOM.modals.confirmModal.classList.add('active');
  }

  DOM.modals.btnConfirmSubmit.addEventListener('click', () => {
    DOM.modals.confirmModal.classList.remove('active');
    submitAndEvaluateQuiz();
  });

  DOM.modals.btnCancelSubmit.addEventListener('click', () => {
    DOM.modals.confirmModal.classList.remove('active');
  });

  // Scorecard actions
  DOM.scorecard.btnRetake.addEventListener('click', () => {
    if (activeQuiz) {
      startQuizSession(activeQuiz.topicId);
    }
  });

  DOM.scorecard.btnHome.addEventListener('click', () => {
    showScreen('topic');
  });

  // Upcoming feature click teasers
  document.querySelectorAll('[data-feature-teaser]').forEach(elem => {
    elem.addEventListener('click', () => {
      const featureName = elem.getAttribute('data-feature-teaser') || "Upcoming Module";
      DOM.modals.teaserTitle.textContent = featureName;
      DOM.modals.teaserModal.classList.add('active');
    });
  });

  DOM.modals.btnCloseTeaser.addEventListener('click', () => {
    DOM.modals.teaserModal.classList.remove('active');
  });
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderTopicCards();
  initEventListeners();
  showScreen('topic');
});
