import { useEffect, useRef, useState } from 'react'
import type { SimDefinition, SimEvent } from './types'
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Layers } from 'lucide-react'

type Props = { sim: SimDefinition; layout?: 'default' | 'split' }

const SPEEDS = [0.5, 1, 2, 4]

function lerp(a:number,b:number,t:number){return a+(b-a)*t}
function getDeviceCenter(sim: SimDefinition, id: string){
  const d = sim.devices.find(x=>x.id===id); if(!d) return {x:0,y:0}
  const w=d.w??140,h=d.h??60; return {x:d.x+w/2, y:d.y+h/2}
}
function pathFor(sim: SimDefinition, from:string, to:string, curve=0){
  const a=getDeviceCenter(sim,from), b=getDeviceCenter(sim,to)
  if(!curve) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
  const mx=(a.x+b.x)/2, my=(a.y+b.y)/2 - curve
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`
}
function pointOnPath(sim: SimDefinition, ev: SimEvent, t:number){
  const a=getDeviceCenter(sim,ev.from), b=getDeviceCenter(sim,ev.to)
  const link=sim.links.find(l=> (l.from===ev.from&&l.to===ev.to)||(l.from===ev.to&&l.to===ev.from))
  const c=link?.curve??0
  if(!c){ return {x:lerp(a.x,b.x,t), y:lerp(a.y,b.y,t)} }
  const mx=(a.x+b.x)/2, my=(a.y+b.y)/2 - c
  const u=1-t
  return { x: u*u*a.x + 2*u*t*mx + t*t*b.x, y: u*u*a.y + 2*u*t*my + t*t*b.y }
}

export function SimulationPlayer({ sim, layout = 'default' }: Props){
  const [playing,setPlaying]=useState(true)
  const [speed,setSpeed]=useState(1)
  const [loop,setLoop]=useState(true)
  const [time,setTime]=useState(0)
  const [showLabels,setShowLabels]=useState(true)
  const [advanced,setAdvanced]=useState(false)
  const [selDev,setSelDev]=useState<string|null>(null)
  const [selPkt,setSelPkt]=useState<string|null>(null)
  const raf=useRef<number>(0)
  const last=useRef<number>(0)

  useEffect(()=>{ setTime(0); setPlaying(true); setSelDev(null); setSelPkt(null); last.current=0 },[sim.id])

  useEffect(()=>{
    if(!playing) return
    const tick=(ts:number)=>{
      if(!last.current) last.current=ts
      const dt=(ts-last.current)*speed
      last.current=ts
      setTime(t=>{
        let nt=t+dt
        if(nt>=sim.totalDuration){
          if(loop) nt = nt % Math.max(1, sim.totalDuration)
          else { nt = sim.totalDuration; setPlaying(false) }
        }
        return nt
      })
      raf.current=requestAnimationFrame(tick)
    }
    raf.current=requestAnimationFrame(tick)
    return ()=>{ cancelAnimationFrame(raf.current); last.current=0 }
  },[playing,speed,loop,sim.totalDuration])

  const activeEvents = sim.events.filter(e=> time>=e.at && time<=e.at+e.dur)
  const pastEvents = sim.events.filter(e=> time>=e.at)
  const currentStep = [...pastEvents].sort((a,b)=>b.at-a.at)[0]
  const activeDevices = new Set<string>(activeEvents.flatMap(e=>[e.from,e.to, ...(e.activate||[])]))
  const selectedEvent = sim.events.find(e=>e.packet.id===selPkt) || currentStep

  const stepTo = (dir: 1|-1) => {
    const steps = sim.events.map(e=>e.at).filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b)
    if (!steps.length) return
    let idx = 0
    for (let i=0;i<steps.length;i++) if (steps[i] <= time + (dir>0?1:-1)) idx = i
    const next = steps[Math.max(0, Math.min(steps.length-1, idx + dir))]
    setTime(next ?? 0); setPlaying(false)
  }

  const viewW = Math.max(1000, ...sim.devices.map(d=>d.x+(d.w??140)+60))
  const viewH = Math.max(560, ...sim.devices.map(d=>d.y+(d.h??60)+60))
  const progress = sim.totalDuration ? Math.min(100,(time/sim.totalDuration)*100) : 0

  const selDevice = selDev ? sim.devices.find(x=>x.id===selDev) : null

  const stage = (
    <div className={layout==='split' ? 'h-full min-h-0 rounded-2xl overflow-hidden bg-[#0b1020] border border-black/10 flex flex-col' : 'rounded-[24px] overflow-hidden bg-[#0b1020] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.12)]'}>
      <div className={layout==='split' ? 'flex-1 min-h-0 p-2 md:p-3' : 'p-3 md:p-4'}>
        <div className={layout==='split' ? 'relative w-full h-full rounded-xl overflow-hidden bg-[radial-gradient(ellipse_at_top,#111a30_0%,#0b1020_60%,#070b14_100%)] ring-1 ring-white/10' : 'relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-[radial-gradient(ellipse_at_top,#111a30_0%,#0b1020_60%,#070b14_100%)] ring-1 ring-white/10'}>
          <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize:'44px 44px'}} />
          <svg viewBox={`0 0 ${viewW} ${viewH}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="mA" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="rgba(255,255,255,0.45)" /></marker>
              <filter id="glow"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {sim.links.map(l=>{
              const c = sim.links.find(x=>x.id===l.id)?.curve ?? 0
              const d = pathFor(sim,l.from,l.to,c)
              const hot = activeEvents.some(e=> (e.from===l.from&&e.to===l.to)||(e.from===l.to&&e.to===l.from))
              return <g key={l.id}>
                <path d={d} fill="none" stroke={hot? 'rgba(90,200,250,0.25)':'rgba(255,255,255,0.08)'} strokeWidth={hot?7:3} />
                <path d={d} fill="none" stroke={hot? '#5ac8fa':'rgba(255,255,255,0.22)'} strokeWidth={hot?2.6:1.6} strokeDasharray={l.dashed?'7 6':undefined} markerEnd="url(#mA)" />
              </g>
            })}

            {sim.devices.map(d=>{
              const w=d.w??150,h=d.h??64, active=activeDevices.has(d.id), sel=selDev===d.id
              const col = d.role==='attacker'? '#ff453a' : d.role==='defender'||d.role==='dns'? '#30d158' : d.role==='server'||d.role==='cloud'? '#bf5af2' : '#0a84ff'
              return (
                <g key={d.id} transform={`translate(${d.x},${d.y})`} onClick={()=>{setSelDev(d.id); setSelPkt(null)}} style={{cursor:'pointer'}}>
                  {active && <rect x={-5} y={-5} width={w+10} height={h+10} rx={18} fill={col} opacity={0.14} filter="url(#glow)" />}
                  <rect width={w} height={h} rx={16} fill={active?'#162338':'rgba(17,24,39,0.96)'} stroke={sel? '#ffd60a' : active? col : 'rgba(255,255,255,0.16)'} strokeWidth={sel?2.4:1.6} />
                  <circle cx={20} cy={h/2} r={7} fill={col} opacity={0.95} />
                  <text x={36} y={h/2 - 3} fontSize={13} fontWeight={600} fill="#f5f7ff">{d.label}</text>
                  <text x={36} y={h/2 + 14} fontSize={10.5} fill="#94a3b8">{d.kind}</text>
                </g>
              )
            })}

            {activeEvents.map(e=>{
              const t = Math.max(0, Math.min(1, (time - e.at)/Math.max(1,e.dur)))
              const p = pointOnPath(sim,e,t)
              const sel = selPkt===e.packet.id
              const color = e.packet.color || '#5ac8fa'
              return (
                <g key={`${e.id}-${e.at}`} transform={`translate(${p.x},${p.y})`} onClick={()=>{setSelPkt(e.packet.id); setSelDev(null)}} style={{cursor:'pointer'}}>
                  <circle r={sel?10:6.5} fill={color} opacity={0.22} filter="url(#glow)" />
                  <circle r={sel?7:5} fill={color} stroke="white" strokeWidth={sel?2:1.3} />
                  {showLabels && (
                    <g transform="translate(11,-13)">
                      <rect rx={7} width={Math.max(54, e.packet.label.length*6.2)} height={19} fill="rgba(255,255,255,0.96)" />
                      <text x={7} y={13} fontSize={10.5} fill="#0b1020" fontWeight={600}>{e.packet.label}</text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>

          <div className="absolute left-3 right-3 bottom-3 flex items-center gap-2 pointer-events-none">
            <div className="flex-1 min-w-0 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2">
              <div className="text-[12px] text-white font-medium truncate">{currentStep?.stepTitle || 'Running simulation'}</div>
              {currentStep?.stepDetail && <div className="text-[11px] text-white/70 truncate">{currentStep.stepDetail}</div>}
            </div>
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 text-[12px] text-white/85 tabular-nums shrink-0">
              {(time/1000).toFixed(1)}s / {(sim.totalDuration/1000).toFixed(1)}s
            </div>
          </div>
        </div>
      </div>

      <div className={layout==='split' ? 'shrink-0 px-3 md:px-4 pb-3 space-y-2' : 'px-4 md:px-5 pb-4 space-y-3'}>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-[#0a84ff] rounded-full" style={{width:`${progress}%`}} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button onClick={()=>setPlaying(p=>!p)} className="h-8 md:h-9 px-3 md:px-4 rounded-full bg-[#0a84ff] hover:bg-[#409cff] text-white text-xs md:text-sm font-medium inline-flex items-center gap-1.5 transition">
              {playing ? <Pause size={14}/> : <Play size={14}/>} {playing?'Pause':'Play'}
            </button>
            <button onClick={()=>{setTime(0); setPlaying(true)}} className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/10 hover:bg-white/15 text-white inline-flex items-center justify-center" title="Restart"><RotateCcw size={14}/></button>
            <button onClick={()=>stepTo(-1)} className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/10 hover:bg-white/15 text-white inline-flex items-center justify-center" title="Step back"><SkipBack size={14}/></button>
            <button onClick={()=>stepTo(1)} className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-white/10 hover:bg-white/15 text-white inline-flex items-center justify-center" title="Step forward"><SkipForward size={14}/></button>
            <div className="ml-0.5 flex items-center rounded-full bg-white/8 border border-white/10 p-0.5">
              {SPEEDS.map(s=> <button key={s} onClick={()=>setSpeed(s)} className={`px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-medium ${speed===s?'bg-white text-[#0b1020]':'text-white/75 hover:text-white'}`}>{s}x</button>)}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] md:text-[12px] text-white/75">
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={loop} onChange={e=>setLoop(e.target.checked)} /> Loop</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={showLabels} onChange={e=>setShowLabels(e.target.checked)} /> Labels</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={advanced} onChange={e=>setAdvanced(e.target.checked)} /> <Layers size={12}/> Adv</label>
          </div>
        </div>
      </div>
    </div>
  )

  if (layout === 'split') {
    const explainItems = (advanced ? sim.advanced : sim.beginner).slice(0, 4)
    return (
      <div className="h-full w-full grid grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-3 p-3 md:p-4 overflow-hidden">
        <div className="min-w-0 min-h-0 h-full">{stage}</div>
        <div className="min-h-0 h-full flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 min-h-0 rounded-2xl border border-black/5 bg-white p-3 md:p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h3 className="text-[13px] font-semibold text-[#1d1d1f]">Explanation</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#6e6e73]">{advanced ? 'Advanced' : 'Beginner'}</span>
            </div>
            <div className="min-h-0 overflow-hidden">
              <ul className="space-y-1.5 text-[12px] md:text-[13px] text-[#3a3a3c] leading-snug list-disc pl-4">
                {explainItems.map((x,i)=><li key={i}>{x}</li>)}
              </ul>
              {sim.failureNote && <div className="mt-2 text-[11px] md:text-[12px] text-[#8a4b00] bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 rounded-lg p-2 leading-snug"><b>Note:</b> {sim.failureNote}</div>}
              {currentStep?.layer && <div className="mt-2 text-[11px] text-[#6e6e73]"><span className="font-medium text-[#1d1d1f]">Phase:</span> {currentStep.layer}</div>}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-black/5 bg-white p-3 md:p-4 overflow-hidden">
            <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-2">Inspector</h3>
            {selDevice ? (
              <div className="text-[12px] space-y-1">
                <div className="font-semibold text-[#1d1d1f]">{selDevice.label}</div>
                <div className="text-[#6e6e73]">{selDevice.kind}{selDevice.role ? ` · ${selDevice.role}` : ''}</div>
                {selDevice.meta && <div className="space-y-0.5 pt-1">{Object.entries(selDevice.meta).slice(0,4).map(([k,v])=> <div key={k} className="flex justify-between gap-2"><span className="text-[#86868b]">{k}</span><span className="text-[#1d1d1f] font-medium text-right truncate">{v}</span></div>)}</div>}
              </div>
            ) : selectedEvent ? (
              <div className="text-[12px] space-y-1">
                <div className="font-semibold text-[#1d1d1f]">{selectedEvent.packet.label}</div>
                <div className="text-[#6e6e73]">{selectedEvent.packet.protocol || 'Packet'} · {selectedEvent.from} → {selectedEvent.to}</div>
                {selectedEvent.packet.fields && <div className="space-y-0.5 pt-1">{Object.entries(selectedEvent.packet.fields).slice(0,4).map(([k,v])=> <div key={k} className="flex justify-between gap-2"><span className="text-[#86868b]">{k}</span><span className="text-[#1d1d1f] font-medium text-right truncate">{v}</span></div>)}</div>}
                {selectedEvent.packet.explanation && <p className="text-[#3a3a3c] leading-snug pt-1 line-clamp-2">{selectedEvent.packet.explanation}</p>}
              </div>
            ) : (
              <p className="text-[12px] text-[#6e6e73]">Click a device or packet in the model.</p>
            )}
          </div>

          <div className="flex-[1.2] min-h-0 rounded-2xl border border-black/5 bg-white p-3 md:p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h3 className="text-[13px] font-semibold text-[#1d1d1f]">Sequence</h3>
              <span className="text-[10px] text-[#86868b]">{sim.events.length} steps</span>
            </div>
            <ol className="min-h-0 flex-1 overflow-hidden space-y-1">
              {sim.events.slice(0, 8).map((e, i) => {
                const state = time < e.at ? 'upcoming' : time <= e.at+e.dur ? 'active' : 'done'
                return (
                  <li key={e.id}>
                    <button onClick={()=>{setTime(e.at); setPlaying(false); setSelPkt(e.packet.id); setSelDev(null)}} className={`w-full text-left flex gap-2 px-2 py-1.5 rounded-lg transition ${state==='active'?'bg-[#0071e3]/10':'hover:bg-[#f5f5f7]'}`}>
                      <span className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold shrink-0 ${state==='active'?'bg-[#0071e3] text-white': state==='done'?'bg-[#e5e5ea] text-[#6e6e73]':'bg-[#f2f2f7] text-[#86868b]'}`}>{i+1}</span>
                      <span className="min-w-0 flex-1">
                        <div className={`text-[11px] md:text-[12px] truncate ${state==='done'?'text-[#6e6e73]':'text-[#1d1d1f] font-medium'}`}>{e.stepTitle || e.packet.label}</div>
                      </span>
                    </button>
                  </li>
                )
              })}
              {sim.events.length > 8 && <li className="text-[10px] text-[#86868b] px-2 pt-0.5">+{sim.events.length - 8} more steps in flow</li>}
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {stage}

      <div className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">
        <div className="rounded-2xl border border-black/5 bg-white p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Explanation</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#6e6e73]">{advanced ? 'Advanced' : 'Beginner'}</span>
          </div>
          <ul className="space-y-2.5 text-[14px] text-[#3a3a3c] leading-relaxed list-disc pl-5">
            {(advanced ? sim.advanced : sim.beginner).map((x,i)=><li key={i}>{x}</li>)}
          </ul>
          {sim.failureNote && <div className="mt-4 text-[13px] text-[#8a4b00] bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 rounded-xl p-3 leading-relaxed"><b>Failure / edge case:</b> {sim.failureNote}</div>}
          {currentStep?.layer && <div className="mt-3 text-[13px] text-[#6e6e73]"><span className="font-medium text-[#1d1d1f]">Layer/phase:</span> {currentStep.layer}</div>}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white p-4 md:p-5">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-3">Inspector</h3>
            {selDevice ? (
              <div className="text-[14px] space-y-2">
                <div>
                  <div className="font-semibold text-[#1d1d1f]">{selDevice.label}</div>
                  <div className="text-[#6e6e73] text-[13px]">{selDevice.kind}{selDevice.role ? ` · ${selDevice.role}` : ''}</div>
                </div>
                {selDevice.meta && <div className="space-y-1.5 pt-1">{Object.entries(selDevice.meta).map(([k,v])=> <div key={k} className="flex justify-between gap-3 text-[13px]"><span className="text-[#86868b]">{k}</span><span className="text-[#1d1d1f] font-medium text-right">{v}</span></div>)}</div>}
              </div>
            ) : selectedEvent ? (
              <div className="text-[14px] space-y-2">
                <div>
                  <div className="font-semibold text-[#1d1d1f]">{selectedEvent.packet.label}</div>
                  <div className="text-[#6e6e73] text-[13px]">{selectedEvent.packet.protocol || 'Packet'} · {selectedEvent.from} → {selectedEvent.to}</div>
                </div>
                {selectedEvent.packet.fields && <div className="space-y-1.5 pt-1">{Object.entries(selectedEvent.packet.fields).map(([k,v])=> <div key={k} className="flex justify-between gap-3 text-[13px]"><span className="text-[#86868b]">{k}</span><span className="text-[#1d1d1f] font-medium text-right">{v}</span></div>)}</div>}
                {selectedEvent.packet.explanation && <p className="text-[13px] text-[#3a3a3c] leading-relaxed pt-1">{selectedEvent.packet.explanation}</p>}
              </div>
            ) : (
              <p className="text-[13px] text-[#6e6e73] leading-relaxed">Select a device or a moving packet in the model to view its details here.</p>
            )}
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Sequence</h3>
              <span className="text-[11px] text-[#86868b]">{sim.events.length} steps</span>
            </div>
            <ol className="space-y-1.5 max-h-64 overflow-auto pr-1">
              {sim.events.map((e, i) => {
                const state = time < e.at ? 'upcoming' : time <= e.at+e.dur ? 'active' : 'done'
                return (
                  <li key={e.id}>
                    <button onClick={()=>{setTime(e.at); setPlaying(false); setSelPkt(e.packet.id); setSelDev(null)}} className={`w-full text-left flex gap-3 px-2.5 py-2 rounded-xl transition ${state==='active'?'bg-[#0071e3]/10':'hover:bg-[#f5f5f7]'}`}>
                      <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold shrink-0 ${state==='active'?'bg-[#0071e3] text-white': state==='done'?'bg-[#e5e5ea] text-[#6e6e73]':'bg-[#f2f2f7] text-[#86868b]'}`}>{i+1}</span>
                      <span className="min-w-0">
                        <div className={`text-[13px] truncate ${state==='done'?'text-[#6e6e73]':'text-[#1d1d1f] font-medium'}`}>{e.stepTitle || e.packet.label}</div>
                        <div className="text-[11px] text-[#86868b] truncate">{e.from} → {e.to}</div>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
