'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store/useAppStore'
import curriculum from '@/src/data/curriculum.json'
import verbs from '@/src/data/verbs.json'
import patterns from '@/src/data/patterns.json'
import scenarios from '@/src/data/scenarios.json'
import vocabulary from '@/src/data/vocabulary.json'

interface Exercise {
  type: string
  items?: string[]
  pattern_id?: number
  practice_count?: number
  scenario?: string
  verb_ids?: number[]
}

interface Lesson {
  day: number
  title: string
  content: string
  exercises: Exercise[]
}

export default function LessonPage() {
  const router = useRouter()
  const { userStats, incrementXP, completeLesson, updateStreak } = useAppStore()
  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentDay, setCurrentDay] = useState(1)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [vocabularyLearned, setVocabularyLearned] = useState<string[]>([])
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const savedWeek = localStorage.getItem('currentWeek')
    const savedDay = localStorage.getItem('currentDay')
    if (savedWeek) setCurrentWeek(parseInt(savedWeek))
    if (savedDay) setCurrentDay(parseInt(savedDay))
  }, [])

  const weekKey = `week_${currentWeek}` as keyof typeof curriculum.curriculum
  const weekData = curriculum.curriculum[weekKey]
  const lesson: Lesson | undefined = weekData?.lessons[currentDay - 1]

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson not found</h2>
          <p className="text-gray-600 mb-6">Unable to load the current lesson.</p>
          <Link href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const currentExercise = lesson.exercises[currentExerciseIndex]
  const isLastExercise = currentExerciseIndex === lesson.exercises.length - 1
  const progress = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleNextExercise = () => {
    if (isLastExercise) {
      // Complete the lesson
      setLessonCompleted(true)
      completeLesson()
      updateStreak()
      incrementXP(100)

      // Move to next lesson
      const totalLessonsInWeek = weekData.lessons.length
      if (currentDay < totalLessonsInWeek) {
        localStorage.setItem('currentDay', (currentDay + 1).toString())
      } else {
        // Move to next week
        localStorage.setItem('currentWeek', (currentWeek + 1).toString())
        localStorage.setItem('currentDay', '1')
      }
    } else {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setShowAnswer(false)
      incrementXP(20)
    }
  }

  const handleVocabLearned = (word: string) => {
    if (!vocabularyLearned.includes(word)) {
      setVocabularyLearned([...vocabularyLearned, word])
    }
  }

  // Render different exercise types
  const renderExercise = () => {
    if (!currentExercise) return null

    switch (currentExercise.type) {
      case 'vocab':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              📚 Vocabulary Practice
            </h3>
            <p className="text-gray-600 mb-6">
              Learn these essential words. Click to hear pronunciation.
            </p>
            <div className="grid gap-4">
              {currentExercise.items?.map((item, idx) => {
                const vocabWord = Object.values(vocabulary.vocabulary)
                  .flat()
                  .find((v: any) => v.indonesian === item)

                return (
                  <div
                    key={idx}
                    className="card hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      playAudio(item)
                      handleVocabLearned(item)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary-600 mb-1">
                          {item}
                        </p>
                        {vocabWord && (
                          <p className="text-gray-600">{vocabWord.english}</p>
                        )}
                      </div>
                      <button className="btn btn-secondary">
                        🔊
                      </button>
                    </div>
                    {vocabularyLearned.includes(item) && (
                      <div className="mt-2 text-success-600 text-sm font-medium">
                        ✓ Learned
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'pattern':
        const pattern = patterns.patterns.find(
          (p) => p.id === currentExercise.pattern_id
        )
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              🎯 Pattern Practice
            </h3>
            {pattern && (
              <div className="card bg-primary-50 border-2 border-primary-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Pattern</p>
                    <p className="text-xl font-bold text-gray-900 mb-3">
                      {pattern.indonesian}
                    </p>
                    <button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="btn btn-secondary btn-sm"
                    >
                      {showAnswer ? '🙈 Hide' : '👁 Show'} English
                    </button>
                    {showAnswer && (
                      <p className="text-gray-700 mt-3 animate-fade-in">
                        {pattern.english}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => playAudio(pattern.indonesian)}
                    className="btn btn-secondary"
                  >
                    🔊
                  </button>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Examples:
                  </p>
                  <div className="space-y-3">
                    {pattern.examples.slice(0, 3).map((example, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => playAudio(example.indonesian)}
                      >
                        <p className="font-semibold text-gray-900">
                          {example.indonesian}
                        </p>
                        {showAnswer && (
                          <p className="text-sm text-gray-600 mt-1">
                            {example.english}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'dialog':
        const scenario = scenarios.scenarios.find(
          (s) => s.id === currentExercise.scenario
        )
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              💬 Dialogue Practice
            </h3>
            {scenario && (
              <div className="space-y-4">
                <div className="card bg-primary-50">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {scenario.title}
                  </h4>
                  <p className="text-sm text-gray-600">{scenario.context}</p>
                </div>

                <div className="space-y-3">
                  {scenario.dialogue.map((line, idx) => (
                    <div
                      key={idx}
                      className={`card cursor-pointer hover:shadow-lg transition-all ${
                        line.speaker === 'You'
                          ? 'bg-primary-50 border-l-4 border-primary-500'
                          : 'bg-gray-50'
                      }`}
                      onClick={() => playAudio(line.indonesian)}
                    >
                      <p className="text-xs text-gray-500 mb-1">
                        {line.speaker}
                      </p>
                      <p className="font-semibold text-gray-900 mb-1">
                        {line.indonesian}
                      </p>
                      {showAnswer && (
                        <p className="text-sm text-gray-600">{line.english}</p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="btn btn-secondary w-full"
                >
                  {showAnswer ? '🙈 Hide' : '👁 Show'} Translations
                </button>
              </div>
            )}
          </div>
        )

      case 'verb_practice':
        const practiceVerbs = verbs.verbs.filter((v) =>
          currentExercise.verb_ids?.includes(v.id)
        )
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              📘 Verb Practice
            </h3>
            <p className="text-gray-600 mb-6">
              Study these verbs and their examples
            </p>
            <div className="space-y-4">
              {practiceVerbs.map((verb) => (
                <div key={verb.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        {verb.indonesian}
                      </p>
                      <p className="text-gray-600">{verb.english}</p>
                    </div>
                    <button
                      onClick={() => playAudio(verb.indonesian)}
                      className="btn btn-secondary"
                    >
                      🔊
                    </button>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Example sentences:
                    </p>
                    <div className="space-y-2">
                      {verb.svo_examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => playAudio(example.indonesian)}
                        >
                          <p className="font-medium text-gray-900">
                            {example.indonesian}
                          </p>
                          {showAnswer && (
                            <p className="text-sm text-gray-600 mt-1">
                              {example.english}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="btn btn-secondary w-full"
            >
              {showAnswer ? '🙈 Hide' : '👁 Show'} Translations
            </button>
          </div>
        )

      case 'svo_constructor':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              🏗 Build Sentences
            </h3>
            <p className="text-gray-600 mb-6">
              Practice building your own sentences with SVO structure
            </p>
            <div className="card bg-primary-50 border-2 border-primary-500">
              <p className="text-center mb-4">
                Ready to practice sentence construction?
              </p>
              <Link
                href="/practice/svo"
                className="btn btn-primary w-full"
                onClick={() => incrementXP(10)}
              >
                Open SVO Constructor →
              </Link>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Complete at least 3 sentences, then return to continue
            </p>
          </div>
        )

      default:
        return (
          <div className="card text-center">
            <p className="text-gray-600">Exercise type not recognized</p>
          </div>
        )
    }
  }

  if (lessonCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 to-primary-50 flex items-center justify-center p-4">
        <div className="card max-w-lg text-center">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Lesson Complete!
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Great job! You earned <strong>100 XP</strong>
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-xl font-bold text-primary-600">
                {userStats.level}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-xl font-bold text-primary-600">
                {userStats.streak}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-primary-600">
                {userStats.lessonsCompleted}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-primary w-full text-lg"
            >
              Back to Dashboard
            </button>
            <Link
              href="/achievements"
              className="btn btn-secondary w-full"
            >
              View Achievements
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-primary-600"
            >
              ← Back
            </Link>
            <div className="text-sm text-gray-600">
              Week {currentWeek} · Day {currentDay}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {lesson.title}
          </h1>
          <p className="text-gray-600 mb-4">{lesson.content}</p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Exercise {currentExerciseIndex + 1} of {lesson.exercises.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar h-3">
              <div
                className="progress-fill h-3"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Exercise Content */}
        <div className="mb-8">{renderExercise()}</div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentExerciseIndex > 0 && (
            <button
              onClick={() => {
                setCurrentExerciseIndex(currentExerciseIndex - 1)
                setShowAnswer(false)
              }}
              className="btn btn-secondary flex-1"
            >
              ← Previous
            </button>
          )}
          <button
            onClick={handleNextExercise}
            className="btn btn-primary flex-1"
          >
            {isLastExercise ? '✓ Complete Lesson' : 'Next Exercise →'}
          </button>
        </div>
      </div>
    </div>
  )
}
