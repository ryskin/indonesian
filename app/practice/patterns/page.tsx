'use client'

import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { useAppStore } from '@/lib/store/useAppStore'
import patternsData from '@/src/data/patterns.json'

export default function PatternsPracticePage() {
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const { addMasteredPattern, incrementXP, userStats } = useAppStore()

  const patterns = patternsData.patterns
  const pattern = selectedPattern !== null
    ? patterns.find(p => p.id === selectedPattern)
    : null

  const handleNextExample = () => {
    if (!pattern) return
    if (currentExampleIndex < pattern.examples.length - 1) {
      setCurrentExampleIndex(currentExampleIndex + 1)
      setShowAnswer(false)
    } else {
      // Pattern completed
      addMasteredPattern(pattern.id)
      incrementXP(30)
      setCurrentExampleIndex(0)
      setShowAnswer(false)
    }
  }

  const handleMasterPattern = () => {
    if (!pattern) return
    addMasteredPattern(pattern.id)
    incrementXP(50)
    setSelectedPattern(null)
    setCurrentExampleIndex(0)
    setShowAnswer(false)
  }

  const isMastered = (patternId: number) => {
    return userStats.patternsMastered.includes(patternId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pattern Practice</h1>
              <p className="text-sm text-gray-600">Master 30 essential sentence patterns</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!pattern ? (
          /* Pattern List */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {userStats.patternsMastered.length}/30 Patterns Mastered
                </h2>
                <p className="text-sm text-gray-600">
                  Click any pattern to start practicing
                </p>
              </div>
            </div>

            {/* Difficulty Filter Info */}
            <div className="card bg-primary-50 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Pattern Difficulty:</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-success-500 rounded-full"></span>
                  <span>Beginner (Weeks 1-4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-warning-500 rounded-full"></span>
                  <span>Elementary (Weeks 5-12)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-error-500 rounded-full"></span>
                  <span>Intermediate (Weeks 13-16)</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {patterns.map((p) => {
                const mastered = isMastered(p.id)
                const difficultyColor = p.difficulty === 1 ? 'success' : p.difficulty === 2 ? 'warning' : 'error'

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPattern(p.id)
                      setCurrentExampleIndex(0)
                      setShowAnswer(false)
                    }}
                    className="card text-left p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          Pattern #{p.id} • Week {p.week}
                        </div>
                        <h3 className="text-2xl font-bold text-primary-600 mb-2">
                          {p.pattern}
                        </h3>
                        <p className="text-gray-700 mb-3">{p.english}</p>
                        <p className="text-sm text-gray-600">{p.description}</p>
                      </div>
                      {mastered && (
                        <div className="text-3xl ml-4">✅</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs bg-${difficultyColor}-500/20 text-${difficultyColor}-600`}>
                        {p.difficulty === 1 ? 'Beginner' : p.difficulty === 2 ? 'Elementary' : 'Intermediate'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {p.examples.length} examples
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* Pattern Detail & Practice */
          <div>
            <button
              onClick={() => {
                setSelectedPattern(null)
                setCurrentExampleIndex(0)
                setShowAnswer(false)
              }}
              className="btn btn-secondary mb-6"
            >
              ← Back to list
            </button>

            {/* Pattern Header */}
            <div className="card mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-2">
                    Pattern #{pattern.id} • Week {pattern.week}
                  </div>
                  <h2 className="text-4xl font-bold text-primary-600 mb-3">
                    {pattern.pattern}
                  </h2>
                  <p className="text-2xl text-gray-700 mb-2">{pattern.english}</p>
                  <p className="text-gray-600">{pattern.description}</p>
                </div>
                {isMastered(pattern.id) && (
                  <div className="text-6xl">✅</div>
                )}
              </div>
            </div>

            {/* Practice Card */}
            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Example {currentExampleIndex + 1} of {pattern.examples.length}
                </h3>
                <div className="flex gap-2">
                  {pattern.examples.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx <= currentExampleIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="card bg-white/10 backdrop-blur-sm p-6 mb-6">
                {!showAnswer ? (
                  <div className="text-center py-12">
                    <p className="text-sm opacity-80 mb-4">Translate to Indonesian:</p>
                    <h3 className="text-3xl font-bold mb-8">
                      {pattern.examples[currentExampleIndex].english}
                    </h3>
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="btn bg-white text-primary-600 hover:bg-gray-100"
                    >
                      Show Answer
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm opacity-80 mb-2">Indonesian:</p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h3 className="text-4xl font-bold">
                        {pattern.examples[currentExampleIndex].indonesian}
                      </h3>
                      <AudioPlayer
                        text={pattern.examples[currentExampleIndex].indonesian}
                        className="text-white hover:text-white"
                        size="lg"
                      />
                    </div>
                    <p className="text-xl opacity-90">
                      {pattern.examples[currentExampleIndex].english}
                    </p>
                  </div>
                )}
              </div>

              {showAnswer && (
                <div className="flex gap-4">
                  {currentExampleIndex < pattern.examples.length - 1 ? (
                    <button
                      onClick={handleNextExample}
                      className="btn bg-white text-primary-600 hover:bg-gray-100 flex-1"
                    >
                      Next Example →
                    </button>
                  ) : (
                    <button
                      onClick={handleNextExample}
                      className="btn bg-success-500 hover:bg-success-600 text-white flex-1"
                    >
                      Complete Practice ✓
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* All Examples */}
            <div className="card">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                All {pattern.examples.length} Examples:
              </h3>
              <div className="space-y-3">
                {pattern.examples.map((example, idx) => (
                  <div
                    key={idx}
                    className={`card p-4 ${
                      idx <= currentExampleIndex
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {example.indonesian}
                        </p>
                        <p className="text-sm text-gray-600">{example.english}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {idx <= currentExampleIndex && (
                          <span className="text-success-500">✓</span>
                        )}
                        <AudioPlayer
                          text={example.indonesian}
                          showText={false}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isMastered(pattern.id) && (
              <button
                onClick={handleMasterPattern}
                className="btn btn-primary w-full mt-6"
              >
                ✅ Mark as Mastered (+50 XP)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
