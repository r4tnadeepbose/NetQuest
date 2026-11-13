import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, Layers, BookOpen, Swords, ListChecks, FlaskConical, BarChart3, Trophy, Settings, Crosshair, Shield, Wrench, Route, Flag, Workflow } from 'lucide-react'
import { useStore } from '../store'
import { LEVELS } from '../lib/levels'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/daily', label: 'Daily Learning', icon: CalendarCheck },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/curriculum', label: 'Curriculum', icon: BookOpen },
  { to: '/visual-lab', label: 'Visual Lab', icon: Workflow },
  { to: '/red-team', label: 'Red Team', icon: Crosshair },
  { to: '/blue-team', label: 'Blue Team', icon: Shield },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/tracks', label: 'Tracks', icon: Route },
  { to: '/capstones', label: 'Capstones', icon: Flag },
  { to: '/challenges', label: 'Challenges', icon: Swords },
  { to: '/mcq', label: 'MCQ Arena', icon: ListChecks },
  { to: '/labs', label: 'Labs', icon: FlaskConical },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Layout() {
  const { progress } = useStore()
  const levelName = LEVELS[progress.level - 1] || 'Network Master'
  return (
    <div className="min-h-screen flex bg-[#f5f5f7] text-[#1d1d1f]">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 h-screen">
        <div className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center text-sm font-semibold tracking-tight">NQ</div>
            <div>
              <div className="font-semibold text-[17px] tracking-tight leading-tight">NetQuest</div>
              <div className="text-[12px] text-[#6e6e73]">Cyber Mastery</div>
            </div>
          </div>
          <div className="mt-5 p-3 rounded-2xl bg-[#f5f5f7]">
            <div className="text-[12px] text-[#6e6e73]">Level {progress.level} · {levelName}</div>
            <div className="mt-2 h-1.5 rounded-full bg-black/10 overflow-hidden"><div className="h-full bg-[#0071e3] rounded-full" style={{ width: `${Math.min(100, (progress.xp % 1000) / 10)}%` }} /></div>
            <div className="mt-2 flex justify-between text-[12px] text-[#6e6e73]"><span>{progress.xp} XP</span><span>{progress.streak} day streak</span></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {nav.map(n => <NavLink key={n.to} to={n.to} end={n.to==='/'}
            className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-2xl text-[14px] transition ${isActive ? 'bg-[#0071e3] text-white shadow-sm' : 'text-[#1d1d1f]/80 hover:bg-black/5'}`}>
            {({isActive}) => (<><n.icon size={17} strokeWidth={isActive?2.2:1.8} /> <span className={isActive?'font-medium':'font-normal'}>{n.label}</span></>)}
          </NavLink>)}
        </nav>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">NetQuest</div>
          <div className="text-[12px] text-[#6e6e73]">Lvl {progress.level} · {progress.xp} XP</div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-10 md:py-10 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
        <nav className="lg:hidden sticky bottom-0 border-t border-black/5 bg-white/80 backdrop-blur-xl grid grid-cols-5 gap-1 px-2 py-1 text-[10px]">
          {[nav[0], nav[1], nav[4], nav[10], nav[14]].map(n => <NavLink key={n.to} to={n.to} end={n.to==='/'} className={({isActive})=>`flex flex-col items-center py-2 rounded-2xl ${isActive?'text-[#0071e3]':'text-[#6e6e73]'}`}>{({isActive})=>(<><n.icon size={18} strokeWidth={isActive?2.2:1.8}/><span className="mt-0.5">{n.label.split(' ')[0]}</span></>)}</NavLink>)}
        </nav>
      </div>
    </div>
  )
}