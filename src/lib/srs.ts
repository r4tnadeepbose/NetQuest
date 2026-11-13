import type { Rating, ReviewState } from '../types'

const DAY = 24 * 60 * 60 * 1000

export function initReview(cardId: string, now = Date.now()): ReviewState {
  return { cardId, due: now, intervalDays: 0, ease: 2.5, repetitions: 0, lapses: 0 }
}

export function scheduleReview(prev: ReviewState | undefined, rating: Rating, now = Date.now()): ReviewState {
  const state = prev ? { ...prev } : initReview('', now)
  let { ease, intervalDays, repetitions, lapses } = state

  const quality = rating === 'again' ? 0 : rating === 'hard' ? 3 : rating === 'good' ? 4 : 5
  if (quality < 3) {
    repetitions = 0
    lapses += 1
    intervalDays = rating === 'again' ? 0.02 : 0.2 // minutes-hours as fractional days
    ease = Math.max(1.3, ease - 0.2)
  } else {
    if (repetitions === 0) intervalDays = rating === 'easy' ? 3 : 1
    else if (repetitions === 1) intervalDays = rating === 'easy' ? 7 : 3
    else intervalDays = Math.round(intervalDays * (rating === 'hard' ? 1.2 : rating === 'easy' ? ease + 0.3 : ease))
    repetitions += 1
    const delta = quality === 5 ? 0.15 : quality === 4 ? 0 : -0.15
    ease = Math.max(1.3, ease + delta)
  }

  const due = now + Math.max(10 * 60 * 1000, intervalDays * DAY)
  return {
    cardId: state.cardId,
    due,
    intervalDays,
    ease,
    repetitions,
    lapses,
    lastReviewed: now,
    lastRating: rating,
  }
}

export function isDue(state: ReviewState | undefined, now = Date.now()) {
  return !state || state.due <= now
}

export function masteryFromReview(state?: ReviewState) {
  if (!state) return 0
  if (state.repetitions >= 5 && state.intervalDays >= 21) return 100
  return Math.min(95, state.repetitions * 18)
}