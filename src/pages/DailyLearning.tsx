import { useEffect, useMemo, useRef } from 'react'
import { useStore } from '../store'
import { FlashcardView } from '../components/FlashcardView'
import { flashcards } from '../data/curriculum'
import { useEffects } from '../components/Effects'

export default function DailyLearning() {
  const { progress, startOrResumeDaily, rateCard, resetDaily } = useStore()
  const { confetti } = useEffects()
  const celebratedRef = useRef<string | null>(null)
  useEffect(() => { startOrResumeDaily() }, [startOrResumeDaily])
  const sessionCards = useMemo(() => progress.daily.cardIds.map(id => flashcards.find(f => f.id === id)).filter(Boolean) as any[], [progress.daily.cardIds])
  const current = sessionCards[progress.daily.index]
  const done = progress.daily.completed || progress.daily.index >= sessionCards.length
  useEffect(() => {
    if (done && sessionCards.length > 0) {
      const key = `${progress.daily.date}:${sessionCards.length}`
      if (celebratedRef.current !== key) {
        celebratedRef.current = key
        confetti({ particleCount: 220 })
      }
    }
  }, [done, sessionCards.length, progress.daily.date, confetti])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Daily Learning Session</h1>
          <p className="text-[#6e6e73] text-sm">One focused card at a time. Mix of new concepts, technical depth, security, and revision.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-[#1d1d1f]/80">Progress: <span className="text-[#1d1d1f] font-medium">{Math.min(progress.daily.index, sessionCards.length)}</span> / {sessionCards.length}</div>
          <button onClick={resetDaily} className="px-3 py-2 rounded-xl border border-black/10 hover:bg-[#f5f5f7] text-sm">New Session</button>
        </div>
      </div>
      <div className="h-2 rounded bg-[#f5f5f7] overflow-hidden"><div className="h-full bg-[#0071e3] transition-all" style={{width:`${sessionCards.length? (Math.min(progress.daily.index,sessionCards.length)/sessionCards.length)*100:0}%`}} /></div>

      {!done && current && (
        <FlashcardView key={current.id} card={current} onRate={(r) => rateCard(current.id, r)} />
      )}
      {done && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-black/5 bg-white p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-2">Daily session complete</h2>
          <p className="text-[#6e6e73] mb-6 text-[17px]">You earned <span className="text-[#1d1d1f] font-semibold">{progress.daily.xpEarned} XP</span> in this session. Reviews are scheduled based on your ratings.</p>
          <div className="flex justify-center gap-3">
            <button onClick={resetDaily} className="px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium transition">Start Another Session</button>
          </div>
        </div>
      )}
    </div>
  )
}