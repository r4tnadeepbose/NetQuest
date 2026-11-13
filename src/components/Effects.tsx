import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getPrefs, play, type SfxName } from '../lib/sfx'

type Toast = { id: number; title: string; message?: string; kind?: 'success' | 'info' | 'achievement' | 'levelup' }
type Ctx = {
  confetti: (opts?: { particleCount?: number; spread?: number }) => void
  toast: (t: Omit<Toast, 'id'>) => void
  sfx: (name: SfxName) => void
  prefs: { sound: boolean; effects: boolean }
  refreshPrefs: () => void
}

const EffectsCtx = createContext<Ctx | null>(null)

type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; rot: number; vr: number; life: number; shape: number }

function ConfettiCanvas({ bursts, onDone }: { bursts: { id: number; opts?: any }[]; onDone: (id: number) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<{ id: number; ps: Particle[] }[]>([])
  const raf = useRef<number>(0)

  useEffect(() => {
    const colors = ['#0071e3', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#5ac8fa', '#ffd60a', '#ffffff']
    for (const b of bursts) {
      if (particlesRef.current.find(x => x.id === b.id)) continue
      const count = b.opts?.particleCount ?? 180
      const ps: Particle[] = []
      const w = window.innerWidth
      for (let i = 0; i < count; i++) {
        // Spawn across the full top width so confetti flows/rains down the whole page
        ps.push({
          x: Math.random() * w,
          y: -20 - Math.random() * window.innerHeight * 0.6,
          vx: (Math.random() - 0.5) * 2.2,
          vy: 2 + Math.random() * 4.5,
          size: 5 + Math.random() * 7,
          color: colors[(Math.random() * colors.length) | 0],
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.25,
          life: 1,
          shape: (Math.random() * 3) | 0,
        })
      }
      particlesRef.current.push({ id: b.id, ps })
    }
  }, [bursts])

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    let last = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(32, t - last) / 16.67; last = t
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const remaining: typeof particlesRef.current = []
      for (const group of particlesRef.current) {
        for (const p of group.ps) {
          // gentle sway and gravity for a smooth top-to-bottom rain
          p.vx += Math.sin((t / 500) + p.x * 0.01) * 0.02 * dt
          p.vx *= 0.995
          p.vy = Math.min(10, p.vy + 0.04 * dt)
          p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt
          if (p.y > canvas.height * 0.85) p.life -= 0.02 * dt
          if (p.y > canvas.height + 30) p.life = 0
          ctx.save()
          ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
          ctx.translate(p.x, p.y); ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          if (p.shape === 0) ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6)
          else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill() }
          else { ctx.beginPath(); ctx.moveTo(0,-p.size/2); ctx.lineTo(p.size/2,p.size/2); ctx.lineTo(-p.size/2,p.size/2); ctx.closePath(); ctx.fill() }
          ctx.restore()
        }
        group.ps = group.ps.filter(p => p.life > 0 && p.y < canvas.height + 40)
        if (group.ps.length > 0) remaining.push(group)
        else onDone(group.id)
      }
      particlesRef.current = remaining
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize) }
  }, [onDone])

  if (typeof document === 'undefined') return null
  return createPortal(<canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />, document.body)
}

export function EffectsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState(getPrefs)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [bursts, setBursts] = useState<{ id: number; opts?: any }[]>([])
  const idRef = useRef(1)

  const refreshPrefs = useCallback(() => setPrefsState(getPrefs()), [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = idRef.current++
    setToasts(ts => [...ts, { ...t, id }])
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 4200)
  }, [])

  const confetti = useCallback((opts?: { particleCount?: number; spread?: number }) => {
    if (!getPrefs().effects) return
    const id = idRef.current++
    setBursts(b => [...b, { id, opts }])
    play('confetti')
  }, [])

  const sfx = useCallback((name: SfxName) => play(name), [])

  const onBurstDone = useCallback((id: number) => setBursts(b => b.filter(x => x.id !== id)), [])

  useEffect(() => {
    const onPrefs = () => refreshPrefs()
    const onCelebrate = (e: any) => {
      const d = e.detail || {}
      if (d.confetti) confetti(typeof d.confetti === 'object' ? d.confetti : d.confettiOpts)
      if (d.sound) sfx(d.sound)
      if (d.toast) toast(d.toast)
    }
    window.addEventListener('netquest:prefs', onPrefs)
    window.addEventListener('netquest:celebrate', onCelebrate as any)
    return () => { window.removeEventListener('netquest:prefs', onPrefs); window.removeEventListener('netquest:celebrate', onCelebrate as any) }
  }, [confetti, sfx, toast, refreshPrefs])

  const value = useMemo(() => ({ confetti, toast, sfx, prefs, refreshPrefs }), [confetti, toast, sfx, prefs, refreshPrefs])

  return (
    <EffectsCtx.Provider value={value}>
      {children}
      <ConfettiCanvas bursts={bursts} onDone={onBurstDone} />
      {typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div key={t.id} initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
                style={{ pointerEvents: 'auto' }}
                className={`min-w-[260px] max-w-sm rounded-2xl border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
                  t.kind === 'achievement' ? 'bg-white border-[#af52de]/30' :
                  t.kind === 'levelup' ? 'bg-white border-[#0071e3]/30' :
                  t.kind === 'success' ? 'bg-white border-[#34c759]/30' : 'bg-white border-black/10'
                }`}>
                <div className="text-[13px] font-semibold text-[#1d1d1f]">
                  {t.kind === 'achievement' ? '🏆 ' : t.kind === 'levelup' ? '⬆️ ' : t.kind === 'success' ? '✨ ' : ''}{t.title}
                </div>
                {t.message && <div className="text-[13px] text-[#6e6e73] mt-0.5 leading-snug">{t.message}</div>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>, document.body
      )}
    </EffectsCtx.Provider>
  )
}

export function useEffects() {
  const v = useContext(EffectsCtx)
  if (!v) throw new Error('EffectsProvider missing')
  return v
}
