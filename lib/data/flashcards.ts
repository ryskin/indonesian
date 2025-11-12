// Flashcard Types and Generator

export type FlashcardType = 'vocab-id-en' | 'vocab-en-id' | 'verb' | 'sentence'

export interface Flashcard {
  id: string
  type: FlashcardType
  front: string // Question/Prompt
  back: string // Answer
  hint?: string
  category: string
  difficulty: number // 1-5
  audio?: string
  examples?: string[]
  tags: string[]
}

import verbsData from '@/src/data/verbs.json'
import vocabularyData from '@/src/data/vocabulary.json'

/**
 * Generate all flashcards from verbs and vocabulary data
 */
export function generateAllFlashcards(): Flashcard[] {
  const flashcards: Flashcard[] = []

  // Generate vocab flashcards (Indonesian → English)
  Object.entries(vocabularyData.vocabulary).forEach(([categoryKey, categoryData]: [string, any]) => {
    if (categoryData.words) {
      categoryData.words.forEach((word: any, index: number) => {
        // Indonesian → English
        flashcards.push({
          id: `vocab-id-en-${categoryKey}-${index}`,
          type: 'vocab-id-en',
          front: word.indonesian,
          back: word.english,
          category: categoryData.name || categoryKey,
          difficulty: 1,
          audio: word.audio,
          tags: ['vocabulary', categoryKey],
        })

        // English → Indonesian (reverse)
        flashcards.push({
          id: `vocab-en-id-${categoryKey}-${index}`,
          type: 'vocab-en-id',
          front: word.english,
          back: word.indonesian,
          hint: `Category: ${categoryData.name || categoryKey}`,
          category: categoryData.name || categoryKey,
          difficulty: 2, // Reverse is harder
          audio: word.audio,
          tags: ['vocabulary', categoryKey, 'reverse'],
        })
      })
    }
  })

  // Generate verb flashcards
  verbsData.verbs.forEach((verb) => {
    // Verb translation card
    flashcards.push({
      id: `verb-${verb.id}`,
      type: 'verb',
      front: verb.indonesian,
      back: verb.english,
      category: 'Verbs',
      difficulty: verb.difficulty,
      audio: verb.audio,
      examples: verb.examples.map((ex) => `${ex.indonesian} - ${ex.english}`),
      tags: ['verb', verb.category],
    })

    // Reverse verb card
    flashcards.push({
      id: `verb-reverse-${verb.id}`,
      type: 'verb',
      front: verb.english,
      back: verb.indonesian,
      category: 'Verbs',
      difficulty: verb.difficulty + 1,
      audio: verb.audio,
      examples: verb.examples.map((ex) => `${ex.english} - ${ex.indonesian}`),
      tags: ['verb', verb.category, 'reverse'],
    })

    // Sentence example cards (first 2 examples)
    verb.examples.slice(0, 2).forEach((example, idx) => {
      flashcards.push({
        id: `sentence-${verb.id}-${idx}`,
        type: 'sentence',
        front: example.indonesian,
        back: example.english,
        hint: `Uses verb: ${verb.indonesian}`,
        category: 'Sentences',
        difficulty: verb.difficulty + 1,
        tags: ['sentence', verb.category, verb.indonesian],
      })
    })
  })

  return flashcards
}

/**
 * Get flashcards by type
 */
export function getFlashcardsByType(type: FlashcardType): Flashcard[] {
  return generateAllFlashcards().filter((card) => card.type === type)
}

/**
 * Get flashcards by category
 */
export function getFlashcardsByCategory(category: string): Flashcard[] {
  return generateAllFlashcards().filter((card) => card.category === category)
}

/**
 * Get flashcards by tags
 */
export function getFlashcardsByTags(tags: string[]): Flashcard[] {
  return generateAllFlashcards().filter((card) =>
    tags.some((tag) => card.tags.includes(tag))
  )
}

/**
 * Get flashcard categories
 */
export function getFlashcardCategories(): string[] {
  const cards = generateAllFlashcards()
  const categories = new Set(cards.map((card) => card.category))
  return Array.from(categories).sort()
}

/**
 * Get flashcard statistics
 */
export function getFlashcardStats() {
  const cards = generateAllFlashcards()
  return {
    total: cards.length,
    byType: {
      'vocab-id-en': cards.filter((c) => c.type === 'vocab-id-en').length,
      'vocab-en-id': cards.filter((c) => c.type === 'vocab-en-id').length,
      verb: cards.filter((c) => c.type === 'verb').length,
      sentence: cards.filter((c) => c.type === 'sentence').length,
    },
    byDifficulty: {
      easy: cards.filter((c) => c.difficulty <= 2).length,
      medium: cards.filter((c) => c.difficulty === 3).length,
      hard: cards.filter((c) => c.difficulty >= 4).length,
    },
  }
}
