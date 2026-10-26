/**
 * PlacedOrPanic - Quiz Engine State Management
 * Controls timing, question navigation, response recording,
 * review flags, and automated scoring calculation.
 */

class QuizEngine {
  constructor(topicId) {
    this.topicData = QUIZ_TOPICS[topicId];
    if (!this.topicData) {
      throw new Error(`Invalid topic ID: ${topicId}`);
    }

    this.topicId = topicId;
    this.questions = this.topicData.questions;
    this.totalQuestions = this.questions.length;
    this.currentIndex = 0;

    // User response state: map questionId -> selectedOptionIndex (or null)
    this.answers = {};
    // Review status map: questionId -> boolean
    this.markedForReview = {};
    // Visited status map: questionId -> boolean
    this.visited = {};

    // Initialise status for current question
    this.visited[this.questions[0].id] = true;

    // Timing
    this.totalDurationSeconds = (this.topicData.durationMinutes || 10) * 60;
    this.remainingSeconds = this.totalDurationSeconds;
    this.timerInterval = null;
    this.isCompleted = false;

    // Callbacks
    this.onTick = null;
    this.onPanic = null;
    this.onTimeExpired = null;
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;

      if (typeof this.onTick === 'function') {
        this.onTick(this.remainingSeconds, this.getFormattedTime());
      }

      // Check Panic threshold: Under 120 seconds (2 mins)
      if (this.remainingSeconds <= 120 && typeof this.onPanic === 'function') {
        this.onPanic(true);
      }

      // Time Over
      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        this.stopTimer();
        if (typeof this.onTimeExpired === 'function') {
          this.onTimeExpired();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getFormattedTime() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  selectOption(optionIndex) {
    const q = this.getCurrentQuestion();
    // Toggle: clicking same option unselects it
    if (this.answers[q.id] === optionIndex) {
      delete this.answers[q.id];
    } else {
      this.answers[q.id] = optionIndex;
    }
  }

  toggleMarkForReview() {
    const q = this.getCurrentQuestion();
    this.markedForReview[q.id] = !this.markedForReview[q.id];
    return this.markedForReview[q.id];
  }

  jumpToQuestion(index) {
    if (index >= 0 && index < this.totalQuestions) {
      this.currentIndex = index;
      const q = this.getCurrentQuestion();
      this.visited[q.id] = true;
      return true;
    }
    return false;
  }

  nextQuestion() {
    if (this.currentIndex < this.totalQuestions - 1) {
      return this.jumpToQuestion(this.currentIndex + 1);
    }
    return false;
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      return this.jumpToQuestion(this.currentIndex - 1);
    }
    return false;
  }

  getQuestionStatus(index) {
    const q = this.questions[index];
    const isAnswered = this.answers[q.id] !== undefined;
    const isReview = !!this.markedForReview[q.id];
    const isVisited = !!this.visited[q.id];
    const isCurrent = this.currentIndex === index;

    let state = 'unvisited';
    if (isAnswered && isReview) {
      state = 'answered-review';
    } else if (isReview) {
      state = 'review';
    } else if (isAnswered) {
      state = 'answered';
    } else if (isVisited) {
      state = 'visited';
    }

    return {
      index,
      number: index + 1,
      state,
      isCurrent,
      isAnswered,
      isReview
    };
  }

  /**
   * Automated Test Evaluation Calculation
   * Calculates Total Score, Accuracy Percentage, and Time Taken
   */
  evaluateResults() {
    this.stopTimer();
    this.isCompleted = true;

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const detailedBreakdown = this.questions.map((q, idx) => {
      const userAnswer = this.answers[q.id];
      const isAnswered = userAnswer !== undefined;
      const isCorrect = isAnswered && userAnswer === q.correctIndex;

      if (!isAnswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        index: idx + 1,
        question: q.question,
        codeSnippet: q.codeSnippet || null,
        options: q.options,
        userAnswer: isAnswered ? userAnswer : null,
        correctAnswer: q.correctIndex,
        isCorrect,
        isAnswered,
        explanation: q.explanation || "No explanation available."
      };
    });

    const attemptedCount = correctCount + incorrectCount;
    // Standard Placement Exam Marking (+4 for correct, -1 for wrong, 0 for unattempted)
    const rawScore = (correctCount * 4) - (incorrectCount * 1);
    const maxScore = this.totalQuestions * 4;
    const percentage = Math.max(0, Math.round((rawScore / maxScore) * 100));

    const accuracy = attemptedCount > 0 
      ? Math.round((correctCount / attemptedCount) * 100) 
      : 0;

    const timeTakenSeconds = this.totalDurationSeconds - this.remainingSeconds;
    const timeTakenMins = Math.floor(timeTakenSeconds / 60);
    const timeTakenSecs = timeTakenSeconds % 60;
    const formattedTimeTaken = `${String(timeTakenMins).padStart(2, '0')}:${String(timeTakenSecs).padStart(2, '0')}`;

    // Placement Verdict
    let verdict = "PANIC";
    let verdictTitle = "🚨 Panic Mode!";
    let verdictMessage = "You need serious brush up before the placement drives start. Review the answer explanations and retry!";
    
    if (percentage >= 75) {
      verdict = "PLACED";
      verdictTitle = "💼 Placed with flying colors!";
      verdictMessage = "Outstanding performance! You cracked the cutoff easily and would pass the technical screening round.";
    } else if (percentage >= 50) {
      verdict = "BORDERLINE";
      verdictTitle = "⚠️ Borderline Candidate";
      verdictMessage = "You passed the basic cutoff, but accuracy under time pressure needs sharpening.";
    }

    return {
      topicId: this.topicId,
      topicName: this.topicData.name,
      totalQuestions: this.totalQuestions,
      attemptedCount,
      correctCount,
      incorrectCount,
      unansweredCount,
      rawScore,
      maxScore,
      percentage,
      accuracy,
      timeTakenSeconds,
      formattedTimeTaken,
      verdict,
      verdictTitle,
      verdictMessage,
      breakdown: detailedBreakdown
    };
  }
}
