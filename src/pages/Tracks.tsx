import { masteryTracks } from '../data/toolsAndTracks'
import { useStore } from '../store'

export default function TracksPage() {
  const { progress, setLearningPath } = useStore()
  const active = progress.settings.learningPath
  return <div className="space-y-4">
    <h1 className="text-2xl font-bold text-[#1d1d1f]">Professional Mastery Tracks</h1>
    <p className="text-[#6e6e73] text-sm">Select a career-oriented learning path. Your daily engine adapts content distribution and prioritization to your chosen specialization while keeping fundamentals and weak areas in rotation.</p>
    <div className="rounded-2xl border border-black/5 bg-white p-4 text-sm text-[#1d1d1f]/80">Active path: <span className="text-[#0071e3] font-medium">{active}</span> • Adaptive distribution: <span className={progress.settings.adaptiveDistribution?'text-[#34c759]':'text-[#ff9f0a]'}>{progress.settings.adaptiveDistribution?'On':'Off'}</span> • Default target {progress.settings.distribution.red_vapt}% Red/VAPT, {progress.settings.distribution.blue_soc}% Blue/SOC, {progress.settings.distribution.networking}% Networking</div>
    <div className="grid lg:grid-cols-2 gap-4">
      {masteryTracks.map(t => {
        const selected = active === t.id as any
        return <div key={t.id} className={`rounded-2xl border p-4 space-y-2 ${selected?'border-[#0071e3]/40 bg-[#0071e3]/10':'border-black/5 bg-white'}`}>
          <div className="flex items-start justify-between gap-2"><div><div className="text-[#1d1d1f] font-semibold text-lg">{t.name}</div><div className="text-[#6e6e73] text-sm">{t.focus}</div></div><button onClick={()=>setLearningPath(t.id as any)} className={`px-3 py-1.5 rounded-xl text-xs border ${selected?'border-cyan-500 text-[#0071e3]':'border-black/10 text-[#1d1d1f]/80 hover:bg-[#f5f5f7]'}`}>{selected?'Selected':'Choose path'}</button></div>
          <div className="text-sm text-[#1d1d1f]/80"><b>Prerequisites:</b> {t.prerequisites.join(', ')}</div>
          <div className="text-sm text-[#1d1d1f]/80"><b>Key concepts:</b> {t.concepts.join(', ')}</div>
          <div className="text-sm text-[#1d1d1f]/80"><b>Tool proficiency:</b> {t.tools.join(', ')}</div>
          <div className="text-sm text-[#1d1d1f]/80"><b>Milestones:</b><ul className="list-disc pl-5 mt-1 text-[#6e6e73]">{t.milestones.map((m,i)=><li key={i}>{m}</li>)}</ul></div>
          <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3"><b>Capstone:</b> {t.capstone}</div>
        </div>
      })}
    </div>
  </div>
}