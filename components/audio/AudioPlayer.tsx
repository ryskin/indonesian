'use client'

import { useState } from 'react'

interface AudioPlayerProps {
  text: string
  lang?: string
  rate?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function AudioPlayer({
  text,
  lang = 'id-ID',
  rate = 0.9,
  className = '',
  size = 'md',
  showText = true,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const play = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true)
      window.speechSynthesis.cancel() // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = rate
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      window.speechSynthesis.speak(utterance)
    } else {
      alert('Sorry, your browser does not support text-to-speech')
    }
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <button
      onClick={play}
      disabled={isPlaying}
      className={`flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50 ${className}`}
      title="Play audio"
    >
      <svg
        className={`${sizeClasses[size]} ${isPlaying ? 'animate-pulse' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {isPlaying ? (
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        )}
      </svg>
      {showText && (
        <span className={`font-medium ${textSizes[size]}`}>
          {isPlaying ? 'Playing...' : 'Play'}
        </span>
      )}
    </button>
  )
}
