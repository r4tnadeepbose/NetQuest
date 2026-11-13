import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Timer, BookOpen, Target, Filter } from 'lucide-react'
import { mcqs, mcqTopics } from '../data/mcqs'
import type { MCQ } from '../types'
import { play } from '../lib/sfx'
import { useEffects } from '../components/Effects'

type Mode = 'practice' | 'exam'
type Stats = { attempted: number; correct: number; byId: Record<string, { attempted: number; correct: number }> }

const STATS_KEY = 'netquest_mcq_stats_v1'
const loadStats = (): Stats => { try { const r = localStorage.getItem(STATS_KEY); if (r) return JSON.parse(r) } catch {} return { attempted: 0, correct: 0, byId: {} } }
const saveStats = (s: Stats) => localStorage.setItem(STATS_KEY, JSON.stringify(s))

function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5) }

export default function MCQPage() {
  const { confetti, toast } = useEffects()
  const [mode, setMode] = useState<Mode>('practice')
  const [topic, setTopic] = useState<string>('All Topics')
  const [difficulty, setDifficulty] = useState<string>('all')
  const [count, setCount] = useState<number>(10)
  const [started, setStarted] = useState(false)
  const [pool, setPool] = useState<MCQ[]>([])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submittedExam, setSubmittedExam] = useState(false)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [seconds, setSeconds] = useState(0)
  const [reviewOnlyWrong, setReviewOnlyWrong] = useState(false)

  useEffect(() => { saveStats(stats) }, [stats])
  useEffect(() => {
    if (!started || (mode === 'exam' && submittedExam)) return
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [started, mode, submittedExam])

  const filtered = useMemo(() => mcqs.filter(q => (topic === 'All Topics' || q.topic === topic) && (difficulty === 'all' || q.difficulty === difficulty)), [topic, difficulty])

  const start = () => {
    const n = Math.max(5, Math.min(count, filtered.length || 5))
    const picked = shuffle(filtered).slice(0, n)
    setPool(picked.length ? picked : shuffle(mcqs).slice(0, Math.min(10, mcqs.length)))
    setIdx(0); setAnswers({}); setSubmittedExam(false); setSeconds(0); setReviewOnlyWrong(false); setStarted(true)
  }
  const reset = () => { setStarted(false); setSubmittedExam(false); setIdx(0); setAnswers({}); setSeconds(0); setReviewOnlyWrong(false) }

  const current = pool[idx]
  const answered = current ? answers[current.id] : undefined
  const isCorrect = current && answered ? answered === current.correctOptionId : false

  const record = (q: MCQ, chosen: string) => {
    setStats(prev => {
      const prevQ = prev.byId[q.id] || { attempted: 0, correct: 0 }
      const correct = chosen === q.correctOptionId
      const byId = { ...prev.byId, [q.id]: { attempted: prevQ.attempted + 1, correct: prevQ.correct + (correct ? 1 : 0) } }
      return { attempted: prev.attempted + 1, correct: prev.correct + (correct ? 1 : 0), byId }
    })
  }

  const choose = (optId: string) => {
    if (!current) return
    if (mode === 'practice') {
      if (answers[current.id]) return
      setAnswers(a => ({ ...a, [current.id]: optId }))
      record(current, optId)
      play(optId === current.correctOptionId ? 'correct' : 'wrong')
    } else {
      if (submittedExam) return
      setAnswers(a => ({ ...a, [current.id]: optId }))
      play('tap')
    }
  }

  const submitExam = () => {
    if (submittedExam) return
    pool.forEach(q => { const a = answers[q.id]; if (a) record(q, a) })
    setSubmittedExam(true)
    const score = pool.reduce((acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0), 0)
    const pct = pool.length ? Math.round((score / pool.length) * 100) : 0
    play('complete')
    if (pct >= 70) confetti({ particleCount: pct >= 90 ? 180 : 120 })
    toast({ title: `Exam submitted: ${pct}%`, message: `${score}/${pool.length} correct`, kind: pct >= 70 ? 'success' : 'info' })
  }

  const examScore = pool.reduce((acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0), 0)
  const accuracy = stats.attempted ? Math.round((stats.correct / stats.attempted) * 100) : 0

  const displayPool = (submittedExam && reviewOnlyWrong) ? pool.filter(q => answers[q.id] !== q.correctOptionId) : pool

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  if (!started) {
    return (
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#1d1d1f]">MCQ Arena — God Tier</h1>
            <p className="text-[#6e6e73] text-sm mt-1">Detailed multiple-choice practice and exam modes with instant explanations, per-option reasoning, topic filters, and performance tracking.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm">
            <div className="text-[#6e6e73] text-xs uppercase">Lifetime MCQ Stats</div>
            <div className="text-[#1d1d1f] font-semibold mt-1">{stats.correct}/{stats.attempted} correct • {accuracy}% accuracy</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#0071e3] mb-2"><BookOpen size={18}/></div><div className="text-[#1d1d1f] font-medium">Practice Mode</div><div className="text-sm text-[#6e6e73]">Instant feedback, detailed explanation and why other options are wrong.</div></div>
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#0071e3] mb-2"><Target size={18}/></div><div className="text-[#1d1d1f] font-medium">Exam Mode</div><div className="text-sm text-[#6e6e73]">Answer all questions, submit, review score and incorrect answers.</div></div>
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#0071e3] mb-2"><Filter size={18}/></div><div className="text-[#1d1d1f] font-medium">Smart Filters</div><div className="text-sm text-[#6e6e73]">Filter by topic and difficulty, choose question count per session.</div></div>
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#0071e3] mb-2"><Timer size={18}/></div><div className="text-[#1d1d1f] font-medium">Tracked Sessions</div><div className="text-sm text-[#6e6e73]">Timer, per-question review, accuracy tracking, and retryable sets.</div></div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-[#1d1d1f]">Configure Session</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm text-[#1d1d1f]/80 mb-1">Mode</label>
              <select value={mode} onChange={e=>setMode(e.target.value as Mode)} className="w-full bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2 text-sm"><option value="practice">Practice (instant feedback)</option><option value="exam">Exam (submit at end)</option></select>
            </div>
            <div>
              <label className="block text-sm text-[#1d1d1f]/80 mb-1">Topic</label>
              <select value={topic} onChange={e=>setTopic(e.target.value)} className="w-full bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2 text-sm"><option>All Topics</option>{mcqTopics.map(t=><option key={t}>{t}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm text-[#1d1d1f]/80 mb-1">Difficulty</label>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2 text-sm"><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
            </div>
            <div>
              <label className="block text-sm text-[#1d1d1f]/80 mb-1">Questions ({filtered.length} available)</label>
              <input type="number" min={5} max={Math.max(5, filtered.length || 30)} value={count} onChange={e=>setCount(Number(e.target.value)||10)} className="w-full bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={start} className="px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold">Start MCQ Session</button>
            <span className="text-sm text-[#6e6e73]">Bank: <b className="text-[#1d1d1f]">{mcqs.length}</b> detailed MCQs across {mcqTopics.length} topics.</span>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'exam' && submittedExam) {
    const pct = pool.length ? Math.round((examScore / pool.length) * 100) : 0
    const list = displayPool
    return (
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Exam Results</h1>
          <div className="flex gap-2"><button onClick={()=>setReviewOnlyWrong(v=>!v)} className="px-3 py-2 rounded-xl border border-black/10 hover:bg-[#f5f5f7] text-sm">{reviewOnlyWrong?'Show All':'Review Incorrect Only'}</button><button onClick={reset} className="px-3 py-2 rounded-xl bg-[#0071e3] text-white font-medium">New Session</button></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Score</div><div className="text-2xl text-[#1d1d1f] font-semibold">{examScore}/{pool.length}</div></div>
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Accuracy</div><div className="text-2xl text-[#1d1d1f] font-semibold">{pct}%</div></div>
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Time</div><div className="text-2xl text-[#1d1d1f] font-semibold">{fmt(seconds)}</div></div>
          <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Incorrect</div><div className="text-2xl text-[#1d1d1f] font-semibold">{pool.length - examScore}</div></div>
        </div>
        <div className="space-y-4">
          {list.length === 0 && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">Perfect score — no incorrect answers to review.</div>}
          {list.map((q, i) => {
            const chosen = answers[q.id]
            const ok = chosen === q.correctOptionId
            return <div key={q.id} className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="flex items-center justify-between gap-2 mb-2"><div className="text-xs uppercase text-[#0071e3]">{q.topic} • {q.difficulty}</div><div className={`text-sm font-medium ${ok?'text-emerald-700':'text-red-600'}`}>{ok?'Correct':'Incorrect'}</div></div>
              <div className="text-[#1d1d1f] font-medium mb-3">{i+1}. {q.question}</div>
              <div className="space-y-2 mb-3">{q.options.map(o => {
                const isAns = o.id === q.correctOptionId
                const isChosen = chosen === o.id
                const cls = isAns ? 'border-emerald-200 bg-emerald-50' : (isChosen ? 'border-red-200 bg-red-50' : 'border-black/5')
                return <div key={o.id} className={`border rounded-xl px-3 py-2 text-sm ${cls}`}><span className="font-mono text-[#6e6e73] mr-2">{o.id.toUpperCase()}.</span>{o.text} {isAns && <span className="text-emerald-700 ml-2 font-medium">(Correct)</span>}{isChosen && !isAns && <span className="text-red-600 ml-2 font-medium">(Your answer)</span>}</div>
              })}</div>
              <div className="text-sm text-[#1d1d1f] bg-[#fbfbfd] border border-black/5 rounded-xl p-3"><div className="text-[#6e6e73] font-medium mb-1">Explanation</div>{q.explanation}</div>
              {q.whyNot && <div className="mt-2 text-sm text-[#1d1d1f]/80 bg-white/80 border border-black/5 rounded-xl p-3"><div className="text-[#6e6e73] font-medium mb-1">Why other options are wrong</div><ul className="space-y-1">{Object.entries(q.whyNot).map(([k,v])=> <li key={k}><span className="font-mono text-[#6e6e73]">{k.toUpperCase()}:</span> {v}</li>)}</ul></div>}
            </div>
          })}
        </div>
      </div>
    )
  }

  if (!current) return <div className="text-[#6e6e73]">No questions available for the selected filters. <button onClick={reset} className="text-[#0071e3] underline">Go back</button></div>

  const showFeedback = mode === 'practice' && !!answered
  const progressPct = pool.length ? Math.round(((idx + (showFeedback ? 1 : 0)) / pool.length) * 100) : 0

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f]">MCQ {mode === 'practice' ? 'Practice' : 'Exam'}</h1>
          <div className="text-sm text-[#6e6e73]">{current.topic} • {current.difficulty} • Question {idx + 1} of {pool.length}</div>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#1d1d1f]/80">
          <span className="flex items-center gap-1"><Timer size={14}/> {fmt(seconds)}</span>
          {mode==='exam' && <span>Answered: {Object.keys(answers).length}/{pool.length}</span>}
          <button onClick={reset} className="px-3 py-1.5 rounded border border-black/10 hover:bg-[#f5f5f7] flex items-center gap-1"><RotateCcw size={14}/> Exit</button>
        </div>
      </div>
      <div className="h-2 rounded bg-[#f5f5f7] overflow-hidden"><div className="h-full bg-[#0071e3] transition-all" style={{width:`${progressPct}%`}} /></div>

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <div className="text-lg text-[#1d1d1f] font-medium mb-4">{current.question}</div>
        <div className="space-y-2">
          {current.options.map(o => {
            const chosen = answers[current.id]
            const isAns = o.id === current.correctOptionId
            const isChosen = chosen === o.id
            let cls = 'border-black/10 hover:bg-black/5'
            if (showFeedback) {
              if (isAns) cls = 'border-emerald-200 bg-emerald-50'
              else if (isChosen) cls = 'border-red-200 bg-red-50'
              else cls = 'border-black/5 opacity-70'
            } else if (mode==='exam' && isChosen) {
              cls = 'border-[#0071e3]/30 bg-[#0071e3]/10'
            }
            return (
              <button key={o.id} onClick={()=>choose(o.id)} disabled={showFeedback} className={`w-full text-left border rounded-xl px-4 py-3 text-sm transition ${cls} ${showFeedback?'cursor-default':''}`}>
                <span className="font-mono text-[#6e6e73] mr-2">{o.id.toUpperCase()}.</span>
                <span className="text-[#1d1d1f]">{o.text}</span>
                {showFeedback && isAns && <CheckCircle2 size={16} className="inline ml-2 text-emerald-600 align-text-bottom"/>}
                {showFeedback && isChosen && !isAns && <XCircle size={16} className="inline ml-2 text-red-600 align-text-bottom"/>}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className="mt-4 space-y-3">
            <div className={`rounded-xl border p-3 text-sm ${isCorrect?'border-emerald-200 bg-emerald-50 text-emerald-800':'border-red-200 bg-red-50 text-red-800'}`}>{isCorrect ? 'Correct answer.' : `Incorrect. Correct answer: ${current.correctOptionId.toUpperCase()}.`}</div>
            <div className="rounded-xl border border-black/5 bg-[#fbfbfd] p-3 text-sm text-[#1d1d1f]"><div className="text-[#6e6e73] font-medium mb-1">Explanation</div>{current.explanation}</div>
            {current.whyNot && <div className="rounded-xl border border-black/5 bg-white/80 p-3 text-sm text-[#1d1d1f]/80"><div className="text-[#6e6e73] font-medium mb-1">Why other options are wrong</div><ul className="space-y-1">{Object.entries(current.whyNot).map(([k,v])=> <li key={k}><span className="font-mono text-[#6e6e73]">{k.toUpperCase()}:</span> {v}</li>)}</ul></div>}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0} className="px-4 py-2 rounded-xl border border-black/10 hover:bg-[#f5f5f7] disabled:opacity-40">Previous</button>
          <div className="flex gap-2">
            {mode==='exam' && !submittedExam && <button onClick={submitExam} className="px-4 py-2 rounded-xl border border-[#0071e3]/30 text-[#0071e3] hover:bg-[#0071e3]/10">Submit Exam</button>}
            <button onClick={()=>setIdx(i=>Math.min(pool.length-1,i+1))} disabled={idx>=pool.length-1} className="px-4 py-2 rounded-xl bg-[#0071e3] text-white font-medium disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <div className="text-sm text-[#1d1d1f]/80 mb-2">Question Navigator</div>
        <div className="flex flex-wrap gap-2">{pool.map((q,i)=>{
          const a = answers[q.id]; const ok = a === q.correctOptionId; const active = i===idx
          let cls = 'border-black/10 text-[#1d1d1f]/80 bg-white'
          if (mode==='practice' && a) cls = ok ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-red-300 text-red-700 bg-red-50'
          else if (mode==='exam' && submittedExam && a) cls = ok ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-red-300 text-red-700 bg-red-50'
          else if (mode==='exam' && a) cls = 'border-[#0071e3]/30 text-[#0071e3] bg-[#0071e3]/10'
          return <button key={q.id} onClick={()=>setIdx(i)} className={`w-9 h-9 rounded-lg border text-sm font-medium ${cls} ${active?'ring-2 ring-[#0071e3]/40':''}`}>{i+1}</button>
        })}</div>
      </div>
    </div>
  )
}