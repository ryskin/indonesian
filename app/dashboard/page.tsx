'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import curriculum from '@/src/data/curriculum.json'

export default function DashboardPage() {
  const [userStats, setUserStats] = useState({
    streak: 0,
    level: 1,
    xp: 0,
    verbsMastered: 0,
    patternsMastered: 0,
    lessonsCompleted: 0,
  })

  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentDay, setCurrentDay] = useState(1)

  useEffect(() => {
    // Load user stats from localStorage
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }

    const savedWeek = localStorage.getItem('currentWeek')
    const savedDay = localStorage.getItem('currentDay')
    if (savedWeek) setCurrentWeek(parseInt(savedWeek))
    if (savedDay) setCurrentDay(parseInt(savedDay))
  }, [])

  // Get current week data
  const weekKey = `week_${currentWeek}` as keyof typeof curriculum.curriculum
  const weekData = curriculum.curriculum[weekKey]
  const currentLesson = weekData?.lessons[currentDay - 1]

  const xpToNextLevel = Math.pow(userStats.level, 2) * 100
  const xpProgress = (userStats.xp / xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">
              🇮🇩 Indonesian
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-semibold text-gray-800">
                  {userStats.streak} days
                </span>
              </div>
              <Link
                href="/progress"
                className="text-gray-600 hover:text-primary-600"
              >
                📊
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">
            Let's continue your Indonesian learning journey
          </p>
        </div>

        {/* Level & XP Card */}
        <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80 mb-1">Current Level</p>
              <h3 className="text-4xl font-bold">Level {userStats.level}</h3>
            </div>
            <div className="text-6xl">🏆</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{userStats.xp} XP</span>
              <span>{xpToNextLevel} XP</span>
            </div>
            <div className="progress-bar bg-white/20">
              <div
                className="progress-fill bg-white"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs opacity-80">
              {xpToNextLevel - userStats.xp} XP to next level
            </p>
          </div>
        </div>

        {/* Today's Lesson Card */}
        <div className="card mb-8 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Week {currentWeek} · Day {currentDay}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {currentLesson?.title || "Today's Lesson"}
              </h3>
              <p className="text-gray-600 mt-2">
                {currentLesson?.content || weekData?.goal}
              </p>
            </div>
            <div className="text-4xl">📚</div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>⏱</span>
              <span>~10-15 min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📝</span>
              <span>{currentLesson?.exercises?.length || 3} exercises</span>
            </div>
          </div>

          <Link
            href="/lesson"
            className="btn btn-primary w-full text-lg"
          >
            Continue Lesson →
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-700">Verbs Mastered</h4>
              <span className="text-3xl">📘</span>
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {userStats.verbsMastered}/100
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(userStats.verbsMastered / 100) * 100}%` }}
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-700">Patterns Learned</h4>
              <span className="text-3xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {userStats.patternsMastered}/30
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(userStats.patternsMastered / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-700">Lessons Done</h4>
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {userStats.lessonsCompleted}/48
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(userStats.lessonsCompleted / 48) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Practice</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/map"
              className="card hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-success-500 bg-gradient-to-br from-success-50 to-primary-50"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🗺️</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Language Map</h4>
                  <p className="text-sm text-gray-600">
                    See your learning journey
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/practice/verbs"
              className="card hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-primary-500"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">📘</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Verb Practice</h4>
                  <p className="text-sm text-gray-600">
                    Master 100 essential verbs
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/practice/patterns"
              className="card hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-primary-500"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pattern Practice</h4>
                  <p className="text-sm text-gray-600">
                    30 key sentence structures
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/practice/svo"
              className="card hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-primary-500"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏗</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Build Sentences</h4>
                  <p className="text-sm text-gray-600">
                    SVO constructor practice
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/practice/dialogues"
              className="card hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-primary-500"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">💬</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Dialogues</h4>
                  <p className="text-sm text-gray-600">
                    Real-life conversations
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-1">
            <Link
              href="/dashboard"
              className="flex flex-col items-center py-3 text-primary-600 border-t-2 border-primary-600"
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              href="/practice"
              className="flex flex-col items-center py-3 text-gray-600 hover:text-primary-600"
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

      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </div>
  )
}
