import { Link } from 'react-router-dom'
import { chapters, flashcards, parts } from '../data/curriculum'
import { useStore } from '../store'
import { masteryTracks } from '../data/toolsAndTracks'

export default function RedTeamAcademy() {
  const { getTopicUnderstanding } = useStore()
  const redPart = parts.find(p=>p.id==='p16')
  const redCh = chapters.filter(c=>c.partId==='p16').sort((a,b)=>a.order-b.order)
  const redCards = flashcards.filter(f=>f.partId==='p16')
  const multi = flashcards.filter(f=>f.front.title.toLowerCase().includes('multi-perspective') || f.tags.includes('multi-perspective'))
  return <div className="space-y-5">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-[#1d1d1f]">Red Team Academy (Primary)</h1>
        <p className="text-[#6e6e73] text-sm mt-1 max-w-3xl">{redPart?.description} All offensive content is for explicitly authorized, isolated lab environments only.</p>
      </div>
      <Link to="/daily" className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-sm font-medium">Train Red/VAPT Daily</Link>
    </div>

    <div className="grid md:grid-cols-3 gap-3">
      <Stat label="Red Team Modules" value={`${redCh.length}`} sub="Core academy chapters" />
      <Stat label="Red/VAPT Cards" value={`${redCards.length}`} sub="Flashcards + scenarios" />
      <Stat label="Multi-Perspective" value={`${multi.length}`} sub="Red/Blue/VAPT views" />
    </div>

    <Panel title="Learning Modules (Authorized Labs Only)">
      <div className="grid md:grid-cols-2 gap-3">
        {redCh.map(ch => {
          const count = redCards.filter(c=>c.chapterId===ch.id).length
          const ml = getTopicUnderstanding(ch.id)
          return <div key={ch.id} className="border border-black/5 rounded-2xl p-4 bg-white/80">
            <div className="flex justify-between gap-2"><h3 className="text-[#1d1d1f] font-semibold">{ch.order}. {ch.title}</h3><span className="text-xs text-[#ff3b30]">{ml}% conf</span></div>
            <p className="text-sm text-[#6e6e73] mt-1">{ch.description}</p>
            <div className="mt-2 h-1.5 bg-[#f5f5f7] rounded overflow-hidden"><div className="h-full bg-rose-500" style={{width:`${ml}%`}} /></div>
            <div className="text-xs text-[#86868b] mt-2">{count} cards • methodology, tools, root cause, impact, remediation</div>
          </div>
        })}
      </div>
    </Panel>

    <div className="grid lg:grid-cols-2 gap-4">
      <Panel title="Red Team Methodology & Standards">
        <ul className="text-sm text-[#1d1d1f]/80 space-y-1 list-disc pl-5">
          <li>Engagement lifecycle: scope/RoE → recon → validation → controlled exploitation (authorized) → impact → reporting → retest.</li>
          <li>Frameworks: MITRE ATT&CK, PTES, OWASP WSTG/ASVS/API Top 10, NIST SP 800-115, CVSS/CWE.</li>
          <li>Focus: root cause, prerequisites, evidence quality, business risk, safe validation, and actionable remediation.</li>
          <li>Ethics: explicit authorization only, isolated labs for practice, no targeting real systems without permission.</li>
        </ul>
      </Panel>
      <Panel title="Primary Career Tracks">
        <div className="space-y-2 text-sm">
          {masteryTracks.filter(t=>['t1','t2','t4','t5','t6','t7','t8'].includes(t.id)).map(t=>(
            <div key={t.id} className="border border-black/5 rounded-xl p-3"><div className="text-[#1d1d1f] font-medium">{t.name}</div><div className="text-[#6e6e73] text-xs mt-0.5">{t.focus}</div></div>
          ))}
          <Link to="/tracks" className="inline-block text-[#0071e3] hover:text-[#0071e3] text-sm">View all mastery tracks →</Link>
        </div>
      </Panel>
    </div>

    <Panel title="Multi-Perspective Flashcards (Red / Blue / VAPT)">
      <p className="text-sm text-[#6e6e73] mb-3">Each key concept includes offensive mechanics (authorized), defensive detection/response, and VAPT assessment/reporting perspective.</p>
      <div className="grid md:grid-cols-2 gap-2">
        {multi.slice(0,12).map(c=> <Link key={c.id} to="/flashcards" className="border border-black/5 rounded-xl p-3 hover:bg-black/5"><div className="text-[#1d1d1f] text-sm font-medium">{c.front.title}</div><div className="text-xs text-[#6e6e73] mt-1">{c.front.question}</div></Link>)}
      </div>
    </Panel>
  </div>
}

function Panel({title,children}:{title:string,children:any}){return <div className="rounded-2xl border border-black/5 bg-white p-4 md:p-5"><h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">{title}</h2>{children}</div>}
function Stat({label,value,sub}:{label:string,value:string,sub:string}){return <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#6e6e73] text-xs uppercase tracking-wide">{label}</div><div className="text-2xl font-semibold text-[#1d1d1f] mt-1">{value}</div><div className="text-xs text-[#6e6e73] mt-1">{sub}</div></div>}