import { capstones } from '../data/toolsAndTracks'
import { useStore } from '../store'

export default function CapstonesPage() {
  const { progress, completeCapstone } = useStore()
  return <div className="space-y-4">
    <h1 className="text-2xl font-bold text-[#1d1d1f]">Capstone Practical Assessments</h1>
    <p className="text-[#6e6e73] text-sm">Long-form simulated engagements in intentionally vulnerable, explicitly authorized lab environments. Never perform practical exercises against real external targets without authorization.</p>
    <div className="grid md:grid-cols-3 gap-3">
      <Stat label="Capstones" value={`${capstones.length}`} sub="Simulated assessments" />
      <Stat label="Completed" value={`${progress.cyber.completedCapstones.length}`} sub="Marked complete" />
      <Stat label="Practical Signals" value={`${progress.cyber.challengeStats.practical}`} sub="Practical interactions logged" />
    </div>
    <div className="space-y-4">
      {capstones.map(c => {
        const done = progress.cyber.completedCapstones.includes(c.id)
        return <div key={c.id} className={`rounded-2xl border p-4 md:p-5 ${done?'border-emerald-200 bg-emerald-50':'border-black/5 bg-white'}`}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div><div className="text-[#1d1d1f] font-semibold text-xl">{c.title}</div><div className="text-[#0071e3] text-sm">{c.type}</div></div>
            <button onClick={()=>completeCapstone(c.id)} className={`px-3 py-1.5 rounded-xl text-sm border font-medium ${done?'border-emerald-300 bg-emerald-100 text-emerald-700':'border-black/10 text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}>{done?'Completed':'Mark complete'}</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm">
            <Section title="Environment" items={[c.environment]} />
            <Section title="Scope & Safety" items={[...c.scope, 'Authorized lab only. Use intentionally vulnerable systems and agreed rules of engagement.']} />
            <Section title="Objectives" items={c.objectives} />
            <Section title="Deliverables" items={c.deliverables} />
            <Section title="Assessment Criteria" items={c.criteria} />
            <Section title="Hint" items={[c.hint]} />
          </div>
        </div>
      })}
    </div>
  </div>
}
function Section({title,items}:{title:string,items:string[]}){return <div><div className="text-[#6e6e73] text-xs uppercase mb-1">{title}</div><ul className="list-disc pl-5 text-[#1d1d1f]/80 space-y-1">{items.map((i,idx)=><li key={idx}>{i}</li>)}</ul></div>}
function Stat({label,value,sub}:{label:string,value:string,sub:string}){return <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#6e6e73] text-xs uppercase tracking-wide">{label}</div><div className="text-2xl font-semibold text-[#1d1d1f] mt-1">{value}</div><div className="text-xs text-[#6e6e73] mt-1">{sub}</div></div>}