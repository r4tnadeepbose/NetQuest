import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { flashcards, chapters } from '../data/curriculum'
import { LEVELS } from '../lib/levels'
import { isDue } from '../lib/srs'
import { toolDatabase, capstones } from '../data/toolsAndTracks'

export default function Dashboard() {
  const { progress, startOrResumeDaily, getOverallUnderstanding, getTopicUnderstanding, getDomainOfCard } = useStore()
  const total = flashcards.length
  const reviewed = Object.keys(progress.reviews).length
  const mastered = Object.values(progress.reviews).filter(r => r.repetitions >= 5 && r.intervalDays >= 21).length
  const due = flashcards.filter(c => isDue(progress.reviews[c.id])).length
  const [todayStr] = useState(() => new Date().toISOString().slice(0, 10))
  const today = progress.history.find(h => h.date === todayStr)
  const levelName = LEVELS[progress.level - 1]
  const completion = Math.round((mastered / Math.max(1,total)) * 100)
  const mlOverall = getOverallUnderstanding()
  const mlUpdates = progress.ml?.totalUpdates || 0

  const chapterProgress = chapters.map(ch => {
    const cards = flashcards.filter(f => f.chapterId === ch.id)
    const m = cards.filter(c => (progress.reviews[c.id]?.repetitions || 0) >= 4).length
    return { ...ch, total: cards.length, mastered: m, pct: cards.length ? Math.round(m/cards.length*100) : 0, ml: getTopicUnderstanding(ch.id) }
  }).sort((a,b)=>b.ml-a.ml || b.total-a.total).slice(0,6)

  const domStats = (dom: 'red_vapt'|'blue_soc'|'networking') => {
    const cards = flashcards.filter(c=>getDomainOfCard(c)===dom)
    const rev = cards.filter(c=>progress.reviews[c.id])
    const mast = cards.filter(c=> (progress.reviews[c.id]?.repetitions||0)>=4)
    const conf = cards.length ? Math.round(cards.reduce((a,c)=>a+getTopicUnderstanding(c.chapterId),0)/cards.length) : 0
    return { total: cards.length, reviewed: rev.length, mastered: mast.length, pct: cards.length? Math.round(mast.length/cards.length*100):0, conf }
  }
  const red = domStats('red_vapt'), blue = domStats('blue_soc'), net = domStats('networking')
  const practicalCards = flashcards.filter(c=>['scenario','command','troubleshoot','packet','security'].includes(c.type))
  const practicalMastered = practicalCards.filter(c=> (progress.reviews[c.id]?.repetitions||0)>=4 && (progress.reviews[c.id]?.lastRating==='good' || progress.reviews[c.id]?.lastRating==='easy')).length
  const theoreticalMastered = flashcards.filter(c=> (progress.reviews[c.id]?.repetitions||0)>=4).length
  const toolProf = Math.round((progress.cyber.toolsStudied.length / Math.max(1, toolDatabase.length)) * 100)
  const capDone = progress.cyber.completedCapstones.length
  const cs = progress.cyber.challengeStats
  const challengeAcc = cs.attempted ? Math.round((cs.correct/cs.attempted)*100) : 0

  return (
    <div className="space-y-10">
      <section className="pt-2 md:pt-4">
        <p className="text-[13px] font-medium text-[#0071e3] mb-2">NetQuest</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.05]">Learn faster.<br/>Master deeply.</h1>
        <p className="text-[17px] md:text-xl text-[#6e6e73] mt-4 max-w-2xl leading-relaxed">A personalized platform for Red Team, VAPT, networking, and defensive security — powered by adaptive learning. Practice in authorized lab contexts only.</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link to="/daily" onClick={startOrResumeDaily} className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-[15px] transition shadow-sm">Continue Daily Learning</Link>
          <div className="text-[13px] text-[#6e6e73]">{progress.settings.distribution.red_vapt}% Red/VAPT · {progress.settings.distribution.blue_soc}% Blue/SOC · {progress.settings.distribution.networking}% Networking</div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Level" value={`${progress.level}`} sub={levelName} />
        <Stat label="Total XP" value={`${progress.xp}`} sub="Cumulative progress" />
        <Stat label="Streak" value={`${progress.streak} days`} sub={`Longest ${progress.longestStreak}`} />
        <Stat label="Today" value={`${today?.cards || 0}/${progress.settings.dailyGoal}`} sub={progress.daily.completed ? 'Completed' : 'In progress'} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Panel title="Mastery Overview">
          <div className="space-y-4">
            <Meter label="Red Team / Offensive" value={red.pct} color="bg-[#ff3b30]" note={`${red.mastered}/${red.total} cards`} />
            <Meter label="VAPT & Methodology" value={Math.round((red.pct + toolProf)/2)} color="bg-[#ff9f0a]" note="Skills & reporting" />
            <Meter label="Blue Team / SOC" value={blue.pct} color="bg-[#0071e3]" note={`${blue.mastered}/${blue.total} cards`} />
            <Meter label="Networking Foundation" value={net.pct} color="bg-[#34c759]" note={`${net.mastered}/${net.total} cards`} />
          </div>
        </Panel>
        <Panel title="Understanding">
          <div className="space-y-4">
            <div><div className="text-[13px] text-[#6e6e73]">Estimated understanding</div><div className="text-4xl font-semibold tracking-tight text-[#1d1d1f] mt-1">{mlOverall}%</div></div>
            <div className="h-2 rounded-full bg-black/5 overflow-hidden"><div className="h-full bg-[#0071e3] rounded-full" style={{width:`${mlOverall}%`}} /></div>
            <div className="grid grid-cols-2 gap-3 text-[13px]"><div><div className="text-[#6e6e73]">Theoretical</div><div className="text-[#1d1d1f] font-medium">{Math.round((theoreticalMastered/Math.max(1,total))*100)}%</div></div><div><div className="text-[#6e6e73]">Practical</div><div className="text-[#1d1d1f] font-medium">{Math.round((practicalMastered/Math.max(1,practicalCards.length))*100)}%</div></div><div><div className="text-[#6e6e73]">ML updates</div><div className="text-[#1d1d1f] font-medium">{mlUpdates}</div></div><div><div className="text-[#6e6e73]">Challenge acc.</div><div className="text-[#1d1d1f] font-medium">{challengeAcc}%</div></div></div>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed">On-device learning adapts sessions to your weak areas, due reviews, and selected path.</p>
          </div>
        </Panel>
        <Panel title="At a Glance">
          <div className="space-y-3 text-[14px]">
            <Row k="Reviewed cards" v={`${reviewed} / ${total}`} />
            <Row k="Due for review" v={`${due}`} />
            <Row k="Mastered" v={`${mastered}`} />
            <Row k="Completion" v={`${completion}%`} />
            <Row k="Tools studied" v={`${progress.cyber.toolsStudied.length} / ${toolDatabase.length}`} />
            <Row k="Capstones" v={`${capDone} / ${capstones.length}`} />
            <div className="pt-2"><Link to="/progress" className="text-[#0071e3] font-medium">View detailed analytics ›</Link></div>
          </div>
        </Panel>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Panel title="Skill Focus">
          <div className="space-y-3">
            <Meter label="Web security" value={Math.min(100, Math.round(red.pct*0.9))} color="bg-[#af52de]" />
            <Meter label="Network security" value={Math.min(100, Math.round((red.pct+net.pct)/2))} color="bg-[#0071e3]" />
            <Meter label="Active Directory" value={Math.min(100, getTopicUnderstanding('rt5'))} color="bg-[#ff3b30]" />
            <Meter label="Cloud security" value={Math.min(100, getTopicUnderstanding('rt7'))} color="bg-[#5ac8fa]" />
            <Meter label="Tool proficiency" value={toolProf} color="bg-[#34c759]" />
          </div>
        </Panel>
        <Panel title="Top Topics">
          <div className="space-y-3">
            {chapterProgress.slice(0,5).map(ch => (
              <div key={ch.id}><div className="flex justify-between mb-1.5 text-[14px]"><span className="text-[#1d1d1f] truncate pr-2">{ch.title}</span><span className="text-[#6e6e73]">{ch.ml}%</span></div><div className="h-1.5 rounded-full bg-black/5 overflow-hidden"><div className="h-full bg-[#0071e3] rounded-full" style={{width:`${ch.ml}%`}} /></div></div>
            ))}
            {mlUpdates === 0 && <div className="text-[#6e6e73] text-[14px]">Rate cards to build your understanding model.</div>}
          </div>
        </Panel>
        <Panel title="Networking → Security">
          <ul className="text-[14px] text-[#1d1d1f]/80 space-y-2 leading-relaxed">
            <li><b className="text-[#1d1d1f] font-medium">TCP:</b> scanning, handshakes, SYN detection</li>
            <li><b className="text-[#1d1d1f] font-medium">DNS:</b> recon, tunneling, poisoning, hunting</li>
            <li><b className="text-[#1d1d1f] font-medium">Routing/VLANs:</b> segmentation, pivoting risks</li>
            <li><b className="text-[#1d1d1f] font-medium">HTTP/TLS:</b> web VAPT and cert assessment</li>
            <li><b className="text-[#1d1d1f] font-medium">AD:</b> enterprise paths and monitoring</li>
          </ul>
        </Panel>
      </div>
    </div>
  )
}

function Stat({label,value,sub}:{label:string,value:string,sub:string}){return <div className="rounded-3xl bg-white border border-black/5 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"><div className="text-[#6e6e73] text-[13px]">{label}</div><div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mt-1">{value}</div><div className="text-[13px] text-[#6e6e73] mt-1">{sub}</div></div>}
function Panel({title,children}:{title:string,children:any}){return <div className="rounded-3xl bg-white border border-black/5 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"><h2 className="text-[19px] font-semibold tracking-tight text-[#1d1d1f] mb-4">{title}</h2>{children}</div>}
function Row({k,v}:{k:string,v:string}){return <div className="flex justify-between py-0.5"><span className="text-[#6e6e73]">{k}</span><span className="text-[#1d1d1f] font-medium">{v}</span></div>}
function Meter({label,value,color,note}:{label:string,value:number,color:string,note?:string}){return <div><div className="flex justify-between mb-1.5 text-[14px]"><span className="text-[#1d1d1f]">{label}</span><span className="text-[#6e6e73]">{value}%</span></div><div className="h-2 rounded-full bg-black/5 overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{width:`${Math.max(0,Math.min(100,value))}%`}} /></div>{note && <div className="text-[12px] text-[#86868b] mt-1">{note}</div>}</div>}