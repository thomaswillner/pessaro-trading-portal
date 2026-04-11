import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell } from 'recharts'
import { useAccount } from '@/hooks/useAccount'
import { useTrades }  from '@/hooks/useTrades'
import { C, MONO, fmtDur, buildEquityCurve, buildSymbolStats, buildHeatmap } from '@/lib/helpers'
import { Card } from '@/components/ui'

const HOURS = [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
const DAYS  = ['','Lun','Mar','Mié','Jue','Vie']

export default function Risk({ userId }) {
  const { account }         = useAccount(userId)
  const { trades, loading } = useTrades(account?.id)

  const curve    = useMemo(() => buildEquityCurve(trades, account?.initial_balance ?? 0), [trades, account])
  const symStats = useMemo(() => buildSymbolStats(trades), [trades])
  const heatmap  = useMemo(() => buildHeatmap(trades), [trades])

  const ddSeries = useMemo(() => {
    let peak = 0
    return curve.map(d => {
      if (d.equity > peak) peak = d.equity
      return { date: d.date, dd: peak > 0 ? +(-(peak - d.equity) / peak * 100).toFixed(2) : 0 }
    })
  }, [curve])

  if (loading) return <Spinner />

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Análisis de riesgo</h1>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 22 }}>Drawdown, exposición y distribución temporal</div>

      {/* Drawdown chart */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Drawdown histórico</div>
        <div style={{ fontSize: 11, color: C.faint, marginBottom: 14 }}>Retroceso desde el máximo acumulado</div>
        {ddSeries.length < 2
          ? <EmptyChart label="Sin datos suficientes" />
          : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ddSeries} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gDD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.red} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.red} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(80,140,220,0.08)" />
                <XAxis dataKey="date" tick={{ fill: C.faint, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false} interval={Math.max(1, Math.floor(ddSeries.length / 8))} />
                <YAxis tick={{ fill: C.faint, fontSize: 10, fontFamily: MONO }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={({ active, payload, label }) => active && payload?.length
                  ? <div style={{ background: '#091929', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: MONO, color: C.red }}>{label}: {payload[0].value}%</div>
                  : null} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.18)" />
                <Area type="monotone" dataKey="dd" stroke={C.red} strokeWidth={1.5} fill="url(#gDD)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
      </Card>

      {/* Pie + Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Exposición por símbolo</div>
          {symStats.length === 0
            ? <EmptyChart label="Sin datos" />
            : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={symStats} dataKey="cnt" nameKey="symbol" cx="50%" cy="50%" outerRadius={65} innerRadius={32}>
                      {symStats.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => active && payload?.length
                      ? <div style={{ background: '#091929', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                          <div style={{ color: '#fff' }}>{payload[0].name}</div>
                          <div style={{ color: C.muted, fontFamily: MONO }}>{payload[0].value} ops</div>
                        </div>
                      : null} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 10px', marginTop: 8 }}>
                  {symStats.map(s => (
                    <div key={s.symbol} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: C.faint }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />{s.symbol}
                    </div>
                  ))}
                </div>
              </>
            )}
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Mapa de calor: hora × día</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
              <thead>
                <tr>
                  <th style={{ width: 36, color: C.faint, fontSize: 10, fontFamily: MONO, fontWeight: 400 }} />
                  {HOURS.map(h => <th key={h} style={{ color: C.faint, fontSize: 10, fontFamily: MONO, fontWeight: 400, textAlign: 'center', width: 30, padding: '2px' }}>{h}h</th>)}
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map(dow => (
                  <tr key={dow}>
                    <td style={{ fontSize: 10, color: C.muted, fontFamily: MONO, paddingRight: 6, textAlign: 'right' }}>{DAYS[dow]}</td>
                    {HOURS.map(h => {
                      const cell  = heatmap[`${dow}-${h}`]
                      const inten = cell ? Math.min(cell.cnt / 6, 1) : 0
                      const col   = cell ? (cell.pnl >= 0 ? C.green : C.red) : null
                      const hexA  = Math.round(inten * 45 + 10).toString(16).padStart(2, '0')
                      return (
                        <td key={h}
                          title={cell ? `${cell.cnt} ops · ${cell.pnl >= 0 ? '+' : ''}$${cell.pnl.toFixed(0)}` : ''}
                          style={{
                            width: 28, height: 28, borderRadius: 5, textAlign: 'center',
                            background: col ? `${col}${hexA}` : 'rgba(80,140,220,0.04)',
                            border: `1px solid ${col ? col + '22' : 'rgba(80,140,220,0.07)'}`,
                            fontSize: 10, color: col || C.faint, fontFamily: MONO,
                            cursor: cell ? 'pointer' : 'default',
                          }}>
                          {cell ? cell.cnt : ''}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 10, color: C.faint, marginTop: 10 }}>
              Operaciones por franja · 🟢 ganancia neta · 🔴 pérdida neta
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Spinner()         { return <div style={{ textAlign: 'center', padding: 40, color: C.faint, fontFamily: MONO, fontSize: 12 }}>Cargando…</div> }
function EmptyChart({ label }) { return <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.faint, fontSize: 12 }}>{label}</div> }
