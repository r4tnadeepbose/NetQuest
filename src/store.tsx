import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AppProgress, Flashcard, LearningDomain, LearningPathId, Rating } from './types'
import { flashcards } from './data/curriculum'
import { loadProgress, saveProgress } from './lib/storage'
import { initReview, isDue, masteryFromReview, scheduleReview } from './lib/srs'
import { levelFromXp, xpForRating } from './lib/levels'
import { overallUnderstanding, predictUnderstanding, topicUnderstanding, updateML } from './lib/ml'

type Store = {
  progress: AppProgress
  allCards: Flashcard[]
  rateCard: (cardId: string, rating: Rating) => void
  toggleBookmark: (cardId: string) => void
  startOrResumeDaily: () => void
  resetDaily: () => void
  resetAll: () => void
  setDailyGoal: (n: number) => void
  setLearningPath: (path: LearningPathId) => void
  setAdaptiveDistribution: (v: boolean) => void
  setDistribution: (d: { red_vapt: number; blue_soc: number; networking: number }) => void
  markToolStudied: (toolId: string) => void
  completeCapstone: (capstoneId: string) => void
  recordChallengeResult: (result: { correct: number; total: number; practical?: boolean; falsePositive?: number }) => void
  getCardUnderstanding: (cardId: string) => number
  getTopicUnderstanding: (chapterId: string) => number
  getOverallUnderstanding: () => number
  getDomainOfCard: (card: Flashcard) => LearningDomain
}

const Ctx = createContext<Store | null>(null)
const todayStr = () => new Date().toISOString().slice(0, 10)

export function getDomainOfCard(card: Flashcard): LearningDomain {
  if (card.partId === 'p17') return 'blue_soc'
  if (card.partId === 'p16' || card.partId === 'p18') return 'red_vapt'
  // p15 OWASP/web-app security treated as red/vapt focus area in this specialization; others networking
  if (card.partId === 'p15') return 'red_vapt'
  const tags = (card.tags || []).join(' ').toLowerCase()
  const text = `${card.front.title} ${card.front.question} ${card.back.explanation}`.toLowerCase()
  if (tags.includes('soc') || tags.includes('siem') || tags.includes('dfir') || tags.includes('threat-hunt') || tags.includes('blue-team') || text.includes('soc analyst') || text.includes('incident response')) return 'blue_soc'
  if (tags.includes('vapt') || tags.includes('pentest') || tags.includes('red-team') || tags.includes('exploit') || tags.includes('owasp') || tags.includes('attack')) return 'red_vapt'
  return 'networking'
}

function pathBoost(card: Flashcard, path: LearningPathId): number {
  if (path === 'general') return 0
  const hay = `${card.partId} ${card.chapterId} ${card.tags.join(' ')} ${card.front.title} ${card.front.question}`.toLowerCase()
  const has = (...ks: string[]) => ks.some(k => hay.includes(k))
  switch (path) {
    case 'red-team-operator': return has('rt', 'ad', 'lateral', 'pivot', 'mitre', 'red-team') ? 0.5 : 0
    case 'vapt-analyst': return has('vapt', 'cp1', 'owasp', 'report', 'cvss', 'web') ? 0.5 : 0
    case 'web-app-pentester': case 'bug-bounty': return has('web', 'api', 'owasp', 'sqli', 'xss', 'ssrf', 'idor', 'rt4', 'p15') ? 0.55 : 0
    case 'network-pentester': return has('rt3', 'network', 'scan', 'tcp', 'routing', 'firewall', 'vlan') ? 0.55 : 0
    case 'ad-specialist': return has('active-directory', 'kerberos', 'ldap', 'ad', 'rt5', 'bloodhound') ? 0.6 : 0
    case 'cloud-tester': return has('cloud', 'iam', 'aws', 'azure', 'kubernetes', 'rt7') ? 0.55 : 0
    case 'soc-analyst': case 'threat-hunter': return has('soc', 'siem', 'hunt', 'dfir', 'bt', 'log', 'detection') ? 0.55 : 0
    case 'security-researcher': return has('deep', 'internals', 'packet', 'protocol', 'vulnerability') ? 0.4 : 0
    case 'purple-team': return has('purple', 'detection', 'mitre', 'bt', 'rt') ? 0.45 : 0
    default: return 0
  }
}

function pickDailyCards(progress: AppProgress): string[] {
  const now = Date.now()
  const goal = Math.max(7, Math.min(12, progress.settings.dailyGoal || 10))
  const dist = progress.settings.distribution || { red_vapt: 70, blue_soc: 20, networking: 10 }
  const adaptive = progress.settings.adaptiveDistribution !== false
  const path = progress.settings.learningPath || 'general'

  // rotation hint by weekday (suggested, not rigid) - mild bias
  const day = new Date().getDay() // 0 Sun
  const dayBias: Record<LearningDomain, number> = { red_vapt: 0, blue_soc: 0, networking: 0 }
  if (day === 1) dayBias.red_vapt += 0.15 // Mon network red teaming
  if (day === 2) dayBias.red_vapt += 0.2  // Tue web vapt
  if (day === 3) dayBias.red_vapt += 0.15 // Wed AD
  if (day === 4) dayBias.red_vapt += 0.1  // Thu infra/cloud
  if (day === 5) dayBias.red_vapt += 0.2  // Fri advanced red
  if (day === 6) dayBias.blue_soc += 0.25 // Sat blue team
  if (day === 0) { dayBias.networking += 0.1; dayBias.red_vapt += 0.05; dayBias.blue_soc += 0.05 } // Sun mixed

  const scored = flashcards.map(c => {
    const dom = getDomainOfCard(c)
    const rev = progress.reviews[c.id]
    const due = isDue(rev, now) ? 1 : 0
    const unseen = !rev ? 1 : 0
    const lapses = Math.min(5, rev?.lapses || 0)
    const p = predictUnderstanding(progress.ml, c, rev, now)
    const weakness = 1 - p
    const base = due * 2.4 + unseen * 1.2 + weakness * 2.1 + lapses * 0.25 + (rev?.lastRating === 'again' ? 0.8 : rev?.lastRating === 'hard' ? 0.4 : 0)
    const target = (dist as any)[dom] ?? 0
    const distWeight = (target / 100) * 1.2
    const pathW = pathBoost(c, path)
    const rot = dayBias[dom] || 0
    // adaptive: amplify weak domains slightly
    const adapt = adaptive ? (weakness * 0.3) : 0
    const score = base + distWeight + pathW + rot + adapt + (Math.random() * 0.05)
    return { id: c.id, score, unseen, dom }
  })

  const byDom: Record<LearningDomain, string[]> = { red_vapt: [], blue_soc: [], networking: [] }
  for (const s of scored.sort((a,b)=>b.score-a.score)) byDom[s.dom].push(s.id)

  // compute targets from distribution, ensure at least representation when possible
  const rawCounts = {
    red_vapt: Math.round(goal * (dist.red_vapt / 100)),
    blue_soc: Math.round(goal * (dist.blue_soc / 100)),
    networking: Math.round(goal * (dist.networking / 100)),
  }
  let total = rawCounts.red_vapt + rawCounts.blue_soc + rawCounts.networking
  while (total < goal) { rawCounts.red_vapt++; total++ }
  while (total > goal) { if (rawCounts.red_vapt > 0) rawCounts.red_vapt--; else if (rawCounts.blue_soc > 0) rawCounts.blue_soc--; else rawCounts.networking--; total-- }
  // guarantee minimum 1 for non-zero targets if goal allows
  if (goal >= 3) {
    if (dist.networking > 0 && rawCounts.networking === 0) { rawCounts.networking = 1; if (rawCounts.red_vapt>1) rawCounts.red_vapt--; else rawCounts.blue_soc-- }
    if (dist.blue_soc > 0 && rawCounts.blue_soc === 0) { rawCounts.blue_soc = 1; if (rawCounts.red_vapt>1) rawCounts.red_vapt--; else rawCounts.networking-- }
  }

  const picked: string[] = []
  const take = (dom: LearningDomain, n: number) => {
    for (const id of byDom[dom]) { if (picked.length >= goal) return; if (picked.filter(x=>x).length >= goal) return; if (picked.includes(id)) continue; if (picked.filter(pid => getDomainOfCard(flashcards.find(f=>f.id===pid)!)===dom).length >= n) break; picked.push(id) }
  }
  take('red_vapt', rawCounts.red_vapt)
  take('blue_soc', rawCounts.blue_soc)
  take('networking', rawCounts.networking)
  // fill remaining by overall score
  for (const s of scored.sort((a,b)=>b.score-a.score)) { if (picked.length >= goal) break; if (!picked.includes(s.id)) picked.push(s.id) }
  return picked.slice(0, goal)
}

function ensureStreak(p: AppProgress): AppProgress {
  const today = todayStr()
  if (p.lastStudyDate === today) return p
  if (!p.lastStudyDate) return p
  const prev = new Date(p.lastStudyDate + 'T00:00:00')
  const cur = new Date(today + 'T00:00:00')
  const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000)
  if (diff === 1) return p
  if (diff > 1) return { ...p, streak: 0 }
  return p
}

function emitCelebrate(detail: any) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('netquest:celebrate', { detail }))
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<AppProgress>(() => ensureStreak(loadProgress()))

  useEffect(() => { saveProgress(progress) }, [progress])

  const startOrResumeDaily = useCallback(() => {
    setProgress(p => {
      const today = todayStr()
      if (p.daily.date === today && p.daily.cardIds.length > 0) return p
      const cardIds = pickDailyCards(p)
      return { ...p, daily: { date: today, completed: false, cardIds, index: 0, xpEarned: 0 } }
    })
  }, [])

  const rateCard = useCallback((cardId: string, rating: Rating) => {
    setProgress(p => {
      const today = todayStr()
      const daily = { ...p.daily }
      if (daily.date !== today) {
        daily.date = today; daily.completed = false; daily.cardIds = pickDailyCards(p); daily.index = 0; daily.xpEarned = 0
      }
      // Guard: prevent duplicate rapid clicks / re-processing of an already consumed daily card
      if (daily.date === today) {
        const idxInDaily = daily.cardIds.indexOf(cardId)
        if (idxInDaily !== -1 && idxInDaily < daily.index) {
          return p
        }
      }

      const now = Date.now()
      const prev = p.reviews[cardId] ? { ...p.reviews[cardId], cardId } : { ...initReview(cardId, now), cardId }
      const nextReview = scheduleReview(prev, rating, now)
      nextReview.cardId = cardId
      const xpGain = xpForRating(rating)
      let streak = p.streak
      let lastStudyDate = p.lastStudyDate
      if (lastStudyDate !== today) {
        const yesterday = new Date(now - 86400000).toISOString().slice(0, 10)
        streak = lastStudyDate === yesterday ? streak + 1 : 1
        lastStudyDate = today
      }
      const xp = p.xp + xpGain
      const level = levelFromXp(xp)
      if (daily.cardIds[daily.index] === cardId) {
        daily.index = Math.min(daily.cardIds.length, daily.index + 1)
        daily.xpEarned += xpGain
        if (daily.index >= daily.cardIds.length && daily.cardIds.length > 0) daily.completed = true
      }
      const history = [...p.history]
      const h = history.find(x => x.date === today)
      if (h) { h.xp += xpGain; h.cards += 1 } else history.push({ date: today, xp: xpGain, cards: 1 })
      const achievements = { ...p.achievements }
      const totalReviews = history.reduce((a,b)=>a+b.cards,0)
      const newUnlocks: string[] = []
      if (totalReviews >= 10 && !achievements.first10) { achievements.first10 = now; newUnlocks.push('first10') }
      if (totalReviews >= 50 && !achievements.first50) { achievements.first50 = now; newUnlocks.push('first50') }
      if (streak >= 7 && !achievements.streak7) { achievements.streak7 = now; newUnlocks.push('streak7') }
      if (daily.completed && !achievements.dailyDone) { achievements.dailyDone = now; newUnlocks.push('dailyDone') }
      const card = flashcards.find(c => c.id === cardId)
      const ml = card ? updateML(p.ml, card, prev, rating, now) : p.ml

      // update cyber domain/theoretical-practical progress heuristics
      const cyber = { ...p.cyber, domains: { ...p.cyber.domains }, metrics: { ...p.cyber.metrics } }
      if (card) {
        const dom = getDomainOfCard(card)
        const dp = { ...cyber.domains[dom] }
        dp.seen = Math.max(dp.seen, Object.values(p.reviews).filter(r => { const cc = flashcards.find(f=>f.id===r.cardId); return cc && getDomainOfCard(cc)===dom }).length + 1)
        if (masteryFromReview(nextReview) >= 100) dp.mastered += (masteryFromReview(prev) >= 100 ? 0 : 1)
        if (rating === 'good' || rating === 'easy') dp.theoretical += 1
        const practicalTypes = ['scenario','command','troubleshoot','packet','security']
        if (practicalTypes.includes(card.type) && (rating === 'good' || rating === 'easy')) dp.practical += 1
        cyber.domains[dom] = dp
      }

      const nextState: AppProgress = {
        ...p,
        xp, level, streak, lastStudyDate,
        longestStreak: Math.max(p.longestStreak, streak),
        reviews: { ...p.reviews, [cardId]: nextReview },
        daily, history: history.slice(-60), achievements, ml, cyber,
      }

      queueMicrotask(() => {
        if (level > p.level) {
          emitCelebrate({ sound: 'levelup', confetti: { particleCount: 160 }, toast: { title: 'Level Up!', message: `You reached level ${level}. Keep going.`, kind: 'levelup' } })
        }
        if (daily.completed && !p.daily.completed) {
          emitCelebrate({ sound: 'complete', confetti: { particleCount: 220, spread: 1.2 }, toast: { title: 'Daily session complete', message: `+${daily.xpEarned} XP earned today.`, kind: 'success' } })
        } else if (streak > p.streak && streak > 1) {
          emitCelebrate({ sound: 'streak', toast: { title: `${streak}-day streak`, message: 'Consistency is building mastery.', kind: 'success' } })
        }
        if (newUnlocks.length) {
          const names: Record<string,string> = { first10:'First 10 Cards', first50:'First 50 Cards', streak7:'Seven-Day Streak', dailyDone:'Daily Session Complete' }
          newUnlocks.forEach((id, i) => setTimeout(() => emitCelebrate({ sound: 'achievement', confetti: { particleCount: 140 }, toast: { title: 'Achievement unlocked', message: names[id] || id, kind: 'achievement' } }), i * 250))
        }
      })

      return nextState
    })
  }, [])

  const toggleBookmark = useCallback((cardId: string) => setProgress(p => {
    const has = p.bookmarks.includes(cardId)
    return { ...p, bookmarks: has ? p.bookmarks.filter(id=>id!==cardId) : [...p.bookmarks, cardId] }
  }), [])
  const resetDaily = useCallback(() => setProgress(p => ({ ...p, daily: { date: todayStr(), completed: false, cardIds: pickDailyCards(p), index: 0, xpEarned: 0 } })), [])
  const resetAll = useCallback(() => setProgress(() => { localStorage.removeItem('netquest_progress_v1'); return loadProgress() }), [])
  const setDailyGoal = useCallback((n: number) => setProgress(p => ({ ...p, settings: { ...p.settings, dailyGoal: n } })), [])
  const setLearningPath = useCallback((path: LearningPathId) => setProgress(p => ({ ...p, settings: { ...p.settings, learningPath: path } })), [])
  const setAdaptiveDistribution = useCallback((v: boolean) => setProgress(p => ({ ...p, settings: { ...p.settings, adaptiveDistribution: v } })), [])
  const setDistribution = useCallback((d: { red_vapt: number; blue_soc: number; networking: number }) => setProgress(p => ({ ...p, settings: { ...p.settings, distribution: d } })), [])
  const markToolStudied = useCallback((toolId: string) => setProgress(p => {
    if (p.cyber.toolsStudied.includes(toolId)) return p
    return { ...p, cyber: { ...p.cyber, toolsStudied: [...p.cyber.toolsStudied, toolId] } }
  }), [])
  const completeCapstone = useCallback((capstoneId: string) => setProgress(p => {
    if (p.cyber.completedCapstones.includes(capstoneId)) return p
    return { ...p, cyber: { ...p.cyber, completedCapstones: [...p.cyber.completedCapstones, capstoneId] } }
  }), [])
  const recordChallengeResult = useCallback((result: { correct: number; total: number; practical?: boolean; falsePositive?: number }) => setProgress(p => {
    const cs = { ...p.cyber.challengeStats }
    cs.attempted += result.total
    cs.correct += result.correct
    if (result.practical) cs.practical += result.total
    cs.falsePositive += (result.falsePositive || 0)
    return { ...p, cyber: { ...p.cyber, challengeStats: cs } }
  }), [])

  const getCardUnderstanding = useCallback((cardId: string) => {
    const card = flashcards.find(c => c.id === cardId); if (!card) return 0
    return Math.round(predictUnderstanding(progress.ml, card, progress.reviews[cardId]) * 100)
  }, [progress])
  const getTopicUnderstanding = useCallback((chapterId: string) => topicUnderstanding(progress.ml, chapterId), [progress])
  const getOverallUnderstanding = useCallback(() => overallUnderstanding(progress.ml), [progress])

  const value = useMemo(() => ({ progress, allCards: flashcards, rateCard, toggleBookmark, startOrResumeDaily, resetDaily, resetAll, setDailyGoal, setLearningPath, setAdaptiveDistribution, setDistribution, markToolStudied, completeCapstone, recordChallengeResult, getCardUnderstanding, getTopicUnderstanding, getOverallUnderstanding, getDomainOfCard }), [progress, rateCard, toggleBookmark, startOrResumeDaily, resetDaily, resetAll, setDailyGoal, setLearningPath, setAdaptiveDistribution, setDistribution, markToolStudied, completeCapstone, recordChallengeResult, getCardUnderstanding, getTopicUnderstanding, getOverallUnderstanding])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('StoreProvider missing')
  return v
}
