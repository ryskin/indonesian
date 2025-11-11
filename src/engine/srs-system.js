/**
 * Spaced Repetition System (SRS) Engine
 * Implements SM-2 algorithm for optimal review scheduling
 * Based on SuperMemo 2 algorithm
 */

class SRSSystem {
  constructor() {
    // Default intervals in days
    this.intervals = {
      again: 1 / 1440, // 1 minute
      hard: 1 / 144, // 10 minutes
      good: 1, // 1 day
      easy: 4 // 4 days
    };
  }

  /**
   * Create a new card for learning
   * @param {string} itemId - Verb ID, pattern ID, or vocab word ID
   * @param {string} itemType - 'verb', 'pattern', 'vocab', 'sentence'
   * @param {Object} content - Card content
   * @returns {Object} New card
   */
  createCard(itemId, itemType, content) {
    return {
      id: `${itemType}_${itemId}_${Date.now()}`,
      itemId,
      itemType,
      content,
      state: 'new', // new, learning, review, relearning
      easeFactor: 2.5, // Initial ease factor
      interval: 0, // Days until next review
      repetitions: 0, // Number of successful reviews
      lapses: 0, // Number of times failed
      lastReviewed: null,
      nextReview: Date.now(), // Available immediately
      created: Date.now(),
      history: []
    };
  }

  /**
   * Review a card and update its schedule
   * @param {Object} card - The card being reviewed
   * @param {string} rating - 'again', 'hard', 'good', 'easy'
   * @returns {Object} Updated card
   */
  reviewCard(card, rating) {
    const now = Date.now();

    // Record review in history
    card.history.push({
      timestamp: now,
      rating,
      interval: card.interval,
      easeFactor: card.easeFactor
    });

    card.lastReviewed = now;

    // Handle different ratings
    switch (rating) {
      case 'again':
        return this.handleAgain(card);

      case 'hard':
        return this.handleHard(card);

      case 'good':
        return this.handleGood(card);

      case 'easy':
        return this.handleEasy(card);

      default:
        throw new Error(`Invalid rating: ${rating}`);
    }
  }

  /**
   * Handle 'again' rating (forgot the card)
   */
  handleAgain(card) {
    card.lapses += 1;
    card.repetitions = 0;
    card.state = card.state === 'new' ? 'learning' : 'relearning';

    // Reduce ease factor
    card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);

    // Reset to short interval
    card.interval = this.intervals.again;
    card.nextReview = Date.now() + this.daysToMs(card.interval);

    return card;
  }

  /**
   * Handle 'hard' rating
   */
  handleHard(card) {
    if (card.state === 'new') {
      card.state = 'learning';
      card.interval = this.intervals.hard;
    } else {
      // Reduce ease factor slightly
      card.easeFactor = Math.max(1.3, card.easeFactor - 0.15);

      // Shorter interval than 'good'
      card.interval = card.interval * 1.2 * card.easeFactor;
    }

    card.nextReview = Date.now() + this.daysToMs(card.interval);
    return card;
  }

  /**
   * Handle 'good' rating
   */
  handleGood(card) {
    if (card.state === 'new' || card.state === 'learning') {
      card.state = 'review';
      card.repetitions = 1;
      card.interval = this.intervals.good;
    } else {
      card.repetitions += 1;

      // SM-2 algorithm
      if (card.repetitions === 1) {
        card.interval = 1;
      } else if (card.repetitions === 2) {
        card.interval = 6;
      } else {
        card.interval = card.interval * card.easeFactor;
      }
    }

    card.nextReview = Date.now() + this.daysToMs(card.interval);
    return card;
  }

  /**
   * Handle 'easy' rating
   */
  handleEasy(card) {
    if (card.state === 'new') {
      card.state = 'review';
      card.repetitions = 1;
      card.interval = this.intervals.easy;
    } else {
      card.repetitions += 1;

      // Increase ease factor
      card.easeFactor = card.easeFactor + 0.15;

      // Longer interval than 'good'
      if (card.repetitions === 1) {
        card.interval = 4;
      } else {
        card.interval = card.interval * card.easeFactor * 1.3;
      }
    }

    card.nextReview = Date.now() + this.daysToMs(card.interval);
    return card;
  }

  /**
   * Get cards due for review
   * @param {Array} cards - All user's cards
   * @returns {Array} Cards due for review
   */
  getDueCards(cards) {
    const now = Date.now();
    return cards.filter(card => card.nextReview <= now);
  }

  /**
   * Get cards by state
   * @param {Array} cards
   * @param {string} state - 'new', 'learning', 'review', 'relearning'
   * @returns {Array}
   */
  getCardsByState(cards, state) {
    return cards.filter(card => card.state === state);
  }

  /**
   * Get statistics for user's progress
   * @param {Array} cards
   * @returns {Object}
   */
  getStatistics(cards) {
    const newCards = this.getCardsByState(cards, 'new').length;
    const learningCards = this.getCardsByState(cards, 'learning').length;
    const reviewCards = this.getCardsByState(cards, 'review').length;
    const dueCards = this.getDueCards(cards).length;

    const totalReviews = cards.reduce((sum, card) => sum + card.history.length, 0);
    const averageEase = cards.length > 0
      ? cards.reduce((sum, card) => sum + card.easeFactor, 0) / cards.length
      : 0;

    return {
      total: cards.length,
      new: newCards,
      learning: learningCards,
      review: reviewCards,
      due: dueCards,
      totalReviews,
      averageEaseFactor: averageEase.toFixed(2)
    };
  }

  /**
   * Get review forecast for next days
   * @param {Array} cards
   * @param {number} days - Number of days to forecast
   * @returns {Array} Daily review counts
   */
  getForecast(cards, days = 7) {
    const forecast = [];
    const now = Date.now();

    for (let i = 0; i < days; i++) {
      const dayStart = now + this.daysToMs(i);
      const dayEnd = now + this.daysToMs(i + 1);

      const count = cards.filter(
        card => card.nextReview >= dayStart && card.nextReview < dayEnd
      ).length;

      forecast.push({
        day: i,
        date: new Date(dayStart).toISOString().split('T')[0],
        count
      });
    }

    return forecast;
  }

  /**
   * Calculate retention rate
   * @param {Array} cards
   * @returns {number} Percentage of successful reviews
   */
  getRetentionRate(cards) {
    const allReviews = cards.flatMap(card => card.history);

    if (allReviews.length === 0) return 0;

    const successfulReviews = allReviews.filter(
      review => review.rating !== 'again'
    ).length;

    return ((successfulReviews / allReviews.length) * 100).toFixed(1);
  }

  /**
   * Get streak (days studied in a row)
   * @param {Array} cards
   * @returns {number}
   */
  getStreak(cards) {
    const reviewDates = new Set();

    cards.forEach(card => {
      card.history.forEach(review => {
        const date = new Date(review.timestamp).toISOString().split('T')[0];
        reviewDates.add(date);
      });
    });

    const sortedDates = Array.from(reviewDates).sort().reverse();

    if (sortedDates.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];

    // Check if studied today or yesterday
    if (sortedDates[0] !== today && sortedDates[0] !== this.getYesterday()) {
      return 0;
    }

    let currentDate = new Date();

    for (const date of sortedDates) {
      const checkDate = new Date(currentDate).toISOString().split('T')[0];

      if (date === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // Helper methods
  daysToMs(days) {
    return days * 24 * 60 * 60 * 1000;
  }

  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  /**
   * Export user data for backup
   * @param {Array} cards
   * @returns {Object}
   */
  exportData(cards) {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      cards,
      statistics: this.getStatistics(cards)
    };
  }

  /**
   * Import user data from backup
   * @param {Object} data
   * @returns {Array} Restored cards
   */
  importData(data) {
    if (data.version !== '1.0') {
      throw new Error('Incompatible data version');
    }

    return data.cards;
  }
}

// Example usage:
/*
const srs = new SRSSystem();

// Create card for verb
const card1 = srs.createCard(1, 'verb', {
  indonesian: 'makan',
  english: 'to eat',
  sentence: 'Saya makan nasi'
});

// Review the card
const updatedCard = srs.reviewCard(card1, 'good');

console.log(`Next review: ${new Date(updatedCard.nextReview)}`);
console.log(`Interval: ${updatedCard.interval} days`);

// Get due cards
const allCards = [updatedCard];
const dueCards = srs.getDueCards(allCards);

// Get statistics
const stats = srs.getStatistics(allCards);
console.log('Statistics:', stats);
*/

module.exports = SRSSystem;
