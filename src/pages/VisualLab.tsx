import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, simulations, simsByCategory } from '../vislab/catalog'
import type { SimCategory } from '../vislab/types'
import { PlayCircle, ArrowRight } from 'lucide-react'

export default function VisualLab() {
  const [cat, setCat] = useState<SimCategory>('dns-internet')
  const list = useMemo(() => simsByCategory(cat), [cat])

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8 pb-8">
      <header className="pt-1">
        <p className="text-[12px] font-medium tracking-wide text-[#0071e3] uppercase">NetQuest</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f] mt-1">Visual Lab</h1>
        <p className="text-[#6e6e73] mt-2 max-w-2xl text-[15px] leading-relaxed">Interactive, animated simulations that show how networks, protocols, and security flows work. Open a topic in the dedicated visualizer for a clear, focused view.</p>
      </header>

      <section className="rounded-3xl border border-black/5 bg-white p-5 md:p-6 shadow-[0_1px_10px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Browse by category</h2>
          <span className="text-[12px] text-[#86868b]">{simulations.length} simulations</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition border ${cat===c.id ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]' : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-[#ececef]'}`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <h2 className="text-lg font-semibold text-[#1d1d1f]">{categories.find(c=>c.id===cat)?.title}</h2>
            <p className="text-[13px] text-[#6e6e73]">{categories.find(c=>c.id===cat)?.desc}</p>
          </div>
          <div className="text-[12px] text-[#86868b]">{list.length} available</div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-[#6e6e73]">
            More simulations for this category are coming soon. Try DNS and Internet Communication, Network Protocol Visualizer, OSI, TCP/IP, or Red Team.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(s => (
              <Link
                key={s.id}
                to={`/visualizer?sim=${encodeURIComponent(s.id)}`}
                className="group rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:border-black/10 transition flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
                    <PlayCircle size={20} />
                  </div>
                  <span className="text-[11px] text-[#86868b] bg-[#f5f5f7] px-2 py-1 rounded-full">4:3 model</span>
                </div>
                <h3 className="mt-4 text-[16px] font-semibold text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition-colors">{s.title}</h3>
                <p className="mt-1.5 text-[13px] text-[#6e6e73] leading-relaxed flex-1">{s.summary}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0071e3]">
                  Open visualizer <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="text-[12px] text-[#86868b] px-1">Simulations run in a dedicated, focused visualizer page for easier understanding. Security scenarios are shown for authorized, isolated lab learning only.</p>
    </div>
  )
}