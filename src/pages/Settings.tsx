import { useState } from 'react'
import { useStore } from '../store'
import { masteryTracks } from '../data/toolsAndTracks'
import { getPrefs, setPrefs, play } from '../lib/sfx'
import { useEffects } from '../components/Effects'

export default function Settings() {
  const { progress, setDailyGoal, setLearningPath, setAdaptiveDistribution, setDistribution, resetDaily, resetAll } = useStore()
  const { refreshPrefs, confetti, toast } = useEffects()
  const [prefs, setPrefsState] = useState(getPrefs())
  const dist = progress.settings.distribution
  const updatePrefs = (p: Partial<{sound:boolean,effects:boolean}>) => {
    const next = setPrefs(p); setPrefsState(next); refreshPrefs();
    if (p.sound && next.sound) play('tap')
    if (p.effects && next.effects) { confetti({ particleCount: 60 }); toast({ title: 'Effects enabled', kind: 'success' }) }
  }
  return <div className="space-y-4 max-w-3xl">
    <h1 className="text-2xl font-bold text-[#1d1d1f]">Settings & Personalization</h1>
    <div className="rounded-2xl border border-black/5 bg-white p-4 space-y-5">
      <div>
        <label className="block text-sm text-[#1d1d1f]/80 mb-1">Learning path / specialization</label>
        <select value={progress.settings.learningPath} onChange={e=>setLearningPath(e.target.value as any)} className="bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2 w-full md:w-96 text-sm">
          <option value="general">General (Red Team–focused cybersecurity mastery)</option>
          {masteryTracks.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <p className="text-xs text-[#86868b] mt-1">The daily engine adapts to your selected path while reinforcing weak areas and networking fundamentals.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#1d1d1f]/80 mb-1">Daily goal (cards per session)</label>
          <input type="number" min={5} max={30} value={progress.settings.dailyGoal} onChange={e=>setDailyGoal(Number(e.target.value)||10)} className="bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2 w-40" />
          <p className="text-xs text-[#86868b] mt-1">Recommended: 7–12 for consistent mastery.</p>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm text-[#1d1d1f]/80 mt-6"><input type="checkbox" checked={progress.settings.adaptiveDistribution} onChange={e=>setAdaptiveDistribution(e.target.checked)} /> Adaptive distribution (recommended)</label>
          <p className="text-xs text-[#86868b] mt-1">Prioritizes weak/due areas and rotation; not a rigid schedule.</p>
        </div>
      </div>

      <div>
        <div className="text-sm text-[#1d1d1f]/80 mb-2">Daily domain distribution target (default 70% Red/VAPT, 20% Blue/SOC, 10% Networking)</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <label className="space-y-1"><div className="text-[#ff3b30]">Red/VAPT %</div><input type="number" min={0} max={100} value={dist.red_vapt} onChange={e=>setDistribution({...dist, red_vapt: Number(e.target.value||0)})} className="w-full bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2" /></label>
          <label className="space-y-1"><div className="text-[#0071e3]">Blue/SOC %</div><input type="number" min={0} max={100} value={dist.blue_soc} onChange={e=>setDistribution({...dist, blue_soc: Number(e.target.value||0)})} className="w-full bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2" /></label>
          <label className="space-y-1"><div className="text-[#0071e3]">Networking %</div><input type="number" min={0} max={100} value={dist.networking} onChange={e=>setDistribution({...dist, networking: Number(e.target.value||0)})} className="w-full bg-[#fbfbfd] border border-black/10 rounded-xl px-3 py-2" /></label>
        </div>
        <p className="text-xs text-[#86868b] mt-1">Targets guide selection; the adaptive engine may rebalance toward weaknesses and due reviews. Best kept summing to ~100.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={resetDaily} className="px-4 py-2 rounded-xl border border-black/10 hover:bg-[#f5f5f7]">Regenerate Today’s Session</button>
        <button onClick={()=>{ if(confirm('Reset Everything? This will permanently erase achievements, streaks, levels/XP, reviews, daily progress, history, ML/personalization, tools/capstones, and all other progress.')) resetAll() }} className="px-4 py-2 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 font-medium">Reset Everything</button>
      </div>

      <div className="border-t border-black/5 pt-4">
        <div className="text-sm font-medium text-[#1d1d1f] mb-2">Sound & Effects</div>
        <div className="flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-2 text-sm text-[#1d1d1f]/80"><input type="checkbox" checked={prefs.sound} onChange={e=>updatePrefs({sound: e.target.checked})} /> Sound effects</label>
          <label className="flex items-center gap-2 text-sm text-[#1d1d1f]/80"><input type="checkbox" checked={prefs.effects} onChange={e=>updatePrefs({effects: e.target.checked})} /> Confetti & celebrations</label>
          <button onClick={()=>{ play('complete'); confetti({ particleCount: 100 }); toast({ title: 'Test celebration', message: 'Sounds and effects are working.', kind: 'success' }) }} className="px-3 py-1.5 rounded-xl border border-black/10 hover:bg-[#f5f5f7] text-sm">Test</button>
        </div>
        <p className="text-xs text-[#86868b] mt-1">Audio plays after interaction (browser policy). You can mute anytime.</p>
      </div>

      <div className="text-sm text-[#6e6e73] border-t border-black/5 pt-4">
        <div className="font-medium text-[#1d1d1f] mb-1">Persistence & Platform Notes</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Progress, SRS reviews, ML model state, personalization, and analytics persist locally (localStorage). No backend required.</li>
          <li>Curriculum and tools/tracks/capstones are data-driven for extensibility.</li>
          <li>All practical/attack content is intended for explicitly authorized, isolated lab environments only.</li>
          <li>Existing workspace file <code className="text-[#0071e3]">sidenav.html</code> was preserved.</li>
        </ul>
      </div>
    </div>
  </div>
}