export const LEVELS = [
  'Network Explorer','Packet Apprentice','Protocol Analyst','Switching Specialist','Routing Engineer',
  'Network Defender','Traffic Investigator','Security Architect','Network Expert','Network Master'
]

export function levelFromXp(xp: number) {
  // 0-499 -> 1, 500-1199 -> 2 etc.
  const thresholds = [0,500,1200,2200,3500,5200,7400,10200,13800,18500]
  let lvl = 1
  for (let i=0;i<thresholds.length;i++) if (xp >= thresholds[i]) lvl = i+1
  return Math.min(10, lvl)
}

export function xpForRating(r: 'again'|'hard'|'good'|'easy') {
  return r==='again'?2 : r==='hard'?6 : r==='good'?10 : 15
}