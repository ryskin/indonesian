import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStats {
  streak: number
  longestStreak: number
  level: number
  xp: number
  verbsMastered: number[]
  patternsMastered: number[]
  lessonsCompleted: string[]
  totalStudyTimeMs: number
  accuracy: number
  totalSentencesCreated: number
  totalDialoguesCompleted: number
  totalReviews: number
  correctAnswers: number
  totalAnswers: number
  lastStudyDate: string | null
  achievements: string[]
}

interface UserSettings {
  dailyGoal: number
  notificationsEnabled: boolean
  soundEnabled: boolean
  autoPlayAudio: boolean
  speechRate: number
  showRomanization: boolean
}

interface AppState {
  // User Stats
  userStats: UserStats
  updateStats: (stats: Partial<UserStats>) => void
  incrementXP: (amount: number) => void
  addMasteredVerb: (verbId: number) => void
  addMasteredPattern: (patternId: number) => void
  completeLesson: (lessonId: string) => void
  updateStreak: () => void
  addAchievement: (achievementId: string) => void

  // Current Session
  currentWeek: number
  currentDay: number
  setCurrentLesson: (week: number, day: number) => void

  // Settings
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void

  // Session Management
  sessionStartTime: number | null
  startSession: () => void
  endSession: () => void

  // Reset
  resetProgress: () => void
}

const initialStats: UserStats = {
  streak: 0,
  longestStreak: 0,
  level: 1,
  xp: 0,
  verbsMastered: [],
  patternsMastered: [],
  lessonsCompleted: [],
  totalStudyTimeMs: 0,
  accuracy: 0,
  totalSentencesCreated: 0,
  totalDialoguesCompleted: 0,
  totalReviews: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  lastStudyDate: null,
  achievements: [],
}

const initialSettings: UserSettings = {
  dailyGoal: 10,
  notificationsEnabled: true,
  soundEnabled: true,
  autoPlayAudio: false,
  speechRate: 0.9,
  showRomanization: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      userStats: initialStats,
      currentWeek: 1,
      currentDay: 1,
      settings: initialSettings,
      sessionStartTime: null,

      // Stats Updates
      updateStats: (stats) =>
        set((state) => ({
          userStats: { ...state.userStats, ...stats },
        })),

      incrementXP: (amount) =>
        set((state) => {
          const newXP = state.userStats.xp + amount
          const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1
          return {
            userStats: {
              ...state.userStats,
              xp: newXP,
              level: newLevel,
            },
          }
        }),

      addMasteredVerb: (verbId) =>
        set((state) => {
          if (state.userStats.verbsMastered.includes(verbId)) {
            return state
          }
          return {
            userStats: {
              ...state.userStats,
              verbsMastered: [...state.userStats.verbsMastered, verbId],
            },
          }
        }),

      addMasteredPattern: (patternId) =>
        set((state) => {
          if (state.userStats.patternsMastered.includes(patternId)) {
            return state
          }
          return {
            userStats: {
              ...state.userStats,
              patternsMastered: [...state.userStats.patternsMastered, patternId],
            },
          }
        }),

      completeLesson: (lessonId) =>
        set((state) => {
          if (state.userStats.lessonsCompleted.includes(lessonId)) {
            return state
          }
          return {
            userStats: {
              ...state.userStats,
              lessonsCompleted: [...state.userStats.lessonsCompleted, lessonId],
            },
          }
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

          if (state.userStats.lastStudyDate === today) {
            return state
          }

          const newStreak =
            state.userStats.lastStudyDate === yesterday
              ? state.userStats.streak + 1
              : 1

          return {
            userStats: {
              ...state.userStats,
              streak: newStreak,
              longestStreak: Math.max(newStreak, state.userStats.longestStreak),
              lastStudyDate: today,
            },
          }
        }),

      addAchievement: (achievementId) =>
        set((state) => {
          if (state.userStats.achievements.includes(achievementId)) {
            return state
          }
          return {
            userStats: {
              ...state.userStats,
              achievements: [...state.userStats.achievements, achievementId],
            },
          }
        }),

      // Current Lesson
      setCurrentLesson: (week, day) =>
        set({ currentWeek: week, currentDay: day }),

      // Settings
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      // Session Management
      startSession: () =>
        set(() => {
          get().updateStreak()
          return { sessionStartTime: Date.now() }
        }),

      endSession: () =>
        set((state) => {
          if (state.sessionStartTime === null) return state

          const duration = Date.now() - state.sessionStartTime
          const newTotalTime = state.userStats.totalStudyTimeMs + duration

          return {
            userStats: {
              ...state.userStats,
              totalStudyTimeMs: newTotalTime,
            },
            sessionStartTime: null,
          }
        }),

      // Reset
      resetProgress: () =>
        set({
          userStats: initialStats,
          currentWeek: 1,
          currentDay: 1,
        }),
    }),
    {
      name: 'indonesian-app-storage',
    }
  )
)
