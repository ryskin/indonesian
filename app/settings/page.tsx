'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store/useAppStore'

export default function SettingsPage() {
  const { settings, updateSettings, resetProgress, userStats } = useAppStore()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showExportSuccess, setShowExportSuccess] = useState(false)

  const handleDailyGoalChange = (minutes: number) => {
    updateSettings({ dailyGoalMinutes: minutes })
  }

  const handleXPGoalChange = (xp: number) => {
    updateSettings({ dailyXPGoal: xp })
  }

  const handleAudioRateChange = (rate: number) => {
    updateSettings({ audioRate: rate })
  }

  const handleAutoplayChange = (enabled: boolean) => {
    updateSettings({ autoplayAudio: enabled })
  }

  const handleShowTranslationsChange = (show: boolean) => {
    updateSettings({ showTranslations: show })
  }

  const handleNotificationsChange = (enabled: boolean) => {
    updateSettings({ notificationsEnabled: enabled })
  }

  const handleExportData = () => {
    const data = {
      userStats,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `indonesian-learning-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setShowExportSuccess(true)
    setTimeout(() => setShowExportSuccess(false), 3000)
  }

  const handleResetProgress = () => {
    if (showResetConfirm) {
      resetProgress()
      setShowResetConfirm(false)
      alert('Progress has been reset successfully.')
    } else {
      setShowResetConfirm(true)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600">Customize your learning experience</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Daily Goals */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Daily Goals
          </h2>

          <div className="space-y-6">
            {/* Study Time Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Daily Study Time Goal
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={settings.dailyGoalMinutes}
                  onChange={(e) => handleDailyGoalChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-bold text-primary-600 min-w-[80px] text-right">
                  {settings.dailyGoalMinutes} min
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>5 min</span>
                <span>30 min</span>
                <span>60 min</span>
              </div>
            </div>

            {/* XP Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Daily XP Goal
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="50"
                  value={settings.dailyXPGoal}
                  onChange={(e) => handleXPGoalChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-bold text-primary-600 min-w-[80px] text-right">
                  {settings.dailyXPGoal} XP
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>50 XP</span>
                <span>250 XP</span>
                <span>500 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">🔊</span>
            Audio Settings
          </h2>

          <div className="space-y-6">
            {/* Playback Speed */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Playback Speed
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.audioRate}
                  onChange={(e) => handleAudioRateChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-bold text-primary-600 min-w-[60px] text-right">
                  {settings.audioRate}x
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Slow (0.5x)</span>
                <span>Normal (1.0x)</span>
                <span>Fast (1.5x)</span>
              </div>
            </div>

            {/* Autoplay */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Autoplay Audio</p>
                <p className="text-sm text-gray-600">
                  Automatically play audio when showing new content
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoplayAudio}
                  onChange={(e) => handleAutoplayChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">👁</span>
            Display Settings
          </h2>

          <div className="space-y-4">
            {/* Show Translations */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Show English Translations</p>
                <p className="text-sm text-gray-600">
                  Display English translations by default
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showTranslations}
                  onChange={(e) => handleShowTranslationsChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">🔔</span>
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Daily Reminders</p>
                <p className="text-sm text-gray-600">
                  Remind me to practice every day
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleNotificationsChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">💾</span>
            Data Management
          </h2>

          <div className="space-y-4">
            {/* Export Data */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Export Progress</p>
                  <p className="text-sm text-gray-600">
                    Download your learning data as a JSON file
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="btn btn-secondary whitespace-nowrap"
                >
                  📥 Export
                </button>
              </div>
              {showExportSuccess && (
                <div className="text-sm text-success-600 font-medium animate-fade-in">
                  ✅ Data exported successfully!
                </div>
              )}
            </div>

            {/* Reset Progress */}
            <div className="p-4 bg-error-50 rounded-lg border border-error-200">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-error-900 mb-1">Reset All Progress</p>
                  <p className="text-sm text-error-700">
                    This will permanently delete all your learning data
                  </p>
                </div>
                <button
                  onClick={handleResetProgress}
                  className={`btn whitespace-nowrap ${
                    showResetConfirm
                      ? 'bg-error-600 hover:bg-error-700 text-white'
                      : 'bg-error-100 hover:bg-error-200 text-error-700'
                  }`}
                >
                  {showResetConfirm ? '⚠️ Confirm Reset' : '🗑 Reset'}
                </button>
              </div>
              {showResetConfirm && (
                <div className="text-sm text-error-700 font-medium">
                  Click again to confirm. This action cannot be undone.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="card bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">ℹ️</span>
            About
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Method:</strong> Petrov's Indonesian Learning System</p>
            <p><strong>Content:</strong> 100 verbs • 30 patterns • 30+ dialogues</p>
            <p><strong>Program:</strong> 16-week structured curriculum</p>
          </div>
        </div>
      </div>
    </div>
  )
}
