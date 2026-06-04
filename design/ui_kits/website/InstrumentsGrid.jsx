/* global React */
const { useEffect: useEffectI } = React;

const INSTRUMENTS = [
  { sym: "EUR/USD", nm: "Euro vs Dólar",   cat: "Forex",          spread: "0.0",  lev: "1:500", trend: "up",   popular: true  },
  { sym: "GBP/USD", nm: "Libra vs Dólar",  cat: "Forex",          spread: "0.1",  lev: "1:500", trend: "down", popular: false },
  { sym: "XAU/USD", nm: "Oro",             cat: "Commodities",    spread: "0.3",  lev: "1:100", trend: "up",   popular: true  },
  { sym: "WTI",     nm: "Petróleo WTI",    cat: "Commodities",    spread: "0.05", lev: "1:100", trend: "up",   popular: false },
  { sym: "SPX500",  nm: "S&P 500",         cat: "Indices",        spread: "0.4",  lev: "1:100", trend: "up",   popular: true  },
  { sym: "NAS100",  nm: "NASDAQ 100",      cat: "Indices",        spread: "1.0",  lev: "1:100", trend: "up",   popular: false },
  { sym: "BTC/USD", nm: "Bitcoin",         cat: "Criptomonedas",  spread: "50",   lev: "1:10",  trend: "up",   popular: true  },
  { sym: "ETH/USD", nm: "Ethereum",        cat: "Criptomonedas",  spread: "2.5",  lev: "1:10",  trend: "down", popular: false }
];

function pctFor(sym, dir) {
  // stable pseudo-random based on symbol
  const seed = [...sym].reduce((a, c) => a + c.charCodeAt(0), 0);
  const v = (seed % 47) / 100 + 0.10;
  return (dir === "up" ? "+" : "−") + v.toFixed(2) + "%";
}

function InstrumentsGrid({ onTrade }) {
  useEffectI(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="section muted" id="instrumentos" data-screen-label="05 Instruments">
      <div className="container">
        <div className="head" style={{textAlign: "left", maxWidth: "none", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 40}}>
          <div style={{maxWidth: 560}}>
            <h2><span>Mercados</span> <span className="accent">Globales</span> <span>al Alcance</span></h2>
            <p>Opere con los activos más líquidos del mundo con spreads competitivos desde 0.0 pips y apalancamiento flexible.</p>
          </div>
          <a href="#" style={{display: "inline-flex", alignItems: "center", gap: 8, color: "oklch(0.45 0.25 280)", fontWeight: 700, fontSize: 14}}>
            Ver todos los instrumentos <i data-lucide="arrow-right"></i>
          </a>
        </div>
        <div className="inst-grid">
          {INSTRUMENTS.map((i, idx) => (
            <article className="inst-card" key={idx}>
              <div className="head" style={{textAlign: "left", margin: 0, maxWidth: "none"}}>
                <div className="ticker">
                  <span className="glyph">{i.sym.substring(0, 2)}</span>
                  <div>
                    <div className="sym">{i.sym}</div>
                    <div className="nm">{i.nm}</div>
                  </div>
                </div>
                <span className={"cat" + (i.popular ? "" : " secondary")}>{i.cat}</span>
              </div>
              <div className="body">
                <div><div className="k">Spread</div><div className="v">{i.spread} pips</div></div>
                <div><div className="k">Apalancamiento</div><div className="v">{i.lev}</div></div>
              </div>
              <div className="foot">
                <span className={"delta " + (i.trend === "up" ? "up" : "dn")}>
                  <i data-lucide={i.trend === "up" ? "trending-up" : "trending-down"}></i>
                  {pctFor(i.sym, i.trend)}
                </span>
                <button className="btn-op" onClick={onTrade}>Operar</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

window.PessInstrumentsGrid = InstrumentsGrid;
