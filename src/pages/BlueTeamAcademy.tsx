import { Link } from 'react-router-dom'
import { chapters, flashcards, parts } from '../data/curriculum'
import { useStore } from '../store'

export default function BlueTeamAcademy() {
  const { getTopicUnderstanding } = useStore()
  const bluePart = parts.find(p=>p.id==='p17')
  const blueCh = chapters.filter(c=>c.partId==='p17').sort((a,b)=>a.order-b.order)
  const blueCards = flashcards.filter(f=>f.partId==='p17')
  return <div className="space-y-5">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-[#1d1d1f]">Blue Team Academy (Secondary)</h1>
        <p className="text-[#6e6e73] text-sm mt-1 max-w-3xl">{bluePart?.description} Learn how defenders detect, investigate, contain, and prevent techniques studied in red team modules.</p>
      </div>
      <Link to="/challenges" className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-200 text-sm">Blue Team Investigations</Link>
    </div>

    <div className="grid md:grid-cols-3 gap-3">
      <Stat label="Blue Modules" value={`${blueCh.length}`} sub="SOC, hunting, DFIR" />
      <Stat label="Defensive Cards" value={`${blueCards.length}`} sub="Detection & response" />
      <Stat label="Focus" value="Detect/Respond" sub="Mapped to offensive TTPs" />
    </div>

    <Panel title="Defensive Learning Modules">
      <div className="grid md:grid-cols-2 gap-3">
        {blueCh.map(ch => {
          const count = blueCards.filter(c=>c.chapterId===ch.id).length
          const ml = getTopicUnderstanding(ch.id)
          return <div key={ch.id} className="border border-black/5 rounded-2xl p-4 bg-white/80">
            <div className="flex justify-between gap-2"><h3 className="text-[#1d1d1f] font-semibold">{ch.order}. {ch.title}</h3><span className="text-xs text-[#0071e3]">{ml}% conf</span></div>
            <p className="text-sm text-[#6e6e73] mt-1">{ch.description}</p>
            <div className="mt-2 h-1.5 bg-[#f5f5f7] rounded overflow-hidden"><div className="h-full bg-blue-500" style={{width:`${ml}%`}} /></div>
            <div className="text-xs text-[#86868b] mt-2">{count} cards • telemetry, triage, detection, response</div>
          </div>
        })}
      </div>
    </Panel>

    <div className="grid lg:grid-cols-2 gap-4">
      <Panel title="Core Defensive Domains">
        <ul className="text-sm text-[#1d1d1f]/80 space-y-1 list-disc pl-5">
          <li><b>SOC/SIEM:</b> log collection/normalization, correlation, alert triage, escalation, investigation.</li>
          <li><b>Threat Hunting:</b> hypothesis-driven hunts, IOC/TTP analysis, DNS/network/endpoint anomalies, C2 beaconing patterns.</li>
          <li><b>Network Defense:</b> firewall/IDS-IPS/NDR, PCAP and HTTP/DNS analysis, segmentation and zero trust.</li>
          <li><b>DFIR:</b> evidence handling, timeline analysis, memory/disk/log forensics, root cause and reporting.</li>
          <li><b>Detection Engineering:</b> MITRE ATT&CK mapping, Sigma/YARA concepts, tuning, coverage and purple-team validation.</li>
        </ul>
      </Panel>
      <Panel title="Attack-to-Defense Mapping">
        <div className="text-sm text-[#1d1d1f]/80 space-y-2">
          <p>Every major offensive concept in NetQuest is paired with defensive implications: required telemetry, detection logic ideas, investigation steps, and prevention/remediation.</p>
          <p className="text-[#6e6e73]">Examples: ARP/DNS abuse, SYN floods, VLAN hopping, SQLi/XSS/SSRF/IDOR, auth bypass, credential exposure, lateral movement, AD/cloud misconfigurations.</p>
          <Link to="/flashcards" className="inline-block text-[#0071e3] hover:text-[#0071e3]">Open multi-perspective cards →</Link>
        </div>
      </Panel>
    </div>
  </div>
}

function Panel({title,children}:{title:string,children:any}){return <div className="rounded-2xl border border-black/5 bg-white p-4 md:p-5"><h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">{title}</h2>{children}</div>}
function Stat({label,value,sub}:{label:string,value:string,sub:string}){return <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-[#6e6e73] text-xs uppercase tracking-wide">{label}</div><div className="text-2xl font-semibold text-[#1d1d1f] mt-1">{value}</div><div className="text-xs text-[#6e6e73] mt-1">{sub}</div></div>}