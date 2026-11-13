export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type CardType = 'concept' | 'how' | 'deep' | 'scenario' | 'security' | 'packet' | 'command' | 'troubleshoot' | 'compare' | 'diagram'
export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface MCQOption {
  id: string
  text: string
}
export interface MCQ {
  id: string
  question: string
  options: MCQOption[]
  correctOptionId: string
  explanation: string
  whyNot?: Record<string, string>
  difficulty: Difficulty
  topic: string
  tags: string[]
}

export interface Part { id: string; title: string; description: string }
export interface Chapter { id: string; partId: string; title: string; description: string; order: number }

export interface Flashcard {
  id: string
  chapterId: string
  partId: string
  type: CardType
  difficulty: Difficulty
  tags: string[]
  front: {
    title: string
    question: string
    category?: string
    visual?: string
  }
  back: {
    explanation: string
    internals?: string
    why?: string
    security?: string
    realWorld?: string
    example?: string
    related?: string[]
  }
}

export interface ReviewState {
  cardId: string
  due: number // epoch ms
  intervalDays: number
  ease: number
  repetitions: number
  lapses: number
  lastReviewed?: number
  lastRating?: Rating
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt?: number
}

export interface MLState {
  weights: number[]
  topicMastery: Record<string, { n: number; sum: number; ema: number }>
  cardUnderstanding: Record<string, number>
  totalUpdates: number
  lastTrained?: number
}

export type LearningDomain = 'red_vapt' | 'blue_soc' | 'networking'
export type LearningPathId = 'general' | 'red-team-operator' | 'vapt-analyst' | 'web-app-pentester' | 'network-pentester' | 'ad-specialist' | 'cloud-tester' | 'bug-bounty' | 'soc-analyst' | 'threat-hunter' | 'security-researcher' | 'purple-team'

export interface DomainProgress {
  seen: number
  mastered: number
  theoretical: number
  practical: number
}

export interface CyberProgress {
  redTeam: number
  vapt: number
  blueTeam: number
  networking: number
  webSecurity: number
  networkSecurity: number
  activeDirectory: number
  cloudSecurity: number
  toolProficiency: number
  practicalChallenges: number
  vulnerabilityAccuracy: number
  falsePositiveAccuracy: number
  troubleshootingAccuracy: number
  mitreKnowledge: number
}

export interface AppProgress {
  xp: number
  level: number
  streak: number
  longestStreak: number
  lastStudyDate?: string // YYYY-MM-DD
  reviews: Record<string, ReviewState>
  bookmarks: string[]
  achievements: Record<string, number>
  daily: {
    date?: string
    completed: boolean
    cardIds: string[]
    index: number
    xpEarned: number
  }
  history: { date: string; xp: number; cards: number }[]
  settings: {
    dailyGoal: number
    theme: 'dark' | 'light'
    learningPath: LearningPathId
    adaptiveDistribution: boolean
    distribution: { red_vapt: number; blue_soc: number; networking: number }
  }
  ml: MLState
  cyber: {
    domains: Record<LearningDomain, DomainProgress>
    metrics: CyberProgress
    toolsStudied: string[]
    completedCapstones: string[]
    challengeStats: { attempted: number; correct: number; practical: number; falsePositive: number }
  }
}