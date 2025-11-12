// Language Graph Structure
// Defines connections between scenes, patterns, words, and categories

export interface GraphNode {
  id: string
  type: 'user' | 'category' | 'scene' | 'pattern' | 'verb'
  label: string
  icon?: string
  x?: number
  y?: number
  connections: string[] // IDs of connected nodes
  requiredForProgress?: number // XP or count needed
  color?: string
}

// Connection types define semantic relationships
export type ConnectionType =
  | 'belongs_to'    // word belongs to scene (makan → dapur)
  | 'cooccurs'      // frequently appear together (sudah ↔ makan)
  | 'pattern_of'    // word is part of pattern (V in "Sudah {V}")
  | 'synonym'       // semantic similarity (tidak ↔ nggak)
  | 'requires'      // grammatical dependency (lebih → daripada)
  | 'context_of'    // contextual relationship (cafe → drink)
  | 'related_to'    // general relationship

export interface GraphConnection {
  from: string
  to: string
  type: ConnectionType
  strength: number // 1-5: connection weight
  weight?: number  // how often they cooccur (for cooccurs type)
  sharedElements?: string[] // shared words/patterns
  bidirectional?: boolean // true if relationship works both ways
}

// Build the language graph structure
export const buildLanguageGraph = (): {
  nodes: GraphNode[]
  connections: GraphConnection[]
} => {
  const nodes: GraphNode[] = [
    // Center: User
    {
      id: 'user',
      type: 'user',
      label: 'You',
      icon: '👤',
      x: 0,
      y: 0,
      connections: ['food-cat', 'places-cat', 'transport-cat', 'people-cat', 'daily-cat'],
      color: '#6366f1'
    },

    // Level 1: Categories (围绕用户的主要类别)
    {
      id: 'food-cat',
      type: 'category',
      label: 'Food & Dining',
      icon: '🍽',
      connections: ['cafe-scene', 'restaurant-scene', 'market-scene', 'verb-eat', 'verb-drink', 'verb-cook'],
      color: '#f59e0b'
    },
    {
      id: 'places-cat',
      type: 'category',
      label: 'Places',
      icon: '📍',
      connections: ['hotel-scene', 'airport-scene', 'directions-scene', 'verb-go', 'verb-come'],
      color: '#10b981'
    },
    {
      id: 'transport-cat',
      type: 'category',
      label: 'Transportation',
      icon: '🚗',
      connections: ['taxi-scene', 'directions-scene', 'verb-go', 'verb-buy'],
      color: '#3b82f6'
    },
    {
      id: 'people-cat',
      type: 'category',
      label: 'People & Social',
      icon: '👥',
      connections: ['greeting-scene', 'family-scene', 'verb-speak', 'verb-meet'],
      color: '#ec4899'
    },
    {
      id: 'daily-cat',
      type: 'category',
      label: 'Daily Life',
      icon: '🏠',
      connections: ['shopping-scene', 'hotel-scene', 'verb-work', 'verb-study', 'verb-sleep'],
      color: '#8b5cf6'
    },

    // Level 2: Scenes (具体场景)
    {
      id: 'cafe-scene',
      type: 'scene',
      label: 'Cafe',
      icon: '☕',
      connections: ['food-cat', 'verb-want', 'verb-drink', 'pattern-want'],
      requiredForProgress: 1
    },
    {
      id: 'restaurant-scene',
      type: 'scene',
      label: 'Restaurant',
      icon: '🍴',
      connections: ['food-cat', 'verb-eat', 'verb-want', 'pattern-have'],
      requiredForProgress: 1
    },
    {
      id: 'market-scene',
      type: 'scene',
      label: 'Market',
      icon: '🏪',
      connections: ['food-cat', 'verb-buy', 'verb-sell', 'pattern-how-much'],
      requiredForProgress: 1
    },
    {
      id: 'hotel-scene',
      type: 'scene',
      label: 'Hotel',
      icon: '🏨',
      connections: ['places-cat', 'daily-cat', 'verb-sleep', 'verb-want', 'pattern-have'],
      requiredForProgress: 1
    },
    {
      id: 'airport-scene',
      type: 'scene',
      label: 'Airport',
      icon: '✈️',
      connections: ['places-cat', 'transport-cat', 'verb-go', 'verb-come'],
      requiredForProgress: 1
    },
    {
      id: 'taxi-scene',
      type: 'scene',
      label: 'Taxi',
      icon: '🚕',
      connections: ['transport-cat', 'verb-go', 'pattern-want', 'directions-scene'],
      requiredForProgress: 1
    },
    {
      id: 'directions-scene',
      type: 'scene',
      label: 'Directions',
      icon: '🧭',
      connections: ['places-cat', 'transport-cat', 'verb-go', 'pattern-where'],
      requiredForProgress: 1
    },
    {
      id: 'greeting-scene',
      type: 'scene',
      label: 'Greetings',
      icon: '👋',
      connections: ['people-cat', 'verb-speak', 'pattern-basic'],
      requiredForProgress: 1
    },
    {
      id: 'shopping-scene',
      type: 'scene',
      label: 'Shopping',
      icon: '🛍',
      connections: ['daily-cat', 'food-cat', 'verb-buy', 'pattern-how-much'],
      requiredForProgress: 1
    },
    {
      id: 'family-scene',
      type: 'scene',
      label: 'Family',
      icon: '👨‍👩‍👧',
      connections: ['people-cat', 'verb-speak', 'pattern-have'],
      requiredForProgress: 1
    },

    // Key Verbs (关键动词节点)
    {
      id: 'verb-eat',
      type: 'verb',
      label: 'makan (eat)',
      icon: '🍴',
      connections: ['food-cat', 'cafe-scene', 'restaurant-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-drink',
      type: 'verb',
      label: 'minum (drink)',
      icon: '🥤',
      connections: ['food-cat', 'cafe-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-go',
      type: 'verb',
      label: 'pergi (go)',
      icon: '🚶',
      connections: ['places-cat', 'transport-cat', 'taxi-scene', 'airport-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-come',
      type: 'verb',
      label: 'datang (come)',
      icon: '👋',
      connections: ['places-cat', 'airport-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-want',
      type: 'verb',
      label: 'mau (want)',
      icon: '🎯',
      connections: ['food-cat', 'cafe-scene', 'hotel-scene', 'pattern-want'],
      requiredForProgress: 3
    },
    {
      id: 'verb-buy',
      type: 'verb',
      label: 'beli (buy)',
      icon: '💰',
      connections: ['food-cat', 'transport-cat', 'market-scene', 'shopping-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-sell',
      type: 'verb',
      label: 'jual (sell)',
      icon: '🏪',
      connections: ['market-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-speak',
      type: 'verb',
      label: 'bicara (speak)',
      icon: '💬',
      connections: ['people-cat', 'greeting-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-sleep',
      type: 'verb',
      label: 'tidur (sleep)',
      icon: '😴',
      connections: ['daily-cat', 'hotel-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-work',
      type: 'verb',
      label: 'kerja (work)',
      icon: '💼',
      connections: ['daily-cat'],
      requiredForProgress: 3
    },
    {
      id: 'verb-study',
      type: 'verb',
      label: 'belajar (study)',
      icon: '📚',
      connections: ['daily-cat'],
      requiredForProgress: 3
    },
    {
      id: 'verb-cook',
      type: 'verb',
      label: 'masak (cook)',
      icon: '👨‍🍳',
      connections: ['food-cat'],
      requiredForProgress: 3
    },
    {
      id: 'verb-meet',
      type: 'verb',
      label: 'ketemu (meet)',
      icon: '🤝',
      connections: ['people-cat', 'greeting-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-like',
      type: 'verb',
      label: 'suka (like)',
      icon: '❤️',
      connections: ['food-cat', 'people-cat', 'cafe-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-need',
      type: 'verb',
      label: 'butuh (need)',
      icon: '🎯',
      connections: ['food-cat', 'shopping-scene'],
      requiredForProgress: 3
    },
    {
      id: 'verb-know',
      type: 'verb',
      label: 'tahu (know)',
      icon: '🧠',
      connections: ['people-cat', 'daily-cat'],
      requiredForProgress: 3
    },
    {
      id: 'verb-understand',
      type: 'verb',
      label: 'mengerti (understand)',
      icon: '💡',
      connections: ['people-cat', 'daily-cat'],
      requiredForProgress: 3
    },
    {
      id: 'verb-help',
      type: 'verb',
      label: 'bantu (help)',
      icon: '🤲',
      connections: ['people-cat', 'daily-cat'],
      requiredForProgress: 3
    },

    // Key Patterns
    {
      id: 'pattern-basic',
      type: 'pattern',
      label: 'Basic SVO',
      icon: '📝',
      connections: ['user', 'greeting-scene'],
      requiredForProgress: 5
    },
    {
      id: 'pattern-want',
      type: 'pattern',
      label: 'Saya mau...',
      icon: '🎯',
      connections: ['verb-want', 'cafe-scene', 'hotel-scene'],
      requiredForProgress: 5
    },
    {
      id: 'pattern-have',
      type: 'pattern',
      label: 'Ada...',
      icon: '✅',
      connections: ['hotel-scene', 'restaurant-scene'],
      requiredForProgress: 5
    },
    {
      id: 'pattern-how-much',
      type: 'pattern',
      label: 'Berapa...?',
      icon: '💵',
      connections: ['market-scene', 'shopping-scene'],
      requiredForProgress: 5
    },
    {
      id: 'pattern-where',
      type: 'pattern',
      label: 'Di mana...?',
      icon: '📍',
      connections: ['directions-scene'],
      requiredForProgress: 5
    },
    {
      id: 'pattern-like',
      type: 'pattern',
      label: 'Saya suka...',
      icon: '❤️',
      connections: ['verb-like', 'cafe-scene'],
      requiredForProgress: 5
    },
    {
      id: 'pattern-can',
      type: 'pattern',
      label: 'Bisa...?',
      icon: '✅',
      connections: ['verb-speak', 'greeting-scene'],
      requiredForProgress: 5
    },
    {
      id: 'pattern-negative',
      type: 'pattern',
      label: 'Tidak...',
      icon: '❌',
      connections: ['user'],
      requiredForProgress: 5
    }
  ]

  // Build semantic connections with types
  const connections: GraphConnection[] = []

  // User to categories: context_of
  const userNode = nodes.find(n => n.type === 'user')
  if (userNode) {
    userNode.connections.forEach(catId => {
      connections.push({
        from: userNode.id,
        to: catId,
        type: 'context_of',
        strength: 5,
        bidirectional: false
      })
    })
  }

  // Categories to scenes: belongs_to
  nodes.filter(n => n.type === 'scene').forEach(scene => {
    const categories = scene.connections.filter(id =>
      nodes.find(n => n.id === id && n.type === 'category')
    )
    categories.forEach(catId => {
      connections.push({
        from: scene.id,
        to: catId,
        type: 'belongs_to',
        strength: 4,
        bidirectional: false
      })
    })
  })

  // Scenes to verbs: cooccurs (frequently appear together)
  nodes.filter(n => n.type === 'scene').forEach(scene => {
    const verbs = scene.connections.filter(id =>
      nodes.find(n => n.id === id && n.type === 'verb')
    )
    verbs.forEach(verbId => {
      connections.push({
        from: scene.id,
        to: verbId,
        type: 'cooccurs',
        strength: 3,
        weight: 5, // frequency of cooccurrence
        bidirectional: true
      })
    })
  })

  // Patterns to verbs: pattern_of
  nodes.filter(n => n.type === 'pattern').forEach(pattern => {
    const verbs = pattern.connections.filter(id =>
      nodes.find(n => n.id === id && n.type === 'verb')
    )
    verbs.forEach(verbId => {
      connections.push({
        from: verbId,
        to: pattern.id,
        type: 'pattern_of',
        strength: 4,
        bidirectional: false
      })
    })
  })

  // Patterns to scenes: context_of
  nodes.filter(n => n.type === 'pattern').forEach(pattern => {
    const scenes = pattern.connections.filter(id =>
      nodes.find(n => n.id === id && n.type === 'scene')
    )
    scenes.forEach(sceneId => {
      connections.push({
        from: pattern.id,
        to: sceneId,
        type: 'context_of',
        strength: 3,
        bidirectional: false
      })
    })
  })

  // Verbs to categories: related_to
  nodes.filter(n => n.type === 'verb').forEach(verb => {
    const categories = verb.connections.filter(id =>
      nodes.find(n => n.id === id && n.type === 'category')
    )
    categories.forEach(catId => {
      connections.push({
        from: verb.id,
        to: catId,
        type: 'related_to',
        strength: 3,
        bidirectional: false
      })
    })
  })

  return { nodes, connections }
}

// Get connection style based on type
export function getConnectionStyle(type: ConnectionType): {
  color: string
  dashArray?: string
  label: string
} {
  const styles = {
    belongs_to: { color: '#10b981', label: 'belongs to' },
    cooccurs: { color: '#f59e0b', dashArray: '5,5', label: 'appears with' },
    pattern_of: { color: '#8b5cf6', label: 'pattern' },
    synonym: { color: '#ec4899', dashArray: '3,3', label: 'similar to' },
    requires: { color: '#ef4444', label: 'requires' },
    context_of: { color: '#3b82f6', label: 'context' },
    related_to: { color: '#9ca3af', dashArray: '2,2', label: 'related' }
  }
  return styles[type]
}

// Calculate centrality of a node (how important it is in the graph)
export function calculateNodeCentrality(
  nodeId: string,
  connections: GraphConnection[]
): number {
  // Count incoming and outgoing connections
  const incoming = connections.filter(c => c.to === nodeId).length
  const outgoing = connections.filter(c => c.from === nodeId).length

  // Weight by connection strength
  const incomingWeight = connections
    .filter(c => c.to === nodeId)
    .reduce((sum, c) => sum + c.strength, 0)
  const outgoingWeight = connections
    .filter(c => c.from === nodeId)
    .reduce((sum, c) => sum + c.strength, 0)

  return (incoming + outgoing) + (incomingWeight + outgoingWeight) * 0.1
}

// Find shortest path between two nodes (for learning path recommendations)
export function findShortestPath(
  fromId: string,
  toId: string,
  graph: { nodes: GraphNode[]; connections: GraphConnection[] }
): string[] {
  // BFS to find shortest path
  const queue: string[][] = [[fromId]]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const path = queue.shift()!
    const node = path[path.length - 1]

    if (node === toId) return path

    if (!visited.has(node)) {
      visited.add(node)

      // Get neighbors
      const neighbors = graph.connections
        .filter(c => c.from === node || (c.bidirectional && c.to === node))
        .map(c => (c.from === node ? c.to : c.from))

      for (const neighbor of neighbors) {
        queue.push([...path, neighbor])
      }
    }
  }

  return [] // No path found
}

// Recommend next learning nodes based on current progress
export function recommendNextNodes(
  completedNodes: string[],
  graph: { nodes: GraphNode[]; connections: GraphConnection[] }
): GraphNode[] {
  const completed = new Set(completedNodes)
  const recommendations: { node: GraphNode; score: number }[] = []

  graph.nodes.forEach(node => {
    if (completed.has(node.id) || node.type === 'user') return

    // Calculate recommendation score
    let score = 0

    // Check how many connected nodes are completed
    const connectedIds = graph.connections
      .filter(c => c.to === node.id || c.from === node.id)
      .map(c => (c.to === node.id ? c.from : c.to))

    const completedConnections = connectedIds.filter(id => completed.has(id)).length

    // Higher score if more prerequisites are completed
    score += completedConnections * 10

    // Bonus for cooccurs relationships (frequently used together)
    const cooccursConnections = graph.connections.filter(
      c => c.type === 'cooccurs' && (c.to === node.id || c.from === node.id)
    )
    score += cooccursConnections.length * 5

    recommendations.push({ node, score })
  })

  // Sort by score and return top recommendations
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.node)
}

// Calculate position for force-directed layout
export function calculateNodePositions(nodes: GraphNode[]): GraphNode[] {
  const centerX = 400
  const centerY = 300

  return nodes.map(node => {
    if (node.type === 'user') {
      return { ...node, x: centerX, y: centerY }
    }

    // Position by type in concentric circles
    const nodeIndex = nodes.filter(n => n.type === node.type).indexOf(node)
    const nodesOfType = nodes.filter(n => n.type === node.type).length
    const angle = (nodeIndex / nodesOfType) * 2 * Math.PI

    let radius = 0
    if (node.type === 'category') radius = 150
    if (node.type === 'scene') radius = 280
    if (node.type === 'verb' || node.type === 'pattern') radius = 420

    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    }
  })
}
