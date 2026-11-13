import { useState } from 'react'
import { parts, chapters, flashcards } from '../data/curriculum'
import { studyRoadmap } from '../data/studyRoadmap'
import { useStore } from '../store'
import { FlashcardView } from '../components/FlashcardView'
import { cardCompletionStatus, sectionCompletionStatus } from '../lib/srs'

export default function Curriculum() {
  const { progress, rateCard } = useStore()
  const [tab, setTab] = useState<'curriculum' | 'roadmap'>('curriculum')
  const [selectedChapter, setSelectedChapter] = useState<string | null>(chapters[0]?.id || null)
  const [studyId, setStudyId] = useState<string | null>(null)
  const chapterCards = flashcards.filter(f => f.chapterId === selectedChapter)
  const studyCard = flashcards.find(f => f.id === studyId) || chapterCards[0]
  const roadmapTotals = studyRoadmap.reduce((acc, s) => {
    acc.topics += s.topics.length
    acc.lectures += s.topics.reduce((a,t)=>a+t.lectures.length,0)
    return acc
  }, {topics:0, lectures:0})

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f]">Curriculum Explorer</h1>
          <p className="text-[#6e6e73] text-sm">Explore the curriculum, track mastery by chapter, and follow a structured study roadmap.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setTab('curriculum')} className={`px-3 py-2 rounded-xl border text-sm ${tab==='curriculum'?'border-[#0071e3]/40 bg-[#0071e3]/10 text-[#0071e3]':'border-black/10 hover:bg-[#f5f5f7]'}`}>Curriculum</button>
          <button onClick={()=>setTab('roadmap')} className={`px-3 py-2 rounded-xl border text-sm ${tab==='roadmap'?'border-[#0071e3]/40 bg-[#0071e3]/10 text-[#0071e3]':'border-black/10 hover:bg-[#f5f5f7]'}`}>Study Roadmap</button>
        </div>
      </div>

      {tab === 'curriculum' && (
      <div className="grid lg:grid-cols-[420px_1fr] gap-4">
        <div className="space-y-3 max-h-[75vh] overflow-auto pr-1">
          {parts.map(p => {
            const pchs = chapters.filter(c => c.partId === p.id)
            if (pchs.length === 0) return null
            return <div key={p.id} className="rounded-2xl border border-black/5 bg-white p-3">
              <div className="font-semibold text-[#1d1d1f]">{p.title}</div>
              <div className="text-xs text-[#6e6e73] mb-2">{p.description}</div>
              <div className="space-y-1">
                {pchs.map(ch => {
                  const cards = flashcards.filter(f=>f.chapterId===ch.id)
                  const statuses = cards.map(c => cardCompletionStatus(progress.reviews[c.id]))
                  const strong = statuses.filter(s=>s==='strong').length
                  const pct = cards.length? Math.round(strong/cards.length*100):0
                  const sec = sectionCompletionStatus(cards.map(c => progress.reviews[c.id]))
                  const active = selectedChapter===ch.id
                  const barClass = sec === 'complete' ? 'bg-[#34c759]' : sec === 'weak' ? 'bg-[#ff9f0a]' : 'bg-[#0071e3]'
                  const borderClass = active
                    ? (sec === 'complete' ? 'border-[#34c759]/40 bg-[#34c759]/10' : sec === 'weak' ? 'border-[#ff9f0a]/40 bg-[#ff9f0a]/10' : 'border-[#0071e3]/30 bg-[#0071e3]/10')
                    : (sec === 'complete' ? 'border-[#34c759]/25 bg-[#34c759]/5 hover:bg-[#34c759]/10' : sec === 'weak' ? 'border-[#ff9f0a]/25 bg-[#ff9f0a]/5 hover:bg-[#ff9f0a]/10' : 'border-black/5 hover:bg-black/5')
                  const statusLabel = sec === 'complete' ? 'Completed (Good/Easy)' : sec === 'weak' ? 'Attended — needs improvement' : 'Not started'
                  return <button key={ch.id} onClick={()=>{setSelectedChapter(ch.id); setStudyId(null)}} className={`w-full text-left px-3 py-2 rounded-xl border ${borderClass}`}>
                    <div className="flex justify-between gap-2"><span className="text-sm text-[#1d1d1f]">{ch.order}. {ch.title}</span><span className="text-xs text-[#6e6e73]">{cards.length} cards</span></div>
                    <div className="mt-1 h-1.5 bg-[#f5f5f7] rounded overflow-hidden"><div className={`h-full ${barClass} transition-all`} style={{width:`${pct}%`}} /></div>
                    <div className="text-[11px] text-[#86868b] mt-1">{pct}% completed (Good/Easy) • {statusLabel}</div>
                  </button>
                })}
              </div>
            </div>
          })}
        </div>
        <div className="space-y-3">
          {selectedChapter && <>
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <h2 className="text-lg font-semibold text-[#1d1d1f]">{chapters.find(c=>c.id===selectedChapter)?.title}</h2>
              <p className="text-sm text-[#6e6e73] mb-3">Select a flashcard to study, or rate cards to update your spaced-repetition schedule.</p>
              <div className="flex flex-wrap gap-2">
                {chapterCards.map(c => {
                  const st = cardCompletionStatus(progress.reviews[c.id])
                  const selected = studyCard?.id===c.id
                  const cls = selected
                    ? (st === 'strong' ? 'border-[#34c759]/50 bg-[#34c759]/15 text-[#248a3d]' : st === 'weak' ? 'border-[#ff9f0a]/50 bg-[#ff9f0a]/15 text-[#b25000]' : 'border-[#0071e3]/40 bg-[#0071e3]/10 text-[#0071e3]')
                    : (st === 'strong' ? 'border-[#34c759]/30 bg-[#34c759]/10 text-[#248a3d] hover:bg-[#34c759]/15' : st === 'weak' ? 'border-[#ff9f0a]/30 bg-[#ff9f0a]/10 text-[#b25000] hover:bg-[#ff9f0a]/15' : 'border-black/10 text-[#1d1d1f]/80 hover:bg-[#f5f5f7]')
                  const marker = st === 'strong' ? ' ✓' : st === 'weak' ? ' •' : ''
                  return <button key={c.id} onClick={()=>setStudyId(c.id)} title={st==='strong'?'Completed (Good/Easy)':st==='weak'?'Attended (Again/Hard)':'Not attempted'} className={`px-2.5 py-1.5 rounded border text-xs ${cls}`}>{c.front.title}{marker}</button>
                })}
                {chapterCards.length===0 && <span className="text-[#6e6e73] text-sm">No cards seeded yet for this chapter in this build. More content can be added in the data module.</span>}
              </div>
            </div>
            {studyCard && <FlashcardView key={studyCard.id} card={studyCard} onRate={(r)=>rateCard(studyCard.id,r)} />}
          </>}
        </div>
      </div>
      )}

      {tab === 'roadmap' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Stages</div><div className="text-2xl text-[#1d1d1f] font-semibold mt-1">{studyRoadmap.length}</div></div>
            <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Topics</div><div className="text-2xl text-[#1d1d1f] font-semibold mt-1">{roadmapTotals.topics}</div></div>
            <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Lessons</div><div className="text-2xl text-[#1d1d1f] font-semibold mt-1">{roadmapTotals.lectures}</div></div>
            <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">Track</div><div className="text-sm text-[#1d1d1f] mt-2">Structured Networking Roadmap</div></div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-4 text-sm text-[#1d1d1f]/80">
            This roadmap provides a structured outline of key networking topics and lessons. Use flashcards, daily sessions, MCQs, challenges, and visualizations in the app for spaced-repetition practice and deeper mastery.
          </div>
          <div className="space-y-3">
            {studyRoadmap.map((stage, si) => (
              <div key={stage.id} className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="text-lg font-semibold text-[#1d1d1f]">{String(si+1).padStart(2,'0')} — {stage.title}</h2>
                  <div className="text-xs text-[#6e6e73]">{stage.topics.length} topics • {stage.topics.reduce((a,t)=>a+t.lectures.length,0)} lessons</div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {stage.topics.map((topic, ti) => (
                    <div key={topic.title} className="border border-black/5 rounded-xl p-3">
                      <div className="text-sm font-medium text-[#1d1d1f] mb-1">{ti+1}. {topic.title}</div>
                      <ul className="space-y-1">
                        {topic.lectures.map((lec, li) => (
                          <li key={lec.title} className="text-xs text-[#6e6e73] flex gap-2"><span className="text-[#86868b]">{String(li+1).padStart(2,'0')}</span><span>{lec.title}</span></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
