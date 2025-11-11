'use client'

import { useState } from 'react'
import Link from 'next/link'
import AudioPlayer from '@/components/audio/AudioPlayer'
import verbsData from '@/src/data/verbs.json'

export default function VerbsPracticePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedVerb, setSelectedVerb] = useState<number | null>(null)

  const categories = [
    { id: 'all', name: 'All Verbs', icon: '📚' },
    { id: 'daily_actions', name: 'Daily Actions', icon: '🏃' },
    { id: 'movement', name: 'Movement', icon: '🚶' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'mental', name: 'Mental', icon: '🧠' },
    { id: 'emotion', name: 'Emotion', icon: '❤️' },
    { id: 'leisure', name: 'Leisure', icon: '🎮' },
  ]

  const filteredVerbs = selectedCategory === 'all'
    ? verbsData.verbs
    : verbsData.verbs.filter(v => v.category === selectedCategory)

  const verb = selectedVerb !== null
    ? verbsData.verbs.find(v => v.id === selectedVerb)
    : null

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
              <h1 className="text-2xl font-bold text-gray-900">Verb Practice</h1>
              <p className="text-sm text-gray-600">Master 100 essential verbs</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setSelectedVerb(null)
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {!verb ? (
          /* Verb Grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredVerbs.length} verbs
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVerbs.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVerb(v.id)}
                  className="card text-left p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">#{v.id}</div>
                      <h3 className="text-2xl font-bold text-primary-600 mb-2">
                        {v.indonesian}
                      </h3>
                      <p className="text-gray-700">{v.english}</p>
                    </div>
                    <AudioPlayer
                      text={v.indonesian}
                      showText={false}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      v.difficulty === 1
                        ? 'bg-success-500/20 text-success-600'
                        : 'bg-warning-500/20 text-warning-600'
                    }`}>
                      {v.difficulty === 1 ? 'Beginner' : 'Intermediate'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {v.category.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Verb Detail */
          <div>
            <button
              onClick={() => setSelectedVerb(null)}
              className="btn btn-secondary mb-6"
            >
              ← Back to list
            </button>

            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Verb #{verb.id}</div>
                  <h2 className="text-5xl font-bold text-primary-600 mb-3">
                    {verb.indonesian}
                  </h2>
                  <p className="text-2xl text-gray-700 mb-4">{verb.english}</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      verb.difficulty === 1
                        ? 'bg-success-500/20 text-success-600'
                        : 'bg-warning-500/20 text-warning-600'
                    }`}>
                      {verb.difficulty === 1 ? 'Beginner' : 'Intermediate'}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {verb.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <AudioPlayer text={verb.indonesian} size="lg" />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  📝 Example Sentences (SVO Structure)
                </h3>

                <div className="space-y-4">
                  {verb.examples.map((ex, idx) => (
                    <div key={idx} className="card bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="text-xl font-semibold text-gray-900 mb-2">
                            {ex.indonesian}
                          </p>
                          <p className="text-gray-600">{ex.english}</p>
                        </div>
                        <AudioPlayer
                          text={ex.indonesian}
                          showText={false}
                          size="sm"
                        />
                      </div>

                      <div className="flex gap-2 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                          S: {ex.svo.subject}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          V: {ex.svo.verb}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                          O: {ex.svo.object}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">
                  💡 Practice Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">✓</span>
                    <span>Listen to the pronunciation multiple times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">✓</span>
                    <span>Try creating your own sentences with this verb</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">✓</span>
                    <span>Practice the SVO structure: Subject + Verb + Object</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="btn btn-primary flex-1">
                  ✅ Mark as Mastered
                </button>
                <button className="btn btn-secondary flex-1">
                  🔄 Add to Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
