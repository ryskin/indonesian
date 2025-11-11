'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)

  const playWelcomeAudio = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance('Selamat datang')
      utterance.lang = 'id-ID'
      utterance.onend = () => setIsPlaying(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">
            🇮🇩 Indonesian
          </h1>
          <p className="text-2xl text-gray-600">Language Learning App</p>
        </div>

        {/* Tagline */}
        <div className="card max-w-2xl mx-auto bg-gradient-to-r from-primary-500 to-primary-600 text-white border-none">
          <h2 className="text-4xl font-bold mb-4">
            Speak Indonesian in 30 Days
          </h2>
          <p className="text-xl opacity-90">
            Master 100 core verbs • 30 key patterns • Real conversations
          </p>
        </div>

        {/* First Phrase Demo */}
        <div className="card max-w-lg mx-auto">
          <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">
            Your first phrase
          </p>
          <button
            onClick={playWelcomeAudio}
            className="group w-full"
            disabled={isPlaying}
          >
            <div className="text-5xl font-bold text-primary-600 mb-2 group-hover:scale-105 transition-transform">
              Selamat datang
            </div>
            <div className="text-2xl text-gray-500 mb-4">Welcome</div>
            <div className="flex items-center justify-center gap-2 text-primary-500">
              <svg
                className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
              </svg>
              <span className="text-sm font-medium">
                {isPlaying ? 'Playing...' : 'Tap to hear'}
              </span>
            </div>
          </button>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Link
            href="/onboarding"
            className="btn btn-primary text-xl px-12 py-4 inline-block shadow-2xl hover:shadow-xl"
          >
            Start Learning →
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-800 mb-2">100 Core Verbs</h3>
            <p className="text-sm text-gray-600">
              Master the building blocks of Indonesian
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">16-Week Program</h3>
            <p className="text-sm text-gray-600">
              Structured path to fluency
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-800 mb-2">Real Dialogues</h3>
            <p className="text-sm text-gray-600">
              Practice authentic conversations
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-8 text-sm text-gray-500">
          <p>Join thousands learning Indonesian • 10 minutes a day • Free to start</p>
        </div>
      </div>
    </main>
  )
}
