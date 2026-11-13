import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { categories, simulations, simsByCategory } from '../vislab/catalog'
import { SimulationPlayer } from '../vislab/engine'
import type { SimCategory, SimDefinition } from '../vislab/types'
import { ErrorBoundary } from '../components/ErrorBoundary'

export default function Visualizer() {
  const [params, setParams] = useSearchParams()
  const initial = simulations.find(s => s.id === params.get('sim')) || simulations[0]
  const [cat, setCat] = useState<SimCategory>(initial?.category || 'dns-internet')
  const [selected, setSelected] = useState<SimDefinition | null>(initial || simulations[0])

  useEffect(() => {
    const id = params.get('sim')
    if (!id) return
    const found = simulations.find(s => s.id === id)
    if (found) { setCat(found.category); setSelected(found) }
  }, [params])

  const list = useMemo(() => simsByCategory(cat), [cat])

  const pick = (sim: SimDefinition) => {
    setCat(sim.category)
    setSelected(sim)
    setParams({ sim: sim.id })
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] flex flex-col">
      <header className="shrink-0 h-12 border-b border-black/5 bg-white/90 backdrop-blur-xl px-4 md:px-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/visual-lab" className="inline-flex items-center gap-1.5 text-[13px] text-[#0071e3] hover:text-[#0077ed] font-medium shrink-0">
            <ArrowLeft size={16} /> Visual Lab
          </Link>
          <span className="text-black/15">|</span>
          <span className="text-[13px] font-medium text-[#1d1d1f] truncate">{selected?.title || 'Visualizer'}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={cat}
              onChange={(e) => {
                const next = e.target.value as SimCategory
                setCat(next)
                const first = simsByCategory(next)[0]
                if (first) pick(first)
                else {
                  setSelected(null)
                  setParams({})
                }
              }}
              className="appearance-none rounded-lg border border-black/10 bg-[#fbfbfd] pl-2.5 pr-7 py-1.5 text-[12px] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/25 max-w-[180px]"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#86868b]" />
          </div>
          <div className="relative">
            <select
              value={selected?.id || ''}
              onChange={(e) => {
                const found = simulations.find(s => s.id === e.target.value)
                if (found) pick(found)
              }}
              disabled={list.length === 0}
              className="appearance-none rounded-lg border border-black/10 bg-[#fbfbfd] pl-2.5 pr-7 py-1.5 text-[12px] font-medium text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/25 max-w-[220px] disabled:opacity-50"
            >
              {list.length === 0 && <option value="">No simulations</option>}
              {list.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#86868b]" />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden">
        {selected ? (
          <ErrorBoundary>
            <SimulationPlayer key={selected.id} sim={selected} layout="split" />
          </ErrorBoundary>
        ) : (
          <div className="h-full flex items-center justify-center text-[#6e6e73]">Select a simulation to visualize.</div>
        )}
      </main>
    </div>
  )
}