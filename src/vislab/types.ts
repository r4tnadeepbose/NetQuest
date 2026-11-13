export type SimCategory =
  | 'fundamentals' | 'osi' | 'tcpip' | 'protocols' | 'dns-internet'
  | 'routing-switching' | 'subnetting' | 'wireless' | 'security-arch'
  | 'red-team' | 'blue-team' | 'vapt' | 'cloud' | 'enterprise'

export interface SimDevice {
  id: string
  label: string
  kind: string
  x: number
  y: number
  w?: number
  h?: number
  meta?: Record<string, string>
  role?: 'client' | 'server' | 'router' | 'switch' | 'attacker' | 'defender' | 'dns' | 'cloud' | 'other'
}

export interface SimLink {
  id: string
  from: string
  to: string
  label?: string
  dashed?: boolean
  curve?: number
}

export interface SimPacket {
  id: string
  label: string
  color?: string
  protocol?: string
  fields?: Record<string, string>
  explanation?: string
}

export interface SimEvent {
  id: string
  at: number        // ms start
  dur: number       // ms travel
  from: string      // device id
  to: string        // device id
  packet: SimPacket
  activate?: string[] // device ids to highlight on arrival
  stepTitle?: string
  stepDetail?: string
  layer?: string
  mode?: 'request' | 'response' | 'attack' | 'defense'
}

export interface SimDefinition {
  id: string
  title: string
  category: SimCategory
  summary: string
  description: string
  devices: SimDevice[]
  links: SimLink[]
  events: SimEvent[]
  totalDuration: number
  beginner: string[]
  advanced: string[]
  failureNote?: string
  perspectives?: ('red'|'blue'|'normal')[]
  tags?: string[]
}