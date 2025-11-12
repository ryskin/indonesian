// Spaced Repetition System (SRS) Engine
// Based on SM-2 Algorithm (SuperMemo 2)

export interface FlashcardReview {
  cardId: string
  quality: number // 0-5 rating (0: complete blackout, 5: perfect response)
  reviewDate: string
  timeSpentMs: number
}

export interface FlashcardData {
  id: string
  easeFactor: number // E-Factor: 1.3 to 2.5+
  interval: number // Days until next review
  repetitions: number // Number of consecutive correct reviews
  nextReviewDate: string
  lastReviewDate: string | null
  totalReviews: number
  correctReviews: number
  createdAt: string
  stage: 'new' | 'learning' | 'review' | 'mastered'
}

export class SRSEngine {
  private static readonly MIN_EASE_FACTOR = 1.3
  private static readonly INITIAL_EASE_FACTOR = 2.5
  private static readonly MASTERY_THRESHOLD = 6 // Repetitions needed for mastery
  private static readonly GRADUATE_INTERVAL = 21 // Days to graduate to mastered

  /**
   * Calculate next review date based on SM-2 algorithm
   * @param card Current flashcard data
   * @param quality Quality rating (0-5)
   * @returns Updated flashcard data
   */
  static reviewCard(card: FlashcardData, quality: number): FlashcardData {
    const now = new Date().toISOString()
    const totalReviews = card.totalReviews + 1
    const correctReviews = quality >= 3 ? card.correctReviews + 1 : card.correctReviews

    // SM-2 Algorithm
    if (quality < 3) {
      // Failed review - reset interval and repetitions
      return {
        ...card,
        interval: 1,
        repetitions: 0,
        nextReviewDate: this.addDays(now, 1),
        lastReviewDate: now,
        totalReviews,
        correctReviews,
        stage: 'learning',
      }
    }

    // Passed review - update ease factor and interval
    let newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    newEaseFactor = Math.max(newEaseFactor, this.MIN_EASE_FACTOR)

    let newInterval: number
    let newRepetitions = card.repetitions + 1

    if (card.repetitions === 0) {
      newInterval = 1
    } else if (card.repetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(card.interval * newEaseFactor)
    }

    // Determine stage
    let stage: FlashcardData['stage']
    if (newRepetitions >= this.MASTERY_THRESHOLD && newInterval >= this.GRADUATE_INTERVAL) {
      stage = 'mastered'
    } else if (newRepetitions >= 2) {
      stage = 'review'
    } else {
      stage = 'learning'
    }

    return {
      ...card,
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetitions: newRepetitions,
      nextReviewDate: this.addDays(now, newInterval),
      lastReviewDate: now,
      totalReviews,
      correctReviews,
      stage,
    }
  }

  /**
   * Create a new flashcard
   */
  static createCard(id: string): FlashcardData {
    const now = new Date().toISOString()
    return {
      id,
      easeFactor: this.INITIAL_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      nextReviewDate: now,
      lastReviewDate: null,
      totalReviews: 0,
      correctReviews: 0,
      createdAt: now,
      stage: 'new',
    }
  }

  /**
   * Check if a card is due for review
   */
  static isDue(card: FlashcardData): boolean {
    const now = new Date()
    const nextReview = new Date(card.nextReviewDate)
    return now >= nextReview
  }

  /**
   * Get cards due for review, sorted by priority
   */
  static getDueCards(cards: FlashcardData[]): FlashcardData[] {
    const now = new Date()
    return cards
      .filter((card) => this.isDue(card))
      .sort((a, b) => {
        // Priority: new > learning > review > mastered
        const stagePriority = { new: 0, learning: 1, review: 2, mastered: 3 }
        if (stagePriority[a.stage] !== stagePriority[b.stage]) {
          return stagePriority[a.stage] - stagePriority[b.stage]
        }
        // Within same stage, older review dates first
        return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime()
      })
  }

  /**
   * Get statistics for a set of cards
   */
  static getStats(cards: FlashcardData[]) {
    const now = new Date()
    const due = cards.filter((c) => this.isDue(c)).length
    const newCards = cards.filter((c) => c.stage === 'new').length
    const learning = cards.filter((c) => c.stage === 'learning').length
    const review = cards.filter((c) => c.stage === 'review').length
    const mastered = cards.filter((c) => c.stage === 'mastered').length

    const totalReviews = cards.reduce((sum, c) => sum + c.totalReviews, 0)
    const totalCorrect = cards.reduce((sum, c) => sum + c.correctReviews, 0)
    const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0

    return {
      total: cards.length,
      due,
      newCards,
      learning,
      review,
      mastered,
      accuracy,
      totalReviews,
    }
  }

  /**
   * Helper: Add days to a date
   */
  private static addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + days)
    return date.toISOString()
  }

  /**
   * Get recommended daily review count
   */
  static getRecommendedReviewCount(cards: FlashcardData[], dailyNewCards: number = 10): number {
    const stats = this.getStats(cards)
    // Review all due cards + add new cards
    return Math.min(stats.due + dailyNewCards, 50) // Cap at 50 per session
  }
}
