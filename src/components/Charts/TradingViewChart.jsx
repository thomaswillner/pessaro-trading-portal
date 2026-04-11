import { useEffect, useRef } from 'react'
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts'
import { C } from '@/lib/helpers'

const CHART_OPTS = {
  layout: {
    background: { color: C.card },
    textColor: C.faint,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
  },
  grid: {
    vertLines: { color: 'rgba(80,140,220,0.07)' },
    horzLines: { color: 'rgba(80,140,220,0.07)' },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: { color: 'rgba(150,200,255,0.3)', style: LineStyle.Dashed },
    horzLine: { color: 'rgba(150,200,255,0.3)', style: LineStyle.Dashed },
  },
  rightPriceScale: {
    borderColor: 'rgba(80,140,220,0.14)',
    textColor: C.faint,
  },
  timeScale: {
    borderColor: 'rgba(80,140,220,0.14)',
    textColor: C.faint,
    timeVisible: true,
    secondsVisible: false,
  },
  handleScroll: true,
  handleScale: true,
}

export default function TradingViewChart({ ohlcData = [], symbol = 'EUR/USD', height = 380 }) {
  const containerRef = useRef(null)
  const chartRef     = useRef(null)
  const candleRef    = useRef(null)
  const volumeRef    = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      ...CHART_OPTS,
      width:  containerRef.current.clientWidth,
      height,
    })
    chartRef.current = chart

    // Candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor:        '#00e5a0',
      downColor:      '#ff4d6a',
      borderUpColor:  '#00e5a0',
      borderDownColor:'#ff4d6a',
      wickUpColor:    '#00e5a0',
      wickDownColor:  '#ff4d6a',
    })
    candleRef.current = candleSeries

    // Volume series (histogram)
    const volumeSeries = chart.addHistogramSeries({
      color:     '#4d90ff',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
      drawTicks: false,
      borderVisible: false,
    })
    volumeRef.current = volumeSeries

    // Responsive resize
    const ro = new ResizeObserver(entries => {
      if (entries[0]) {
        chart.applyOptions({ width: entries[0].contentRect.width })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [height])

  // Update data when ohlcData changes
  useEffect(() => {
    if (!candleRef.current || !ohlcData.length) return
    const candles = ohlcData.map(d => ({
      time:  Math.floor(new Date(d.time).getTime() / 1000),
      open:  +d.open, high: +d.high, low: +d.low, close: +d.close,
    }))
    const volumes = ohlcData.map(d => ({
      time:  Math.floor(new Date(d.time).getTime() / 1000),
      value: +(d.volume || 0),
      color: +d.close >= +d.open ? 'rgba(0,229,160,0.3)' : 'rgba(255,77,106,0.3)',
    }))
    candleRef.current.setData(candles)
    volumeRef.current.setData(volumes)
    chartRef.current?.timeScale().fitContent()
  }, [ohlcData])

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
          {symbol}
          <span style={{ fontSize: 11, color: 'rgba(150,200,255,0.4)', marginLeft: 8 }}>
            Gráfico de velas
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(150,200,255,0.4)' }}>
          <span>TradingView Lightweight Charts</span>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height }} />
    </div>
  )
}
