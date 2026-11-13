import { useState } from 'react'
import { flashcards, chapters } from '../data/curriculum'
import { useStore } from '../store'
import type { Flashcard } from '../types'
import { play } from '../lib/sfx'
import { useEffects } from '../components/Effects'

type Mode = 'speed'|'topic'|'survival'|'interview'|'weak'|'recon'|'vuln-hunter'|'attack-path'|'vapt-analyst'|'ad-detective'|'exploit-understanding'|'blue-investigation'|'purple-team'

const MODE_INFO: Record<Mode,{label:string,desc:string}> = {
  speed:{label:'Speed Round',desc:'Fast mixed recall across domains.'},
  topic:{label:'Topic Challenge',desc:'Focused drill on a selected chapter/topic.'},
  survival:{label:'Survival Mode',desc:'Pressure test with mixed practical concepts.'},
  interview:{label:'Interview Simulation',desc:'Scenario/troubleshooting/security depth questions.'},
  weak:{label:'Weak Areas (ML)',desc:'Targets lowest predicted understanding and lapses.'},
  recon:{label:'A. Reconnaissance Challenge',desc:'Authorized-lab mindset: identify hosts, subdomains, ports, services, technologies, attack surface and methodology.'},
  'vuln-hunter':{label:'B. Vulnerability Hunter',desc:'Identify vulnerability, root cause, impact, validation steps, and remediation.'},
  'attack-path':{label:'C. Attack Path Investigation',desc:'Analyze simulated enterprise weaknesses and possible attack paths.'},
  'vapt-analyst':{label:'D. VAPT Analyst',desc:'Validate findings, severity/CVSS reasoning, false positives, and reporting quality.'},
  'ad-detective':{label:'E. AD Detective',desc:'Identify Active Directory misconfigurations and risky trust relationships (labs).'},
  'exploit-understanding':{label:'F. Exploit Understanding',desc:'Explain what/why/conditions/impact/fix for a weakness or sanitized scenario.'},
  'blue-investigation':{label:'G. Blue Team Investigation',desc:'Investigate simulated alerts, logs, or PCAP-style scenarios and respond.'},
  'purple-team':{label:'H. Purple Team Challenge',desc:'Assess, detect, map ATT&CK, and remediate an attack scenario collaboratively.'},
}

function buildPool(mode: Mode, chapterId: string, weakIds?: string[]): Flashcard[] {
  let arr = [...flashcards]
  const practical = (f: Flashcard) => ['scenario','troubleshoot','security','deep','packet','command'].includes(f.type)
  if (mode === 'topic') arr = arr.filter(f => f.chapterId === chapterId)
  if (mode === 'interview') arr = arr.filter(f => ['scenario','troubleshoot','security','deep','packet'].includes(f.type))
  if (mode === 'weak') {
    if (weakIds && weakIds.length) arr = arr.filter(f => weakIds.includes(f.id))
    if (arr.length < 8) arr = [...flashcards].filter(f => ['scenario','troubleshoot','security','deep'].includes(f.type))
  }
  if (mode === 'recon') arr = arr.filter(f => (f.partId==='p16' && (f.chapterId==='rt2'||f.chapterId==='rt3')) || f.tags.some(tg=>['recon','osint','dns','subdomain','nmap','scanning','enumeration','attack-surface'].includes(tg)) || practical(f))
  if (mode === 'vuln-hunter' || mode === 'exploit-understanding') arr = arr.filter(f => f.partId==='p15' || f.partId==='p18' || f.chapterId==='rt4' || f.type==='security' || f.tags.some(tg=>['owasp','sqli','xss','ssrf','idor','vulnerability','injection'].includes(tg)))
  if (mode === 'attack-path' || mode === 'ad-detective') arr = arr.filter(f => f.chapterId==='rt5' || f.partId==='p16' || f.tags.some(tg=>['active-directory','lateral-movement','pivot','kerberos','acl','trust','attack-path'].includes(tg)))
  if (mode === 'vapt-analyst') arr = arr.filter(f => f.chapterId==='cp1' || f.partId==='p18' || f.tags.some(tg=>['vapt','cvss','report','assessment','false-positive'].includes(tg)))
  if (mode === 'blue-investigation') arr = arr.filter(f => f.partId==='p17' || f.tags.some(tg=>['soc','siem','dfir','hunt','detection','log','pcap','blue-team'].includes(tg)))
  if (mode === 'purple-team') arr = arr.filter(f => f.tags.includes('multi-perspective') || f.partId==='p17' || f.chapterId==='rt1' || f.chapterId==='cp2')

  if (arr.length < 6) arr = [...flashcards]
  const n = (mode === 'topic' || mode==='recon' || mode==='vapt-analyst' || mode==='purple-team') ? 12 : 10
  arr = arr.sort(() => Math.random() - 0.5)
  return arr.slice(0, n)
}

export default function Challenges() {
  const { progress, rateCard, getCardUnderstanding, recordChallengeResult } = useStore()
  const { confetti, toast } = useEffects()
  const weakIds = [...flashcards]
    .map(c => ({ id: c.id, u: getCardUnderstanding(c.id), rev: progress.reviews[c.id] }))
    .sort((a,b)=> a.u - b.u || (b.rev?.lapses||0)-(a.rev?.lapses||0))
    .slice(0, 30).map(x=>x.id)
  const [mode, setMode] = useState<Mode>('recon')
  const [chapter, setChapter] = useState(chapters[0].id)
  const [pool, setPool] = useState<Flashcard[]>([])
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [answering, setAnswering] = useState(false)
  const start = () => { setPool(buildPool(mode, chapter, weakIds)); setIdx(0); setShow(false); setScore(0); setDone(false); setAnswering(false) }
  const answer = (correct: boolean) => {
    if (answering || done) return
    const card = pool[idx]
    setAnswering(true)
    play(correct ? 'correct' : 'wrong')
    if (card) rateCard(card.id, correct ? 'good' : 'again')
    if (correct) setScore(s=>s+1)
    const next = idx + 1
    if (next >= pool.length) {
      const final = score + (correct ? 1 : 0)
      recordChallengeResult({ correct: final, total: pool.length, practical: true })
      const pct = pool.length ? Math.round((final / pool.length) * 100) : 0
      play('complete')
      if (pct >= 60) confetti({ particleCount: pct >= 85 ? 180 : 120 })
      toast({ title: 'Challenge complete', message: `${final}/${pool.length} correct (${pct}%)`, kind: pct >= 60 ? 'success' : 'info' })
      setDone(true)
    } else { setIdx(next); setShow(false); setAnswering(false) }
  }
  const card = pool[idx]
  return <div className="space-y-4">
    <h1 className="text-2xl font-bold text-[#1d1d1f]">Advanced Challenge Modes</h1>
    <p className="text-[#6e6e73] text-sm">Practice in authorized, simulated lab contexts. Modes evaluate methodology, analysis, root cause, impact, detection, and remediation—not just memorization.</p>
    <div className="rounded-2xl border border-black/5 bg-white p-4 flex flex-wrap gap-3 items-end">
      <div><label className="block text-xs text-[#6e6e73] mb-1">Mode</label><select value={mode} onChange={e=>setMode(e.target.value as Mode)} className="bg-[#fbfbfd] border border-black/10 rounded px-3 py-2 max-w-full"><optgroup label="Core">{(['speed','topic','survival','interview','weak'] as Mode[]).map(m=><option key={m} value={m}>{MODE_INFO[m].label}</option>)}</optgroup><optgroup label="Red/Blue/VAPT Advanced (A–H)">{(['recon','vuln-hunter','attack-path','vapt-analyst','ad-detective','exploit-understanding','blue-investigation','purple-team'] as Mode[]).map(m=><option key={m} value={m}>{MODE_INFO[m].label}</option>)}</optgroup></select></div>
      {mode==='topic' && <div><label className="block text-xs text-[#6e6e73] mb-1">Topic/Chapter</label><select value={chapter} onChange={e=>setChapter(e.target.value)} className="bg-[#fbfbfd] border border-black/10 rounded px-3 py-2 min-w-64">{chapters.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></div>}
      <button onClick={start} className="px-4 py-2 rounded-xl bg-[#0071e3] text-white font-medium">Start Challenge</button>
      {pool.length>0 && <div className="text-sm text-[#1d1d1f]/80">Card {Math.min(idx+1,pool.length)}/{pool.length} • Score {score}</div>}
    </div>
    <div className="text-sm text-[#0071e3]/90 bg-[#0071e3]/10 border border-cyan-900/40 rounded-xl p-3"><b>{MODE_INFO[mode].label}:</b> {MODE_INFO[mode].desc}</div>

    {card && !done && (
      <div className="max-w-3xl mx-auto rounded-2xl border border-black/5 bg-white p-6">
        <div className="text-xs uppercase text-[#6e6e73] mb-2">{MODE_INFO[mode].label} • {card.difficulty} • {card.type}</div>
        <h2 className="text-xl text-[#1d1d1f] font-semibold mb-2">{card.front.title}</h2>
        <p className="text-[#1d1d1f] mb-4 whitespace-pre-wrap">{card.front.question}</p>
        {!show ? <button onClick={()=>setShow(true)} className="px-4 py-2 rounded-xl border border-[#0071e3]/30 text-[#0071e3] hover:bg-[#0071e3]/10">Reveal Analysis / Answer</button> : <div className="space-y-3"><div className="text-[#1d1d1f] whitespace-pre-wrap">{card.back.explanation}</div>{card.back.internals && <div className="text-[#1d1d1f]/80 text-sm"><b>Technical details:</b> {card.back.internals}</div>}{card.back.security && <div className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm whitespace-pre-wrap"><b>Security / Perspectives:</b> {card.back.security}</div>}{card.back.example && <div className="text-[#1d1d1f]/80 text-sm"><b>Example:</b> {card.back.example}</div>}<div className="flex gap-2 pt-2"><button disabled={answering} onClick={()=>answer(false)} className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed">I missed key points</button><button disabled={answering} onClick={()=>answer(true)} className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed">I reasoned correctly</button></div></div>}
      </div>
    )}
    {done && <div className="max-w-xl mx-auto rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"><h2 className="text-2xl text-[#1d1d1f] font-semibold">Challenge complete</h2><p className="text-[#1d1d1f]/80 mt-2">Score: <span className="text-emerald-700 font-semibold">{score}</span> / {pool.length}</p><p className="text-[#6e6e73] text-sm mt-1">Result recorded as practical challenge progress (theoretical vs practical tracked separately in analytics).</p><button onClick={start} className="mt-4 px-4 py-2 rounded-xl bg-[#0071e3] text-white font-medium">Run Again</button></div>}
    {!card && pool.length===0 && <p className="text-[#6e6e73]">Choose a mode and start a challenge to test understanding under pressure. All scenarios assume authorized, isolated lab environments.</p>}
  </div>
}