'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProgressPage() {
  const [userStats, setUserStats] = useState({
    streak: 0,
    longestStreak: 0,
    level: 1,
    xp: 0,
    verbsMastered: 0,
    patternsMastered: 0,
    lessonsCompleted: 0,
    totalStudyTimeMs: 0,
    accuracy: 0,
  })

  useEffect(() => {
    const savedStats = localStorage.getItem('userStats')
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  const xpToNextLevel = Math.pow(userStats.level, 2) * 100
  const xpProgress = (userStats.xp / xpToNextLevel) * 100
  const totalHours = Math.floor(userStats.totalStudyTimeMs / 3600000)
  const totalMinutes = Math.floor((userStats.totalStudyTimeMs % 3600000) / 60000)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
              <p className="text-sm text-gray-600">Track your learning journey</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Level Card */}
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm opacity-80 mb-1">Current Level</p>
              <h2 className="text-5xl font-bold">Level {userStats.level}</h2>
            </div>
            <div className="text-7xl">🏆</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{userStats.xp} XP</span>
              <span>{xpToNextLevel} XP</span>
            </div>
            <div className="progress-bar bg-white/20 h-4">
              <div
                className="progress-fill bg-white h-4"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-sm opacity-80">
              {xpToNextLevel - userStats.xp} XP to reach Level {userStats.level + 1}
            </p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">🔥</div>
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <h3 className="text-4xl font-bold text-primary-600">
                  {userStats.streak} days
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Keep it up! Study every day to maintain your streak.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">⭐</div>
              <div>
                <p className="text-sm text-gray-500">Longest Streak</p>
                <h3 className="text-4xl font-bold text-gray-700">
                  {userStats.longestStreak} days
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Your personal best streak record.
            </p>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Learning Progress
          </h2>

          <div className="space-y-6">
            {/* Verbs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📘</span>
                  <span className="font-semibold text-gray-900">Verbs Mastered</span>
                </div>
                <span className="text-xl font-bold text-primary-600">
                  {userStats.verbsMastered}/100
                </span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-fill h-3"
                  style={{ width: `${(userStats.verbsMastered / 100) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {100 - userStats.verbsMastered} verbs remaining
              </p>
            </div>

            {/* Patterns */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className="font-semibold text-gray-900">Patterns Learned</span>
                </div>
                <span className="text-xl font-bold text-primary-600">
                  {userStats.patternsMastered}/30
                </span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-fill h-3"
                  style={{ width: `${(userStats.patternsMastered / 30) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {30 - userStats.patternsMastered} patterns remaining
              </p>
            </div>

            {/* Lessons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <span className="font-semibold text-gray-900">Lessons Completed</span>
                </div>
                <span className="text-xl font-bold text-primary-600">
                  {userStats.lessonsCompleted}/48
                </span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-fill h-3"
                  style={{ width: `${(userStats.lessonsCompleted / 48) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Week {Math.ceil(userStats.lessonsCompleted / 3)} of 16
              </p>
            </div>
          </div>
        </div>

        {/* Study Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-3">⏱</div>
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {totalHours}h {totalMinutes}m
            </div>
            <p className="text-sm text-gray-600">Total Study Time</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {userStats.accuracy}%
            </div>
            <p className="text-sm text-gray-600">Overall Accuracy</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">⚡</div>
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {userStats.lessonsCompleted}
            </div>
            <p className="text-sm text-gray-600">Lessons Completed</p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="card bg-gradient-to-r from-success-500/10 to-primary-500/10 border-success-500">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🎉</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Great progress!
              </h3>
              <p className="text-gray-700">
                You're {Math.round((userStats.lessonsCompleted / 48) * 100)}% through the 16-week program.
                Keep up the excellent work! 💪
              </p>
            </div>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">🎯 Next Milestone</h3>
          <div className="space-y-3">
            {userStats.verbsMastered < 25 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📘</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Master 25 verbs</p>
                  <p className="text-sm text-gray-600">
                    {25 - userStats.verbsMastered} more to go
                  </p>
                </div>
              </div>
            )}
            {userStats.patternsMastered < 10 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Learn 10 patterns</p>
                  <p className="text-sm text-gray-600">
                    {10 - userStats.patternsMastered} more to go
                  </p>
                </div>
              </div>
            )}
            {userStats.lessonsCompleted < 12 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📚</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Complete first month</p>
                  <p className="text-sm text-gray-600">
                    {12 - userStats.lessonsCompleted} lessons remaining
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
