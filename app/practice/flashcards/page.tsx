'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store/useAppStore'
import { SRSEngine, FlashcardData } from '@/lib/engines/srs'
import { generateAllFlashcards, Flashcard, getFlashcardStats } from '@/lib/data/flashcards'
import AudioPlayer from '@/components/audio/AudioPlayer'

export default function FlashcardsPage() {
  const router = useRouter()
  const { flashcardProgress, updateFlashcard, incrementXP, updateStats, userStats, startSession } = useAppStore()
  const [selectedMode, setSelectedMode] = useState<'all' | 'due' | 'new'>('due')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([])
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0, skipped: 0 })
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  // Generate all available flashcards
  const allFlashcards = useMemo(() => generateAllFlashcards(), [])

  // Get flashcard SRS data
  const getCardData = useCallback((cardId: string): FlashcardData => {
    return flashcardProgress[cardId] || SRSEngine.createCard(cardId)
  }, [flashcardProgress])

  // Filter cards based on mode
  const filteredCards = useMemo(() => {
    const cardsWithData = allFlashcards.map((card) => ({
      ...card,
      srsData: getCardData(card.id),
    }))

    if (selectedMode === 'new') {
      return cardsWithData.filter((c) => c.srsData.stage === 'new').slice(0, 20)
    } else if (selectedMode === 'due') {
      return cardsWithData.filter((c) => SRSEngine.isDue(c.srsData)).slice(0, 30)
    }
    return cardsWithData.slice(0, 50)
  }, [allFlashcards, getCardData, selectedMode])

  useEffect(() => {
    if (filteredCards.length > 0 && sessionCards.length === 0) {
      setSessionCards(filteredCards)
      setStartTime(Date.now())
      startSession()
    }
  }, [filteredCards, sessionCards.length, startSession])

  const currentCard = sessionCards[currentCardIndex]
  const progressPercent = sessionCards.length > 0 ? ((currentCardIndex + 1) / sessionCards.length) * 100 : 0

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleRating = (quality: number) => {
    if (!currentCard) return

    const cardData = getCardData(currentCard.id)
    const updatedData = SRSEngine.reviewCard(cardData, quality)
    updateFlashcard(currentCard.id, updatedData)

    // Update session stats
    const isCorrect = quality >= 3
    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      skipped: prev.skipped,
    }))

    // Award XP
    const xpGain = quality === 5 ? 10 : quality === 4 ? 8 : quality === 3 ? 5 : 2
    incrementXP(xpGain)

    // Move to next card
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      // Session complete
      setShowResults(true)
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      updateStats({
        totalReviews: userStats.totalReviews + sessionStats.reviewed + 1,
        correctAnswers: userStats.correctAnswers + sessionStats.correct + (isCorrect ? 1 : 0),
        totalAnswers: userStats.totalAnswers + sessionStats.reviewed + 1,
      })
    }
  }

  const handleSkip = () => {
    setSessionStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }))
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setShowResults(true)
    }
  }

  const stats = useMemo(() => {
    const allCardsData = allFlashcards.map((card) => getCardData(card.id))
    return SRSEngine.getStats(allCardsData)
  }, [allFlashcards, getCardData])

  const flashcardTotalStats = useMemo(() => getFlashcardStats(), [])

  if (showResults) {
    const accuracy = sessionStats.reviewed > 0 ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100) : 0
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-24">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/practice" className="text-gray-600 hover:text-primary-600">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Session Complete!</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card bg-gradient-to-br from-success-50 to-success-100 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Great Work!</h2>
            <p className="text-gray-700 mb-8">You've completed your flashcard session</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-primary-600">{sessionStats.reviewed}</div>
                <div className="text-sm text-gray-600">Reviewed</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-success-600">{sessionStats.correct}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">{timeSpent}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowResults(false)
                  setCurrentCardIndex(0)
                  setSessionStats({ reviewed: 0, correct: 0, skipped: 0 })
                  setSessionCards(filteredCards)
                  setStartTime(Date.now())
                }}
                className="btn-primary"
              >
                Practice More
              </button>
              <Link href="/practice" className="btn-secondary">
                Back to Practice
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (sessionCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-24">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/practice" className="text-gray-600 hover:text-primary-600">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card text-center">
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No cards available</h2>
            <p className="text-gray-600 mb-6">
              {selectedMode === 'due' ? 'No cards are due for review right now. Check back later!' : 'Try selecting a different mode.'}
            </p>
            <Link href="/practice" className="btn-primary">
              Back to Practice
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/practice" className="text-gray-600 hover:text-primary-600">
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
                <p className="text-sm text-gray-600">
                  {currentCardIndex + 1} / {sessionCards.length}
                </p>
              </div>
            </div>
            <button onClick={handleSkip} className="text-sm text-gray-600 hover:text-primary-600">
              Skip →
            </button>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-success-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedMode('due')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMode === 'due'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Due ({stats.due})
          </button>
          <button
            onClick={() => setSelectedMode('new')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMode === 'new'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            New ({stats.newCards})
          </button>
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMode === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({flashcardTotalStats.total})
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="card bg-gradient-to-br from-gray-50 to-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.mastered}</div>
            <div className="text-xs text-gray-600">Mastered</div>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 text-center">
            <div className="text-2xl font-bold text-blue-900">{stats.review}</div>
            <div className="text-xs text-blue-700">Review</div>
          </div>
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 text-center">
            <div className="text-2xl font-bold text-yellow-900">{stats.learning}</div>
            <div className="text-xs text-yellow-700">Learning</div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 text-center">
            <div className="text-2xl font-bold text-green-900">{stats.accuracy}%</div>
            <div className="text-xs text-green-700">Accuracy</div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="relative mb-6" style={{ minHeight: '400px' }}>
          <div
            className={`card cursor-pointer transform transition-all duration-500 ${
              isFlipped ? 'scale-95' : 'scale-100 hover:scale-102'
            }`}
            onClick={handleFlip}
            style={{
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: isFlipped
                ? 'linear-gradient(to bottom right, #e0f2fe, #dbeafe)'
                : 'linear-gradient(to bottom right, #fef3c7, #fef9c3)',
            }}
          >
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow">
                {currentCard.category}
              </span>
            </div>

            {/* Difficulty Indicator */}
            <div className="absolute top-4 right-4 flex gap-1">
              {Array.from({ length: currentCard.difficulty }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary-500" />
              ))}
            </div>

            {/* Card Content */}
            <div className="text-center px-8">
              {!isFlipped ? (
                <>
                  <div className="text-sm text-gray-600 mb-3">Question</div>
                  <div className="text-4xl font-bold text-gray-900 mb-6">{currentCard.front}</div>
                  {currentCard.hint && !isFlipped && (
                    <div className="text-sm text-gray-600 italic">💡 {currentCard.hint}</div>
                  )}
                  <div className="mt-6 text-sm text-gray-500">Click to reveal answer</div>
                </>
              ) : (
                <>
                  <div className="text-sm text-blue-600 mb-3">Answer</div>
                  <div className="text-4xl font-bold text-blue-900 mb-6">{currentCard.back}</div>
                  {currentCard.audio && (
                    <div className="mb-4">
                      <AudioPlayer text={currentCard.back} autoPlay={false} />
                    </div>
                  )}
                  {currentCard.examples && currentCard.examples.length > 0 && (
                    <div className="mt-6 text-sm text-gray-700 bg-white rounded-lg p-4">
                      <div className="font-semibold mb-2">Examples:</div>
                      {currentCard.examples.slice(0, 2).map((ex, i) => (
                        <div key={i} className="text-left mb-1">
                          • {ex}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating Buttons (only show when flipped) */}
        {isFlipped && (
          <div className="card bg-white">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">How well did you know this?</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRating(1)}
                className="p-4 rounded-lg border-2 border-red-300 hover:border-red-500 hover:bg-red-50 transition-colors"
              >
                <div className="text-2xl mb-1">😓</div>
                <div className="font-semibold text-red-900">Again</div>
                <div className="text-xs text-red-600">&lt; 1 day</div>
              </button>
              <button
                onClick={() => handleRating(3)}
                className="p-4 rounded-lg border-2 border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
              >
                <div className="text-2xl mb-1">😐</div>
                <div className="font-semibold text-yellow-900">Hard</div>
                <div className="text-xs text-yellow-600">1-3 days</div>
              </button>
              <button
                onClick={() => handleRating(4)}
                className="p-4 rounded-lg border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-2xl mb-1">🙂</div>
                <div className="font-semibold text-blue-900">Good</div>
                <div className="text-xs text-blue-600">3-7 days</div>
              </button>
            </div>
            <button
              onClick={() => handleRating(5)}
              className="w-full mt-3 p-4 rounded-lg border-2 border-green-300 hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="text-2xl mb-1">😄</div>
              <div className="font-semibold text-green-900">Easy</div>
              <div className="text-xs text-green-600">7+ days</div>
            </button>
          </div>
        )}

        {/* Session Stats */}
        <div className="card bg-gray-50 mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">This Session</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">{sessionStats.reviewed}</div>
              <div className="text-sm text-gray-600">Reviewed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success-600">{sessionStats.correct}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{sessionStats.skipped}</div>
              <div className="text-sm text-gray-600">Skipped</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
