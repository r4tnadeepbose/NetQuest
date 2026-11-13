import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { flashcards, chapters, parts } from '../data/curriculum'
import { FlashcardView } from '../components/FlashcardView'
import { useStore } from '../store'
import { cardCompletionStatus, isDue } from '../lib/srs'

export default function Flashcards() {
  const { rateCard, progress } = useStore()
  const [searchParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [part, setPart] = useState('all')
  const [diff, setDiff] = useState('all')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState<'all'|'unseen'|'weak'|'strong'|'due'>('all')
  const [activeId, setActiveId] = useState(flashcards[0]?.id)

  useEffect(() => {
    const cardParam = searchParams.get('card')
    const qParam = searchParams.get('q')
    const partParam = searchParams.get('part')
    const typeParam = searchParams.get('type')
    const statusParam = searchParams.get('status')

    if (qParam !== null) setQ(qParam)
    if (partParam && (partParam === 'all' || parts.some(p => p.id === partParam))) setPart(partParam)
    const allowedTypes = new Set(['all','concept','how','deep','scenario','security','packet','command','troubleshoot','compare','diagram'])
    if (typeParam && allowedTypes.has(typeParam)) setType(typeParam)
    const allowedStatus = new Set(['all','unseen','weak','strong','due'])
    if (statusParam && allowedStatus.has(statusParam)) setStatus(statusParam as any)

    if (cardParam) {
      const target = flashcards.find(c => c.id === cardParam)
      if (target) {
        setActiveId(target.id)
        // ensure the target card is visible
        setPart('all')
        setDiff('all')
        setType('all')
        setStatus('all')
        if (qParam === null) setQ('')
      }
    }
  }, [searchParams])
  const filtered = useMemo(() => flashcards.filter(c => {
    if (part !== 'all' && c.partId !== part) return false
    if (diff !== 'all' && c.difficulty !== diff) return false
    if (type !== 'all' && c.type !== type) return false
    const st = cardCompletionStatus(progress.reviews[c.id])
    if (status === 'unseen' && st !== 'unseen') return false
    if (status === 'weak' && st !== 'weak') return false
    if (status === 'strong' && st !== 'strong') return false
    if (status === 'due' && !isDue(progress.reviews[c.id])) return false
    if (q) {
      const s = q.toLowerCase()
      const hay = [c.front.title, c.front.question, c.back.explanation, ...c.tags, c.type].join(' ').toLowerCase()
      if (!hay.includes(s)) return false
    }
    return true
  }), [q, part, diff, type, status, progress.reviews])
  const statusCounts = useMemo(() => {
    let strong = 0, weak = 0, unseen = 0, due = 0
    for (const c of flashcards) {
      const st = cardCompletionStatus(progress.reviews[c.id])
      if (st === 'strong') strong++; else if (st === 'weak') weak++; else unseen++
      if (isDue(progress.reviews[c.id])) due++
    }
    return { strong, weak, unseen, due, total: flashcards.length }
  }, [progress.reviews])
  const active = useMemo(() => flashcards.find(c => c.id === activeId && filtered.some(f => f.id === c.id)) || filtered[0], [activeId, filtered])

  useEffect(() => {
    if (!filtered.length) return
    if (!activeId || !filtered.some(c => c.id === activeId)) setActiveId(filtered[0].id)
  }, [filtered, activeId])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#1d1d1f]">Flashcards</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search concepts, protocols, commands..." className="md:col-span-2 bg-white border border-black/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-500" />
        <select value={part} onChange={e=>setPart(e.target.value)} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm"><option value="all">All parts</option>{parts.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select>
        <select value={status} onChange={e=>setStatus(e.target.value as any)} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm"><option value="all">All statuses</option><option value="strong">Completed (Good/Easy)</option><option value="weak">Attended (Again/Hard)</option><option value="unseen">Not attempted</option><option value="due">Due for review</option></select>
        <div className="grid grid-cols-2 gap-2">
          <select value={diff} onChange={e=>setDiff(e.target.value)} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm"><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
          <select value={type} onChange={e=>setType(e.target.value)} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm"><option value="all">All types</option>{['concept','how','deep','scenario','security','packet','command','troubleshoot','compare','diagram'].map(t=><option key={t} value={t}>{t}</option>)}</select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-[#34c759]/10 text-[#248a3d] border border-[#34c759]/20">Good/Easy: {statusCounts.strong}</span>
        <span className="px-2.5 py-1 rounded-full bg-[#ff9f0a]/10 text-[#b25000] border border-[#ff9f0a]/20">Again/Hard: {statusCounts.weak}</span>
        <span className="px-2.5 py-1 rounded-full bg-[#f5f5f7] text-[#6e6e73] border border-black/10">Not attempted: {statusCounts.unseen}</span>
        <span className="px-2.5 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20">Due now: {statusCounts.due}</span>
      </div>
      <div className="grid lg:grid-cols-[360px_1fr] gap-4">
        <div className="rounded-2xl border border-black/5 bg-white p-3 max-h-[70vh] overflow-auto">
          <div className="text-sm text-[#6e6e73] mb-2">{filtered.length} cards shown (of {statusCounts.total})</div>
          <div className="space-y-2">
            {filtered.map(c => {
              const st = cardCompletionStatus(progress.reviews[c.id])
              const isActive = active?.id === c.id
              const base = st === 'strong'
                ? (isActive ? 'border-[#34c759]/50 bg-[#34c759]/15' : 'border-[#34c759]/30 bg-[#34c759]/5 hover:bg-[#34c759]/10')
                : st === 'weak'
                  ? (isActive ? 'border-[#ff9f0a]/50 bg-[#ff9f0a]/15' : 'border-[#ff9f0a]/30 bg-[#ff9f0a]/5 hover:bg-[#ff9f0a]/10')
                  : (isActive ? 'border-[#0071e3]/30 bg-[#0071e3]/10' : 'border-black/5 hover:bg-black/5')
              const titleColor = st === 'strong' ? 'text-[#1f7a3d]' : st === 'weak' ? 'text-[#9a5b00]' : 'text-[#1d1d1f]'
              const statusLabel = st === 'strong' ? 'Completed (Good/Easy)' : st === 'weak' ? 'Attended (Again/Hard)' : 'Not attempted'
              return (
                <button key={c.id} onClick={()=>setActiveId(c.id)} title={statusLabel} className={`w-full text-left p-3 rounded-xl border ${base}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className={`text-sm font-medium ${titleColor}`}>{c.front.title}</div>
                    {st !== 'unseen' && <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded ${st==='strong'?'bg-[#34c759]/20 text-[#248a3d]':'bg-[#ff9f0a]/20 text-[#b25000]'}`}>{st==='strong'?'Good/Easy':'Again/Hard'}</span>}
                  </div>
                  <div className="text-xs text-[#6e6e73] mt-1 line-clamp-2">{c.front.question}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]"><span className="px-1.5 py-0.5 rounded bg-[#f5f5f7] text-[#1d1d1f]/80">{c.difficulty}</span><span className="px-1.5 py-0.5 rounded bg-[#f5f5f7] text-[#1d1d1f]/80">{chapters.find(ch=>ch.id===c.chapterId)?.title}</span><span className={`px-1.5 py-0.5 rounded ${st==='strong'?'bg-[#34c759]/15 text-[#248a3d]':st==='weak'?'bg-[#ff9f0a]/15 text-[#b25000]':'bg-[#f5f5f7] text-[#6e6e73]'}`}>{statusLabel}</span></div>
                </button>
              )
            })}
            {filtered.length===0 && <div className="text-[#6e6e73] text-sm p-2">No cards match filters.</div>}
          </div>
        </div>
        <div>{active ? <FlashcardView key={active.id} card={active} onRate={(r)=>rateCard(active.id,r)} /> : <div className="text-[#6e6e73]">Select a card</div>}</div>
      </div>
    </div>
  )
}