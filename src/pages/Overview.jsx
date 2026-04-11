import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAccount } from '@/hooks/useAccount'
import { useTrades }  from '@/hooks/useTrades'
import { C, UI, MONO, SYM_COLOR, fmtUSD, fmtPnl, computeStats, buildEquityCurve } from '@/lib/helpers'
import { KPICard, Card, Pill, PnLVal, TH, TD, SymbolCell, ChartTip, StatRow } from '@/components/ui'

export default function Overview({ userId }) {
  const { account, positions, loading: accLoading } = useAccount(userId)
  const { trades,  loading: trLoading }             = useTrades(account?.id)

  const stats = useMemo(() => computeStats(trades), [trades])
  const curve = useMemo(() => buildEquityCurve(trades, account?.initial_balance || 0), [trades, account])

  if (accLoading) return <Spinner />

  const bal      = account?.balance         ?? 24850
  const equity   = account?.equity          ?? 25312.4
  const free     = account?.free_margin     ?? 18740
  const used     = account?.margin_used     ?? 6572
  const floating = account?.floating_pnl   ?? 462.4
  const initial  = account?.initial_balance ?? 22000
  const returnPct = initial > 0 ? ((bal - initial) / initial * 100).toFixed(2) : 0

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Resumen de cuenta</h1>
          <div style={{ fontSize: 12, color: C.muted }}>
            {account?.account_number ?? 'MT4-284751'} · {account?.broker ?? 'Pessaro Capital'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: C.greenBg, border: `1px solid rgba(0,229,160,0.25)`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: C.green }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          En vivo
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14, marginBottom: 20 }}>
        <KPICard label="Balance"        value={fmtUSD(bal)}    sub={`${account?.currency ?? 'USD'} · Cuenta real`} />
        <KPICard label="Equity"         value={fmtUSD(equity)} sub={`${fmtPnl(floating)} flotante`} color={C.green} />
        <KPICard label="Margen libre"   value={fmtUSD(free)}   sub={`Usado: ${fmtUSD(used)}`} color={C.blue} pct={free / (free + used) * 100} />
        <KPICard label="Rendimiento"    value={`+${returnPct}%`} sub="Desde inicio" color={C.green} />
      </div>

      {/* Equity curve + métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 18 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Equity Curve</div>
            <div style={{ fontSize: 11, color: C.faint, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: C.green }}>—</span> Equity
            </div>
          </div>
          {curve.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={curve} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gEq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.green} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(80,140,220,0.08)" />
                <XAxis dataKey="date" tick={{ fill: C.faint, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false} interval={Math.max(1, Math.floor(curve.length / 6))} />
                <YAxis tick={{ fill: C.faint, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="equity" name="Equity" stroke={C.green} strokeWidth={2} fill="url(#gEq)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="Sin datos de equity aún" />
          )}
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Métricas clave</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['Ganancia neta', stats.total ? fmtPnl(stats.net)          : '—', C.green],
              ['Win rate',      stats.total ? `${stats.winRate}%`         : '—', C.green],
              ['Drawdown',      stats.total ? `-${stats.maxDD}%`          : '—', C.red  ],
              ['Profit factor', stats.total ? stats.pf                    : '—', '#ffbb38'],
              ['Operaciones',   stats.total ?? '—',                              C.text ],
              ['Media P&L',     stats.total ? `+$${(stats.net / stats.total).toFixed(0)}` : '—', C.green],
            ].map(([k, v, c]) => (
              <div key={k} style={{ background: 'rgba(80,140,220,0.05)', borderRadius: 8, padding: '9px 12px' }}>
                <div style={{ fontSize: 9, color: C.faint, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 5, fontFamily: UI }}>{k}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: c, fontFamily: MONO }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.faint, marginBottom: 5 }}>
              <span>Nivel de margen</span>
              <span style={{ color: C.green }}>{account?.margin_level?.toFixed(1) ?? '384.7'}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${Math.min(72, 100)}%`, background: `linear-gradient(90deg,${C.green},${C.blue})`, borderRadius: 2 }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Posiciones abiertas */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            Posiciones abiertas
            <span style={{ color: C.green, fontSize: 11, marginLeft: 8, fontFamily: MONO }}>{positions.length}</span>
          </div>
        </div>
        {positions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 12, color: C.faint }}>No hay posiciones abiertas</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Símbolo','Tipo','Lotes','Apertura','Actual','SL','TP','P&L Flotante'].map(h => <TH key={h}>{h}</TH>)}</tr>
              </thead>
              <tbody>
                {positions.map(p => (
                  <tr key={p.id}>
                    <TD><SymbolCell symbol={p.symbol} color={SYM_COLOR[p.symbol]} /></TD>
                    <TD><Pill type={p.position_type} /></TD>
                    <TD><span style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>{p.lots}</span></TD>
                    <TD><span style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>{p.open_price}</span></TD>
                    <TD><span style={{ fontFamily: MONO, fontSize: 12 }}>{p.current_price ?? '—'}</span></TD>
                    <TD><span style={{ fontFamily: MONO, fontSize: 12, color: C.red,   opacity: 0.85 }}>{p.stop_loss   ?? '—'}</span></TD>
                    <TD><span style={{ fontFamily: MONO, fontSize: 12, color: C.green, opacity: 0.85 }}>{p.take_profit ?? '—'}</span></TD>
                    <TD><PnLVal v={p.profit_loss ?? 0} /></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function Spinner() {
  return <div style={{ textAlign: 'center', padding: 40, color: C.faint, fontFamily: MONO, fontSize: 12 }}>Cargando…</div>
}
function EmptyChart({ label }) {
  return <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.faint, fontSize: 12 }}>{label}</div>
}
