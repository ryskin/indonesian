'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store/useAppStore'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'learning' | 'practice' | 'streak' | 'mastery' | 'social'
  requirement: number
  currentProgress: number
  unlocked: boolean
  xpReward: number
}

export default function AchievementsPage() {
  const { userStats } = useAppStore()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Calculate achievements based on user stats
    const allAchievements: Achievement[] = [
      // Learning Achievements
      {
        id: 'first_lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '👣',
        category: 'learning',
        requirement: 1,
        currentProgress: userStats.lessonsCompleted,
        unlocked: userStats.lessonsCompleted >= 1,
        xpReward: 50
      },
      {
        id: 'week_complete',
        title: 'Week Warrior',
        description: 'Complete your first week (3 lessons)',
        icon: '📅',
        category: 'learning',
        requirement: 3,
        currentProgress: userStats.lessonsCompleted,
        unlocked: userStats.lessonsCompleted >= 3,
        xpReward: 100
      },
      {
        id: 'month_complete',
        title: 'Monthly Master',
        description: 'Complete one month (12 lessons)',
        icon: '🗓',
        category: 'learning',
        requirement: 12,
        currentProgress: userStats.lessonsCompleted,
        unlocked: userStats.lessonsCompleted >= 12,
        xpReward: 250
      },
      {
        id: 'program_complete',
        title: 'Program Champion',
        description: 'Complete all 48 lessons',
        icon: '🏆',
        category: 'learning',
        requirement: 48,
        currentProgress: userStats.lessonsCompleted,
        unlocked: userStats.lessonsCompleted >= 48,
        xpReward: 1000
      },

      // Verb Mastery
      {
        id: 'first_verb',
        title: 'Verb Beginner',
        description: 'Master your first verb',
        icon: '📘',
        category: 'mastery',
        requirement: 1,
        currentProgress: userStats.verbsMastered,
        unlocked: userStats.verbsMastered >= 1,
        xpReward: 25
      },
      {
        id: 'verb_10',
        title: 'Verb Collector',
        description: 'Master 10 verbs',
        icon: '📚',
        category: 'mastery',
        requirement: 10,
        currentProgress: userStats.verbsMastered,
        unlocked: userStats.verbsMastered >= 10,
        xpReward: 100
      },
      {
        id: 'verb_25',
        title: 'Verb Expert',
        description: 'Master 25 verbs',
        icon: '📖',
        category: 'mastery',
        requirement: 25,
        currentProgress: userStats.verbsMastered,
        unlocked: userStats.verbsMastered >= 25,
        xpReward: 250
      },
      {
        id: 'verb_50',
        title: 'Verb Master',
        description: 'Master 50 verbs',
        icon: '🎓',
        category: 'mastery',
        requirement: 50,
        currentProgress: userStats.verbsMastered,
        unlocked: userStats.verbsMastered >= 50,
        xpReward: 500
      },
      {
        id: 'verb_100',
        title: 'Verb Legend',
        description: 'Master all 100 verbs',
        icon: '👑',
        category: 'mastery',
        requirement: 100,
        currentProgress: userStats.verbsMastered,
        unlocked: userStats.verbsMastered >= 100,
        xpReward: 1500
      },

      // Pattern Mastery
      {
        id: 'pattern_5',
        title: 'Pattern Pioneer',
        description: 'Learn 5 sentence patterns',
        icon: '🎯',
        category: 'mastery',
        requirement: 5,
        currentProgress: userStats.patternsMastered,
        unlocked: userStats.patternsMastered >= 5,
        xpReward: 100
      },
      {
        id: 'pattern_15',
        title: 'Pattern Pro',
        description: 'Learn 15 sentence patterns',
        icon: '🎪',
        category: 'mastery',
        requirement: 15,
        currentProgress: userStats.patternsMastered,
        unlocked: userStats.patternsMastered >= 15,
        xpReward: 300
      },
      {
        id: 'pattern_30',
        title: 'Pattern Perfectionist',
        description: 'Master all 30 patterns',
        icon: '💎',
        category: 'mastery',
        requirement: 30,
        currentProgress: userStats.patternsMastered,
        unlocked: userStats.patternsMastered >= 30,
        xpReward: 750
      },

      // Practice Achievements
      {
        id: 'sentence_10',
        title: 'Sentence Builder',
        description: 'Create 10 sentences',
        icon: '🏗',
        category: 'practice',
        requirement: 10,
        currentProgress: userStats.totalSentencesCreated,
        unlocked: userStats.totalSentencesCreated >= 10,
        xpReward: 50
      },
      {
        id: 'sentence_50',
        title: 'Sentence Architect',
        description: 'Create 50 sentences',
        icon: '🏛',
        category: 'practice',
        requirement: 50,
        currentProgress: userStats.totalSentencesCreated,
        unlocked: userStats.totalSentencesCreated >= 50,
        xpReward: 200
      },
      {
        id: 'sentence_100',
        title: 'Sentence Master',
        description: 'Create 100 sentences',
        icon: '🏰',
        category: 'practice',
        requirement: 100,
        currentProgress: userStats.totalSentencesCreated,
        unlocked: userStats.totalSentencesCreated >= 100,
        xpReward: 500
      },
      {
        id: 'dialogue_5',
        title: 'Conversationalist',
        description: 'Complete 5 dialogues',
        icon: '💬',
        category: 'practice',
        requirement: 5,
        currentProgress: userStats.totalDialoguesCompleted,
        unlocked: userStats.totalDialoguesCompleted >= 5,
        xpReward: 100
      },
      {
        id: 'dialogue_15',
        title: 'Dialogue Master',
        description: 'Complete 15 dialogues',
        icon: '🗣',
        category: 'practice',
        requirement: 15,
        currentProgress: userStats.totalDialoguesCompleted,
        unlocked: userStats.totalDialoguesCompleted >= 15,
        xpReward: 300
      },
      {
        id: 'dialogue_30',
        title: 'Conversation Expert',
        description: 'Complete all 30 dialogues',
        icon: '🎭',
        category: 'practice',
        requirement: 30,
        currentProgress: userStats.totalDialoguesCompleted,
        unlocked: userStats.totalDialoguesCompleted >= 30,
        xpReward: 750
      },

      // Streak Achievements
      {
        id: 'streak_3',
        title: 'Consistent Learner',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        category: 'streak',
        requirement: 3,
        currentProgress: userStats.streak,
        unlocked: userStats.streak >= 3,
        xpReward: 50
      },
      {
        id: 'streak_7',
        title: 'Week Streak',
        description: 'Maintain a 7-day streak',
        icon: '🌟',
        category: 'streak',
        requirement: 7,
        currentProgress: userStats.streak,
        unlocked: userStats.streak >= 7,
        xpReward: 150
      },
      {
        id: 'streak_30',
        title: 'Month Streak',
        description: 'Maintain a 30-day streak',
        icon: '⭐',
        category: 'streak',
        requirement: 30,
        currentProgress: userStats.streak,
        unlocked: userStats.streak >= 30,
        xpReward: 500
      },
      {
        id: 'streak_100',
        title: 'Dedication Legend',
        description: 'Maintain a 100-day streak',
        icon: '💫',
        category: 'streak',
        requirement: 100,
        currentProgress: userStats.streak,
        unlocked: userStats.streak >= 100,
        xpReward: 2000
      },

      // Level Achievements
      {
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reach Level 5',
        icon: '⚡',
        category: 'learning',
        requirement: 5,
        currentProgress: userStats.level,
        unlocked: userStats.level >= 5,
        xpReward: 100
      },
      {
        id: 'level_10',
        title: 'Experienced Learner',
        description: 'Reach Level 10',
        icon: '💪',
        category: 'learning',
        requirement: 10,
        currentProgress: userStats.level,
        unlocked: userStats.level >= 10,
        xpReward: 250
      },
      {
        id: 'level_20',
        title: 'Expert Student',
        description: 'Reach Level 20',
        icon: '🚀',
        category: 'learning',
        requirement: 20,
        currentProgress: userStats.level,
        unlocked: userStats.level >= 20,
        xpReward: 500
      }
    ]

    setAchievements(allAchievements)
  }, [userStats])

  const categories = [
    { id: 'all', name: 'All', icon: '🏅' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'practice', name: 'Practice', icon: '✍️' },
    { id: 'mastery', name: 'Mastery', icon: '🎓' },
    { id: 'streak', name: 'Streaks', icon: '🔥' }
  ]

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

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
              <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
              <p className="text-sm text-gray-600">Track your learning milestones</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {unlockedCount} / {totalCount}
              </h2>
              <p className="text-lg opacity-90 mb-4">
                Achievements Unlocked
              </p>
              <div className="flex items-center gap-3">
                <div className="progress-bar bg-white/20 h-3 flex-1 max-w-xs">
                  <div
                    className="progress-fill bg-white h-3"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{completionPercentage}%</span>
              </div>
            </div>
            <div className="text-8xl">🏆</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const count = cat.id === 'all'
                ? achievements.filter(a => a.unlocked).length
                : achievements.filter(a => a.category === cat.id && a.unlocked).length

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                  <span className="ml-2 text-xs opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const progress = Math.min(
              (achievement.currentProgress / achievement.requirement) * 100,
              100
            )

            return (
              <div
                key={achievement.id}
                className={`card transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-white to-primary-50 border-2 border-primary-500 shadow-lg'
                    : 'bg-gray-50 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`text-6xl ${
                      achievement.unlocked ? 'grayscale-0' : 'grayscale opacity-40'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  {achievement.unlocked && (
                    <div className="bg-success-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      ✓ Unlocked
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>
                        {achievement.currentProgress} / {achievement.requirement}
                      </span>
                    </div>
                    <div className="progress-bar h-2">
                      <div
                        className="progress-fill h-2"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500 capitalize">
                    {achievement.category}
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    +{achievement.xpReward} XP
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Motivational Section */}
        {unlockedCount < totalCount && (
          <div className="card bg-gradient-to-r from-primary-50 to-success-50 border-primary-500 mt-8">
            <div className="flex items-start gap-4">
              <div className="text-5xl">💪</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Keep Going!
                </h3>
                <p className="text-gray-700">
                  You have {totalCount - unlockedCount} more achievements to unlock.
                  Keep practicing to earn more badges and XP!
                </p>
              </div>
            </div>
          </div>
        )}

        {unlockedCount === totalCount && (
          <div className="card bg-gradient-to-r from-success-500 to-primary-500 text-white mt-8">
            <div className="flex items-start gap-4">
              <div className="text-6xl">🎉</div>
              <div>
                <h3 className="font-bold text-2xl mb-2">
                  Achievement Master!
                </h3>
                <p className="text-lg opacity-90">
                  Congratulations! You've unlocked all {totalCount} achievements.
                  You're a true Indonesian learning champion! 🏆
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
