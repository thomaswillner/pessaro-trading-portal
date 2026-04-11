import { useState, useEffect, useRef } from 'react'
import { C, UI, MONO, SYM_COLOR } from '@/lib/helpers'
import { Card } from '@/components/ui'

const SYMBOLS = Object.keys(SYM_COLOR)
const TIMEFRAMES = [
  { label: '1m',  tv: '1'   },
  { label: '5m',  tv: '5'   },
  { label: '15m', tv: '15'  },
  { label: '1h',  tv: '60'  },
  { label: '4h',  tv: '240' },
  { label: '1D',  tv: 'D'   },
]

const TV_SYMBOL = {
  'EUR/USD': 'OANDA:EURUSD',
  'GBP/USD': 'OANDA:GBPUSD',
  'XAU/USD': 'OANDA:XAUUSD',
  'NAS100':  'NASDAQ:NDX',
  'USD/JPY': 'OANDA:USDJPY',
  'GBP/JPY': 'OANDA:GBPJPY',
  'EUR/JPY': 'OANDA:EURJPY',
  'AUD/USD': 'OANDA:AUDUSD',
  'BTC/USD': 'BITSTAMP:BTCUSD',
  'EUR/GBP': 'OANDA:EURGBP',
  'SPX500':  'SP:SPX',
  'OIL':     'NYMEX:CL1!',
}

export default function ChartPage() {
  const [symbol, setSymbol] = useState('EUR/USD')
  const [tf,     setTf]     = useState(TIMEFRAMES[3])

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Gráfico de mercado</h1>
        <div style={{ fontSize: 12, color: C.muted }}>Análisis técnico en tiempo real — TradingView</div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {SYMBOLS.map(s => (
          <button key={s} onClick={() => setSymbol(s)} style={{
            padding: '6px 11px', borderRadius: 8, fontSize: 11, fontFamily: UI, cursor: 'pointer',
            background: symbol === s ? 'rgba(0,229,160,0.12)' : C.card,
            color:      symbol === s ? C.green : C.muted,
            border:    `1px solid ${symbol === s ? 'rgba(0,229,160,0.35)' : C.border}`,
            display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: SYM_COLOR[s], flexShrink: 0 }} />
            {s}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {TIMEFRAMES.map(t => (
            <button key={t.label} onClick={() => setTf(t)} style={{
              padding: '6px 11px', borderRadius: 8, fontSize: 11, fontFamily: MONO, cursor: 'pointer',
              background: tf.label === t.label ? 'rgba(77,144,255,0.12)' : C.card,
              color:      tf.label === t.label ? C.blue : C.muted,
              border:    `1px solid ${tf.label === t.label ? 'rgba(77,144,255,0.35)' : C.border}`,
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <TradingViewAdvanced symbol={symbol} interval={tf.tv} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Análisis técnico</div>
            <span style={{ fontSize: 10, color: C.faint }}>TradingView</span>
          </div>
          <TradingViewTechnicals symbol={symbol} />
        </Card>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Mini gráfico 3M</div>
            <span style={{ fontSize: 10, color: C.faint }}>TradingView</span>
          </div>
          <TradingViewMini symbol={symbol} />
        </Card>
      </div>
    </div>
  )
}

function TradingViewAdvanced({ symbol, interval }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    c.innerHTML = ''
    const s = document.createElement('script')
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    s.type = 'text/javascript'
    s.async = true
    s.innerHTML = JSON.stringify({
      autosize: true, symbol: TV_SYMBOL[symbol] || symbol.replace('/',''),
      interval, timezone: 'America/Santiago', theme: 'dark', style: '1',
      locale: 'es', enable_publishing: false, hide_top_toolbar: false,
      save_image: true, allow_symbol_change: false,
      studies: ['RSI@tv-basicstudies','MACD@tv-basicstudies'],
      backgroundColor: '#0a1e33', gridColor: 'rgba(80,140,220,0.07)',
      support_host: 'https://www.tradingview.com',
    })
    c.appendChild(s)
    return () => { c.innerHTML = '' }
  }, [symbol, interval])
  return <div ref={ref} style={{ height: 580, width: '100%' }}><div style={{ height: '100%', width: '100%' }} /></div>
}

function TradingViewTechnicals({ symbol }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    c.innerHTML = ''
    const s = document.createElement('script')
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js'
    s.type = 'text/javascript'
    s.async = true
    s.innerHTML = JSON.stringify({
      interval: '1h', width: '100%', isTransparent: true, height: 280,
      symbol: TV_SYMBOL[symbol] || symbol.replace('/',''),
      showIntervalTabs: true, locale: 'es', colorTheme: 'dark',
    })
    c.appendChild(s)
    return () => { c.innerHTML = '' }
  }, [symbol])
  return <div ref={ref} style={{ height: 280, width: '100%' }}><div style={{ height: '100%', width: '100%' }} /></div>
}

function TradingViewMini({ symbol }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    c.innerHTML = ''
    const s = document.createElement('script')
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    s.type = 'text/javascript'
    s.async = true
    s.innerHTML = JSON.stringify({
      symbol: TV_SYMBOL[symbol] || symbol.replace('/',''),
      width: '100%', height: 280, locale: 'es', dateRange: '3M',
      colorTheme: 'dark', isTransparent: true,
    })
    c.appendChild(s)
    return () => { c.innerHTML = '' }
  }, [symbol])
  return <div ref={ref} style={{ height: 280, width: '100%' }}><div style={{ height: '100%', width: '100%' }} /></div>
}
