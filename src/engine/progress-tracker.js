/**
 * Progress Tracking & Gamification Engine
 * Tracks user progress, achievements, and provides motivation
 */

class ProgressTracker {
  constructor() {
    this.achievements = this.initializeAchievements();
    this.levels = this.initializeLevels();
  }

  /**
   * Create new user progress profile
   * @param {string} userId
   * @param {Object} userGoals - From onboarding
   * @returns {Object}
   */
  createUserProfile(userId, userGoals = {}) {
    return {
      userId,
      createdAt: Date.now(),
      goals: userGoals, // { purpose, dailyMinutes, targetDate }

      // Learning progress
      currentWeek: 1,
      currentDay: 1,
      completedLessons: [],
      verbsMastered: [], // Array of verb IDs
      patternsMastered: [], // Array of pattern IDs
      vocabularyLearned: [], // Array of word IDs

      // Practice stats
      totalSentencesCreated: 0,
      totalDialoguesCompleted: 0,
      totalReviews: 0,
      correctAnswers: 0,
      totalAnswers: 0,

      // Time tracking
      totalStudyTimeMs: 0,
      studySessions: [],
      streak: 0,
      longestStreak: 0,
      lastStudyDate: null,

      // Gamification
      xp: 0,
      level: 1,
      achievements: [],
      badges: [],

      // Settings
      dailyGoal: userGoals.dailyMinutes || 10, // minutes
      notificationsEnabled: true,
      soundEnabled: true
    };
  }

  /**
   * Update progress after lesson completion
   * @param {Object} userProfile
   * @param {Object} lessonData
   * @returns {Object} Updated profile with rewards
   */
  completeLesson(userProfile, lessonData) {
    const { week, day, lessonId } = lessonData;

    // Mark lesson as completed
    userProfile.completedLessons.push({
      lessonId,
      week,
      day,
      completedAt: Date.now()
    });

    // Update current position
    if (week >= userProfile.currentWeek) {
      userProfile.currentWeek = week;
      userProfile.currentDay = Math.max(day, userProfile.currentDay);
    }

    // Award XP
    const xpGained = this.calculateLessonXP(lessonData);
    userProfile.xp += xpGained;

    // Check for level up
    const levelUp = this.checkLevelUp(userProfile);

    // Check for new achievements
    const newAchievements = this.checkAchievements(userProfile);

    return {
      userProfile,
      rewards: {
        xp: xpGained,
        levelUp,
        newAchievements
      }
    };
  }

  /**
   * Track verb mastery
   * @param {Object} userProfile
   * @param {number} verbId
   * @param {number} performanceScore - 0-100
   * @returns {Object}
   */
  trackVerbProgress(userProfile, verbId, performanceScore) {
    // Consider verb mastered if score > 85 and practiced 3+ times
    const verbPracticeCount = userProfile.verbsMastered.filter(
      v => v.verbId === verbId
    ).length;

    if (performanceScore >= 85 && verbPracticeCount >= 2) {
      if (!userProfile.verbsMastered.find(v => v.verbId === verbId && v.mastered)) {
        userProfile.verbsMastered.push({
          verbId,
          masteredAt: Date.now(),
          mastered: true
        });

        // Award bonus XP
        userProfile.xp += 50;

        return {
          mastered: true,
          milestone: this.checkVerbMilestones(userProfile)
        };
      }
    } else {
      // Track practice
      userProfile.verbsMastered.push({
        verbId,
        practicedAt: Date.now(),
        score: performanceScore,
        mastered: false
      });
    }

    return { mastered: false };
  }

  /**
   * Track pattern mastery
   * @param {Object} userProfile
   * @param {number} patternId
   * @param {number} accuracy - 0-100
   * @returns {Object}
   */
  trackPatternProgress(userProfile, patternId, accuracy) {
    const existingPattern = userProfile.patternsMastered.find(
      p => p.patternId === patternId
    );

    if (!existingPattern) {
      userProfile.patternsMastered.push({
        patternId,
        attempts: 1,
        totalAccuracy: accuracy,
        mastered: accuracy >= 90,
        masteredAt: accuracy >= 90 ? Date.now() : null
      });
    } else {
      existingPattern.attempts += 1;
      existingPattern.totalAccuracy += accuracy;

      const avgAccuracy = existingPattern.totalAccuracy / existingPattern.attempts;

      if (!existingPattern.mastered && avgAccuracy >= 90 && existingPattern.attempts >= 3) {
        existingPattern.mastered = true;
        existingPattern.masteredAt = Date.now();
        userProfile.xp += 30;

        return { mastered: true };
      }
    }

    return { mastered: false };
  }

  /**
   * Start study session
   * @param {Object} userProfile
   * @returns {Object} Session object
   */
  startStudySession(userProfile) {
    const session = {
      id: `session_${Date.now()}`,
      startTime: Date.now(),
      endTime: null,
      activities: []
    };

    // Update streak
    this.updateStreak(userProfile);

    return session;
  }

  /**
   * End study session
   * @param {Object} userProfile
   * @param {Object} session
   * @returns {Object}
   */
  endStudySession(userProfile, session) {
    session.endTime = Date.now();
    const durationMs = session.endTime - session.startTime;
    const durationMinutes = Math.round(durationMs / 60000);

    session.durationMs = durationMs;
    session.durationMinutes = durationMinutes;

    // Update total study time
    userProfile.totalStudyTimeMs += durationMs;
    userProfile.studySessions.push(session);
    userProfile.lastStudyDate = new Date().toISOString().split('T')[0];

    // Award time-based XP (1 XP per minute)
    userProfile.xp += durationMinutes;

    // Check daily goal
    const dailyGoalMet = this.checkDailyGoal(userProfile);

    return {
      userProfile,
      session,
      dailyGoalMet,
      totalTimeToday: this.getTodayStudyTime(userProfile)
    };
  }

  /**
   * Update streak
   * @param {Object} userProfile
   */
  updateStreak(userProfile) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = this.getYesterday();

    if (userProfile.lastStudyDate === today) {
      // Already studied today, keep streak
      return;
    }

    if (userProfile.lastStudyDate === yesterday) {
      // Studied yesterday, increment streak
      userProfile.streak += 1;
      userProfile.longestStreak = Math.max(userProfile.streak, userProfile.longestStreak);
    } else {
      // Streak broken
      userProfile.streak = 1;
    }
  }

  /**
   * Calculate XP for lesson completion
   * @param {Object} lessonData
   * @returns {number}
   */
  calculateLessonXP(lessonData) {
    const baseXP = 100;
    const weekMultiplier = 1 + (lessonData.week * 0.1); // More XP for advanced lessons
    return Math.round(baseXP * weekMultiplier);
  }

  /**
   * Check if user levels up
   * @param {Object} userProfile
   * @returns {Object|null}
   */
  checkLevelUp(userProfile) {
    const currentLevel = userProfile.level;
    const newLevel = this.calculateLevel(userProfile.xp);

    if (newLevel > currentLevel) {
      userProfile.level = newLevel;

      return {
        oldLevel: currentLevel,
        newLevel,
        reward: `Congratulations! You reached level ${newLevel}!`
      };
    }

    return null;
  }

  /**
   * Calculate level from XP
   * @param {number} xp
   * @returns {number}
   */
  calculateLevel(xp) {
    // Level formula: level = floor(sqrt(xp / 100))
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  /**
   * Get XP needed for next level
   * @param {number} currentLevel
   * @returns {number}
   */
  getXPForNextLevel(currentLevel) {
    return Math.pow(currentLevel, 2) * 100;
  }

  /**
   * Check for new achievements
   * @param {Object} userProfile
   * @returns {Array}
   */
  checkAchievements(userProfile) {
    const newAchievements = [];

    this.achievements.forEach(achievement => {
      // Skip if already earned
      if (userProfile.achievements.includes(achievement.id)) {
        return;
      }

      if (this.checkAchievementCondition(userProfile, achievement)) {
        userProfile.achievements.push(achievement.id);
        userProfile.xp += achievement.xp;
        newAchievements.push(achievement);
      }
    });

    return newAchievements;
  }

  /**
   * Check if achievement condition is met
   * @param {Object} userProfile
   * @param {Object} achievement
   * @returns {boolean}
   */
  checkAchievementCondition(userProfile, achievement) {
    const { condition, value } = achievement;

    switch (condition) {
      case 'verbs_mastered':
        return userProfile.verbsMastered.filter(v => v.mastered).length >= value;

      case 'patterns_mastered':
        return userProfile.patternsMastered.filter(p => p.mastered).length >= value;

      case 'lessons_completed':
        return userProfile.completedLessons.length >= value;

      case 'streak':
        return userProfile.streak >= value;

      case 'sentences_created':
        return userProfile.totalSentencesCreated >= value;

      case 'dialogs_completed':
        return userProfile.totalDialoguesCompleted >= value;

      case 'study_time_hours':
        return (userProfile.totalStudyTimeMs / 3600000) >= value;

      default:
        return false;
    }
  }

  /**
   * Check verb milestones
   * @param {Object} userProfile
   * @returns {Object|null}
   */
  checkVerbMilestones(userProfile) {
    const masteredCount = userProfile.verbsMastered.filter(v => v.mastered).length;
    const milestones = [10, 25, 50, 75, 100];

    if (milestones.includes(masteredCount)) {
      return {
        milestone: masteredCount,
        message: `Amazing! You've mastered ${masteredCount} verbs! 🎉`,
        xp: masteredCount * 10
      };
    }

    return null;
  }

  /**
   * Check daily goal
   * @param {Object} userProfile
   * @returns {boolean}
   */
  checkDailyGoal(userProfile) {
    const todayMinutes = this.getTodayStudyTime(userProfile);
    return todayMinutes >= userProfile.dailyGoal;
  }

  /**
   * Get today's study time in minutes
   * @param {Object} userProfile
   * @returns {number}
   */
  getTodayStudyTime(userProfile) {
    const today = new Date().toISOString().split('T')[0];

    const todaySessions = userProfile.studySessions.filter(session => {
      const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
      return sessionDate === today;
    });

    const totalMs = todaySessions.reduce((sum, s) => sum + (s.durationMs || 0), 0);
    return Math.round(totalMs / 60000);
  }

  /**
   * Get comprehensive statistics
   * @param {Object} userProfile
   * @returns {Object}
   */
  getStatistics(userProfile) {
    const verbsMastered = userProfile.verbsMastered.filter(v => v.mastered).length;
    const patternsMastered = userProfile.patternsMastered.filter(p => p.mastered).length;
    const accuracy = userProfile.totalAnswers > 0
      ? Math.round((userProfile.correctAnswers / userProfile.totalAnswers) * 100)
      : 0;

    const totalHours = Math.round(userProfile.totalStudyTimeMs / 3600000);
    const avgSessionMinutes = userProfile.studySessions.length > 0
      ? Math.round(
        userProfile.studySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) /
        userProfile.studySessions.length
      )
      : 0;

    return {
      level: userProfile.level,
      xp: userProfile.xp,
      nextLevelXP: this.getXPForNextLevel(userProfile.level),
      progress: {
        currentWeek: userProfile.currentWeek,
        lessonsCompleted: userProfile.completedLessons.length,
        verbsMastered,
        verbsProgress: `${verbsMastered}/100`,
        patternsMastered,
        patternsProgress: `${patternsMastered}/30`,
        vocabularyLearned: userProfile.vocabularyLearned.length
      },
      performance: {
        accuracy: `${accuracy}%`,
        totalSentencesCreated: userProfile.totalSentencesCreated,
        totalDialoguesCompleted: userProfile.totalDialoguesCompleted,
        totalReviews: userProfile.totalReviews
      },
      time: {
        streak: userProfile.streak,
        longestStreak: userProfile.longestStreak,
        totalHours,
        totalSessions: userProfile.studySessions.length,
        avgSessionMinutes,
        todayMinutes: this.getTodayStudyTime(userProfile),
        dailyGoal: userProfile.dailyGoal
      },
      achievements: {
        total: userProfile.achievements.length,
        earned: userProfile.achievements,
        available: this.achievements.length
      }
    };
  }

  // Helper methods
  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  /**
   * Initialize achievements list
   * @returns {Array}
   */
  initializeAchievements() {
    return [
      // First steps
      { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', condition: 'lessons_completed', value: 1, xp: 50, icon: '🎯' },
      { id: 'first_sentence', name: 'First Words', description: 'Create your first sentence', condition: 'sentences_created', value: 1, xp: 25, icon: '💬' },

      // Verb mastery
      { id: 'verbs_10', name: 'Verb Apprentice', description: 'Master 10 verbs', condition: 'verbs_mastered', value: 10, xp: 100, icon: '📘' },
      { id: 'verbs_25', name: 'Verb Adept', description: 'Master 25 verbs', condition: 'verbs_mastered', value: 25, xp: 250, icon: '📗' },
      { id: 'verbs_50', name: 'Verb Expert', description: 'Master 50 verbs', condition: 'verbs_mastered', value: 50, xp: 500, icon: '📙' },
      { id: 'verbs_100', name: 'Verb Master', description: 'Master all 100 verbs!', condition: 'verbs_mastered', value: 100, xp: 1000, icon: '🏆' },

      // Patterns
      { id: 'patterns_10', name: 'Pattern Pro', description: 'Master 10 patterns', condition: 'patterns_mastered', value: 10, xp: 150, icon: '🎨' },
      { id: 'patterns_20', name: 'Pattern Expert', description: 'Master 20 patterns', condition: 'patterns_mastered', value: 20, xp: 300, icon: '🎭' },
      { id: 'patterns_30', name: 'Pattern Master', description: 'Master all 30 patterns!', condition: 'patterns_mastered', value: 30, xp: 500, icon: '👑' },

      // Streaks
      { id: 'streak_3', name: 'Consistent', description: 'Study 3 days in a row', condition: 'streak', value: 3, xp: 50, icon: '🔥' },
      { id: 'streak_7', name: 'Dedicated', description: 'Study 7 days in a row', condition: 'streak', value: 7, xp: 150, icon: '🔥🔥' },
      { id: 'streak_30', name: 'Committed', description: 'Study 30 days in a row', condition: 'streak', value: 30, xp: 500, icon: '🔥🔥🔥' },

      // Lessons
      { id: 'week_1', name: 'Week 1 Complete', description: 'Complete first week', condition: 'lessons_completed', value: 3, xp: 100, icon: '📅' },
      { id: 'week_4', name: 'Month Master', description: 'Complete first month', condition: 'lessons_completed', value: 12, xp: 300, icon: '📆' },
      { id: 'week_16', name: 'Program Complete', description: 'Complete 16-week program!', condition: 'lessons_completed', value: 48, xp: 2000, icon: '🎓' },

      // Practice
      { id: 'sentences_50', name: 'Sentence Smith', description: 'Create 50 sentences', condition: 'sentences_created', value: 50, xp: 100, icon: '✍️' },
      { id: 'sentences_200', name: 'Sentence Master', description: 'Create 200 sentences', condition: 'sentences_created', value: 200, xp: 300, icon: '📝' },
      { id: 'dialogs_20', name: 'Conversationalist', description: 'Complete 20 dialogues', condition: 'dialogs_completed', value: 20, xp: 200, icon: '💭' },

      // Time
      { id: 'time_10h', name: 'Dedicated Learner', description: 'Study for 10 hours total', condition: 'study_time_hours', value: 10, xp: 200, icon: '⏰' },
      { id: 'time_50h', name: 'Serious Student', description: 'Study for 50 hours total', condition: 'study_time_hours', value: 50, xp: 500, icon: '⏳' }
    ];
  }

  /**
   * Initialize level definitions
   * @returns {Array}
   */
  initializeLevels() {
    return [
      { level: 1, title: 'Beginner', xpRequired: 0 },
      { level: 5, title: 'Learner', xpRequired: 2500 },
      { level: 10, title: 'Student', xpRequired: 10000 },
      { level: 15, title: 'Speaker', xpRequired: 22500 },
      { level: 20, title: 'Fluent', xpRequired: 40000 },
      { level: 25, title: 'Expert', xpRequired: 62500 },
      { level: 30, title: 'Master', xpRequired: 90000 }
    ];
  }
}

module.exports = ProgressTracker;
