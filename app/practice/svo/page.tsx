'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { SVOConstructor } from '@/lib/engines/svo-constructor'
import { useAppStore } from '@/lib/store/useAppStore'
import verbsData from '@/src/data/verbs.json'
import vocabularyData from '@/src/data/vocabulary.json'

export default function SVOConstructorPage() {
  const [constructor, setConstructor] = useState<SVOConstructor | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedVerb, setSelectedVerb] = useState<number | null>(null)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const { incrementXP, updateStats, userStats } = useAppStore()

  useEffect(() => {
    const svoConstructor = new SVOConstructor(verbsData, vocabularyData)
    setConstructor(svoConstructor)
  }, [])

  const subjects = vocabularyData.vocabulary.pronouns.words
  const verbs = verbsData.verbs.slice(0, 20) // First 20 verbs for simplicity
  const objects = [
    'nasi', 'kopi', 'air', 'roti', 'ayam',
    'buku', 'film', 'musik', 'teman', 'rumah',
    'sekolah', 'kantor', 'pasar', 'hotel', 'taksi'
  ]

  const buildSentence = () => {
    if (!constructor || !selectedSubject || selectedVerb === null || !selectedObject) {
      setFeedback('Please select all parts: Subject + Verb + Object')
      return
    }

    try {
      const sentence = constructor.buildSentence(selectedSubject, selectedVerb, selectedObject)
      setResult(sentence)
      setFeedback('✅ Great! Here\'s your sentence:')

      // Award XP
      incrementXP(10)
      updateStats({
        totalSentencesCreated: userStats.totalSentencesCreated + 1
      })
    } catch (error) {
      setFeedback('❌ Error building sentence. Please try again.')
    }
  }

  const reset = () => {
    setSelectedSubject(null)
    setSelectedVerb(null)
    setSelectedObject(null)
    setResult(null)
    setFeedback(null)
  }

  if (!constructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <p className="text-gray-600">Loading constructor...</p>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900">SVO Constructor</h1>
              <p className="text-sm text-gray-600">Build sentences: Subject + Verb + Object</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="card bg-primary-50 border-primary-500 mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">📚 How it works:</h2>
          <p className="text-gray-700 text-sm mb-3">
            Indonesian uses a simple SVO (Subject-Verb-Object) structure, just like English!
          </p>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">S: Who</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">V: Action</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">O: What</span>
          </div>
        </div>

        {/* Construction Zone */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Build Your Sentence</h2>

          {/* Sentence Slots */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Subject Slot */}
            <div className="card bg-blue-50 border-2 border-blue-300 min-h-[120px] flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">👤</span>
                <span className="font-semibold text-blue-700">Subject</span>
              </div>
              {selectedSubject ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700 mb-1">
                      {selectedSubject}
                    </p>
                    <p className="text-sm text-gray-600">
                      {subjects.find(s => s.indonesian === selectedSubject)?.english}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select subject
                </div>
              )}
            </div>

            {/* Verb Slot */}
            <div className="card bg-green-50 border-2 border-green-300 min-h-[120px] flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold text-green-700">Verb</span>
              </div>
              {selectedVerb !== null ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-700 mb-1">
                      {verbs.find(v => v.id === selectedVerb)?.indonesian}
                    </p>
                    <p className="text-sm text-gray-600">
                      {verbs.find(v => v.id === selectedVerb)?.english}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select verb
                </div>
              )}
            </div>

            {/* Object Slot */}
            <div className="card bg-purple-50 border-2 border-purple-300 min-h-[120px] flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold text-purple-700">Object</span>
              </div>
              {selectedObject ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-700">
                      {selectedObject}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select object
                </div>
              )}
            </div>
          </div>

          {/* Word Banks */}
          <div className="space-y-6">
            {/* Subjects */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">👤 Choose Subject:</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.indonesian}
                    onClick={() => setSelectedSubject(subject.indonesian)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedSubject === subject.indonesian
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    <div className="font-semibold">{subject.indonesian}</div>
                    <div className="text-xs opacity-70">{subject.english}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Verbs */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">⚡ Choose Verb:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {verbs.map((verb) => (
                  <button
                    key={verb.id}
                    onClick={() => setSelectedVerb(verb.id)}
                    className={`px-3 py-2 rounded-lg transition-all text-left ${
                      selectedVerb === verb.id
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                    }`}
                  >
                    <div className="font-semibold">{verb.indonesian}</div>
                    <div className="text-xs opacity-70">{verb.english}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Objects */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">🎯 Choose Object:</h3>
              <div className="flex flex-wrap gap-2">
                {objects.map((object) => (
                  <button
                    key={object}
                    onClick={() => setSelectedObject(object)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedObject === object
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    {object}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={buildSentence}
              disabled={!selectedSubject || selectedVerb === null || !selectedObject}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Build Sentence
            </button>
            <button onClick={reset} className="btn btn-secondary">
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`card mb-8 animate-fade-in ${
            feedback.startsWith('✅')
              ? 'bg-success-500/10 border-success-500'
              : feedback.startsWith('❌')
              ? 'bg-error-500/10 border-error-500'
              : 'bg-warning-500/10 border-warning-500'
          }`}>
            <p className="font-semibold text-gray-900">{feedback}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm opacity-80 mb-2">Your sentence:</p>
                <h2 className="text-4xl font-bold mb-4">{result.indonesian}</h2>
                <p className="text-2xl opacity-90 mb-6">{result.english}</p>

                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    S: {result.svo.subject}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    V: {result.svo.verb}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    O: {result.svo.object}
                  </span>
                </div>
              </div>

              <AudioPlayer
                text={result.indonesian}
                className="text-white hover:text-white"
                size="lg"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-80">
                🎉 +10 XP • Total sentences created: {userStats.totalSentencesCreated + 1}
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="card bg-gray-50 mt-8">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Practice Tips:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">✓</span>
              <span>Try different combinations to create hundreds of sentences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">✓</span>
              <span>Listen to the pronunciation after building each sentence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">✓</span>
              <span>The more sentences you create, the more natural it becomes!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
