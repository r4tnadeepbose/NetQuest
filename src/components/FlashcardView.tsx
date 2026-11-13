import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { Flashcard, Rating } from '../types'
import { useStore } from '../store'
import { play } from '../lib/sfx'
import { cardCompletionStatus, isDue } from '../lib/srs'

export function FlashcardView({ card, onRate, showRating = true }: { card: Flashcard; onRate?: (r: Rating) => void; showRating?: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const [rated, setRated] = useState(false)
  const { progress, toggleBookmark } = useStore()
  const bookmarked = progress.bookmarks.includes(card.id)
  const review = progress.reviews[card.id]
  const st = cardCompletionStatus(review)
  const due = isDue(review)

  const submitRating = (r: Rating, sound: Parameters<typeof play>[0]) => {
    if (rated) return
    setRated(true)
    play(sound)
    onRate?.(r)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const tag = t?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || t?.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped(f => !f)
        play('flip')
      } else if (showRating && flipped && !rated) {
        const rate = (r: Rating, sound: Parameters<typeof play>[0]) => {
          setRated(true)
          play(sound)
          onRate?.(r)
        }
        if (e.key === '1') { e.preventDefault(); rate('again', 'wrong') }
        else if (e.key === '2') { e.preventDefault(); rate('hard', 'tap') }
        else if (e.key === '3') { e.preventDefault(); rate('good', 'correct') }
        else if (e.key === '4') { e.preventDefault(); rate('easy', 'success') }
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleBookmark(card.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, rated, showRating, card.id, toggleBookmark, onRate])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4 text-sm gap-3 flex-wrap">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-[#f5f5f7] text-[#6e6e73] uppercase tracking-wide text-[11px] font-medium">{card.type}</span>
          <span className="px-2.5 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[11px] font-medium">{card.difficulty}</span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${st==='strong'?'bg-[#34c759]/10 text-[#248a3d]':st==='weak'?'bg-[#ff9f0a]/10 text-[#b25000]':'bg-[#f5f5f7] text-[#6e6e73]'}`}>{st==='strong'?'Good/Easy':st==='weak'?'Again/Hard':'Not attempted'}</span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${due?'bg-[#0071e3]/10 text-[#0071e3]':'bg-[#f5f5f7] text-[#6e6e73]'}`}>{due?'Due now':'Scheduled'}</span>
          {review?.lastReviewed && <span className="text-[11px] text-[#86868b]">Reps {review.repetitions || 0} · Last {new Date(review.lastReviewed).toLocaleDateString()}</span>}
        </div>
        <button onClick={() => toggleBookmark(card.id)} className="p-2 rounded-full hover:bg-black/5 text-[#6e6e73] transition" title="Bookmark (B)">
          {bookmarked ? <BookmarkCheck size={18} className="text-[#0071e3]" /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="perspective-1000 cursor-pointer" onClick={() => { setFlipped(f => !f); play('flip') }}>
        <motion.div
          className="relative w-full min-h-[420px] transform-style-preserve-3d"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 backface-hidden rounded-3xl border border-black/5 bg-white p-7 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col">
            <div className="text-[#0071e3] text-[12px] font-medium tracking-wide mb-2">{card.front.category || 'Flashcard'} · {card.chapterId.toUpperCase()}</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-4">{card.front.title}</h2>
            <p className="text-[17px] md:text-lg text-[#1d1d1f]/80 leading-relaxed flex-1">{card.front.question}</p>
            {card.front.visual && <pre className="mt-4 text-xs text-[#1d1d1f] bg-[#f5f5f7] rounded-2xl p-4 overflow-auto">{card.front.visual}</pre>}
            <div className="mt-6 text-sm text-[#86868b]">Tap to reveal answer</div>
          </div>

          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border border-black/5 bg-white p-7 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-auto">
            <div className="text-[#0071e3] text-[12px] font-medium tracking-wide mb-2">Explanation</div>
            <div className="space-y-5 text-[15px] leading-relaxed">
              <Section label="Answer" value={card.back.explanation} />
              {card.back.internals && <Section label="How it works" value={card.back.internals} />}
              {card.back.why && <Section label="Why it matters" value={card.back.why} />}
              {card.back.security && <Section label="Security relevance" value={card.back.security} />}
              {card.back.realWorld && <Section label="Real-world / example" value={card.back.realWorld} />}
              {!card.back.realWorld && card.back.example && <Section label="Example" value={card.back.example} />}
              {card.back.related && card.back.related.length > 0 && (
                <div>
                  <div className="text-[#6e6e73] font-medium mb-2">Related concepts</div>
                  <div className="flex flex-wrap gap-2">{card.back.related.map(r => <span key={r} className="px-3 py-1 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-xs">{r}</span>)}</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {showRating && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <RateBtn label="Again" sub="Relearn" color="bg-[#ff3b30]/10 text-[#d70015] hover:bg-[#ff3b30]/15" onClick={() => submitRating('again', 'wrong')} disabled={!flipped || rated} />
          <RateBtn label="Hard" sub="Tricky" color="bg-[#ff9f0a]/10 text-[#b25000] hover:bg-[#ff9f0a]/15" onClick={() => submitRating('hard', 'tap')} disabled={!flipped || rated} />
          <RateBtn label="Good" sub="Got it" color="bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/15" onClick={() => submitRating('good', 'correct')} disabled={!flipped || rated} />
          <RateBtn label="Easy" sub="Mastered" color="bg-[#34c759]/10 text-[#248a3d] hover:bg-[#34c759]/15" onClick={() => submitRating('easy', 'success')} disabled={!flipped || rated} />
        </div>
      )}
      <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
        {showRating && !flipped && <div className="text-[13px] text-[#86868b]">Flip the card to rate your understanding. (Space to flip)</div>}
        {showRating && flipped && !rated && <div className="text-[13px] text-[#86868b]">Rate: 1 Again · 2 Hard · 3 Good · 4 Easy</div>}
        {showRating && flipped && rated && <div className="text-[13px] text-[#34c759] font-medium">Rating saved.</div>}
      </div>
    </div>
  )
}

function Section({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[#6e6e73] font-medium mb-1.5">{label}</div><div className="text-[#1d1d1f] whitespace-pre-wrap">{value}</div></div>
}
function RateBtn({ label, sub, color, onClick, disabled }: any) {
  return <button disabled={disabled} onClick={onClick} className={`rounded-2xl px-4 py-3.5 text-left transition ${color} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
    <div className="font-semibold text-[15px]">{label}</div><div className="text-xs opacity-80 mt-0.5">{sub}</div>
  </button>
}