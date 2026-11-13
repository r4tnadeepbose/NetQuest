import { useStore } from '../store'
import { flashcards, chapters } from '../data/curriculum'
import { isDue, masteryFromReview } from '../lib/srs'
import { toolDatabase, capstones } from '../data/toolsAndTracks'

export default function Progress() {
  const { progress, getOverallUnderstanding, getTopicUnderstanding, getDomainOfCard } = useStore()
  const total = flashcards.length
  const reviewed = Object.keys(progress.reviews).length
  const mastered = Object.values(progress.reviews).filter(r => masteryFromReview(r) >= 100).length
  const due = flashcards.filter(c => isDue(progress.reviews[c.id])).length
  const mlOverall = getOverallUnderstanding()
  const mlUpdates = progress.ml?.totalUpdates || 0
  const byChapter = chapters.map(ch => {
    const cards = flashcards.filter(f=>f.chapterId===ch.id)
    const avg = cards.length ? Math.round(cards.reduce((a,c)=>a+masteryFromReview(progress.reviews[c.id]),0)/cards.length) : 0
    const ml = getTopicUnderstanding(ch.id)
    return { ch, count: cards.length, avg, ml }
  }).filter(x=>x.count>0)

  const dom = (d:'red_vapt'|'blue_soc'|'networking') => {
    const cards = flashcards.filter(c=>getDomainOfCard(c)===d)
    const m = cards.filter(c=>masteryFromReview(progress.reviews[c.id])>=80).length
    return cards.length ? Math.round((m/cards.length)*100) : 0
  }
  const red = dom('red_vapt'), blue = dom('blue_soc'), net = dom('networking')
  const toolProf = Math.round((progress.cyber.toolsStudied.length / Math.max(1, toolDatabase.length)) * 100)
  const cs = progress.cyber.challengeStats
  const challengeAcc = cs.attempted ? Math.round((cs.correct/cs.attempted)*100) : 0
  const practicalCards = flashcards.filter(c=>['scenario','command','troubleshoot','packet','security'].includes(c.type))
  const practical = practicalCards.length ? Math.round((practicalCards.filter(c=> (progress.reviews[c.id]?.repetitions||0)>=4 && ['good','easy'].includes(progress.reviews[c.id]?.lastRating||'')).length / practicalCards.length)*100) : 0
  const theoretical = total ? Math.round((Object.values(progress.reviews).filter(r=>masteryFromReview(r)>=80).length / total)*100) : 0

  return <div className="space-y-4">
    <h1 className="text-2xl font-bold text-[#1d1d1f]">Progress & Cybersecurity Analytics</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <Box label="Total Cards" value={`${total}`} />
      <Box label="Reviewed" value={`${reviewed}`} />
      <Box label="Due Now" value={`${due}`} />
      <Box label="Mastered" value={`${mastered}`} />
      <Box label="ML Understanding" value={`${mlOverall}%`} />
      <Box label="Challenge Accuracy" value={`${challengeAcc}%`} />
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">Cybersecurity Mastery (Theoretical ≠ Practical)</h2>
        <div className="space-y-2 text-sm">
          <Bar label="Red Team mastery" value={red} color="bg-rose-500" />
          <Bar label="VAPT mastery" value={Math.round((red + challengeAcc)/2)} color="bg-orange-400" />
          <Bar label="Blue Team / SOC mastery" value={blue} color="bg-blue-500" />
          <Bar label="Networking mastery" value={net} color="bg-[#0071e3]" />
          <Bar label="Web security knowledge" value={Math.min(100, Math.round(red*0.95))} color="bg-fuchsia-500" />
          <Bar label="Network security knowledge" value={Math.min(100, Math.round((red+net)/2))} color="bg-cyan-400" />
          <Bar label="Active Directory knowledge" value={Math.min(100, getTopicUnderstanding('rt5'))} color="bg-rose-400" />
          <Bar label="Cloud security knowledge" value={Math.min(100, getTopicUnderstanding('rt7'))} color="bg-sky-400" />
          <Bar label="Tool proficiency" value={toolProf} color="bg-emerald-500" />
          <Bar label="Theoretical knowledge" value={theoretical} color="bg-indigo-400" />
          <Bar label="Practical proficiency" value={practical} color="bg-emerald-400" />
        </div>
        <p className="text-xs text-[#86868b] mt-3">Practical proficiency is inferred from scenario/command/troubleshooting/security card performance and challenge outcomes; correct definitions alone do not imply operational proficiency.</p>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">Operational & Assessment Metrics</h2>
        <div className="space-y-2 text-sm">
          <Row k="Learning path" v={progress.settings.learningPath} />
          <Row k="Distribution target" v={`${progress.settings.distribution.red_vapt}% R / ${progress.settings.distribution.blue_soc}% B / ${progress.settings.distribution.networking}% N`} />
          <Row k="Adaptive engine" v={progress.settings.adaptiveDistribution ? 'Enabled' : 'Disabled'} />
          <Row k="Tools studied" v={`${progress.cyber.toolsStudied.length} / ${toolDatabase.length}`} />
          <Row k="Capstones completed" v={`${progress.cyber.completedCapstones.length} / ${capstones.length}`} />
          <Row k="Practical challenges logged" v={`${cs.practical}`} />
          <Row k="Vulnerability identification accuracy" v={`${challengeAcc}%`} />
          <Row k="False positive tracking count" v={`${cs.falsePositive}`} />
          <Row k="Technical troubleshooting signals" v={`${Math.min(100, practical)}%`} />
          <Row k="MITRE ATT&CK technique knowledge" v={`${Math.min(100, Math.round((getTopicUnderstanding('rt1')+getTopicUnderstanding('cp1'))/2))}%`} />
        </div>
        <div className="mt-4 text-sm text-[#6e6e73]">Networking foundation connects to security operations: TCP→scanning/handshakes/SYN detection, DNS→recon/tunneling/hunting, Routing/VLANs→segmentation/pivoting, HTTP/TLS→web testing, AD→enterprise attack paths and monitoring.</div>
      </div>
    </div>

    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <h2 className="text-lg font-semibold text-[#1d1d1f] mb-2">Machine Learning Understanding Model</h2>
      <p className="text-sm text-[#6e6e73] mb-3">On-device online logistic-regression learner updates on every flashcard rating (Again/Hard/Good/Easy) using difficulty, repetitions, lapses, recency, and ease to estimate understanding per card/topic and adapt daily sessions.</p>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-3 rounded bg-[#f5f5f7] overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{width:`${mlOverall}%`}} /></div>
        <div className="text-[#0071e3] font-semibold w-16 text-right">{mlOverall}%</div>
      </div>
      <div className="text-xs text-[#86868b] mt-2">{mlUpdates === 0 ? 'No training updates yet — rate cards to train the model.' : `Trained on ${mlUpdates} rating events with persistent model weights and topic understanding.`}</div>
    </div>

    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">Weekly / Recent Activity</h2>
      <div className="space-y-2">{progress.history.slice().reverse().slice(0,14).map(h=> <div key={h.date} className="flex items-center gap-3 text-sm"><div className="w-28 text-[#6e6e73]">{h.date}</div><div className="flex-1 h-2 bg-[#f5f5f7] rounded overflow-hidden"><div className="h-full bg-[#0071e3]" style={{width:`${Math.min(100,h.cards*10)}%`}} /></div><div className="w-28 text-right text-[#1d1d1f]/80">{h.cards} cards • {h.xp} XP</div></div>)}
      {progress.history.length===0 && <div className="text-[#6e6e73] text-sm">No activity yet. Start a daily session to build your history.</div>}</div>
    </div>

    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <h2 className="text-lg font-semibold text-[#1d1d1f] mb-3">Topic Mastery & ML Understanding by Chapter</h2>
      <div className="grid md:grid-cols-2 gap-3">{byChapter.map(({ch,count,avg,ml})=> <div key={ch.id} className="border border-black/5 rounded-xl p-3"><div className="flex justify-between text-sm mb-1"><span className="text-[#1d1d1f]">{ch.title}</span><span className="text-[#6e6e73]">Mastery {avg}%</span></div><div className="h-1.5 bg-[#f5f5f7] rounded overflow-hidden mb-2"><div className="h-full bg-blue-500" style={{width:`${avg}%`}} /></div><div className="flex justify-between text-xs mb-1"><span className="text-[#86868b]">ML confidence</span><span className="text-[#0071e3]">{ml}%</span></div><div className="h-1.5 bg-[#f5f5f7] rounded overflow-hidden"><div className="h-full bg-[#0071e3]" style={{width:`${ml}%`}} /></div><div className="text-xs text-[#86868b] mt-2">{count} cards • lower confidence topics are prioritized adaptively</div></div>)}</div>
    </div>
  </div>
}
function Box({label,value}:{label:string,value:string}){return <div className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-xs uppercase text-[#6e6e73]">{label}</div><div className="text-2xl text-[#1d1d1f] font-semibold mt-1">{value}</div></div>}
function Row({k,v}:{k:string,v:string}){return <div className="flex justify-between gap-3 text-sm"><span className="text-[#6e6e73]">{k}</span><span className="text-[#1d1d1f] font-medium text-right">{v}</span></div>}
function Bar({label,value,color}:{label:string,value:number,color:string}){return <div><div className="flex justify-between mb-1"><span className="text-[#1d1d1f]/80">{label}</span><span className="text-[#1d1d1f]">{value}%</span></div><div className="h-1.5 rounded bg-[#f5f5f7] overflow-hidden"><div className={`h-full ${color}`} style={{width:`${Math.max(0,Math.min(100,value))}%`}} /></div></div>}