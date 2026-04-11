// ── THEME ─────────────────────────────────────────────────────────────────
export const C = {
  bg:       '#020c1a',
  surface:  '#071628',
  card:     '#0a1e33',
  border:   'rgba(80,140,220,0.14)',
  green:    '#00e5a0',
  greenBg:  'rgba(0,229,160,0.10)',
  blue:     '#4d90ff',
  blueBg:   'rgba(77,144,255,0.10)',
  red:      '#ff4d6a',
  redBg:    'rgba(255,77,106,0.10)',
  amber:    '#ffbb38',
  text:     '#ddeeff',
  muted:    'rgba(150,200,255,0.55)',
  faint:    'rgba(150,200,255,0.28)',
}

export const MONO = "'JetBrains Mono', monospace"
export const UI   = "'Syne', sans-serif"

// ── SYMBOL COLORS ─────────────────────────────────────────────────────────
export const SYM_COLOR = {
  'EUR/USD': '#4d90ff', 'GBP/USD': '#9b72ff', 'XAU/USD': '#ffbb38',
  'NAS100':  '#00e5a0', 'USD/JPY': '#ff4d6a', 'GBP/JPY': '#ff77aa',
  'EUR/JPY': '#a3e635', 'AUD/USD': '#22d3ee', 'BTC/USD': '#fb923c',
  'EUR/GBP': '#c084fc', 'SPX500':  '#60a5fa', 'OIL':     '#fbbf24',
}

// ── FORMATTERS ────────────────────────────────────────────────────────────
export const fmtUSD = v =>
  '$' + Math.abs(v).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtPnl = v => (v >= 0 ? '+' : '-') + fmtUSD(v)

export const fmtPct = v => (v >= 0 ? '+' : '') + v.toFixed(2) + '%'

export const fmtDur = mins =>
  `${Math.floor(mins / 60)}h ${mins % 60}m`

export const fmtDate = ts =>
  new Date(ts).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })

export const fmtTime = ts =>
  new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

export const fmtDateTime = ts => `${fmtDate(ts)} ${fmtTime(ts)}`

// ── STATS ─────────────────────────────────────────────────────────────────
export function computeStats(trades) {
  if (!trades.length) return {}
  const wins   = trades.filter(t => t.profit_loss > 0)
  const losses = trades.filter(t => t.profit_loss < 0)
  const gP     = wins.reduce((s, t) => s + t.profit_loss, 0)
  const gL     = Math.abs(losses.reduce((s, t) => s + t.profit_loss, 0))
  const net    = gP - gL

  let peak = 0, maxDD = 0, running = 0
  trades.forEach(t => {
    running += t.profit_loss
    if (running > peak) peak = running
    const dd = peak > 0 ? (peak - running) / peak * 100 : 0
    if (dd > maxDD) maxDD = dd
  })

  return {
    total:   trades.length,
    wins:    wins.length,
    losses:  losses.length,
    winRate: trades.length ? +(wins.length / trades.length * 100).toFixed(1) : 0,
    net:     +net.toFixed(2),
    gP:      +gP.toFixed(2),
    gL:      +gL.toFixed(2),
    pf:      gL > 0 ? +(gP / gL).toFixed(2) : 0,
    avgW:    wins.length   ? +(gP / wins.length).toFixed(2)  : 0,
    avgL:    losses.length ? +(gL / losses.length).toFixed(2): 0,
    best:    trades.length ? +Math.max(...trades.map(t => t.profit_loss)).toFixed(2) : 0,
    worst:   trades.length ? +Math.min(...trades.map(t => t.profit_loss)).toFixed(2) : 0,
    avgDur:  trades.length ? Math.round(trades.reduce((s, t) => s + (t.duration_mins || 0), 0) / trades.length) : 0,
    maxDD:   +maxDD.toFixed(2),
  }
}

// ── EQUITY CURVE ──────────────────────────────────────────────────────────
export function buildEquityCurve(trades, startBalance = 0) {
  const byDate = new Map()
  let running = startBalance
  trades
    .slice()
    .sort((a, b) => new Date(a.close_time) - new Date(b.close_time))
    .forEach(t => {
      running += t.profit_loss
      const key = fmtDate(new Date(t.close_time))
      byDate.set(key, { date: key, equity: +running.toFixed(2), ts: new Date(t.close_time) })
    })
  return [...byDate.values()].sort((a, b) => a.ts - b.ts)
}

// ── CALENDAR ─────────────────────────────────────────────────────────────
export function buildCalendar(trades, year, month) {
  const map = {}
  trades
    .filter(t => {
      const d = new Date(t.close_time)
      return d.getFullYear() === year && d.getMonth() === month
    })
    .forEach(t => {
      const day = new Date(t.close_time).getDate()
      if (!map[day]) map[day] = { pnl: 0, cnt: 0 }
      map[day].pnl += t.profit_loss
      map[day].cnt++
    })
  return map
}

// ── SYMBOL STATS ──────────────────────────────────────────────────────────
export function buildSymbolStats(trades) {
  const map = {}
  trades.forEach(t => {
    if (!map[t.symbol]) map[t.symbol] = { symbol: t.symbol, cnt: 0, wins: 0, pnl: 0, color: SYM_COLOR[t.symbol] || '#888' }
    map[t.symbol].cnt++
    if (t.profit_loss > 0) map[t.symbol].wins++
    map[t.symbol].pnl += t.profit_loss
  })
  return Object.values(map)
    .map(s => ({ ...s, pnl: +s.pnl.toFixed(2), wr: +(s.wins / s.cnt * 100).toFixed(0) }))
    .sort((a, b) => b.pnl - a.pnl)
}

// ── HEATMAP ───────────────────────────────────────────────────────────────
export function buildHeatmap(trades) {
  const map = {}
  trades.forEach(t => {
    const d = new Date(t.open_time)
    const k = `${d.getDay()}-${d.getHours()}`
    if (!map[k]) map[k] = { cnt: 0, pnl: 0 }
    map[k].cnt++
    map[k].pnl += t.profit_loss
  })
  return map
}

// ── CSV EXPORT ────────────────────────────────────────────────────────────
export function exportCSV(trades) {
  const header = 'ID,Símbolo,Tipo,Lotes,Apertura,Cierre,Duración,P&L,Balance\n'
  const rows = trades.map(t =>
    [t.id, t.symbol, t.position_type, t.lots,
     fmtDateTime(new Date(t.open_time)),
     fmtDateTime(new Date(t.close_time)),
     fmtDur(t.duration_mins || 0), t.profit_loss, t.running_balance
    ].join(',')
  ).join('\n')
  const url = URL.createObjectURL(new Blob([header + rows], { type: 'text/csv' }))
  Object.assign(document.createElement('a'), { href: url, download: 'trades_pessaro.csv' }).click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
