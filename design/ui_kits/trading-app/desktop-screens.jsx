/* global React */
// Tablet + Desktop screens.
// Exposes: TabletDashboard, DesktopWorkstation, DesktopAnalytics.

function useLucideT(deps = []) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, deps);
}

// ─────────────────────────────────────────────────────────────
// TABLET — split-pane dashboard
//   Left:  watchlist + balance
//   Right: asset chart + book + cta + positions
// Designed for ~1024×720 (landscape iPad).
// ─────────────────────────────────────────────────────────────
function TabletDashboard({ lang, chartType }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  const a = D.ASSETS.Forex[0]; // EUR/USD selected
  useLucideT([chartType]);
  return (
    <div className="tapp" style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "340px 1fr", overflow: "hidden" }}>
      {/* LEFT pane */}
      <aside style={{ borderRight: "1px solid var(--app-border)", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--app-surface)" }}>
        {/* user + balance */}
        <div style={{ padding: 18, borderBottom: "1px solid var(--app-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span className="avatar" style={{ width: 36, height: 36, borderRadius: 50, background: "linear-gradient(135deg, var(--app-primary), var(--app-accent))", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--app-bg)", fontWeight: 700, fontSize: 13 }}>FR</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--app-muted)" }}>{t.greet},</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Francisco Rojas</div>
            </div>
            <span className="net-pill"><span className="dot" />18ms</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{t.overview}</div>
          <div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 4 }}>
            48,294.<span style={{ fontSize: 18, color: "var(--app-muted)" }}>71</span>
            <span style={{ fontSize: 12, color: "var(--app-muted)", marginLeft: 6, fontFamily: "var(--font-sans)" }}>USD</span>
          </div>
          <div className="delta-up-bg" style={{ display: "inline-flex", padding: "4px 10px", borderRadius: 9999, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, marginTop: 8 }}>+1,287.40 · +2.74%</div>
        </div>

        {/* search */}
        <div style={{ padding: "14px 18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", background: "var(--app-surface-2)", border: "1px solid var(--app-border)", borderRadius: 10, padding: "0 12px", height: 38 }}>
            <i data-lucide="search" style={{ width: 14, height: 14, color: "var(--app-muted)", marginRight: 8 }}></i>
            <input placeholder="Buscar mercados…" style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--app-text)", fontSize: 13 }} />
          </div>
        </div>

        {/* watchlist */}
        <div style={{ padding: "14px 18px 0", flex: 1, overflow: "auto" }}>
          <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>{t.watchlist}</div>
          {Object.entries(D.ASSETS).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: "var(--app-muted-2)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, padding: "8px 4px 4px" }}>{t[cat.toLowerCase()] || cat}</div>
              {items.slice(0, 3).map((it, i) => {
                const sel = it.sym === a.sym;
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center",
                    padding: "8px 8px",
                    background: sel ? "var(--app-surface-2)" : "transparent",
                    borderRadius: 8, cursor: "pointer",
                    border: "1px solid " + (sel ? "var(--app-border)" : "transparent"),
                  }}>
                    <div>
                      <div className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{it.sym}</div>
                      <div style={{ fontSize: 10, color: "var(--app-muted)" }}>{it.nm}</div>
                    </div>
                    <window.SparkChart seed={it.sym.charCodeAt(0) * 3} up={it.dl >= 0} width={50} height={20} />
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{it.px.toFixed(it.px > 1000 ? 1 : 4)}</div>
                      <div className={"mono " + (it.dl >= 0 ? "delta-up" : "delta-down")} style={{ fontSize: 10, fontWeight: 700 }}>{it.dl >= 0 ? "+" : ""}{it.dl.toFixed(2)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT pane */}
      <main style={{ display: "grid", gridTemplateRows: "auto 1fr auto", overflow: "hidden" }}>
        {/* asset header */}
        <div style={{ padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--app-border)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{a.sym}</div>
              <div style={{ fontSize: 12, color: "var(--app-muted)" }}>{a.nm}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 4 }}>
              <div className="mono" style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{a.px.toFixed(5)}</div>
              <div className={"delta " + (a.dl >= 0 ? "delta-up-bg" : "delta-down-bg")} style={{ padding: "3px 10px", borderRadius: 9999, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700 }}>{a.dl >= 0 ? "+" : ""}{a.dl.toFixed(2)}%</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="tf-row" style={{ margin: 0 }}>
              {["1m", "15m", "1H", "4H", "1D", "1W"].map(tf => (
                <button key={tf} className={tf === "1H" ? "active" : ""}>{tf}</button>
              ))}
            </div>
          </div>
        </div>

        {/* chart + book */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", overflow: "hidden" }}>
          <div style={{ padding: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 14, overflow: "hidden", padding: 6 }}>
              <window.PriceChart seed={42} type={chartType} height={280} up={a.dl >= 0} />
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto" }}>
              {["RSI 64.2", "MACD ↑", "EMA 20", "VWAP 1.0838", "BB ±2σ"].map((c, i) => (
                <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "5px 10px", background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-muted)", whiteSpace: "nowrap" }}>{c}</span>
              ))}
            </div>
          </div>

          <div style={{ borderLeft: "1px solid var(--app-border)", overflow: "auto", background: "var(--app-surface)" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--app-border)" }}>
              <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{t.depth}</div>
            </div>
            <window.OrderBook midPx={a.px} t={t} />
          </div>
        </div>

        {/* sticky bottom: CTAs + open positions strip */}
        <div style={{ borderTop: "1px solid var(--app-border)", padding: 14, background: "var(--app-bg)", display: "grid", gridTemplateColumns: "1fr 1fr 220px 220px", gap: 14, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{t.positions}</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>4 abiertas · +$327.30</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{t.margin}</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>$1,840.20 · 12.4%</div>
          </div>
          <button className="btn-sell" style={{ height: 48 }}>
            <span style={{ fontSize: 10, opacity: 0.7, fontFamily: "var(--font-mono)" }}>{(a.px - 0.00005).toFixed(5)}</span>
            {t.sell}
          </button>
          <button className="btn-buy" style={{ height: 48 }}>
            <span style={{ fontSize: 10, opacity: 0.7, fontFamily: "var(--font-mono)" }}>{(a.px + 0.00005).toFixed(5)}</span>
            {t.buy}
          </button>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Trading Workstation (full pro view)
// 1440×800 — 4 columns: sidebar, chart+positions, book+watchlist, ticket
// ─────────────────────────────────────────────────────────────
function DesktopWorkstation({ lang, chartType }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  const a = D.ASSETS.Forex[0]; // EUR/USD
  useLucideT([chartType]);

  return (
    <div className="tapp" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="dt-topbar">
        <div className="logo">
          <img src="../../assets/logo-pessaro-trade.svg" alt="Pessaro Trade" style={{ height: 32 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>PESSARO <span style={{ color: "var(--app-accent)" }}>TRADE</span></span>
        </div>
        <nav>
          <a href="#" className="active">{t.trade}</a>
          <a href="#">{t.marketsTab}</a>
          <a href="#">{t.portfolio}</a>
          <a href="#">{t.history}</a>
          <a href="#">Insights</a>
        </nav>
        <div className="balance">
          <span className="net-pill"><span className="dot" />18ms LD4</span>
          <div style={{ textAlign: "right" }}>
            <div className="lbl">{t.overview}</div>
            <div className="v">$48,294.71</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="lbl">{t.todayPnl}</div>
            <div className="v delta-up">+$1,287.40</div>
          </div>
          <span className="avatar">FR</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "260px 1fr 320px 300px", overflow: "hidden" }}>
        {/* Left rail — markets */}
        <aside style={{ borderRight: "1px solid var(--app-border)", overflow: "auto", padding: "14px 12px", background: "var(--app-surface)" }}>
          <div style={{ display: "flex", alignItems: "center", background: "var(--app-surface-2)", border: "1px solid var(--app-border)", borderRadius: 8, padding: "0 10px", height: 32, marginBottom: 14 }}>
            <i data-lucide="search" style={{ width: 13, height: 13, color: "var(--app-muted)", marginRight: 8 }}></i>
            <input placeholder="Buscar…" style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--app-text)", fontSize: 12 }} />
          </div>
          {Object.entries(D.ASSETS).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--app-muted-2)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, padding: "6px 4px" }}>{t[cat.toLowerCase()] || cat}</div>
              {items.map((it, i) => {
                const sel = it.sym === a.sym;
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center",
                    padding: "6px 8px", borderRadius: 6, cursor: "pointer",
                    background: sel ? "var(--app-surface-2)" : "transparent",
                  }}>
                    <div>
                      <div className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{it.sym}</div>
                      <div style={{ fontSize: 10, color: "var(--app-muted)" }}>{it.nm}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{it.px.toFixed(it.px > 1000 ? 1 : 4)}</div>
                      <div className={"mono " + (it.dl >= 0 ? "delta-up" : "delta-down")} style={{ fontSize: 10, fontWeight: 700 }}>{it.dl >= 0 ? "+" : ""}{it.dl.toFixed(2)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Center — chart + positions */}
        <main style={{ display: "grid", gridTemplateRows: "auto 1fr 280px", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--app-border)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{a.sym}</div>
                <div style={{ fontSize: 11, color: "var(--app-muted)" }}>{a.nm}</div>
                <span style={{ fontSize: 10, padding: "2px 8px", background: "var(--app-tile)", color: "var(--app-accent)", borderRadius: 9999, fontWeight: 700, letterSpacing: "0.04em" }}>{t.forex}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{a.px.toFixed(5)}</div>
                <div className={"mono " + (a.dl >= 0 ? "delta-up-bg" : "delta-down-bg")} style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>{a.dl >= 0 ? "+" : ""}{a.dl.toFixed(2)}% · {a.dla >= 0 ? "+" : ""}{a.dla.toFixed(5)}</div>
                <span style={{ fontSize: 10, color: "var(--app-muted)", fontFamily: "var(--font-mono)" }}>{t.spread} {a.spread} · {a.leverage}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div className="tf-row" style={{ margin: 0 }}>
                {["1m", "5m", "15m", "1H", "4H", "1D", "1W"].map(tf => (
                  <button key={tf} className={tf === "1H" ? "active" : ""}>{tf}</button>
                ))}
              </div>
              <button style={{ background: "var(--app-surface-2)", border: "1px solid var(--app-border)", color: "var(--app-text)", height: 32, padding: "0 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <i data-lucide="settings-2" style={{ width: 13, height: 13 }}></i>
                Indicadores
              </button>
            </div>
          </div>

          <div style={{ padding: 16, overflow: "hidden", background: "var(--app-bg)" }}>
            <div style={{ width: "100%", height: "100%", background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 14, padding: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <window.RealChart seed={42} type={chartType} height={420} up={a.dl >= 0} />
              </div>
              <div style={{ display: "flex", gap: 6, padding: "8px 4px 0" }}>
                {["RSI 64.2", "MACD: bullish cross", "EMA 20: 1.0832", "EMA 50: 1.0815", "VWAP: 1.0838", "BB ±2σ: 1.0790 / 1.0890"].map((c, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "4px 10px", background: "var(--app-surface-2)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-muted)", whiteSpace: "nowrap" }}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* positions table */}
          <div style={{ borderTop: "1px solid var(--app-border)", background: "var(--app-surface)", overflow: "auto" }}>
            <div style={{ display: "flex", gap: 2, padding: "10px 16px 4px", borderBottom: "1px solid var(--app-border)" }}>
              {[t.positions, "Órdenes", t.history].map((tab, i) => (
                <button key={i} style={{
                  background: i === 0 ? "var(--app-surface-2)" : "transparent",
                  border: 0, color: i === 0 ? "var(--app-text)" : "var(--app-muted)",
                  padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>{tab}</button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 11, color: "var(--app-muted)", alignSelf: "center", fontFamily: "var(--font-mono)" }}>4 abiertas · P&L +$327.30</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ color: "var(--app-muted)", textAlign: "left" }}>
                  {["Símbolo", "Lado", "Volumen", "Entrada", "Actual", "P&L", "SL", "TP", ""].map((h, i) => (
                    <th key={i} style={{ padding: "10px 16px", fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid var(--app-border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {D.POSITIONS.map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(from var(--app-border) l c h / 0.5)" }}>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{p.sym}</td>
                    <td style={{ padding: "10px 16px", color: p.side === "Buy" ? "var(--app-up)" : "var(--app-down)", fontWeight: 700, fontSize: 11 }}>{p.side.toUpperCase()}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)" }}>{p.vol.toFixed(2)}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)" }}>{p.entry.toFixed(p.entry > 1000 ? 1 : 4)}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)" }}>{p.mark.toFixed(p.mark > 1000 ? 1 : 4)}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", color: p.pnl >= 0 ? "var(--app-up)" : "var(--app-down)", fontWeight: 700 }}>{p.pnl >= 0 ? "+" : ""}${p.pnl.toFixed(2)}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", color: "var(--app-muted)" }}>{(p.entry * 0.998).toFixed(p.entry > 1000 ? 1 : 4)}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", color: "var(--app-muted)" }}>{(p.entry * 1.004).toFixed(p.entry > 1000 ? 1 : 4)}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <button style={{ background: "var(--app-surface-3)", border: 0, color: "var(--app-text)", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{t.close}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Right rail 1 — order book + watchlist */}
        <section style={{ borderLeft: "1px solid var(--app-border)", background: "var(--app-surface)", overflow: "auto" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--app-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>{t.depth}</div>
            <span style={{ fontSize: 10, color: "var(--app-muted)", fontFamily: "var(--font-mono)" }}>L2 · live</span>
          </div>
          <window.OrderBook midPx={a.px} t={t} />
          <div style={{ padding: "12px 14px", borderTop: "1px solid var(--app-border)", borderBottom: "1px solid var(--app-border)" }}>
            <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Recent trades</div>
            {[
              ["1.08415", "0.50", "var(--app-up)", "13:24:55"],
              ["1.08413", "0.10", "var(--app-down)", "13:24:54"],
              ["1.08415", "1.20", "var(--app-up)", "13:24:53"],
              ["1.08414", "0.32", "var(--app-up)", "13:24:52"],
              ["1.08412", "0.08", "var(--app-down)", "13:24:51"],
            ].map(([px, sz, c, ts], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", padding: "3px 0", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                <span style={{ color: c, fontWeight: 700 }}>{px}</span>
                <span style={{ color: "var(--app-text)", textAlign: "right" }}>{sz}</span>
                <span style={{ color: "var(--app-muted)", marginLeft: 12 }}>{ts}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right rail 2 — order ticket */}
        <aside style={{ borderLeft: "1px solid var(--app-border)", background: "var(--app-surface)", overflow: "auto", padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: 4, background: "var(--app-surface-2)", borderRadius: 12, marginBottom: 12 }}>
            <button style={{ background: "var(--app-down)", color: "var(--app-bg)", border: 0, height: 42, borderRadius: 8, fontWeight: 700, fontSize: 13 }}>{t.sell} {(a.px - 0.00005).toFixed(5)}</button>
            <button style={{ background: "transparent", color: "var(--app-muted)", border: 0, height: 42, borderRadius: 8, fontWeight: 700, fontSize: 13 }}>{t.buy} {(a.px + 0.00005).toFixed(5)}</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, padding: 4, background: "var(--app-surface-2)", borderRadius: 10, marginBottom: 14 }}>
            {[[t.market, true], [t.limit], [t.stop]].map(([k, sel], i) => (
              <button key={i} style={{
                background: sel ? "var(--app-surface-3)" : "transparent",
                color: sel ? "var(--app-text)" : "var(--app-muted)",
                border: 0, height: 30, borderRadius: 6, fontSize: 11, fontWeight: 600,
              }}>{k}</button>
            ))}
          </div>

          {[
            [t.volume, "0.50", "lots"],
            [t.amount, "54,250.00", "USD"],
            [t.sl, "1.08210", ""],
            [t.tp, "1.08620", ""],
          ].map(([lbl, val, unit], i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 4 }}>{lbl}</div>
              <div style={{ display: "flex", alignItems: "center", background: "var(--app-surface-2)", border: "1px solid var(--app-border)", borderRadius: 8, padding: "0 10px", height: 36 }}>
                <input defaultValue={val} style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--app-text)", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }} />
                {unit && <span style={{ fontSize: 11, color: "var(--app-muted)" }}>{unit}</span>}
              </div>
            </div>
          ))}

          <div style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)", borderRadius: 10, padding: 12, margin: "8px 0" }}>
            {[
              [t.spread, "0.0 pips"],
              [t.commission, "$5.00"],
              [t.margin, "$108.40"],
              [t.totalCost, "$54,250.00", true],
            ].map(([k, v, total], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11, ...(total ? { borderTop: "1px solid var(--app-border)", marginTop: 6, paddingTop: 8, fontWeight: 700 } : {}) }}>
                <span style={{ color: "var(--app-muted)" }}>{k}</span>
                <span className="mono" style={{ fontWeight: total ? 700 : 600, color: "var(--app-text)" }}>{v}</span>
              </div>
            ))}
          </div>

          <button style={{ width: "100%", background: "var(--app-down)", color: "var(--app-bg)", border: 0, height: 48, borderRadius: 10, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <i data-lucide="trending-down" style={{ width: 16, height: 16 }}></i>
            {t.sell} 0.50 · {a.sym}
          </button>

          <div style={{ marginTop: 14, padding: 10, background: "var(--app-bg)", border: "1px solid var(--app-border)", borderRadius: 8, fontSize: 10, color: "var(--app-muted)", lineHeight: 1.5 }}>
            {t.riskWarning}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Portfolio Analytics
// 1440×800 — equity curve, allocation donut, KPI grid, transactions
// ─────────────────────────────────────────────────────────────
function DesktopAnalytics({ lang, chartType }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  useLucideT([chartType]);

  return (
    <div className="tapp" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="dt-topbar">
        <div className="logo">
          <img src="../../assets/logo-pessaro-trade.svg" alt="Pessaro Trade" style={{ height: 32 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>PESSARO <span style={{ color: "var(--app-accent)" }}>TRADE</span></span>
        </div>
        <nav>
          <a href="#">{t.trade}</a>
          <a href="#">{t.marketsTab}</a>
          <a href="#" className="active">{t.portfolio}</a>
          <a href="#">{t.history}</a>
          <a href="#">Insights</a>
        </nav>
        <div className="balance">
          <span className="net-pill"><span className="dot" />18ms LD4</span>
          <div style={{ textAlign: "right" }}>
            <div className="lbl">{t.overview}</div>
            <div className="v">$48,294.71</div>
          </div>
          <span className="avatar">FR</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: 20, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, overflow: "auto" }}>
        {/* Left column */}
        <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: 16, minHeight: 0 }}>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              ["Patrimonio total",  "$48,294.71",  "+34.6%",  true, "trending-up"],
              ["P&L acumulado",     "+$12,408.52", "ROI 34.6%", true, "wallet"],
              ["Posiciones abiertas","4",           "+$327.30", true, "layers"],
              ["Operaciones (30d)", "142",         "62% win", null, "activity"],
            ].map(([k, v, sub, up, icon], i) => (
              <div key={i} className="dt-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{k}</div>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--app-tile)", color: "var(--app-accent)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <i data-lucide={icon} style={{ width: 14, height: 14 }}></i>
                  </span>
                </div>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 8 }}>{v}</div>
                <div className={"mono " + (up === true ? "delta-up" : up === false ? "delta-down" : "")} style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: up == null ? "var(--app-muted)" : undefined }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Equity curve */}
          <div className="dt-card" style={{ minHeight: 0 }}>
            <div className="hd">
              <div>
                <div className="t">Curva de patrimonio</div>
                <div className="sub">Últimos 12 meses · USD</div>
              </div>
              <div className="tf-row" style={{ margin: 0 }}>
                {["1M", "3M", "6M", "1Y", "ALL"].map(tf => (
                  <button key={tf} className={tf === "1Y" ? "active" : ""}>{tf}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, flex: 1, minHeight: 0 }}>
              <window.RealChart seed={101} type="area" height={260} up={true} />
            </div>
          </div>

          {/* Transactions table */}
          <div className="dt-card">
            <div className="hd"><div className="t">Transacciones recientes</div><a style={{ fontSize: 11, color: "var(--app-accent)" }}>Exportar CSV</a></div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ color: "var(--app-muted)", textAlign: "left" }}>
                  {["Fecha", "Símbolo", "Lado", "Volumen", "Precio", "Estado"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 16px", fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid var(--app-border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {D.TX_HISTORY.map((tx, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid oklch(from var(--app-border) l c h / 0.5)" }}>
                    <td style={{ padding: "10px 16px", color: "var(--app-muted)" }}>{tx.date}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{tx.sym}</td>
                    <td style={{ padding: "10px 16px", color: tx.side === "Buy" ? "var(--app-up)" : tx.side === "Sell" ? "var(--app-down)" : "var(--app-muted)", fontWeight: 700, fontSize: 11 }}>{tx.side}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)" }}>{tx.vol !== null ? tx.vol.toFixed(2) : "—"}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)" }}>{tx.px.toFixed(tx.px > 1000 ? 1 : 4)}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                        background: tx.status === "Filled" ? "var(--app-up-bg)" : "var(--app-surface-3)",
                        color: tx.status === "Filled" ? "var(--app-up)" : "var(--app-muted)",
                      }}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr", gap: 16, minHeight: 0 }}>
          {/* Allocation donut */}
          <div className="dt-card">
            <div className="hd"><div className="t">{t.allocation}</div><div className="sub">Por clase de activo</div></div>
            <div style={{ padding: 16, display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center" }}>
              <DonutMini data={D.PORTFOLIO_ALLOCATION} size={140} />
              <div>
                {D.PORTFOLIO_ALLOCATION.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                    <span style={{ flex: 1, fontSize: 12 }}>{d.label}</span>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Win rate */}
          <div className="dt-card">
            <div className="hd"><div className="t">Estadísticas (30d)</div></div>
            <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Win rate", "62%", "var(--app-up)"],
                ["Avg win", "+$84.20", "var(--app-up)"],
                ["Avg loss", "−$42.10", "var(--app-down)"],
                ["Sharpe", "1.82", "var(--app-text)"],
                ["Profit factor", "2.4", "var(--app-text)"],
                ["Max drawdown", "−4.8%", "var(--app-down)"],
              ].map(([k, v, c], i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: "var(--app-muted)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>{k}</div>
                  <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: c, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* News */}
          <div className="dt-card" style={{ minHeight: 0 }}>
            <div className="hd"><div className="t">Insights del mercado</div></div>
            <div style={{ padding: 0, overflow: "auto" }}>
              {[
                ["Powell mantiene la tasa", "Fed conserva 5.50% por tercera reunión consecutiva, presión sobre USD.", "Hace 24m"],
                ["Oro supera $2,400", "Spot alcanza máximo de 6 meses ante tensiones geopolíticas.", "Hace 1h"],
                ["BCE recorta 25 bps", "Lagarde adelanta nuevo recorte si la inflación cede al 2.2%.", "Hace 3h"],
              ].map(([t1, t2, ts], i) => (
                <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid oklch(from var(--app-border) l c h / 0.5)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{t1}</div>
                  <div style={{ fontSize: 11, color: "var(--app-muted)", lineHeight: 1.45 }}>{t2}</div>
                  <div style={{ fontSize: 10, color: "var(--app-muted-2)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{ts}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutMini({ data, size = 140 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cum = 0;
  const r = size / 2; const c = r;
  const stroke = 18;
  const radius = r - stroke / 2;
  const circ = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={radius} fill="none" stroke="var(--app-surface-2)" strokeWidth={stroke} />
      {data.map((d, i) => {
        const frac = d.value / total;
        const dash = frac * circ;
        const gap  = circ - dash;
        const rot  = (cum / total) * 360 - 90;
        cum += d.value;
        return (
          <circle key={i} cx={c} cy={c} r={radius}
            fill="none" stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rot} ${c} ${c})`} />
        );
      })}
      <text x={c} y={c - 2} textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={700} fontSize={20} fill="var(--app-text)">100%</text>
      <text x={c} y={c + 16} textAnchor="middle" fontSize={9} fill="var(--app-muted)" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>cartera</text>
    </svg>
  );
}

window.TabletDashboard = TabletDashboard;
window.DesktopWorkstation = DesktopWorkstation;
window.DesktopAnalytics = DesktopAnalytics;
