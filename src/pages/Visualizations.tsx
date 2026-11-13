import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type VizId = 'dns' | 'http' | 'tcp' | 'encap' | 'dhcp'

const VIZ: { id: VizId; title: string; desc: string }[] = [
  { id: 'dns', title: 'DNS Resolution', desc: 'How a domain name becomes an IP address.' },
  { id: 'http', title: 'Web Request Flow', desc: 'From URL to server response over the network.' },
  { id: 'tcp', title: 'TCP 3-Way Handshake', desc: 'How a reliable connection is established.' },
  { id: 'encap', title: 'Data Encapsulation', desc: 'How data is wrapped as it moves down the stack.' },
  { id: 'dhcp', title: 'DHCP (DORA)', desc: 'How a device gets network configuration.' },
]

export default function Visualizations() {
  const [active, setActive] = useState<VizId>('dns')
  const current = VIZ.find(v => v.id === active)!
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f]">Visual Flows</h1>
        <p className="text-[#6e6e73] mt-2 max-w-3xl">Animated, continuously flowing models of core networking concepts. Watch how requests, packets, and handshakes move step by step.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {VIZ.map(v => (
          <button key={v.id} onClick={() => setActive(v.id)}
            className={`px-4 py-2 rounded-full border text-sm transition ${active===v.id ? 'bg-[#0071e3] text-white border-[#0071e3]' : 'bg-white border-black/10 text-[#1d1d1f]/80 hover:bg-[#f5f5f7]'}`}>
            {v.title}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-5 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{current.title}</h2>
          <p className="text-[#6e6e73]">{current.desc}</p>
        </div>
        <div className="w-full overflow-hidden rounded-2xl bg-[#f5f5f7] border border-black/5">
          {active === 'dns' && <DnsFlow />}
          {active === 'http' && <HttpFlow />}
          {active === 'tcp' && <TcpFlow />}
          {active === 'encap' && <EncapFlow />}
          {active === 'dhcp' && <DhcpFlow />}
        </div>
      </div>
    </div>
  )
}

function NodeBox({ x, y, w=150, h=64, title, sub, color = '#0071e3' }: { x:number;y:number;w?:number;h?:number;title:string;sub?:string;color?:string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h} rx={16} fill="white" stroke="rgba(0,0,0,0.08)" />
      <circle cx={18} cy={h/2} r={6} fill={color} />
      <text x={34} y={h/2 - 4} fontSize={13} fontWeight={600} fill="#1d1d1f">{title}</text>
      {sub && <text x={34} y={h/2 + 14} fontSize={11} fill="#6e6e73">{sub}</text>}
    </g>
  )
}

function FlowArrow({ d, label, color = '#0071e3', delay = 0, duration = 2.4, reverse = false, dash }: { d: string; label?: string; color?: string; delay?: number; duration?: number; reverse?: boolean; dash?: string }) {
  const pathId = useMemo(() => `p${Math.random().toString(36).slice(2)}`, [])
  return (
    <g>
      <path id={pathId} d={d} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} strokeDasharray={dash} markerEnd="url(#arrow)" />
      <motion.circle r={5} fill={color}>
        <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} path={d} keyPoints={reverse ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear" rotate="auto" />
      </motion.circle>
      {label && (
        <text fontSize={11} fill="#6e6e73">
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">{label}</textPath>
        </text>
      )}
    </g>
  )
}

function SvgDefs() {
  return (
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="rgba(0,0,0,0.25)" />
      </marker>
      <linearGradient id="flowGrad" x1="0" x2="1">
        <stop offset="0%" stopColor="#0071e3" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#34c759" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  )
}

function DnsFlow() {
  // Browser -> Resolver -> Root -> TLD -> Authoritative and back
  return (
    <svg viewBox="0 0 1000 420" className="w-full h-[360px] md:h-[420px]">
      <SvgDefs />
      <rect x="20" y="20" width="960" height="380" rx="18" fill="url(#flowGrad)" opacity="0.15" />
      <NodeBox x={40} y={170} title="You / Browser" sub="www.example.com" color="#1d1d1f" />
      <NodeBox x={240} y={170} title="Recursive Resolver" sub="ISP / DNS cache" color="#0071e3" />
      <NodeBox x={500} y={40} title="Root Server" sub="." color="#af52de" />
      <NodeBox x={720} y={170} title="TLD Server" sub=".com" color="#ff9f0a" />
      <NodeBox x={500} y={300} title="Authoritative" sub="example.com" color="#34c759" />

      {/* request path */}
      <FlowArrow d="M190,202 C210,202 220,202 240,202" label="1. query" delay={0} duration={1.8} />
      <FlowArrow d="M390,186 C430,140 460,110 500,90" label="2. ask root" delay={0.6} duration={2.2} />
      <FlowArrow d="M575,105 C640,140 680,160 720,185" label="3. go to .com" delay={1.2} duration={2.2} />
      <FlowArrow d="M760,234 C700,270 640,295 575,315" label="4. ask auth" delay={1.8} duration={2.2} />
      {/* response path */}
      <FlowArrow d="M500,320 C440,290 410,250 390,225" label="5. IP answer" color="#34c759" delay={2.6} duration={2.2} />
      <FlowArrow d="M240,214 C220,214 210,214 190,214" label="6. result" color="#34c759" delay={3.4} duration={1.8} />

      <motion.g initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
        <text x={500} y={395} textAnchor="middle" fontSize={12} fill="#6e6e73">Continuous flow: cached answers may skip steps 2–4</text>
      </motion.g>
    </svg>
  )
}

function HttpFlow() {
  return (
    <svg viewBox="0 0 1000 360" className="w-full h-[320px] md:h-[360px]">
      <SvgDefs />
      <NodeBox x={40} y={140} w={160} title="Browser" sub="Enter URL" color="#1d1d1f" />
      <NodeBox x={300} y={40} w={160} title="DNS" sub="Resolve name" color="#af52de" />
      <NodeBox x={300} y={240} w={160} title="TCP/TLS" sub="Connect securely" color="#ff9f0a" />
      <NodeBox x={560} y={140} w={170} title="Server / CDN" sub="Process request" color="#0071e3" />
      <NodeBox x={800} y={140} w={150} title="Web Page" sub="Render content" color="#34c759" />

      <FlowArrow d="M200,150 C240,110 260,90 300,75" label="resolve" delay={0} duration={2} />
      <FlowArrow d="M380,104 C420,130 480,150 560,165" label="IP found" color="#34c759" delay={0.8} duration={2} />
      <FlowArrow d="M200,190 C240,220 260,250 300,265" label="handshake" delay={0.3} duration={2.2} />
      <FlowArrow d="M460,265 C500,230 520,210 560,190" label="secure channel" color="#ff9f0a" delay={1.2} duration={2} />
      <FlowArrow d="M730,172 C760,172 780,172 800,172" label="HTTP response" color="#34c759" delay={2.0} duration={1.8} />
      <FlowArrow d="M800,190 C760,220 520,300 200,200" label="load assets / render" color="#0071e3" delay={2.8} duration={3.2} dash="6 6" />
      <motion.text x={500} y={340} textAnchor="middle" fontSize={12} fill="#6e6e73" animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 3, repeat: Infinity }}>Requests and responses flow continuously as resources are fetched</motion.text>
    </svg>
  )
}

function TcpFlow() {
  return (
    <svg viewBox="0 0 1000 340" className="w-full h-[300px] md:h-[340px]">
      <SvgDefs />
      <NodeBox x={120} y={130} w={180} h={80} title="Client" sub="Initiates connection" color="#0071e3" />
      <NodeBox x={700} y={130} w={180} h={80} title="Server" sub="Listens for clients" color="#34c759" />

      {/* SYN */}
      <path d="M300,150 C450,90 550,90 700,150" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} markerEnd="url(#arrow)" />
      <motion.g>
        <motion.circle r={6} fill="#0071e3">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="0s" path="M300,150 C450,90 550,90 700,150" />
        </motion.circle>
      </motion.g>
      <text x={500} y={88} textAnchor="middle" fontSize={12} fill="#1d1d1f" fontWeight={600}>1. SYN (seq=x)</text>

      {/* SYN-ACK */}
      <path d="M700,175 C550,235 450,235 300,175" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} markerEnd="url(#arrow)" />
      <motion.circle r={6} fill="#ff9f0a">
        <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.7s" path="M700,175 C550,235 450,235 300,175" />
      </motion.circle>
      <text x={500} y={252} textAnchor="middle" fontSize={12} fill="#1d1d1f" fontWeight={600}>2. SYN-ACK (seq=y, ack=x+1)</text>

      {/* ACK */}
      <path d="M300,165 C450,165 550,165 700,165" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} strokeDasharray="6 6" markerEnd="url(#arrow)" />
      <motion.circle r={6} fill="#34c759">
        <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.4s" path="M300,165 C450,165 550,165 700,165" />
      </motion.circle>
      <text x={500} y={156} textAnchor="middle" fontSize={12} fill="#1d1d1f" fontWeight={600}>3. ACK (ack=y+1)</text>

      <motion.rect x={360} y={270} width={280} height={36} rx={18} fill="#34c759" opacity={0.12}
        animate={{ opacity: [0.08, 0.18, 0.08] }} transition={{ duration: 2.2, repeat: Infinity }} />
      <text x={500} y={293} textAnchor="middle" fontSize={13} fill="#248a3d" fontWeight={600}>Connection established → data can flow</text>
    </svg>
  )
}

function EncapFlow() {
  const layers = [
    { name: 'Application', ex: 'HTTP Data', c: '#af52de', w: 260 },
    { name: 'Transport', ex: 'TCP Header + Data', c: '#0071e3', w: 360 },
    { name: 'Network', ex: 'IP Header + Segment', c: '#ff9f0a', w: 460 },
    { name: 'Data Link', ex: 'Frame Header + Packet + FCS', c: '#34c759', w: 560 },
    { name: 'Physical', ex: 'Bits / Signals', c: '#1d1d1f', w: 660 },
  ]
  return (
    <svg viewBox="0 0 1000 380" className="w-full h-[340px] md:h-[380px]">
      <SvgDefs />
      <text x={500} y={30} textAnchor="middle" fontSize={14} fill="#6e6e73">Sender: data moves down and gets wrapped at each layer</text>
      {layers.map((l, i) => {
        const y = 50 + i * 58
        const x = 170 + i * 18
        return (
          <g key={l.name}>
            <motion.rect x={x} y={y} width={l.w} height={42} rx={12} fill="white" stroke={l.c} strokeWidth={2}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} />
            <text x={x + 14} y={y + 18} fontSize={12} fontWeight={600} fill="#1d1d1f">{l.name}</text>
            <text x={x + 14} y={y + 33} fontSize={11} fill="#6e6e73">{l.ex}</text>
            <motion.circle cx={x + l.w - 18} cy={y + 21} r={5} fill={l.c}
              animate={{ cy: [y + 21, y + 21, y + 21], opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }} />
          </g>
        )
      })}
      {/* flowing packet down */}
      {[0,1,2,3].map(i => (
        <motion.circle key={i} r={5} fill="#0071e3">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin={`${i * 0.8}s`} path="M120,70 L140,128 L158,186 L176,244 L194,302 L220,340" />
        </motion.circle>
      ))}
      <text x={120} y={360} textAnchor="middle" fontSize={12} fill="#6e6e73">Encapsulate ↓</text>
      <text x={880} y={360} textAnchor="middle" fontSize={12} fill="#6e6e73">↑ Decapsulate at receiver</text>
    </svg>
  )
}

function DhcpFlow() {
  return (
    <svg viewBox="0 0 1000 360" className="w-full h-[320px] md:h-[360px]">
      <SvgDefs />
      <NodeBox x={120} y={140} w={170} h={80} title="Client Device" sub="Needs IP config" color="#1d1d1f" />
      <NodeBox x={700} y={140} w={170} h={80} title="DHCP Server" sub="Manages IP pool" color="#0071e3" />

      <path d="M290,155 C430,80 570,80 700,155" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} markerEnd="url(#arrow)" />
      <motion.circle r={6} fill="#af52de"><animateMotion dur="2.6s" repeatCount="indefinite" begin="0s" path="M290,155 C430,80 570,80 700,155" /></motion.circle>
      <text x={500} y={78} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1d1d1f">1. Discover (broadcast)</text>

      <path d="M700,175 C570,120 430,120 290,175" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} markerEnd="url(#arrow)" />
      <motion.circle r={6} fill="#ff9f0a"><animateMotion dur="2.6s" repeatCount="indefinite" begin="0.65s" path="M700,175 C570,120 430,120 290,175" /></motion.circle>
      <text x={500} y={132} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1d1d1f">2. Offer (IP, mask, gateway)</text>

      <path d="M290,190 C430,250 570,250 700,190" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} markerEnd="url(#arrow)" />
      <motion.circle r={6} fill="#0071e3"><animateMotion dur="2.6s" repeatCount="indefinite" begin="1.3s" path="M290,190 C430,250 570,250 700,190" /></motion.circle>
      <text x={500} y={252} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1d1d1f">3. Request (accept offer)</text>

      <path d="M700,205 C570,300 430,300 290,205" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2.5} markerEnd="url(#arrow)" />
      <motion.circle r={6} fill="#34c759"><animateMotion dur="2.6s" repeatCount="indefinite" begin="1.95s" path="M700,205 C570,300 430,300 290,205" /></motion.circle>
      <text x={500} y={314} textAnchor="middle" fontSize={12} fontWeight={600} fill="#1d1d1f">4. Acknowledge (lease confirmed)</text>

      <motion.text x={500} y={345} textAnchor="middle" fontSize={12} fill="#6e6e73" animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 3, repeat: Infinity }}>DORA cycle repeats for new leases/renewals</motion.text>
    </svg>
  )
}
