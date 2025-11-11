'use client'

import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { useAppStore } from '@/lib/store/useAppStore'
import scenariosData from '@/src/data/scenarios.json'

export default function DialoguesPracticePage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(true)
  const { incrementXP, updateStats, userStats } = useAppStore()

  const scenarios = Object.entries(scenariosData.scenarios)
  const scenario = selectedScenario
    ? scenariosData.scenarios[selectedScenario as keyof typeof scenariosData.scenarios]
    : null

  const handleNextLine = () => {
    if (!scenario) return
    if (currentLineIndex < scenario.dialog.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
    } else {
      // Dialog completed
      incrementXP(25)
      updateStats({
        totalDialoguesCompleted: userStats.totalDialoguesCompleted + 1
      })
      setCurrentLineIndex(0)
    }
  }

  const handlePrevLine = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1)
    }
  }

  const handleRestart = () => {
    setCurrentLineIndex(0)
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
              <h1 className="text-2xl font-bold text-gray-900">Dialogue Practice</h1>
              <p className="text-sm text-gray-600">Practice real-life conversations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!scenario ? (
          /* Scenario List */
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Choose a Scenario
              </h2>
              <p className="text-gray-600">
                {scenarios.length} real-life situations • {userStats.totalDialoguesCompleted} completed
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map(([key, s]) => {
                const difficultyEmoji = s.difficulty === 1 ? '🟢' : s.difficulty === 2 ? '🟡' : '🔴'
                const difficultyText = s.difficulty === 1 ? 'Beginner' : s.difficulty === 2 ? 'Elementary' : 'Intermediate'

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedScenario(key)
                      setCurrentLineIndex(0)
                    }}
                    className="card text-left p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    <div className="text-4xl mb-4">💬</div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {s.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{difficultyEmoji} {difficultyText}</span>
                      <span>•</span>
                      <span>Week {s.week}</span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      {s.dialog.length} lines
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* Dialog Practice */
          <div>
            <button
              onClick={() => {
                setSelectedScenario(null)
                setCurrentLineIndex(0)
              }}
              className="btn btn-secondary mb-6"
            >
              ← Back to scenarios
            </button>

            {/* Scenario Header */}
            <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{scenario.title}</h2>
                  <div className="flex items-center gap-3 text-sm opacity-90">
                    <span>Week {scenario.week}</span>
                    <span>•</span>
                    <span>{scenario.difficulty === 1 ? 'Beginner' : scenario.difficulty === 2 ? 'Elementary' : 'Intermediate'}</span>
                    <span>•</span>
                    <span>{scenario.dialog.length} lines</span>
                  </div>
                </div>
                <div className="text-5xl">💬</div>
              </div>
            </div>

            {/* Controls */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Line {currentLineIndex + 1} of {scenario.dialog.length}
                </h3>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTranslation}
                    onChange={(e) => setShowTranslation(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Show English
                </label>
              </div>

              <div className="progress-bar h-2">
                <div
                  className="progress-fill h-2"
                  style={{ width: `${((currentLineIndex + 1) / scenario.dialog.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Dialog Display */}
            <div className="space-y-4 mb-6">
              {scenario.dialog.map((line, idx) => {
                const isPast = idx < currentLineIndex
                const isCurrent = idx === currentLineIndex
                const isFuture = idx > currentLineIndex

                if (isFuture) return null

                return (
                  <div
                    key={idx}
                    className={`card transition-all ${
                      isCurrent
                        ? 'bg-primary-50 border-2 border-primary-500 shadow-lg scale-[1.02]'
                        : isPast
                        ? 'bg-gray-50 opacity-60'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          line.speaker === 'You'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {line.speaker === 'You' ? '👤' : '💬'}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {line.speaker}
                          </span>
                          {isCurrent && (
                            <span className="text-xs px-2 py-1 bg-primary-500 text-white rounded-full">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-3 mb-2">
                          <p className="text-xl font-semibold text-gray-900 flex-1">
                            {line.indonesian}
                          </p>
                          <AudioPlayer
                            text={line.indonesian}
                            showText={false}
                            size="md"
                          />
                        </div>

                        {showTranslation && (
                          <p className="text-gray-600">{line.english}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="card">
              <div className="flex gap-4">
                <button
                  onClick={handlePrevLine}
                  disabled={currentLineIndex === 0}
                  className="btn btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {currentLineIndex < scenario.dialog.length - 1 ? (
                  <button
                    onClick={handleNextLine}
                    className="btn btn-primary flex-1"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      incrementXP(25)
                      updateStats({
                        totalDialoguesCompleted: userStats.totalDialoguesCompleted + 1
                      })
                      setSelectedScenario(null)
                    }}
                    className="btn bg-success-500 hover:bg-success-600 text-white flex-1"
                  >
                    Complete Dialog ✓
                  </button>
                )}
              </div>

              <button
                onClick={handleRestart}
                className="btn btn-secondary w-full mt-4"
              >
                🔄 Restart Dialog
              </button>
            </div>

            {/* Complete Transcript */}
            <div className="card mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Complete Transcript:
              </h3>
              <div className="space-y-3">
                {scenario.dialog.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-2">
                    <span className="font-semibold text-gray-500 min-w-[80px]">
                      {line.speaker}:
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{line.indonesian}</p>
                      <p className="text-sm text-gray-600">{line.english}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
