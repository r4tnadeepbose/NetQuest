import type { Flashcard, MLState, Rating, ReviewState } from '../types'

// Online logistic regression to estimate learner understanding/mastery probability.
// Features: bias, ratingQuality, difficulty, repetitions, lapses, recency, easeNorm, typeDepth
export function defaultMLState(): MLState {
  return {
    weights: [0, 0.8, -0.4, 0.25, -0.35, 0.15, 0.2, 0.05],
    topicMastery: {},
    cardUnderstanding: {},
    totalUpdates: 0,
  }
}

function sigmoid(x: number) { return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, x)))) }
function clamp01(x: number) { return Math.max(0, Math.min(1, x)) }

function ratingLabel(r: Rating) {
  return r === 'again' ? 0 : r === 'hard' ? 0.35 : r === 'good' ? 0.75 : 1
}

function diffVal(d: Flashcard['difficulty']) { return d === 'beginner' ? 0 : d === 'intermediate' ? 0.5 : 1 }
function typeDepth(t: Flashcard['type']) {
  return (['deep','scenario','security','packet','troubleshoot'].includes(t) ? 0.8 : t === 'how' ? 0.6 : 0.4)
}

export function featuresFor(card: Flashcard, review: ReviewState | undefined, rating: Rating, now = Date.now()) {
  const reps = Math.min(10, review?.repetitions ?? 0) / 10
  const lapses = Math.min(5, review?.lapses ?? 0) / 5
  const last = review?.lastReviewed ?? 0
  const days = last ? Math.min(30, (now - last) / 86400000) / 30 : 1
  const recency = 1 - days
  const ease = Math.min(3, Math.max(1.3, review?.ease ?? 2.5))
  const easeNorm = (ease - 1.3) / 1.7
  return [
    1, // bias
    ratingLabel(rating),
    diffVal(card.difficulty),
    reps,
    lapses,
    recency,
    easeNorm,
    typeDepth(card.type),
  ]
}

export function predictUnderstanding(ml: MLState | undefined, card: Flashcard, review: ReviewState | undefined, now = Date.now()) {
  const w = ml?.weights?.length ? ml.weights : defaultMLState().weights
  // prediction without using current rating as feature; use prior signal proxy from review
  const reps = Math.min(10, review?.repetitions ?? 0) / 10
  const lapses = Math.min(5, review?.lapses ?? 0) / 5
  const last = review?.lastReviewed ?? 0
  const days = last ? Math.min(30, (now - last) / 86400000) / 30 : 1
  const recency = 1 - days
  const ease = Math.min(3, Math.max(1.3, review?.ease ?? 2.5))
  const easeNorm = (ease - 1.3) / 1.7
  const priorQuality = review?.lastRating ? ratingLabel(review.lastRating) : (review ? 0.5 : 0.2)
  const x = [1, priorQuality, diffVal(card.difficulty), reps, lapses, recency, easeNorm, typeDepth(card.type)]
  let z = 0
  for (let i = 0; i < w.length; i++) z += w[i] * (x[i] ?? 0)
  // blend with card-specific understanding if available
  const p = sigmoid(z)
  const cardP = ml?.cardUnderstanding?.[card.id]
  return clamp01(cardP != null ? 0.6 * p + 0.4 * cardP : p)
}

export function updateML(ml: MLState | undefined, card: Flashcard, review: ReviewState | undefined, rating: Rating, now = Date.now()): MLState {
  const state: MLState = ml ? { ...ml, weights: [...ml.weights], topicMastery: { ...ml.topicMastery }, cardUnderstanding: { ...ml.cardUnderstanding } } : defaultMLState()
  const x = featuresFor(card, review, rating, now)
  if (state.weights.length !== x.length) state.weights = defaultMLState().weights.slice(0, x.length)
  let z = 0
  for (let i = 0; i < state.weights.length; i++) z += state.weights[i] * x[i]
  const pred = sigmoid(z)
  const y = ratingLabel(rating)
  const lr = 0.08
  for (let i = 0; i < state.weights.length; i++) state.weights[i] += lr * (y - pred) * x[i]

  // card-level understanding EMA
  const prevCard = state.cardUnderstanding[card.id] ?? 0.3
  state.cardUnderstanding[card.id] = clamp01(prevCard * 0.7 + y * 0.3)

  // topic/chapter mastery EMA
  const key = card.chapterId
  const tm = state.topicMastery[key] || { n: 0, sum: 0, ema: 0.3 }
  const ema = clamp01(tm.ema * 0.8 + y * 0.2)
  state.topicMastery[key] = { n: tm.n + 1, sum: tm.sum + y, ema }

  state.totalUpdates += 1
  state.lastTrained = now
  return state
}

export function topicUnderstanding(ml: MLState | undefined, chapterId: string) {
  const t = ml?.topicMastery?.[chapterId]
  if (!t) return 0
  return Math.round(clamp01(t.ema) * 100)
}

export function overallUnderstanding(ml: MLState | undefined) {
  const vals = Object.values(ml?.topicMastery || {}).map(t => t.ema)
  if (!vals.length) return 0
  return Math.round((vals.reduce((a,b)=>a+b,0) / vals.length) * 100)
}