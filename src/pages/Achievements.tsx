import { useStore } from '../store'

const defs = [
  { id:'first10', title:'First 10 Cards', desc:'Complete 10 card reviews.' },
  { id:'first50', title:'First 50 Cards', desc:'Complete 50 card reviews.' },
  { id:'streak7', title:'Seven-Day Streak', desc:'Study on 7 consecutive days.' },
  { id:'dailyDone', title:'Daily Session Complete', desc:'Finish a daily learning session.' },
  { id:'tcp', title:'TCP Master', desc:'Strengthen TCP chapter cards through reviews (progressive).' },
  { id:'dns', title:'DNS Specialist', desc:'Strengthen DNS chapter cards through reviews (progressive).' },
  { id:'subnet', title:'Subnetting Champion', desc:'Practice and master subnetting cards.' },
]

export default function Achievements() {
  const { progress } = useStore()
  return <div className="space-y-4">
    <h1 className="text-2xl font-bold text-[#1d1d1f]">Achievements</h1>
    <p className="text-[#6e6e73] text-sm">Meaningful milestones based on consistent learning and mastery.</p>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {defs.map(a => {
        const unlocked = progress.achievements[a.id]
        return <div key={a.id} className={`rounded-2xl border p-4 ${unlocked?'border-[#0071e3]/30 bg-[#0071e3]/10':'border-black/5 bg-white opacity-80'}`}>
          <div className="flex items-center justify-between mb-1"><h3 className="text-[#1d1d1f] font-semibold">{a.title}</h3><span className={`text-xs px-2 py-0.5 rounded ${unlocked?'bg-emerald-100 text-emerald-700':'bg-[#f5f5f7] text-[#6e6e73]'}`}>{unlocked?'Unlocked':'Locked'}</span></div>
          <p className="text-sm text-[#6e6e73]">{a.desc}</p>
          {unlocked && <div className="text-xs text-[#86868b] mt-2">Unlocked {new Date(unlocked).toLocaleString()}</div>}
        </div>
      })}
    </div>
    <div className="text-xs text-[#86868b]">Achievement system is extensible; topic-mastery achievements unlock progressively as chapter/card review data grows.</div>
  </div>
}