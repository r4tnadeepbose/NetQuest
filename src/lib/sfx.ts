export type SfxName = 'tap' | 'flip' | 'correct' | 'wrong' | 'success' | 'levelup' | 'achievement' | 'streak' | 'complete' | 'confetti'

const PREF_KEY = 'netquest_prefs_v1'

export function getPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY)
    if (raw) return { sound: true, effects: true, ...JSON.parse(raw) } as { sound: boolean; effects: boolean }
  } catch {}
  return { sound: true, effects: true }
}

export function setPrefs(p: Partial<{ sound: boolean; effects: boolean }>) {
  const cur = getPrefs()
  const next = { ...cur, ...p }
  try { localStorage.setItem(PREF_KEY, JSON.stringify(next)) } catch {}
  window.dispatchEvent(new CustomEvent('netquest:prefs', { detail: next }))
  return next
}

let ctx: AudioContext | null = null
function getCtx() {
  if (typeof window === 'undefined') return null
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  const c = ctx
  if (c && c.state === 'suspended') c.resume().catch(() => {})
  return c
}

function tone(freq: number, dur = 0.12, type: OscillatorType = 'sine', gain = 0.06, when = 0) {
  const c = getCtx(); if (!c) return
  const t0 = c.currentTime + when
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g); g.connect(c.destination)
  o.start(t0); o.stop(t0 + dur + 0.02)
}

function noise(dur = 0.15, gain = 0.03) {
  const c = getCtx(); if (!c) return
  const bufferSize = Math.floor(c.sampleRate * dur)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  const src = c.createBufferSource(); src.buffer = buffer
  const g = c.createGain(); g.gain.value = gain
  src.connect(g); g.connect(c.destination); src.start()
}

export function play(name: SfxName) {
  if (!getPrefs().sound) return
  try {
    switch (name) {
      case 'tap': tone(520, 0.06, 'sine', 0.04); break
      case 'flip': tone(420, 0.07, 'triangle', 0.04); tone(620, 0.08, 'triangle', 0.03, 0.05); break
      case 'correct':
      case 'success': tone(523.25, 0.09, 'sine', 0.05); tone(659.25, 0.1, 'sine', 0.05, 0.07); tone(783.99, 0.14, 'sine', 0.05, 0.14); break
      case 'wrong': tone(220, 0.12, 'sawtooth', 0.04); tone(185, 0.18, 'sawtooth', 0.035, 0.08); break
      case 'levelup': [523,659,784,1046].forEach((f,i)=>tone(f,0.16,'triangle',0.05,i*0.09)); break
      case 'achievement': [659,784,988,1319].forEach((f,i)=>tone(f,0.18,'sine',0.045,i*0.08)); noise(0.12,0.015); break
      case 'streak': tone(440,0.08,'sine',0.04); tone(554,0.08,'sine',0.04,0.07); tone(659,0.12,'sine',0.045,0.14); break
      case 'complete': [392,523,659,784,1046].forEach((f,i)=>tone(f,0.2,'triangle',0.045,i*0.08)); break
      case 'confetti': tone(880,0.06,'sine',0.03); tone(1174,0.08,'sine',0.03,0.05); break
      default: tone(500,0.08,'sine',0.04)
    }
  } catch {}
}
