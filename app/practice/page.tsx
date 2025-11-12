'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store/useAppStore'

export default function PracticePage() {
  const { userStats } = useAppStore()

  const practiceOptions = [
    {
      title: 'Flashcards',
      description: 'Spaced repetition vocabulary practice',
      icon: '🎴',
      href: '/practice/flashcards',
      stats: `${userStats.flashcardsMastered || 0} mastered`,
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Verb Practice',
      description: 'Master 100 essential Indonesian verbs',
      icon: '📘',
      href: '/practice/verbs',
      stats: `${userStats.verbsMastered.length}/100 mastered`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Pattern Practice',
      description: '30 key sentence structures',
      icon: '🎯',
      href: '/practice/patterns',
      stats: `${userStats.patternsMastered.length}/30 learned`,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'SVO Constructor',
      description: 'Build sentences with Subject-Verb-Object',
      icon: '🏗',
      href: '/practice/svo',
      stats: `${userStats.totalSentencesCreated} sentences created`,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Dialogues',
      description: 'Real-life conversation practice',
      icon: '💬',
      href: '/practice/dialogues',
      stats: `${userStats.totalDialoguesCompleted}/30 completed`,
      color: 'from-pink-500 to-pink-600'
    }
  ]

  const quickLinks = [
    {
      title: 'Daily Review',
      description: 'Review items due today',
      icon: '📅',
      action: 'Coming Soon',
      color: 'bg-orange-50 border-orange-500'
    },
    {
      title: 'Pronunciation',
      description: 'Practice speaking skills',
      icon: '🗣',
      action: 'Coming Soon',
      color: 'bg-indigo-50 border-indigo-500'
    },
    {
      title: 'Listening',
      description: 'Audio comprehension exercises',
      icon: '👂',
      action: 'Coming Soon',
      color: 'bg-rose-50 border-rose-500'
    },
    {
      title: 'Grammar',
      description: 'Learn sentence structure rules',
      icon: '📖',
      action: 'Coming Soon',
      color: 'bg-blue-50 border-blue-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice Hub
          </h1>
          <p className="text-gray-600">
            Choose your practice mode and improve your skills
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Daily Stats */}
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80 mb-1">Today's Progress</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-3xl font-bold">{userStats.streak}</p>
                  <p className="text-sm opacity-80">Day Streak</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{userStats.xp}</p>
                  <p className="text-sm opacity-80">Total XP</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">Level {userStats.level}</p>
                  <p className="text-sm opacity-80">Current Level</p>
                </div>
              </div>
            </div>
            <div className="text-7xl">📊</div>
          </div>
        </div>

        {/* Main Practice Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Core Practice
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {practiceOptions.map((option) => (
              <Link
                key={option.href}
                href={option.href}
                className="group"
              >
                <div className="card hover:shadow-2xl transition-all duration-300 h-full border-2 border-transparent hover:border-primary-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`text-6xl mb-4 transform group-hover:scale-110 transition-transform`}>
                      {option.icon}
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${option.color} text-white text-xs font-semibold`}>
                      Active
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {option.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      {option.stats}
                    </span>
                    <span className="text-primary-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                      Start →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Practice */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Practice
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => (
              <div
                key={idx}
                className={`card ${link.color} border-2 opacity-60 cursor-not-allowed`}
              >
                <div className="text-4xl mb-3">{link.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {link.description}
                </p>
                <div className="text-xs text-gray-500 font-semibold">
                  {link.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Tips */}
        <div className="card bg-gradient-to-r from-primary-50 to-success-50 border-primary-500">
          <div className="flex items-start gap-4">
            <div className="text-5xl">💡</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Study Tips
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Practice for at least 10-15 minutes daily to maintain your streak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Focus on verbs first - they're the foundation of sentences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Use the SVO constructor to practice real sentence building</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Practice dialogues to prepare for real conversations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-1">
            <Link
              href="/dashboard"
              className="flex flex-col items-center py-3 text-gray-600 hover:text-primary-600"
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              href="/practice"
              className="flex flex-col items-center py-3 text-primary-600 border-t-2 border-primary-600"
            >
              <span className="text-2xl mb-1">📚</span>
              <span className="text-xs font-medium">Practice</span>
            </Link>
            <Link
              href="/progress"
              className="flex flex-col items-center py-3 text-gray-600 hover:text-primary-600"
            >
              <span className="text-2xl mb-1">📊</span>
              <span className="text-xs font-medium">Progress</span>
            </Link>
            <Link
              href="/settings"
              className="flex flex-col items-center py-3 text-gray-600 hover:text-primary-600"
            >
              <span className="text-2xl mb-1">⚙️</span>
              <span className="text-xs font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
