import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { C, UI, MONO, SYM_COLOR } from '@/lib/helpers'
import { Card } from '@/components/ui'
import TradingViewChart from '@/components/Charts/TradingViewChart'

const SYMBOLS  = Object.keys(SYM_COLOR)
const TIMEFRAMES = ['1m','5m','15m','1h','4h','1D']

export default function ChartPage() {
  const [symbol,    setSymbol]    = useState('EUR/USD')
  const [tf,        setTf]        = useState('1h')
  const [ohlcData,  setOhlcData]  = useState([])
  const [loading,   setLoading]   = useState(false)

  useEffect(() => { fetchOHLC() }, [symbol, tf])

  async function fetchOHLC() {
    setLoading(true)
    const { data } = await supabase
      .from('tp_ohlc')
      .select('time, open, high, low, close, volume')
      .eq('symbol', symbol)
      .eq('timeframe', tf)
      .order('time', { ascending: true })
      .limit(500)
    setOhlcData(data || [])
    setLoading(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
          Gráfico de mercado
        </h1>
        <div style={{ fontSize: 12, color: `rgba(150,200,255,0.5)` }}>
          Velas · Volumen · Análisis técnico — powered by TradingView Lightweight Charts
        </div>
      </div>

      {/* Symbol + TF selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {SYMBOLS.map(s => (
            <button key={s} onClick={() => setSymbol(s)} style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 11, fontFamily: UI,
              cursor: 'pointer',
              background: symbol === s ? 'rgba(0,229,160,0.12)' : C.card,
              color:      symbol === s ? C.green : `rgba(150,200,255,0.5)`,
              border:     `1px solid ${symbol === s ? 'rgba(0,229,160,0.3)' : C.border}`,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: SYM_COLOR[s] }} />
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {TIMEFRAMES.map(t => (
            <button key={t} onClick={() => setTf(t)} style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 11, fontFamily: MONO,
              cursor: 'pointer',
              background: tf === t ? 'rgba(77,144,255,0.12)' : C.card,
              color:      tf === t ? C.blue : `rgba(150,200,255,0.5)`,
              border:     `1px solid ${tf === t ? 'rgba(77,144,255,0.3)' : C.border}`,
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Main chart */}
      <Card>
        {loading ? (
          <div style={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `rgba(150,200,255,0.3)`, fontFamily: MONO, fontSize: 12 }}>
            Cargando datos…
          </div>
        ) : ohlcData.length === 0 ? (
          <div style={{ height: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: `rgba(150,200,255,0.3)`, fontFamily: MONO }}>
              Sin datos para {symbol} · {tf}
            </div>
            <div style={{ fontSize: 11, color: `rgba(150,200,255,0.2)`, fontFamily: UI }}>
              Los datos OHLC se cargarán cuando el feed de precios esté activo
            </div>
          </div>
        ) : (
          <TradingViewChart ohlcData={ohlcData} symbol={`${symbol} · ${tf}`} height={380} />
        )}
      </Card>

      {/* TradingView Widget embed (full analysis) */}
      <Card style={{ marginTop: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
            Análisis avanzado
            <span style={{ fontSize: 11, color: `rgba(150,200,255,0.4)`, marginLeft: 8 }}>TradingView</span>
          </div>
        </div>
        <TradingViewWidget symbol={symbol} />
      </Card>
    </div>
  )
}

function TradingViewWidget({ symbol }) {
  const containerRef = useState(null)[0]
  const ref          = { current: null }

  useEffect(() => {
    const container = document.getElementById('tv-widget-container')
    if (!container) return
    container.innerHTML = ''

    const script = document.createElement('script')
    script.src   = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type  = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize:          true,
      symbol:            symbol.replace('/', ''),
      interval:          '60',
      timezone:          'America/Santiago',
      theme:             'dark',
      style:             '1',
      locale:            'es',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar:          false,
      support_host:      'https://www.tradingview.com',
      backgroundColor:   '#0a1e33',
      gridColor:         'rgba(80,140,220,0.07)',
    })
    container.appendChild(script)
  }, [symbol])

  return (
    <div id="tv-widget-container" className="tradingview-widget-container" style={{ height: 500, width: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
    </div>
  )
}
