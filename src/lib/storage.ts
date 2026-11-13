import type { AppProgress } from '../types'
import { defaultMLState } from './ml'

const KEY = 'netquest_progress_v1'

export function defaultProgress(): AppProgress {
  const today = new Date().toISOString().slice(0, 10)
  return {
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    reviews: {},
    bookmarks: [],
    achievements: {},
    daily: { date: today, completed: false, cardIds: [], index: 0, xpEarned: 0 },
    history: [],
    settings: { dailyGoal: 10, theme: 'dark', learningPath: 'general', adaptiveDistribution: true, distribution: { red_vapt: 70, blue_soc: 20, networking: 10 } },
    ml: defaultMLState(),
    cyber: {
      domains: {
        red_vapt: { seen: 0, mastered: 0, theoretical: 0, practical: 0 },
        blue_soc: { seen: 0, mastered: 0, theoretical: 0, practical: 0 },
        networking: { seen: 0, mastered: 0, theoretical: 0, practical: 0 },
      },
      metrics: { redTeam: 0, vapt: 0, blueTeam: 0, networking: 0, webSecurity: 0, networkSecurity: 0, activeDirectory: 0, cloudSecurity: 0, toolProficiency: 0, practicalChallenges: 0, vulnerabilityAccuracy: 0, falsePositiveAccuracy: 0, troubleshootingAccuracy: 0, mitreKnowledge: 0 },
      toolsStudied: [],
      completedCapstones: [],
      challengeStats: { attempted: 0, correct: 0, practical: 0, falsePositive: 0 },
    },
  }
}

export function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as any
    const d = defaultProgress()
    const dml = defaultMLState()
    const pml = parsed.ml || ({} as any)
    return {
      ...d,
      ...parsed,
      reviews: parsed.reviews || {},
      bookmarks: parsed.bookmarks || [],
      achievements: parsed.achievements || {},
      daily: { ...d.daily, ...(parsed.daily || {}) },
      settings: { ...d.settings, ...(parsed.settings || {}), distribution: { ...d.settings.distribution, ...((parsed.settings||{}).distribution||{}) } },
      ml: {
        ...dml,
        ...pml,
        weights: Array.isArray(pml.weights) && pml.weights.length ? pml.weights : dml.weights,
        topicMastery: pml.topicMastery || {},
        cardUnderstanding: pml.cardUnderstanding || {},
        totalUpdates: pml.totalUpdates || 0,
      },
      cyber: {
        ...d.cyber,
        ...(parsed.cyber || {}),
        domains: {
          red_vapt: { ...d.cyber.domains.red_vapt, ...(((parsed.cyber||{}).domains||{}).red_vapt||{}) },
          blue_soc: { ...d.cyber.domains.blue_soc, ...(((parsed.cyber||{}).domains||{}).blue_soc||{}) },
          networking: { ...d.cyber.domains.networking, ...(((parsed.cyber||{}).domains||{}).networking||{}) },
        },
        metrics: { ...d.cyber.metrics, ...((parsed.cyber||{}).metrics||{}) },
        toolsStudied: (parsed.cyber && parsed.cyber.toolsStudied) || [],
        completedCapstones: (parsed.cyber && parsed.cyber.completedCapstones) || [],
        challengeStats: { ...d.cyber.challengeStats, ...((parsed.cyber||{}).challengeStats||{}) },
      },
    }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: AppProgress) {
  localStorage.setItem(KEY, JSON.stringify(p))
}