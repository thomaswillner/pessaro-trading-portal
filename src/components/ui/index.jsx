import { C, MONO, UI, fmtUSD } from '@/lib/helpers'

// ── Card ──────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: '20px 24px', ...style,
    }}>
      {children}
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────────
export function KPICard({ label, value, sub, color, pct }) {
  return (
    <Card>
      <div style={{ fontSize: 10, color: C.faint, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10, fontFamily: UI }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || C.text, fontFamily: MONO, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{sub}</div>}
      {pct !== undefined && (
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginTop: 10 }}>
          <div style={{ height: '100%', width: `${Math.min(Math.max(pct, 0), 100)}%`, background: color || C.green, borderRadius: 2 }} />
        </div>
      )}
    </Card>
  )
}

// ── Badge BUY/SELL ────────────────────────────────────────────────────────
export function Pill({ type }) {
  const isBuy = type === 'BUY' || type === 'buy'
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 20,
      fontSize: 10, fontWeight: 700, fontFamily: MONO, letterSpacing: '0.5px',
      background: isBuy ? C.greenBg : C.redBg,
      color: isBuy ? C.green : C.red,
    }}>
      {isBuy ? 'BUY' : 'SELL'}
    </span>
  )
}

// ── P&L colored value ─────────────────────────────────────────────────────
export function PnLVal({ v }) {
  return (
    <span style={{ color: v >= 0 ? C.green : C.red, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>
      {v >= 0 ? '+' : '-'}{fmtUSD(v)}
    </span>
  )
}

// ── Symbol dot + name ─────────────────────────────────────────────────────
export function SymbolCell({ symbol, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color || '#888', flexShrink: 0 }} />
      <span style={{ fontFamily: MONO, fontSize: 12 }}>{symbol}</span>
    </div>
  )
}

// ── Table TH ──────────────────────────────────────────────────────────────
export function TH({ children, active, onClick }) {
  return (
    <th onClick={onClick} style={{
      textAlign: 'left', padding: '9px 12px',
      color: active ? C.green : C.faint,
      fontWeight: 500, fontSize: 10, textTransform: 'uppercase',
      letterSpacing: '1px', borderBottom: `1px solid ${C.border}`,
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: UI, userSelect: 'none', whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  )
}

// ── Table TD ──────────────────────────────────────────────────────────────
export function TD({ children, style = {} }) {
  return (
    <td style={{ padding: '9px 12px', borderBottom: `1px solid rgba(80,140,220,0.05)`, ...style }}>
      {children}
    </td>
  )
}

// ── Chart Tooltip ─────────────────────────────────────────────────────────
export function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#091929', border: `1px solid ${C.border}`,
      borderRadius: 8, padding: '10px 14px', fontSize: 12, fontFamily: MONO,
    }}>
      <div style={{ color: C.muted, marginBottom: 5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.text }}>
          {p.name}: ${p.value?.toLocaleString?.()}
        </div>
      ))}
    </div>
  )
}

// ── Stat row (label: value) ────────────────────────────────────────────────
export function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid rgba(80,140,220,0.06)` }}>
      <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 12, color: color || C.text, fontFamily: MONO, fontWeight: 500 }}>{value}</span>
    </div>
  )
}
