'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Goal = 'travel' | 'work' | 'friends' | 'culture'
type TimeCommitment = 5 | 10 | 20

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedTime, setSelectedTime] = useState<TimeCommitment | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const goals = [
    { id: 'travel' as Goal, icon: '🌴', title: 'Travel & Tourism', description: 'Explore Indonesia with confidence' },
    { id: 'work' as Goal, icon: '💼', title: 'Work & Business', description: 'Professional communication' },
    { id: 'friends' as Goal, icon: '👥', title: 'Friends & Family', description: 'Connect with loved ones' },
    { id: 'culture' as Goal, icon: '🎨', title: 'Culture & Interest', description: 'Discover Indonesian culture' },
  ]

  const timeOptions = [
    { minutes: 5 as TimeCommitment, label: 'Casual', description: '5 min/day' },
    { minutes: 10 as TimeCommitment, label: 'Steady', description: '10 min/day' },
    { minutes: 20 as TimeCommitment, label: 'Intensive', description: '20 min/day' },
  ]

  const playFirstPhrase = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance('Saya mau kopi')
      utterance.lang = 'id-ID'
      utterance.rate = 0.8
      utterance.onend = () => setIsPlaying(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStart = () => {
    // Save user preferences to localStorage
    if (selectedGoal && selectedTime) {
      localStorage.setItem('userGoal', selectedGoal)
      localStorage.setItem('dailyMinutes', selectedTime.toString())
      localStorage.setItem('onboardingComplete', 'true')
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-2 w-16 rounded-full transition-all ${
                  num <= step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 3</p>
        </div>

        {/* Step 1: Goal Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Why do you want to learn Indonesian?
              </h1>
              <p className="text-gray-600">Choose your main goal</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`card text-left p-6 transition-all hover:scale-105 ${
                    selectedGoal === goal.id
                      ? 'ring-4 ring-primary-500 bg-primary-50'
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="text-5xl mb-4">{goal.icon}</div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedGoal}
              className="btn btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Time Commitment */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                How much time can you dedicate daily?
              </h1>
              <p className="text-gray-600">Choose your study pace</p>
            </div>

            <div className="space-y-4">
              {timeOptions.map((option) => (
                <button
                  key={option.minutes}
                  onClick={() => setSelectedTime(option.minutes)}
                  className={`card w-full text-left p-6 transition-all hover:scale-102 ${
                    selectedTime === option.minutes
                      ? 'ring-4 ring-primary-500 bg-primary-50'
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-1">
                        {option.label}
                      </h3>
                      <p className="text-2xl font-bold text-primary-600">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-4xl">
                      {option.minutes === 5 && '🌱'}
                      {option.minutes === 10 && '🌿'}
                      {option.minutes === 20 && '🌳'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="btn btn-secondary flex-1"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedTime}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: First Lesson Preview */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                You're all set!
              </h1>
              <p className="text-gray-600">Here's your first phrase</p>
            </div>

            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white p-12 text-center">
              <p className="text-sm uppercase tracking-wide opacity-80 mb-6">
                Your first Indonesian sentence
              </p>

              <button
                onClick={playFirstPhrase}
                className="w-full group"
                disabled={isPlaying}
              >
                <div className="text-6xl font-bold mb-4 group-hover:scale-105 transition-transform">
                  Saya mau kopi
                </div>
                <div className="text-3xl opacity-90 mb-8">I want coffee</div>

                <div className="flex items-center justify-center gap-3 text-white">
                  <svg
                    className={`w-8 h-8 ${isPlaying ? 'animate-pulse' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  <span className="text-lg font-medium">
                    {isPlaying ? 'Playing...' : 'Tap to hear pronunciation'}
                  </span>
                </div>
              </button>
            </div>

            <div className="card p-6 bg-primary-50">
              <h3 className="font-semibold text-gray-900 mb-3">
                🎯 What you'll achieve:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-success-500 mt-1">✓</span>
                  <span>Master 100 essential Indonesian verbs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500 mt-1">✓</span>
                  <span>Build thousands of sentences using SVO structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500 mt-1">✓</span>
                  <span>Hold real conversations in 16 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success-500 mt-1">✓</span>
                  <span>Practice with 30+ real-life scenarios</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="btn btn-secondary flex-1"
              >
                ← Back
              </button>
              <button
                onClick={handleStart}
                className="btn btn-primary flex-1 text-lg"
              >
                Start Learning 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
