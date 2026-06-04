/* global React */
// Shared trading-app data + chart helpers.
// Exposes:
//   window.TAPP_I18N    — { es, en, pt }
//   window.TAPP_DATA    — assets + book + positions + portfolio + tx history
//   window.SparkChart   — small inline sparkline (svg)
//   window.PriceChart   — full price chart with candles/line/area variants

// ─────────────────────────────────────────────────────────────
// i18n (Spanish CL / English / Portuguese BR)
// ─────────────────────────────────────────────────────────────
const I18N = {
  es: {
    greet: "Hola",
    overview: "Patrimonio",
    todayPnl: "P&L del día",
    deposit: "Depositar", withdraw: "Retirar", transfer: "Transferir", convert: "Convertir",
    positions: "Posiciones abiertas",
    watchlist: "Lista de seguimiento",
    markets: "Mercados",
    seeAll: "Ver todos",
    forex: "Forex", commodities: "Materias Primas", indices: "Índices", crypto: "Criptomonedas",
    home: "Inicio", marketsTab: "Mercados", trade: "Operar", portfolio: "Cartera", profile: "Perfil",
    buy: "Comprar", sell: "Vender", operate: "Operar",
    orderType: "Tipo de orden", market: "Mercado", limit: "Límite", stop: "Stop",
    volume: "Volumen (lotes)", leverage: "Apalancamiento",
    amount: "Importe (USD)", price: "Precio", sl: "Stop loss", tp: "Take profit",
    review: "Revisión", spread: "Spread", commission: "Comisión", margin: "Margen",
    totalCost: "Coste total", confirm: "Confirmar",
    slideToConfirm: "Desliza para confirmar",
    history: "Historial", allocation: "Asignación", allTime: "Histórico",
    bid: "Compra", ask: "Venta", size: "Tam.", depth: "Profundidad",
    chart: "Gráfico", news: "Noticias", info: "Info",
    netLatency: "Latencia óptima",
    open: "Abrir", close: "Cerrar",
    addToWatch: "Añadir a la lista",
    riskWarning: "Las operaciones apalancadas implican alto riesgo. Pessaro Capital no presta asesoramiento de inversión directo.",
  },
  en: {
    greet: "Hi",
    overview: "Portfolio",
    todayPnl: "Today's P&L",
    deposit: "Deposit", withdraw: "Withdraw", transfer: "Transfer", convert: "Convert",
    positions: "Open positions",
    watchlist: "Watchlist",
    markets: "Markets",
    seeAll: "See all",
    forex: "Forex", commodities: "Commodities", indices: "Indices", crypto: "Crypto",
    home: "Home", marketsTab: "Markets", trade: "Trade", portfolio: "Portfolio", profile: "Profile",
    buy: "Buy", sell: "Sell", operate: "Trade",
    orderType: "Order type", market: "Market", limit: "Limit", stop: "Stop",
    volume: "Volume (lots)", leverage: "Leverage",
    amount: "Amount (USD)", price: "Price", sl: "Stop loss", tp: "Take profit",
    review: "Review", spread: "Spread", commission: "Commission", margin: "Margin",
    totalCost: "Total cost", confirm: "Confirm",
    slideToConfirm: "Slide to confirm",
    history: "History", allocation: "Allocation", allTime: "All-time",
    bid: "Bid", ask: "Ask", size: "Size", depth: "Order book",
    chart: "Chart", news: "News", info: "Info",
    netLatency: "Optimal latency",
    open: "Open", close: "Close",
    addToWatch: "Add to watchlist",
    riskWarning: "Leveraged trading involves high risk. Pessaro Capital does not provide direct investment advice.",
  },
  pt: {
    greet: "Olá",
    overview: "Patrimônio",
    todayPnl: "P&L do dia",
    deposit: "Depositar", withdraw: "Sacar", transfer: "Transferir", convert: "Converter",
    positions: "Posições abertas",
    watchlist: "Lista de observação",
    markets: "Mercados",
    seeAll: "Ver todos",
    forex: "Forex", commodities: "Matérias-Primas", indices: "Índices", crypto: "Cripto",
    home: "Início", marketsTab: "Mercados", trade: "Operar", portfolio: "Carteira", profile: "Perfil",
    buy: "Comprar", sell: "Vender", operate: "Operar",
    orderType: "Tipo de ordem", market: "Mercado", limit: "Limite", stop: "Stop",
    volume: "Volume (lotes)", leverage: "Alavancagem",
    amount: "Valor (USD)", price: "Preço", sl: "Stop loss", tp: "Take profit",
    review: "Revisão", spread: "Spread", commission: "Comissão", margin: "Margem",
    totalCost: "Custo total", confirm: "Confirmar",
    slideToConfirm: "Deslize para confirmar",
    history: "Histórico", allocation: "Alocação", allTime: "Histórico",
    bid: "Compra", ask: "Venda", size: "Tam.", depth: "Livro",
    chart: "Gráfico", news: "Notícias", info: "Info",
    netLatency: "Latência ótima",
    open: "Abrir", close: "Fechar",
    addToWatch: "Adicionar à lista",
    riskWarning: "Operações alavancadas envolvem alto risco. A Pessaro Capital não presta consultoria de investimento direta.",
  },
};

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────
const ASSETS = {
  Forex: [
    { sym: "EUR/USD", nm: "Euro / Dólar",       px: 1.08415, dl: +0.42, dla: +0.00453, spread: 0.0, leverage: "1:500", trend: "up" },
    { sym: "GBP/USD", nm: "Libra / Dólar",      px: 1.27123, dl: -0.18, dla: -0.00231, spread: 0.1, leverage: "1:500", trend: "down" },
    { sym: "USD/JPY", nm: "Dólar / Yen",        px: 156.82, dl: +0.31, dla: +0.486,    spread: 0.1, leverage: "1:500", trend: "up" },
    { sym: "USD/CLP", nm: "Dólar / Peso CL",    px: 932.40, dl: -0.05, dla: -0.47,     spread: 1.2, leverage: "1:200", trend: "down" },
  ],
  Commodities: [
    { sym: "XAU/USD", nm: "Oro",                px: 2408.15, dl: +0.52, dla: +12.40,   spread: 0.3,  leverage: "1:100", trend: "up", popular: true },
    { sym: "XAG/USD", nm: "Plata",              px: 28.42,   dl: +1.12, dla: +0.31,    spread: 0.02, leverage: "1:100", trend: "up" },
    { sym: "WTI",     nm: "Petróleo WTI",       px: 78.36,   dl: -0.84, dla: -0.66,    spread: 0.05, leverage: "1:100", trend: "down" },
  ],
  Indices: [
    { sym: "SPX500",  nm: "S&P 500",           px: 5612.80, dl: +0.33, dla: +18.60,    spread: 0.4, leverage: "1:100", trend: "up", popular: true },
    { sym: "NAS100",  nm: "NASDAQ 100",        px: 19842.50, dl: +0.62, dla: +122.30,  spread: 1.0, leverage: "1:100", trend: "up" },
    { sym: "GER40",   nm: "DAX 40",            px: 18482.10, dl: -0.21, dla: -38.80,   spread: 0.8, leverage: "1:100", trend: "down" },
  ],
  Crypto: [
    { sym: "BTC/USD", nm: "Bitcoin",            px: 88142.00, dl: -1.35, dla: -1204.0, spread: 50, leverage: "1:10", trend: "down", popular: true },
    { sym: "ETH/USD", nm: "Ethereum",           px: 3284.50,  dl: +2.15, dla: +69.10,  spread: 2.5, leverage: "1:10", trend: "up" },
    { sym: "SOL/USD", nm: "Solana",             px: 168.20,   dl: +4.82, dla: +7.74,   spread: 1.0, leverage: "1:10", trend: "up" },
  ],
};

const ALL_ASSETS = [].concat(...Object.values(ASSETS));

// Pseudo-random but stable series for charts
function seriesFor(seed, n = 120, vol = 0.012, drift = 0.0006) {
  let v = 100;
  const out = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = (s / 233280) - 0.5;
    v = v * (1 + r * vol + drift);
    out.push(v);
  }
  return out;
}

function ohlcFor(seed, n = 60) {
  const out = [];
  let v = 100;
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = (s / 233280) - 0.5;
    s = (s * 9301 + 49297) % 233280;
    const r2 = (s / 233280) - 0.5;
    const open = v;
    v = v * (1 + r * 0.014 + 0.0007);
    const close = v;
    const hi = Math.max(open, close) + Math.abs(r2) * 0.5;
    const lo = Math.min(open, close) - Math.abs(r2) * 0.5;
    out.push({ o: open, h: hi, l: lo, c: close });
  }
  return out;
}

const POSITIONS = [
  { sym: "EUR/USD", side: "Buy", vol: 0.50, entry: 1.0820, mark: 1.08415, pnl: +107.50 },
  { sym: "XAU/USD", side: "Buy", vol: 0.10, entry: 2395.20, mark: 2408.15, pnl: +129.50 },
  { sym: "BTC/USD", side: "Sell", vol: 0.05, entry: 89200.0, mark: 88142.0, pnl: +52.90 },
  { sym: "SPX500",  side: "Buy", vol: 0.20, entry: 5594.10, mark: 5612.80, pnl: +37.40 },
];

const PORTFOLIO_ALLOCATION = [
  { label: "Forex",       value: 38, color: "var(--app-primary)" },
  { label: "Commodities", value: 26, color: "var(--app-warn)" },
  { label: "Indices",     value: 22, color: "var(--app-accent)" },
  { label: "Crypto",      value: 14, color: "var(--app-trust)" },
];

const TX_HISTORY = [
  { date: "21 May", sym: "EUR/USD", side: "Buy",  vol: 0.50, px: 1.0820, status: "Filled" },
  { date: "20 May", sym: "XAU/USD", side: "Buy",  vol: 0.10, px: 2395.20, status: "Filled" },
  { date: "19 May", sym: "BTC/USD", side: "Sell", vol: 0.05, px: 89200.0, status: "Filled" },
  { date: "19 May", sym: "NAS100",  side: "Sell", vol: 0.15, px: 19720.50, status: "Cancelled" },
  { date: "18 May", sym: "Deposit", side: "—",    vol: null, px: 5000.00, status: "Wire" },
  { date: "17 May", sym: "SPX500",  side: "Buy",  vol: 0.20, px: 5594.10, status: "Filled" },
];

// ─────────────────────────────────────────────────────────────
// Spark chart (svg, inline)
// ─────────────────────────────────────────────────────────────
function SparkChart({ seed, up, width = 76, height = 30 }) {
  const data = React.useMemo(() => seriesFor(seed, 40, 0.018), [seed]);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => `${(i * stepX).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(" ");
  const color = up ? "var(--app-up)" : "var(--app-down)";
  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Price chart (full)  type = candles | line | area
// ─────────────────────────────────────────────────────────────
function PriceChart({ seed, type = "candles", height = 220, up = true }) {
  const ohlc = React.useMemo(() => ohlcFor(seed, 60), [seed]);
  const line = React.useMemo(() => seriesFor(seed, 120, 0.014), [seed]);

  if (type === "candles") {
    const all = ohlc.flatMap(c => [c.h, c.l]);
    const min = Math.min(...all); const max = Math.max(...all);
    const range = max - min || 1;
    const w = 600; const stepX = w / ohlc.length;
    return (
      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
        {/* grid */}
        {[0.2, 0.5, 0.8].map((y, i) => (
          <line key={i} x1="0" x2={w} y1={height * y} y2={height * y} stroke="var(--app-grid)" strokeWidth="0.5" />
        ))}
        {ohlc.map((c, i) => {
          const x = i * stepX + stepX * 0.5;
          const yHi = height - ((c.h - min) / range) * height;
          const yLo = height - ((c.l - min) / range) * height;
          const yO  = height - ((c.o - min) / range) * height;
          const yC  = height - ((c.c - min) / range) * height;
          const bull = c.c >= c.o;
          const color = bull ? "var(--app-up)" : "var(--app-down)";
          const cw = Math.max(1, stepX * 0.65);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={yHi} y2={yLo} stroke={color} strokeWidth="1" />
              <rect
                x={x - cw / 2}
                y={Math.min(yO, yC)}
                width={cw}
                height={Math.max(1, Math.abs(yC - yO))}
                fill={color}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  // line / area
  const data = line;
  const min = Math.min(...data); const max = Math.max(...data);
  const range = max - min || 1;
  const w = 600; const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const poly = pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");
  const areaPath = `M ${poly} L ${w},${height} L 0,${height} Z`.replace(/\s+/g, " ");
  const color = up ? "var(--app-up)" : "var(--app-down)";
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
      {[0.2, 0.5, 0.8].map((y, i) => (
        <line key={i} x1="0" x2={w} y1={height * y} y2={height * y} stroke="var(--app-grid)" strokeWidth="0.5" />
      ))}
      {type === "area" && (
        <>
          <defs>
            <linearGradient id={`g-${seed}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#g-${seed})`} />
        </>
      )}
      <polyline points={poly} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Order book (depth)
// ─────────────────────────────────────────────────────────────
function OrderBook({ midPx, t }) {
  const tick = midPx * 0.00007;
  const levels = 8;
  const asks = Array.from({ length: levels }, (_, i) => ({
    px: (midPx + tick * (levels - i)).toFixed(midPx > 1000 ? 1 : 5),
    size: (0.5 + Math.abs(Math.sin(i * 1.3)) * 6).toFixed(2),
    bar: 25 + Math.abs(Math.sin(i * 1.3)) * 60,
  }));
  const bids = Array.from({ length: levels }, (_, i) => ({
    px: (midPx - tick * (i + 1)).toFixed(midPx > 1000 ? 1 : 5),
    size: (0.5 + Math.abs(Math.cos(i * 1.1)) * 6).toFixed(2),
    bar: 25 + Math.abs(Math.cos(i * 1.1)) * 60,
  }));
  return (
    <div className="book">
      <div className="col-head" style={{ textAlign: "right" }}>{t.size}</div>
      <div className="col-head" style={{ textAlign: "right" }}>{t.bid}</div>
      <div className="col-head" style={{ textAlign: "right" }}>{t.ask}</div>
      {asks.map((l, i) => (
        <React.Fragment key={`a${i}`}>
          <div className="cell size">{l.size}</div>
          <div className="cell" />
          <div className="cell ask">
            <div className="bar" style={{ width: `${l.bar}%` }} />
            {l.px}
          </div>
        </React.Fragment>
      ))}
      <div className="spread">
        <span>{t.spread} <span className="v">{tick.toFixed(midPx > 1000 ? 1 : 5)}</span></span>
        <span>{t.bid} <span className="v" style={{color: "var(--app-up)"}}>{bids[0].px}</span></span>
        <span>{t.ask} <span className="v" style={{color: "var(--app-down)"}}>{asks[asks.length-1].px}</span></span>
      </div>
      {bids.map((l, i) => (
        <React.Fragment key={`b${i}`}>
          <div className="cell size">{l.size}</div>
          <div className="cell bid">
            <div className="bar" style={{ width: `${l.bar}%` }} />
            {l.px}
          </div>
          <div className="cell" />
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Real candlestick chart via TradingView's lightweight-charts.
// Falls back to the SVG PriceChart if the library hasn't loaded.
// ─────────────────────────────────────────────────────────────
function RealChart({ seed = 42, height = 420, type = "candles", up = true }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.LightweightCharts) return;
    const lc = window.LightweightCharts;

    // Deterministic OHLC, 200 candles
    const data = [];
    let v = 1.0820;
    let s = seed;
    const day = 60 * 60; // each candle is 1h
    let t0 = Math.floor(Date.now() / 1000) - 200 * day;
    for (let i = 0; i < 200; i++) {
      s = (s * 9301 + 49297) % 233280;
      const r = (s / 233280) - 0.5;
      s = (s * 9301 + 49297) % 233280;
      const r2 = (s / 233280) - 0.5;
      const open = v;
      v = v * (1 + r * 0.0035 + 0.0001);
      const close = v;
      const hi = Math.max(open, close) + Math.abs(r2) * 0.0012;
      const lo = Math.min(open, close) - Math.abs(r2) * 0.0012;
      data.push({ time: t0 + i * day, open, high: hi, low: lo, close });
    }

    const chart = lc.createChart(ref.current, {
      width: ref.current.clientWidth,
      height,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#9BA3B5",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.06)" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: { borderColor: "rgba(255,255,255,0.08)", timeVisible: true, secondsVisible: false },
      crosshair: {
        mode: 1,
        vertLine: { color: "rgba(168, 240, 200, 0.50)", width: 1, style: 2 },
        horzLine: { color: "rgba(168, 240, 200, 0.50)", width: 1, style: 2 },
      },
    });

    let series;
    if (type === "candles" && chart.addCandlestickSeries) {
      series = chart.addCandlestickSeries({
        upColor: "#5BD9A5", downColor: "#FF6B6B",
        wickUpColor: "#5BD9A5", wickDownColor: "#FF6B6B",
        borderVisible: false,
      });
      series.setData(data);
    } else if ((type === "line" || type === "area") && chart.addAreaSeries) {
      series = chart.addAreaSeries({
        lineColor: up ? "#5BD9A5" : "#FF6B6B",
        topColor: "rgba(91, 217, 165, 0.40)",
        bottomColor: "rgba(91, 217, 165, 0.0)",
        lineWidth: 2,
      });
      series.setData(data.map(d => ({ time: d.time, value: d.close })));
    } else {
      // SDK shape changed — bail and render fallback
      chart.remove();
      return;
    }

    // resize observer
    const ro = new ResizeObserver(entries => {
      for (const e of entries) chart.resize(e.contentRect.width, height);
    });
    ro.observe(ref.current);

    chart.timeScale().fitContent();

    return () => { ro.disconnect(); chart.remove(); };
  }, [seed, type, height, up]);

  if (!window.LightweightCharts) {
    return <window.PriceChart seed={seed} type={type} height={height} up={up} />;
  }
  return <div ref={ref} style={{ width: "100%", height }} />;
}

window.RealChart = RealChart;
window.TAPP_I18N = I18N;
window.TAPP_DATA = { ASSETS, ALL_ASSETS, POSITIONS, PORTFOLIO_ALLOCATION, TX_HISTORY };
window.SparkChart = SparkChart;
window.PriceChart = PriceChart;
window.OrderBook = OrderBook;
