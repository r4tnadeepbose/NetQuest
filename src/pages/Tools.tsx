import { useMemo, useState } from 'react'
import { toolDatabase } from '../data/toolsAndTracks'
import { useStore } from '../store'
import { EncapsulationVisual, FirewallRuleSimulator, SubnetCalculator, TcpHandshakeStepper } from '../components/NetworkUtilities'

export default function ToolsPage() {
  const { progress, markToolStudied } = useStore()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const cats = ['all', ...Array.from(new Set(toolDatabase.map(t=>t.category))).sort()]
  const filtered = useMemo(()=> toolDatabase.filter(t => (cat==='all'||t.category===cat) && (!q || (t.name+' '+t.description+' '+t.why+' '+t.category).toLowerCase().includes(q.toLowerCase()))), [cat,q])
  return <div className="space-y-4">
    <h1 className="text-2xl font-bold text-[#1d1d1f]">Professional Tool Knowledge System</h1>
    <p className="text-[#6e6e73] text-sm">Understand what each tool does, why/how it’s used, inputs/outputs, limitations, alternatives, ATT&CK mapping, and defensive detection. Use tools only in authorized environments.</p>
    <div className="grid md:grid-cols-3 gap-3">
      <Stat label="Tools in Database" value={`${toolDatabase.length}`} sub="Recon, VAPT, AD, Blue, Cloud, DFIR" />
      <Stat label="Studied" value={`${progress.cyber.toolsStudied.length}`} sub="Marked by you" />
      <Stat label="Coverage" value={`${Math.round((progress.cyber.toolsStudied.length/Math.max(1,toolDatabase.length))*100)}%`} sub="Tool proficiency progress" />
    </div>
    <div className="flex flex-wrap gap-2 items-center">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tools..." className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm w-full md:w-80" />
      <select value={cat} onChange={e=>setCat(e.target.value)} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm"><option value="all">All categories</option>{cats.filter(c=>c!=='all').map(c=><option key={c} value={c}>{c}</option>)}</select>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      {filtered.map(t => {
        const studied = progress.cyber.toolsStudied.includes(t.id)
        return <div key={t.id} className="rounded-2xl border border-black/5 bg-white p-4 space-y-2">
          <div className="flex items-start justify-between gap-2"><div><div className="text-[#1d1d1f] font-semibold text-lg">{t.name}</div><div className="text-xs text-[#0071e3]">{t.category}</div></div><button onClick={()=>markToolStudied(t.id)} className={`px-3 py-1.5 rounded-xl text-xs border font-medium ${studied?'border-emerald-200 bg-emerald-50 text-emerald-700':'border-black/10 text-[#1d1d1f]/80 hover:bg-[#f5f5f7]'}`}>{studied?'Studied':'Mark studied'}</button></div>
          <p className="text-sm text-[#1d1d1f]/80"><b>What/Why:</b> {t.description} {t.why}</p>
          <p className="text-sm text-[#6e6e73]"><b>How it works:</b> {t.internals}</p>
          <div className="text-sm text-[#1d1d1f]/80"><b>Key features:</b> {t.features.join(', ')}</div>
          <div className="text-sm text-[#1d1d1f]/80"><b>Examples (authorized):</b><ul className="list-disc pl-5 mt-1 text-[#6e6e73]">{t.examples.map((e,i)=><li key={i}><code className="text-[#0071e3]">{e}</code></li>)}</ul></div>
          <div className="text-sm text-[#6e6e73]"><b>Limitations:</b> {t.limitations.join(' ')}</div>
          <div className="text-sm text-[#6e6e73]"><b>Alternatives:</b> {t.alternatives.join(', ')}</div>
          {t.mitre && <div className="text-sm text-[#6e6e73]"><b>MITRE ATT&CK:</b> {t.mitre.join('; ')}</div>}
          {t.detection && <div className="text-sm text-[#0071e3]/90"><b>Defensive detection:</b> {t.detection}</div>}
        </div>
      })}
    </div>

    <div className="pt-2">
      <h2 className="text-xl font-semibold text-[#1d1d1f]">Network Utilities</h2>
      <p className="text-sm text-[#6e6e73] mt-1">Compact interactive helpers: subnetting calculator and quick protocol/rule references (authorized lab learning context).</p>
      <div className="grid lg:grid-cols-2 gap-4 mt-3">
        <SubnetCalculator />
        <TcpHandshakeStepper />
        <EncapsulationVisual />
        <FirewallRuleSimulator />
      </div>
    </div>
  </div>
}
function Stat({label,value,sub}:{label:string,value:string,sub:string}){return <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#6e6e73] text-xs uppercase tracking-wide">{label}</div><div className="text-2xl font-semibold text-[#1d1d1f] mt-1">{value}</div><div className="text-xs text-[#6e6e73] mt-1">{sub}</div></div>}