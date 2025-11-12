'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store/useAppStore'
import {
  buildLanguageGraph,
  calculateNodePositions,
  getConnectionStyle,
  recommendNextNodes,
  GraphNode,
  GraphConnection
} from '@/lib/data/language-graph'

export default function LanguageMapPage() {
  const router = useRouter()
  const { userStats } = useAppStore()
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; connections: GraphConnection[] }>({
    nodes: [],
    connections: []
  })
  const [recommendations, setRecommendations] = useState<GraphNode[]>([])

  const getNodeProgress = useCallback((node: GraphNode): number => {
    // Calculate progress based on user stats
    if (node.type === 'user') return 100

    if (node.type === 'verb') {
      const verbsCompleted = userStats.verbsMastered || 0
      return Math.min((verbsCompleted / 100) * 100, 100)
    }

    if (node.type === 'pattern') {
      const patternsCompleted = userStats.patternsMastered || 0
      return Math.min((patternsCompleted / 30) * 100, 100)
    }

    if (node.type === 'scene') {
      const dialoguesCompleted = userStats.totalDialoguesCompleted || 0
      return Math.min((dialoguesCompleted / 30) * 100, 100)
    }

    if (node.type === 'category') {
      // Average of connected scenes (simplified to avoid recursion in useCallback)
      const verbsCompleted = userStats.verbsMastered || 0
      const dialoguesCompleted = userStats.totalDialoguesCompleted || 0
      return Math.min(((verbsCompleted + dialoguesCompleted) / 130) * 100, 100)
    }

    return 0
  }, [userStats.verbsMastered, userStats.patternsMastered, userStats.totalDialoguesCompleted])

  useEffect(() => {
    const { nodes, connections } = buildLanguageGraph()
    const positionedNodes = calculateNodePositions(nodes)
    setGraph({ nodes: positionedNodes, connections })

    // Calculate recommendations based on user progress
    const completedNodeIds = positionedNodes
      .filter(node => getNodeProgress(node) > 70)
      .map(node => node.id)

    const nextNodes = recommendNextNodes(completedNodeIds, { nodes: positionedNodes, connections })
    setRecommendations(nextNodes)
  }, [userStats, getNodeProgress])

  const getNodeColor = (node: GraphNode, progress: number): string => {
    if (node.id === hoveredNode || node.id === selectedNode?.id) {
      return '#6366f1' // primary blue when hovered/selected
    }

    if (node.type === 'user') return '#6366f1'

    // Progress-based color
    if (progress === 0) return '#d1d5db' // gray
    if (progress < 30) return '#fbbf24' // yellow
    if (progress < 70) return '#fb923c' // orange
    return '#10b981' // green

    return node.color || '#9ca3af'
  }

  const getConnectionOpacity = (connection: GraphConnection): number => {
    const fromNode = graph.nodes.find(n => n.id === connection.from)
    const toNode = graph.nodes.find(n => n.id === connection.to)

    if (!fromNode || !toNode) return 0.1

    const fromProgress = getNodeProgress(fromNode)
    const toProgress = getNodeProgress(toNode)
    const avgProgress = (fromProgress + toProgress) / 2

    // Highlight if either node is hovered
    if (hoveredNode === connection.from || hoveredNode === connection.to) {
      return 0.8
    }

    return 0.1 + (avgProgress / 100) * 0.4
  }

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node)

    // Navigate to relevant page based on node type
    if (node.type === 'scene') {
      router.push('/practice/dialogues')
    } else if (node.type === 'verb') {
      router.push('/practice/verbs')
    } else if (node.type === 'pattern') {
      router.push('/practice/patterns')
    } else if (node.type === 'category') {
      router.push('/practice')
    }
  }

  const viewBox = '0 0 1000 800'

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
              <h1 className="text-2xl font-bold text-gray-900">Language Map</h1>
              <p className="text-sm text-gray-600">Your Indonesian learning journey</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="card bg-gradient-to-r from-primary-50 to-success-50 border-primary-500 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                How to use the Language Map
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total nodes</p>
              <p className="text-2xl font-bold text-primary-600">{graph.nodes.length}</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span><strong>Center (You):</strong> Your starting point in Indonesian</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span><strong>Categories (5):</strong> Main areas - Food, Places, Transport, People, Daily Life</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span><strong>Scenes (10):</strong> Real situations - Cafe, Hotel, Market, Airport, etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span><strong>Verbs (18):</strong> Essential actions - makan, pergi, beli, suka, etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span><strong>Patterns (8):</strong> Sentence templates - "Saya mau...", "Ada...", etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span><strong>Hover over connections</strong> to see relationship types (belongs_to, cooccurs, pattern_of)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span><strong>Click any node</strong> to navigate to practice that area</span>
            </li>
          </ul>
        </div>

        {/* Recommendations - What to learn next */}
        {recommendations.length > 0 && (
          <div className="card bg-gradient-to-r from-success-50 to-primary-50 border-success-500 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Recommended Next
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Based on your current progress, these areas are ready for you to explore:
            </p>
            <div className="grid md:grid-cols-5 gap-3">
              {recommendations.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className="card hover:shadow-lg transition-all p-4 text-center border-2 border-transparent hover:border-success-500"
                >
                  <div className="text-3xl mb-2">{node.icon}</div>
                  <div className="text-sm font-semibold text-gray-900">{node.label}</div>
                  <div className="text-xs text-gray-600 mt-1 capitalize">{node.type}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-blue-900">{userStats.level}</div>
            <div className="text-sm text-blue-700">Level</div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-3xl mb-2">📘</div>
            <div className="text-2xl font-bold text-green-900">{userStats.verbsMastered || 0}/100</div>
            <div className="text-sm text-green-700">Verbs Mastered</div>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-purple-900">{userStats.patternsMastered || 0}/30</div>
            <div className="text-sm text-purple-700">Patterns Learned</div>
          </div>
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-orange-900">{userStats.totalDialoguesCompleted || 0}/30</div>
            <div className="text-sm text-orange-700">Dialogues Done</div>
          </div>
        </div>

        {/* Graph Visualization */}
        <div className="card p-0 overflow-hidden">
          <svg
            viewBox={viewBox}
            className="w-full h-auto"
            style={{ minHeight: '500px', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}
          >
            {/* Connections with semantic types */}
            <g className="connections">
              {graph.connections.map((conn, idx) => {
                const fromNode = graph.nodes.find(n => n.id === conn.from)
                const toNode = graph.nodes.find(n => n.id === conn.to)

                if (!fromNode || !toNode ||
                    fromNode.x === undefined || fromNode.y === undefined ||
                    toNode.x === undefined || toNode.y === undefined ||
                    fromNode.x === null || fromNode.y === null ||
                    toNode.x === null || toNode.y === null) {
                  return null
                }

                const style = getConnectionStyle(conn.type)
                const isHighlighted =
                  hoveredNode === conn.from || hoveredNode === conn.to || selectedNode?.id === conn.from || selectedNode?.id === conn.to

                return (
                  <g key={`${conn.from}-${conn.to}-${idx}`}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isHighlighted ? style.color : '#d1d5db'}
                      strokeWidth={isHighlighted ? conn.strength * 0.8 : conn.strength * 0.4}
                      strokeOpacity={isHighlighted ? 0.8 : getConnectionOpacity(conn)}
                      strokeDasharray={isHighlighted ? style.dashArray : undefined}
                      className="transition-all duration-300"
                    />
                    {/* Connection label on hover */}
                    {isHighlighted && (
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        fontSize="9"
                        fill={style.color}
                        textAnchor="middle"
                        fontWeight="600"
                        className="pointer-events-none"
                      >
                        {style.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {graph.nodes.map(node => {
                if (node.x === undefined || node.y === undefined || node.x === null || node.y === null) return null

                const progress = getNodeProgress(node)
                const color = getNodeColor(node, progress)
                const radius = node.type === 'user' ? 30 : node.type === 'category' ? 25 : 20

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})${hoveredNode === node.id ? ' scale(1.1)' : ''}`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Progress ring */}
                    {progress > 0 && node.type !== 'user' && (
                      <circle
                        r={radius + 4}
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray={`${(progress / 100) * (2 * Math.PI * (radius + 4))} ${2 * Math.PI * (radius + 4)}`}
                        strokeLinecap="round"
                        transform="rotate(-90)"
                        opacity="0.6"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      r={radius}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-300"
                      style={{
                        filter: hoveredNode === node.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }}
                    />

                    {/* Icon */}
                    <text
                      textAnchor="middle"
                      dy=".3em"
                      fontSize={node.type === 'user' ? '24' : '16'}
                      fill="white"
                    >
                      {node.icon}
                    </text>

                    {/* Label */}
                    <text
                      textAnchor="middle"
                      dy={radius + 18}
                      fontSize="11"
                      fontWeight="600"
                      fill="#374151"
                      className="pointer-events-none"
                    >
                      {node.label}
                    </text>

                    {/* Progress percentage (if hovering) */}
                    {hoveredNode === node.id && progress > 0 && node.type !== 'user' && (
                      <text
                        textAnchor="middle"
                        dy={radius + 32}
                        fontSize="10"
                        fill="#6366f1"
                        fontWeight="bold"
                      >
                        {Math.round(progress)}%
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="card mt-8 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Node Types */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Node Types</p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  👤
                </div>
                <span className="text-sm text-gray-700">You (Center)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">
                  📍
                </div>
                <span className="text-sm text-gray-700">Categories</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                  ☕
                </div>
                <span className="text-sm text-gray-700">Scenes</span>
              </div>
            </div>

            {/* Progress Colors */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Progress</p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-700">Not Started (0%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                <span className="text-sm text-gray-700">Learning (1-30%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-700">Progressing (30-70%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">Mastered (70-100%)</span>
              </div>
            </div>

            {/* Connection Types */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Connections (hover to see)</p>
              <div className="flex items-center gap-3">
                <div className="h-1 w-6" style={{ backgroundColor: '#10b981' }}></div>
                <span className="text-sm text-gray-700">belongs to</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-6 border-dashed border-2" style={{ borderColor: '#f59e0b' }}></div>
                <span className="text-sm text-gray-700">appears with</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-6" style={{ backgroundColor: '#8b5cf6' }}></div>
                <span className="text-sm text-gray-700">pattern</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-6" style={{ backgroundColor: '#3b82f6' }}></div>
                <span className="text-sm text-gray-700">context</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-1">
            <Link
              href="/dashboard"
              className="flex flex-col items-center py-3 text-gray-600 hover:text-primary-600"
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              href="/practice"
              className="flex flex-col items-center py-3 text-gray-600 hover:text-primary-600"
            >
              <span className="text-2xl mb-1">📚</span>
              <span className="text-xs font-medium">Practice</span>
            </Link>
            <Link
              href="/map"
              className="flex flex-col items-center py-3 text-primary-600 border-t-2 border-primary-600"
            >
              <span className="text-2xl mb-1">🗺️</span>
              <span className="text-xs font-medium">Map</span>
            </Link>
            <Link
              href="/settings"
              className="flex flex-col items-center py-3 text-gray-600 hover:text-primary-600"
            >
              <span className="text-2xl mb-1">⚙️</span>
              <span className="text-xs font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
