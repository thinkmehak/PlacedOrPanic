/**
 * PlacedOrPanic - Main Application Controller
 * Handles candidate identity, tactile audio triggers, screen transitions,
 * analytics dashboard, and verified certificate exports.
 */

let activeQuiz = null;
let currentResults = null;

// DOM Elements Cache
const DOM = {
  screens: {
    topic: document.getElementById('screen-topic-select'),
    quiz: document.getElementById('screen-quiz-stage'),
    scorecard: document.getElementById('screen-scorecard')
  },
  candidate: {
    welcomeName: document.getElementById('candidate-display-name'),
    inputName: document.getElementById('input-candidate-name'),
    inputCollege: document.getElementById('input-candidate-college'),
    btnSaveProfile: document.getElementById('btn-save-candidate-profile'),
    headerPill: document.getElementById('header-candidate-pill'),
    headerName: document.getElementById('header-candidate-name'),
    scorecardBadge: document.getElementById('scorecard-candidate-name')
  },
  analytics: {
    attemptsCount: document.getElementById('dash-total-attempts'),
    avgAccuracy: document.getElementById('dash-avg-accuracy'),
    meterAptitude: document.getElementById('meter-aptitude-fill'),
    valAptitude: document.getElementById('meter-aptitude-val'),
    meterC: document.getElementById('meter-c-fill'),
    valC: document.getElementById('meter-c-val'),
    meterCF: document.getElementById('meter-cf-fill'),
    valCF: document.getElementById('meter-cf-val'),
    meterWeb: document.getElementById('meter-web-fill'),
    valWeb: document.getElementById('meter-web-val')
  },
  audioToggleBtn: document.getElementById('btn-toggle-audio'),
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
    btnHome: document.getElementById('btn-home-return'),
    btnDownloadPDF: document.getElementById('btn-download-pdf-scorecard')
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
   1. Candidate Profile & Analytics Handling
   -------------------------------------------------------------------------- */
function loadCandidateProfile() {
  const profile = StorageManager.getProfile();
  const name = profile.name ? profile.name.trim() : 'Candidate';
  if (DOM.candidate.welcomeName) DOM.candidate.welcomeName.textContent = name;
  if (DOM.candidate.headerName) DOM.candidate.headerName.textContent = name;
  if (DOM.candidate.inputName) DOM.candidate.inputName.value = profile.name || '';
  if (DOM.candidate.inputCollege) DOM.candidate.inputCollege.value = profile.college || '';
}

function updateAnalyticsDashboard() {
  const attempts = StorageManager.getAttempts();
  const stats = StorageManager.getTopicStats();

  if (DOM.analytics.attemptsCount) {
    DOM.analytics.attemptsCount.textContent = `${attempts.length} Finished`;
  }

  // Calculate overall average accuracy
  if (DOM.analytics.avgAccuracy) {
    if (attempts.length === 0) {
      DOM.analytics.avgAccuracy.textContent = '0%';
    } else {
      const totalAcc = attempts.reduce((acc, curr) => acc + curr.accuracy, 0);
      DOM.analytics.avgAccuracy.textContent = `${Math.round(totalAcc / attempts.length)}%`;
    }
  }

  // Update Progress Bars per Topic
  const updateBar = (fillElem, valElem, bestScore) => {
    if (fillElem) fillElem.style.width = `${bestScore}%`;
    if (valElem) valElem.textContent = `${bestScore}% Best`;
  };

  updateBar(DOM.analytics.meterAptitude, DOM.analytics.valAptitude, stats.aptitude.bestScore);
  updateBar(DOM.analytics.meterC, DOM.analytics.valC, stats.c_programming.bestScore);
  updateBar(DOM.analytics.meterCF, DOM.analytics.valCF, stats.computer_fundamentals.bestScore);
  updateBar(DOM.analytics.meterWeb, DOM.analytics.valWeb, stats.web_basics.bestScore);
}

/* --------------------------------------------------------------------------
   2. Screen Navigation
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
   3. Render Topics
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

    card.addEventListener('click', () => {
      soundEngine.playClick();
      handleTopicCardClick(topic.id);
    });

    DOM.topicCardsContainer.appendChild(card);
  });
}

let pendingTopicLaunchId = null;

function handleTopicCardClick(topicId) {
  const profile = StorageManager.getProfile();
  // If user has not entered a name yet, prompt the launch verification modal
  if (!profile.name || profile.name.trim().length < 2) {
    pendingTopicLaunchId = topicId;
    const profileModal = document.getElementById('candidate-profile-modal');
    const topicData = QUIZ_TOPICS[topicId];
    const subtitle = document.getElementById('launch-modal-subtitle');
    if (subtitle && topicData) {
      subtitle.innerHTML = `You are about to launch <strong>${topicData.name}</strong> (${topicData.durationMinutes} mins). Please enter your name for your certificate.`;
    }
    if (DOM.candidate.inputName) DOM.candidate.inputName.value = '';
    if (profileModal) profileModal.classList.add('active');
    if (DOM.candidate.inputName) DOM.candidate.inputName.focus();
  } else {
    // Name already verified, start quiz directly
    startQuizSession(topicId);
  }
}


/* --------------------------------------------------------------------------
   4. Start Quiz Session
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
        soundEngine.startHeartbeat();
      } else {
        DOM.quiz.timerContainer.classList.remove('panic-mode');
        soundEngine.stopHeartbeat();
      }
    };

    activeQuiz.onTimeExpired = () => {
      soundEngine.stopHeartbeat();
      soundEngine.playPanicBuzzer();
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
   5. Render Current Question & Option List
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
      soundEngine.playClick();
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
   6. Render Palette (Switchboard)
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
      soundEngine.playClick();
      activeQuiz.jumpToQuestion(i);
      renderCurrentQuestion();
      renderPalette();
    });

    DOM.quiz.paletteGrid.appendChild(key);
  }
}

/* --------------------------------------------------------------------------
   7. Submit & Automated Evaluation
   -------------------------------------------------------------------------- */
function submitAndEvaluateQuiz() {
  if (!activeQuiz) return;
  soundEngine.stopHeartbeat();

  currentResults = activeQuiz.evaluateResults();
  StorageManager.saveAttempt(currentResults);
  updateAnalyticsDashboard();

  const isPlaced = currentResults.verdict === 'PLACED';
  if (isPlaced) {
    soundEngine.playVictory();
  } else {
    soundEngine.playPanicBuzzer();
  }

  // Candidate Name on Scorecard
  const profile = StorageManager.getProfile();
  if (DOM.candidate.scorecardBadge) {
    DOM.candidate.scorecardBadge.textContent = profile.name ? `Candidate: ${profile.name}` : 'Candidate: Anonymous';
  }

  // Update Scorecard View
  DOM.scorecard.emblem.className = `status-emblem ${isPlaced ? 'placed' : 'panic'}`;
  DOM.scorecard.emblem.textContent = isPlaced ? '💼' : '🚨';

  DOM.scorecard.verdictTitle.textContent = currentResults.verdictTitle;
  DOM.scorecard.verdictTitle.style.color = isPlaced ? 'var(--status-placed)' : 'var(--status-panic)';
  DOM.scorecard.verdictMessage.textContent = currentResults.verdictMessage;

  DOM.scorecard.metricScore.textContent = `${currentResults.rawScore} / ${currentResults.maxScore}`;
  DOM.scorecard.metricAccuracy.textContent = `${currentResults.accuracy}%`;
  DOM.scorecard.metricTime.textContent = currentResults.formattedTimeTaken;

  // Render Detailed Explanations
  DOM.scorecard.reviewList.innerHTML = '';
  currentResults.breakdown.forEach((item) => {
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
   8. Event Listeners Setup
   -------------------------------------------------------------------------- */
function initEventListeners() {
  // Candidate profile save with full edgecase handling
  if (DOM.candidate.btnSaveProfile) {
    const errorElem = document.getElementById('candidate-error-msg');
    const nameInput = DOM.candidate.inputName;
    const collegeInput = DOM.candidate.inputCollege;

    const clearInputError = () => {
      if (nameInput) nameInput.classList.remove('input-error');
      if (errorElem) {
        errorElem.style.display = 'none';
        errorElem.textContent = '';
      }
    };

    if (nameInput) {
      nameInput.addEventListener('input', clearInputError);
    }

    DOM.candidate.btnSaveProfile.addEventListener('click', () => {
      clearInputError();
      const rawName = nameInput ? nameInput.value : '';
      const rawCollege = collegeInput ? collegeInput.value : '';
      const name = rawName.trim();
      const college = rawCollege.trim();

      // Edgecase 1: Completely empty or whitespace-only name
      if (!name) {
        soundEngine.playPanicBuzzer();
        if (nameInput) {
          nameInput.classList.add('input-error');
          nameInput.focus();
        }
        if (errorElem) {
          errorElem.style.display = 'block';
          errorElem.className = 'candidate-feedback-msg error';
          errorElem.textContent = '⚠️ Please enter your name before saving.';
        }
        return;
      }

      // Edgecase 2: Name too short (e.g. single character)
      if (name.length < 2) {
        soundEngine.playPanicBuzzer();
        if (nameInput) {
          nameInput.classList.add('input-error');
          nameInput.focus();
        }
        if (errorElem) {
          errorElem.style.display = 'block';
          errorElem.className = 'candidate-feedback-msg error';
          errorElem.textContent = '⚠️ Name must be at least 2 characters.';
        }
        return;
      }

      // Edgecase 3: Valid Input - Save and launch quiz
      soundEngine.playVictory();
      StorageManager.saveProfile({ 
        name, 
        college: college || 'Campus Placement Drive' 
      });
      loadCandidateProfile();

      if (errorElem) {
        errorElem.style.display = 'block';
        errorElem.className = 'candidate-feedback-msg success';
        errorElem.textContent = `✅ Verified! Launching test...`;
      }

      setTimeout(() => {
        const modal = document.getElementById('candidate-profile-modal');
        if (modal) modal.classList.remove('active');
        if (errorElem) errorElem.style.display = 'none';
        
        // Launch quiz if pending
        if (pendingTopicLaunchId) {
          const tId = pendingTopicLaunchId;
          pendingTopicLaunchId = null;
          startQuizSession(tId);
        }
      }, 600);
    });
  }

  // Candidate Profile Modal Close & Cancel
  const profileModal = document.getElementById('candidate-profile-modal');
  const btnCloseProfile = document.getElementById('btn-close-profile-modal');
  const btnCancelProfile = document.getElementById('btn-cancel-candidate-profile');

  if (btnCloseProfile && profileModal) {
    btnCloseProfile.addEventListener('click', () => {
      soundEngine.playClick();
      profileModal.classList.remove('active');
      pendingTopicLaunchId = null;
    });
  }

  if (btnCancelProfile && profileModal) {
    btnCancelProfile.addEventListener('click', () => {
      soundEngine.playClick();
      profileModal.classList.remove('active');
      pendingTopicLaunchId = null;
    });
  }

  // Floating Audio Toggle Button (Bottom-Right FAB)
  if (DOM.audioToggleBtn) {
    DOM.audioToggleBtn.addEventListener('click', () => {
      const isMuted = soundEngine.toggleMute();
      if (isMuted) {
        DOM.audioToggleBtn.classList.add('muted');
        DOM.audioToggleBtn.innerHTML = '🔇';
        DOM.audioToggleBtn.setAttribute('title', 'Sound Muted (Click to turn on)');
      } else {
        DOM.audioToggleBtn.classList.remove('muted');
        DOM.audioToggleBtn.innerHTML = '🔊';
        DOM.audioToggleBtn.setAttribute('title', 'Sound Active (Click to mute)');
        soundEngine.playClick();
      }
    });
  }


  // Download Placement Scorecard Certificate PDF
  if (DOM.scorecard.btnDownloadPDF) {
    DOM.scorecard.btnDownloadPDF.addEventListener('click', () => {
      soundEngine.playVictory();
      const profile = StorageManager.getProfile();
      PDFCertificateGenerator.downloadCertificate(currentResults, profile);
    });
  }

  // Navigation inside quiz
  DOM.quiz.btnNext.addEventListener('click', () => {
    soundEngine.playClick();
    if (activeQuiz) {
      if (activeQuiz.currentIndex < activeQuiz.totalQuestions - 1) {
        activeQuiz.nextQuestion();
        renderCurrentQuestion();
        renderPalette();
      } else {
        openSubmitModal();
      }
    }
  });

  DOM.quiz.btnPrev.addEventListener('click', () => {
    soundEngine.playClick();
    if (activeQuiz) {
      activeQuiz.previousQuestion();
      renderCurrentQuestion();
      renderPalette();
    }
  });

  DOM.quiz.btnClear.addEventListener('click', () => {
    soundEngine.playClick();
    if (activeQuiz) {
      const q = activeQuiz.getCurrentQuestion();
      delete activeQuiz.answers[q.id];
      renderCurrentQuestion();
      renderPalette();
    }
  });

  DOM.quiz.reviewBtn.addEventListener('click', () => {
    soundEngine.playSwitch();
    if (activeQuiz) {
      activeQuiz.toggleMarkForReview();
      renderCurrentQuestion();
      renderPalette();
    }
  });

  // Submit test confirmation modal
  DOM.quiz.btnSubmit.addEventListener('click', () => {
    soundEngine.playClick();
    openSubmitModal();
  });

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
    soundEngine.playClick();
    DOM.modals.confirmModal.classList.remove('active');
  });

  // Scorecard actions
  DOM.scorecard.btnRetake.addEventListener('click', () => {
    soundEngine.playClick();
    if (activeQuiz) {
      startQuizSession(activeQuiz.topicId);
    }
  });

  DOM.scorecard.btnHome.addEventListener('click', () => {
    soundEngine.playClick();
    showScreen('topic');
  });

  // Upcoming feature click teasers
  document.querySelectorAll('[data-feature-teaser]').forEach(elem => {
    elem.addEventListener('click', () => {
      soundEngine.playClick();
      const featureName = elem.getAttribute('data-feature-teaser') || "Upcoming Module";
      DOM.modals.teaserTitle.textContent = featureName;
      DOM.modals.teaserModal.classList.add('active');
    });
  });

  DOM.modals.btnCloseTeaser.addEventListener('click', () => {
    soundEngine.playClick();
    DOM.modals.teaserModal.classList.remove('active');
  });
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadCandidateProfile();
  updateAnalyticsDashboard();
  renderTopicCards();
  initEventListeners();
  showScreen('topic');
});
