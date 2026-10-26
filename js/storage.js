/**
 * PlacedOrPanic - Local Storage & History Manager
 * Keeps track of candidate identity, previous quiz attempts, personal bests, and preferences.
 */

const STORAGE_KEYS = {
  USER_PROFILE: 'placed_or_panic_profile',
  ATTEMPTS: 'placed_or_panic_attempts',
  SETTINGS: 'placed_or_panic_settings'
};

const StorageManager = {
  // Candidate Profile
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : { name: '', college: '' };
    } catch (e) {
      return { name: '', college: '' };
    }
  },

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  // Attempt History
  saveAttempt(resultData) {
    try {
      const profile = this.getProfile();
      const history = this.getAttempts();
      const attemptEntry = {
        id: 'att_' + Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        candidateName: profile.name || 'Anonymous Aspirant',
        candidateCollege: profile.college || 'Engineering College',
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

  // Topic Statistics & Mastery Breakdown
  getTopicStats() {
    const attempts = this.getAttempts();
    const stats = {
      aptitude: { attempts: 0, bestScore: 0, avgAccuracy: 0, totalAccuracy: 0 },
      c_programming: { attempts: 0, bestScore: 0, avgAccuracy: 0, totalAccuracy: 0 },
      computer_fundamentals: { attempts: 0, bestScore: 0, avgAccuracy: 0, totalAccuracy: 0 },
      web_basics: { attempts: 0, bestScore: 0, avgAccuracy: 0, totalAccuracy: 0 }
    };

    attempts.forEach(att => {
      if (stats[att.topicId]) {
        const item = stats[att.topicId];
        item.attempts++;
        if (att.percentage > item.bestScore) item.bestScore = att.percentage;
        item.totalAccuracy += att.accuracy;
      }
    });

    Object.keys(stats).forEach(k => {
      if (stats[k].attempts > 0) {
        stats[k].avgAccuracy = Math.round(stats[k].totalAccuracy / stats[k].attempts);
      }
    });

    return stats;
  },

  clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  }
};
