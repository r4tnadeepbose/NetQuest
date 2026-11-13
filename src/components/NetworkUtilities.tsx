import { useMemo, useState } from 'react'

function ipToInt(ip: string) { return ip.split('.').map(Number).reduce((a, b) => (a << 8) + b, 0) >>> 0 }
function intToIp(n: number) { return [24, 16, 8, 0].map(s => (n >>> s) & 255).join('.') }

export function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.10')
  const [cidr, setCidr] = useState(24)
  const r = useMemo(() => {
    try {
      const c = Math.min(32, Math.max(0, Number(cidr)))
      const mask = c === 0 ? 0 : (0xffffffff << (32 - c)) >>> 0
      const ipi = ipToInt(ip)
      const net = (ipi & mask) >>> 0
      const bcast = (net | (~mask >>> 0)) >>> 0
      const hosts = c >= 31 ? (c === 31 ? 2 : 1) : Math.pow(2, 32 - c) - 2
      const first = c >= 31 ? net : (net + 1) >>> 0
      const last = c >= 31 ? bcast : (bcast - 1) >>> 0
      return { mask: intToIp(mask), network: intToIp(net), broadcast: intToIp(bcast), first: intToIp(first), last: intToIp(last), hosts }
    } catch { return null }
  }, [ip, cidr])
  return <UtilCard title="Subnetting Calculator" desc="Enter IPv4 and CIDR to compute network details.">
    <div className="flex flex-wrap gap-2 mb-3"><input value={ip} onChange={e => setIp(e.target.value)} className="bg-[#fbfbfd] border border-black/10 rounded px-3 py-2 text-sm" /><input type="number" value={cidr} onChange={e => setCidr(Number(e.target.value))} className="w-24 bg-[#fbfbfd] border border-black/10 rounded px-3 py-2 text-sm" /></div>
    {r && <div className="grid sm:grid-cols-2 gap-2 text-sm">{Object.entries(r).map(([k, v]) => <div key={k} className="border border-black/5 rounded px-3 py-2 flex justify-between"><span className="text-[#6e6e73] capitalize">{k}</span><span className="text-[#1d1d1f] font-mono">{String(v)}</span></div>)}</div>}
  </UtilCard>
}

export function TcpHandshakeStepper() {
  const steps = [
    { t: '1. SYN', d: 'Client → Server: SYN, Seq=x. Client requests connection and synchronizes sequence number.' },
    { t: '2. SYN-ACK', d: 'Server → Client: SYN, ACK, Seq=y Ack=x+1. Server acknowledges and synchronizes its own sequence.' },
    { t: '3. ACK', d: 'Client → Server: ACK, Seq=x+1 Ack=y+1. Connection established; data transfer can begin.' },
  ]
  const [i, setI] = useState(0)
  return <UtilCard title="TCP Three-Way Handshake" desc="Step through connection establishment.">
    <div className="flex items-center justify-between mb-3 text-sm text-[#1d1d1f]/80"><span>Step {i + 1} / 3</span><div className="flex gap-2"><button onClick={() => setI(v => Math.max(0, v - 1))} className="px-3 py-1.5 border border-black/10 rounded">Prev</button><button onClick={() => setI(v => Math.min(2, v + 1))} className="px-3 py-1.5 border border-black/10 rounded">Next</button></div></div>
    <div className="rounded-xl border border-cyan-900/50 bg-[#fbfbfd] p-4"><div className="text-[#0071e3] font-semibold mb-1">{steps[i].t}</div><div className="text-[#1d1d1f] text-sm">{steps[i].d}</div></div>
    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">{steps.map((s, idx) => <div key={s.t} className={`p-2 rounded border ${idx === i ? 'border-[#0071e3]/40 bg-[#0071e3]/10' : 'border-black/5 text-[#6e6e73]'}`}>{s.t}</div>)}</div>
  </UtilCard>
}

export function EncapsulationVisual() {
  const layers = [['Application', 'Data (e.g. HTTP)'], ['Transport', 'TCP/UDP Segment (ports, seq/ack)'], ['Network', 'IP Packet (src/dst IP, TTL)'], ['Data Link', 'Frame (src/dst MAC, FCS)'], ['Physical', 'Bits/signals on medium']]
  return <UtilCard title="Encapsulation Visual" desc="Data gains headers as it moves down the stack (simplified).">
    <div className="space-y-2">{layers.map(([l, d], idx) => <div key={l} className="flex items-center gap-3"><div className="w-36 text-sm text-[#0071e3]">{l}</div><div className="flex-1 border border-black/10 rounded px-3 py-2 text-sm text-[#1d1d1f] bg-[#fbfbfd]" style={{ marginLeft: idx * 6 }}>{d}</div></div>)}</div>
  </UtilCard>
}

export function FirewallRuleSimulator() {
  const [allow443, setAllow443] = useState(true)
  const [allow22, setAllow22] = useState(false)
  const packets = [{ name: 'HTTPS to 443', port: 443 }, { name: 'SSH to 22', port: 22 }, { name: 'HTTP to 80', port: 80 }]
  const allowed = (p: number) => (p === 443 && allow443) || (p === 22 && allow22)
  return <UtilCard title="Firewall Rule Simulator" desc="Toggle simple inbound rules and observe packet decisions.">
    <div className="flex gap-4 mb-3 text-sm flex-wrap"><label className="flex items-center gap-2"><input type="checkbox" checked={allow443} onChange={e => setAllow443(e.target.checked)} /> Allow TCP 443</label><label className="flex items-center gap-2"><input type="checkbox" checked={allow22} onChange={e => setAllow22(e.target.checked)} /> Allow TCP 22</label></div>
    <div className="space-y-2">{packets.map(p => <div key={p.port} className="flex justify-between border border-black/5 rounded px-3 py-2 text-sm"><span className="text-[#1d1d1f]">{p.name}</span><span className={allowed(p.port) ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>{allowed(p.port) ? 'ALLOW' : 'DENY (default drop)'}</span></div>)}</div>
  </UtilCard>
}

function UtilCard({ title, desc, children }: { title: string; desc: string; children: any }) {
  return <div className="rounded-2xl border border-black/5 bg-white p-4"><h3 className="text-base font-semibold text-[#1d1d1f]">{title}</h3><p className="text-sm text-[#6e6e73] mb-3">{desc}</p>{children}</div>
}
