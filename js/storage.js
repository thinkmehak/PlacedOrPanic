/**
 * PlacedOrPanic - Local Storage & History Manager
 * Keeps track of previous quiz attempts, personal bests, and preferences.
 */

const STORAGE_KEYS = {
  ATTEMPTS: 'placed_or_panic_attempts',
  SETTINGS: 'placed_or_panic_settings'
};

const StorageManager = {
  saveAttempt(resultData) {
    try {
      const history = this.getAttempts();
      const attemptEntry = {
        id: 'att_' + Date.now(),
        date: new Date().toISOString(),
        topicId: resultData.topicId,
        topicName: resultData.topicName,
        rawScore: resultData.rawScore,
        maxScore: resultData.maxScore,
        percentage: resultData.percentage,
        accuracy: resultData.accuracy,
        timeTaken: resultData.formattedTimeTaken,
        verdict: resultData.verdict
      };
      history.unshift(attemptEntry);
      // Keep last 30 attempts
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(history.slice(0, 30)));
      return attemptEntry;
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
      return null;
    }
  },

  getAttempts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  }
};
