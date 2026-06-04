/* global React */
// Mobile screens for trading app.
// All screens are designed for 390×844 (inside iOS frame which adds chrome).
// Exposes: MobDashboard, MobAssetDetail, MobMarkets, MobOrderTicket, MobPortfolio.

const ICON_W = 18;

// Light wrapper to invoke lucide.createIcons() after mount.
function useLucide(deps = []) {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, deps);
}

// ─────────────────────────────────────────────────────────────
// Pieces shared across screens
// ─────────────────────────────────────────────────────────────

function NavBarMobile({ t, active }) {
  useLucide([active]);
  const items = [
    { key: "home",     icon: "home",          label: t.home },
    { key: "markets",  icon: "candlestick-chart", label: t.marketsTab },
    { key: "trade",    icon: "circle-plus",   label: t.trade, big: true },
    { key: "portfolio",icon: "pie-chart",     label: t.portfolio },
    { key: "profile",  icon: "user-round",    label: t.profile },
  ];
  return (
    <div className="bottom-nav">
      {items.map(it => (
        <button key={it.key} className={it.key === active ? "active" : ""}>
          <i data-lucide={it.icon}></i>
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function StatusPill({ t }) {
  useLucide();
  return (
    <span className="net-pill" title={t.netLatency}>
      <span className="dot" />
      18ms · LD4
    </span>
  );
}

function MobHeader({ t, lang, title, showAvatar = true }) {
  useLucide();
  return (
    <div className="mob-top">
      <div>
        {title ? (
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>{title}</div>
        ) : (
          <>
            <div className="greet">{t.greet}, Francisco</div>
            <div className="name">Pessaro Capital</div>
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <StatusPill t={t} />
        {showAvatar && <span className="avatar">FR</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1) DASHBOARD
// ─────────────────────────────────────────────────────────────
function MobDashboard({ lang, chartType, density }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  useLucide();
  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      <MobHeader t={t} lang={lang} />

      <div className="balance-card">
        <div className="row">
          <div>
            <div className="lbl">{t.overview}</div>
            <div className="total">
              48,294.<span style={{ fontSize: 22, color: "var(--app-muted)" }}>71</span>
              <span className="cur">USD</span>
            </div>
            <div className="pnl delta-up-bg">
              <i data-lucide="trending-up" style={{ width: 13, height: 13, color: "var(--app-up)" }}></i>
              +1,287.40 · +2.74%
            </div>
          </div>
          <button style={{ background: "transparent", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-muted)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i data-lucide="eye" style={{ width: 14, height: 14 }}></i>
          </button>
        </div>

        {/* mini chart */}
        <div style={{ marginTop: 14 }}>
          <window.PriceChart seed={42} type={chartType === "candles" ? "area" : chartType} height={64} up={true} />
        </div>

        <div className="actions">
          <button><i data-lucide="arrow-down-to-line"></i>{t.deposit}</button>
          <button><i data-lucide="arrow-up-from-line"></i>{t.withdraw}</button>
          <button><i data-lucide="arrow-right-left"></i>{t.transfer}</button>
          <button><i data-lucide="refresh-cw"></i>{t.convert}</button>
        </div>
      </div>

      <div className="mkt-section">
        <div className="head"><h3>{t.positions}</h3><a>{t.seeAll}</a></div>
        <div className="mkt-list">
          {D.POSITIONS.slice(0, 4).map((p, i) => (
            <div key={i} className="pos-row">
              <div>
                <div className="sym">{p.sym}</div>
                <div className="meta">
                  <span style={{ color: p.side === "Buy" ? "var(--app-up)" : "var(--app-down)" }}>{p.side}</span> · {p.vol} · @{p.entry.toFixed(p.entry > 1000 ? 1 : 4)}
                </div>
              </div>
              <div className="px">{p.mark.toFixed(p.mark > 1000 ? 1 : 4)}</div>
              <div className={"pnl " + (p.pnl >= 0 ? "delta-up-bg" : "delta-down-bg")}>{p.pnl >= 0 ? "+" : ""}{p.pnl.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mkt-section" style={{ paddingBottom: 100 }}>
        <div className="head"><h3>{t.watchlist}</h3><a>{t.seeAll}</a></div>
        <div className="mkt-list">
          {[D.ASSETS.Forex[0], D.ASSETS.Commodities[0], D.ASSETS.Crypto[0]].map((a, i) => (
            <div key={i} className="mkt-row">
              <div className="glyph">{a.sym.slice(0, 2)}</div>
              <div>
                <div className="nm">{a.sym}</div>
                <div className="sub">{a.nm}</div>
              </div>
              <window.SparkChart seed={a.sym.charCodeAt(0) * a.sym.charCodeAt(1)} up={a.dl >= 0} />
              <div style={{ textAlign: "right" }}>
                <div className="px">{a.px.toFixed(a.px > 1000 ? 1 : 4)}</div>
                <div className={"dl " + (a.dl >= 0 ? "delta-up-bg" : "delta-down-bg")}>{a.dl >= 0 ? "+" : ""}{a.dl.toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavBarMobile t={t} active="home" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2) ASSET DETAIL  (with sticky buy/sell + order book)
// ─────────────────────────────────────────────────────────────
function MobAssetDetail({ lang, chartType, density }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  const a = D.ASSETS.Commodities[0]; // XAU/USD as hero
  useLucide([chartType]);
  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      <div className="mob-top" style={{ paddingBottom: 8 }}>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-text)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{a.sym}</div>
          <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.commodities}</div>
        </div>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-muted)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="star" style={{ width: 18, height: 18 }}></i>
        </button>
      </div>

      <div className="asset-hd">
        <div className="px-row">
          <div className="big-px">{a.px.toFixed(2)}</div>
          <div className={"delta " + (a.dl >= 0 ? "delta-up-bg" : "delta-down-bg")}>{a.dl >= 0 ? "+" : ""}{a.dl.toFixed(2)}%</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--app-muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
          {a.dla >= 0 ? "+" : ""}{a.dla.toFixed(2)} {t.spread.toLowerCase()} {a.spread} · {a.leverage}
        </div>
      </div>

      <div className="tf-row">
        {["1m", "5m", "1H", "1D", "1W", "1M"].map(tf => (
          <button key={tf} className={tf === "1H" ? "active" : ""}>{tf}</button>
        ))}
      </div>

      <div style={{ margin: "0 16px", borderRadius: 14, overflow: "hidden", background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
        <window.PriceChart seed={777} type={chartType} height={210} up={a.dl >= 0} />
      </div>

      {/* indicator strip */}
      <div style={{ display: "flex", gap: 6, padding: "10px 16px 14px", overflowX: "auto" }}>
        {["RSI 64.2", "MACD ↑", "EMA 20", "VWAP", "+12"].map((c, i) => (
          <span key={i} style={{
            fontFamily: "var(--font-mono)", fontSize: 11, padding: "5px 10px",
            background: "var(--app-surface)", border: "1px solid var(--app-border)",
            borderRadius: 9999, color: "var(--app-muted)", whiteSpace: "nowrap",
          }}>{c}</span>
        ))}
      </div>

      {/* book */}
      <div className="mkt-section">
        <div className="head"><h3>{t.depth}</h3><span style={{ fontSize: 10, color: "var(--app-muted)", fontFamily: "var(--font-mono)" }}>L2</span></div>
        <div style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 18, overflow: "hidden" }}>
          <window.OrderBook midPx={a.px} t={t} />
        </div>
      </div>

      {/* About */}
      <div className="mkt-section" style={{ paddingBottom: 160 }}>
        <div className="head"><h3>{t.info}</h3></div>
        <div style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 18, padding: 14, fontSize: 13, color: "var(--app-muted)", lineHeight: 1.55 }}>
          Oro al contado (XAU/USD). Activo refugio por excelencia con cobertura contra la inflación y la volatilidad de divisas. Horario 23h, spread medio {a.spread} desde sesión asiática.
        </div>
      </div>

      <div className="sticky-cta">
        <button className="btn-sell">
          <span style={{ fontSize: 10, opacity: 0.7, fontFamily: "var(--font-mono)" }}>{a.px.toFixed(2) - 0.10}</span>
          {t.sell}
        </button>
        <button className="btn-buy">
          <span style={{ fontSize: 10, opacity: 0.7, fontFamily: "var(--font-mono)" }}>{(a.px + 0.10).toFixed(2)}</span>
          {t.buy}
        </button>
      </div>

      <NavBarMobile t={t} active="markets" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3) MARKETS (watchlist + categories)
// ─────────────────────────────────────────────────────────────
function MobMarkets({ lang }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  useLucide();
  const [tab, setTab] = React.useState("Forex");
  const tabs = [["Forex", t.forex], ["Commodities", t.commodities], ["Indices", t.indices], ["Crypto", t.crypto]];
  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      <MobHeader t={t} lang={lang} title={t.markets} showAvatar={false} />

      {/* search */}
      <div style={{ margin: "0 16px 14px", display: "flex", alignItems: "center", background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 14, padding: "0 14px", height: 44 }}>
        <i data-lucide="search" style={{ width: 16, height: 16, color: "var(--app-muted)", marginRight: 10 }}></i>
        <input placeholder="EUR/USD, BTC, Apple…" style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--app-text)", fontFamily: "var(--font-sans)", fontSize: 14 }} />
        <i data-lucide="sliders-horizontal" style={{ width: 16, height: 16, color: "var(--app-muted)" }}></i>
      </div>

      {/* category tabs */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", overflowX: "auto" }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            background: tab === key ? "var(--app-surface-2)" : "transparent",
            border: "1px solid " + (tab === key ? "var(--app-border)" : "transparent"),
            color: tab === key ? "var(--app-text)" : "var(--app-muted)",
            padding: "8px 14px", borderRadius: 9999,
            fontWeight: 600, fontSize: 13, whiteSpace: "nowrap",
          }}>{label}</button>
        ))}
      </div>

      <div className="mkt-section" style={{ paddingBottom: 100 }}>
        <div className="mkt-list">
          {D.ASSETS[tab].map((a, i) => (
            <div key={i} className="mkt-row">
              <div className="glyph">{a.sym.slice(0, 2)}</div>
              <div>
                <div className="nm">{a.sym}</div>
                <div className="sub">{a.nm}</div>
              </div>
              <window.SparkChart seed={a.sym.charCodeAt(0) * (a.sym.charCodeAt(2) || 7)} up={a.dl >= 0} />
              <div style={{ textAlign: "right" }}>
                <div className="px">{a.px.toFixed(a.px > 1000 ? 1 : 4)}</div>
                <div className={"dl " + (a.dl >= 0 ? "delta-up-bg" : "delta-down-bg")}>{a.dl >= 0 ? "+" : ""}{a.dl.toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavBarMobile t={t} active="markets" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Arc slide-to-confirm — ergonomic curved swipe (spec: "arco del pulgar").
// Drag the thumb left→right; it rises along an arc and fires past 90%.
// ─────────────────────────────────────────────────────────────
function ArcConfirm({ side, label }) {
  const tone = side === "sell" ? "var(--app-down)" : "var(--app-up)";
  const trackRef = React.useRef(null);
  const progRef = React.useRef(0);
  const draggingRef = React.useRef(false);
  const [prog, setProg] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const THUMB = 52, AMP = 26;

  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [side, done, prog === 0]);

  const setFromX = (clientX) => {
    const el = trackRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    let p = (clientX - r.left - THUMB / 2) / (r.width - THUMB);
    p = Math.max(0, Math.min(1, p));
    progRef.current = p; setProg(p);
  };
  const onDown = (e) => { if (done) return; draggingRef.current = true; e.currentTarget.setPointerCapture?.(e.pointerId); setFromX(e.clientX); };
  const onMove = (e) => { if (draggingRef.current) setFromX(e.clientX); };
  const onUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (progRef.current > 0.9) { progRef.current = 1; setProg(1); setDone(true); }
    else { progRef.current = 0; setProg(0); }
  };
  const reset = () => { progRef.current = 0; setProg(0); setDone(false); };

  const lift = -AMP * Math.sin(Math.PI * prog);
  const fillTone = "color-mix(in oklch, " + tone + " 26%, transparent)";

  return (
    <div style={{ position: "relative", height: 84, marginTop: 4 }}>
      {/* arc guide */}
      <svg viewBox="0 0 100 84" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <path d="M 9 58 Q 50 6 91 58" fill="none" stroke={tone} strokeOpacity="0.32" strokeWidth="1.4" strokeDasharray="2 5" strokeLinecap="round" />
      </svg>

      {/* base pill */}
      <div ref={trackRef} style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 56, borderRadius: 9999,
        background: done ? tone : "linear-gradient(90deg, " + fillTone + " " + (prog * 100) + "%, var(--app-surface) " + (prog * 100) + "%)",
        border: "1px solid " + (done ? tone : "var(--app-border)"),
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        transition: draggingRef.current ? "none" : "background .25s ease",
      }}>
        {done ? (
          <span onClick={reset} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--app-bg)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            <i data-lucide="check-circle-2" style={{ width: 18, height: 18 }}></i>
            Orden enviada · {label}
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--app-muted)", fontWeight: 700, fontSize: 13, letterSpacing: "0.02em", opacity: 1 - prog * 1.3, transition: "opacity .1s linear" }}>
            {side === "sell" ? "Desliza para vender" : "Desliza para comprar"}
            <i data-lucide="chevrons-right" style={{ width: 18, height: 18 }}></i>
          </span>
        )}
      </div>

      {/* thumb */}
      {!done && (
        <div
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          style={{
            position: "absolute", bottom: 2, left: "calc(" + prog + " * (100% - " + THUMB + "px))",
            transform: "translateY(" + lift + "px)",
            width: THUMB, height: THUMB, borderRadius: 9999, background: tone,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--app-bg)", cursor: "grab", touchAction: "none",
            boxShadow: "0 8px 22px -6px " + tone, transition: draggingRef.current ? "none" : "left .25s ease, transform .25s ease",
          }}>
          <i data-lucide={side === "sell" ? "trending-down" : "trending-up"} style={{ width: 22, height: 22 }}></i>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4) ORDER TICKET (bottom sheet over asset detail)
// ─────────────────────────────────────────────────────────────
function MobOrderTicket({ lang, chartType }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  const a = D.ASSETS.Forex[0]; // EUR/USD
  const [side, setSide] = React.useState("buy");
  const [otype, setOtype] = React.useState("market");
  const [vol, setVol] = React.useState(0.50);
  useLucide([side, otype]);

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 54 }}>
      {/* dimmed background screen */}
      <div className="mob-top" style={{ paddingBottom: 8, opacity: 0.4 }}>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-text)", width: 38, height: 38 }}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{a.sym}</div>
          <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.forex}</div>
        </div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ opacity: 0.4, padding: "0 16px" }}>
        <div className="px-row" style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <div className="mono" style={{ fontSize: 32, fontWeight: 700 }}>{a.px.toFixed(5)}</div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div className="sheet-scrim" />
      <div className="sheet">
        <div className="handle" />
        <h3>{t.operate} {a.sym}</h3>

        <div className="tabs">
          <button className={"sell " + (side === "sell" ? "active" : "")} onClick={() => setSide("sell")}>{t.sell} · {(a.px - 0.00005).toFixed(5)}</button>
          <button className={"buy "  + (side === "buy"  ? "active" : "")} onClick={() => setSide("buy")}>{t.buy} · {(a.px + 0.00005).toFixed(5)}</button>
        </div>

        <div className="segs">
          {[["market", t.market], ["limit", t.limit], ["stop", t.stop]].map(([k, label]) => (
            <button key={k} className={otype === k ? "active" : ""} onClick={() => setOtype(k)}>{label}</button>
          ))}
        </div>

        <div className="field">
          <div className="lbl">{t.volume}</div>
          <div className="input-row">
            <input value={vol.toFixed(2)} onChange={(e) => setVol(parseFloat(e.target.value) || 0)} />
            <div className="stepper">
              <button onClick={() => setVol(v => Math.max(0.01, +(v - 0.05).toFixed(2)))}>−</button>
              <button onClick={() => setVol(v => +(v + 0.05).toFixed(2))}>+</button>
            </div>
          </div>
        </div>

        {otype !== "market" && (
          <div className="field">
            <div className="lbl">{t.price}</div>
            <div className="input-row">
              <input defaultValue={a.px.toFixed(5)} />
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="field">
            <div className="lbl">{t.sl}</div>
            <div className="input-row"><input defaultValue={(a.px - 0.0010).toFixed(5)} /></div>
          </div>
          <div className="field">
            <div className="lbl">{t.tp}</div>
            <div className="input-row"><input defaultValue={(a.px + 0.0020).toFixed(5)} /></div>
          </div>
        </div>

        <div className="review">
          <div className="rrow"><span className="k">{t.spread}</span><span className="v">{a.spread} pips</span></div>
          <div className="rrow"><span className="k">{t.commission}</span><span className="v">$5.00</span></div>
          <div className="rrow"><span className="k">{t.margin}</span><span className="v">$108.40</span></div>
          <div className="rrow total"><span className="k">{t.totalCost}</span><span className="v">$54,250.00</span></div>
        </div>

        <ArcConfirm side={side} label={`${vol.toFixed(2)} · ${a.sym}`} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5) PORTFOLIO (donut + history)
// ─────────────────────────────────────────────────────────────
function Donut({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cum = 0;
  const r = size / 2; const c = r;
  const stroke = 22;
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
            transform={`rotate(${rot} ${c} ${c})`} strokeLinecap="butt" />
        );
      })}
      <text x={c} y={c - 2} textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={700} fontSize={22} fill="var(--app-text)">{total}%</text>
      <text x={c} y={c + 18} textAnchor="middle" fontSize={10} fill="var(--app-muted)" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>diversified</text>
    </svg>
  );
}

function MobPortfolio({ lang }) {
  const t = window.TAPP_I18N[lang];
  const D = window.TAPP_DATA;
  useLucide();
  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      <MobHeader t={t} lang={lang} title={t.portfolio} showAvatar={false} />

      <div className="balance-card">
        <div className="lbl">{t.allTime}</div>
        <div className="total">+12,408.<span style={{ fontSize: 22, color: "var(--app-muted)" }}>52</span><span className="cur">USD</span></div>
        <div className="pnl delta-up-bg">+34.6% ROI · 18 meses</div>
      </div>

      <div style={{ margin: "0 16px 16px", padding: 18, background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 22, display: "flex", gap: 14, alignItems: "center" }}>
        <Donut data={D.PORTFOLIO_ALLOCATION} size={160} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: 10 }}>{t.allocation}</div>
          {D.PORTFOLIO_ALLOCATION.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
              <span style={{ flex: 1, fontSize: 13 }}>{d.label}</span>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{d.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mkt-section" style={{ paddingBottom: 100 }}>
        <div className="head"><h3>{t.history}</h3><a><i data-lucide="download" style={{ width: 12, height: 12, marginRight: 4 }}></i>CSV</a></div>
        <div className="mkt-list">
          {D.TX_HISTORY.map((tx, i) => {
            const side = tx.side === "Buy" ? "var(--app-up)" : tx.side === "Sell" ? "var(--app-down)" : "var(--app-muted)";
            const filled = tx.status === "Filled";
            return (
              <div key={i} className="pos-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <div>
                  <div className="sym" style={{ fontFamily: tx.sym === "Deposit" ? "var(--font-sans)" : "var(--font-mono)" }}>{tx.sym}</div>
                  <div className="meta">
                    <span style={{ color: side, fontWeight: 600 }}>{tx.side}</span> · {tx.vol !== null ? tx.vol : "—"} · {tx.date}
                  </div>
                </div>
                <div className="px">{tx.px.toFixed(tx.px > 1000 ? 1 : 4)}</div>
                <div className="pnl" style={{
                  background: filled ? "var(--app-up-bg)" : "var(--app-surface-3)",
                  color: filled ? "var(--app-up)" : "var(--app-muted)",
                  fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700,
                }}>{tx.status}</div>
              </div>
            );
          })}
        </div>
      </div>

      <NavBarMobile t={t} active="portfolio" />
    </div>
  );
}

window.MobDashboard = MobDashboard;
window.MobAssetDetail = MobAssetDetail;
window.MobMarkets = MobMarkets;
window.MobOrderTicket = MobOrderTicket;
window.MobPortfolio = MobPortfolio;

// ─────────────────────────────────────────────────────────────
// 6) LOGIN
// ─────────────────────────────────────────────────────────────
function MobLogin({ lang }) {
  const t = window.TAPP_I18N[lang];
  useLucide();
  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 54, padding: "54px 24px 24px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <img src="../../assets/logo-pessaro-trade.svg" alt="Pessaro Trade" style={{ width: 78, height: 78, margin: "0 auto 22px" }} />
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>Pessaro <span style={{ color: "var(--app-accent)" }}>Trade</span></div>
        <div style={{ fontSize: 13, color: "var(--app-muted)", marginTop: 6 }}>Acceso seguro a su cuenta</div>

        <div style={{ marginTop: 36, textAlign: "left" }}>
          <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Correo electrónico</div>
          <div style={{ display: "flex", alignItems: "center", background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, padding: "0 14px", height: 52 }}>
            <i data-lucide="mail" style={{ width: 16, height: 16, color: "var(--app-muted)", marginRight: 10 }}></i>
            <input defaultValue="francisco@pessaro.cl" style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--app-text)", fontFamily: "var(--font-sans)", fontSize: 15 }} />
          </div>

          <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600, marginTop: 14, marginBottom: 6 }}>Contraseña</div>
          <div style={{ display: "flex", alignItems: "center", background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, padding: "0 14px", height: 52 }}>
            <i data-lucide="lock" style={{ width: 16, height: 16, color: "var(--app-muted)", marginRight: 10 }}></i>
            <input type="password" defaultValue="••••••••••••" style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--app-text)", fontFamily: "var(--font-mono)", fontSize: 15, letterSpacing: "0.1em" }} />
            <i data-lucide="eye" style={{ width: 16, height: 16, color: "var(--app-muted)" }}></i>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--app-muted)" }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: "var(--app-accent)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <i data-lucide="check" style={{ width: 12, height: 12, color: "var(--app-bg)" }}></i>
              </span>
              Recordarme
            </label>
            <a style={{ fontSize: 12, color: "var(--app-accent)", fontWeight: 600 }}>¿Olvidaste tu contraseña?</a>
          </div>
        </div>

        <button style={{ marginTop: 24, width: "100%", height: 54, borderRadius: 14, background: "var(--app-primary)", color: "white", border: 0, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "var(--app-glow)" }}>
          Iniciar sesión
          <i data-lucide="arrow-right" style={{ width: 18, height: 18 }}></i>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--app-border)" }} />
          <span style={{ fontSize: 11, color: "var(--app-muted)" }}>o continúa con</span>
          <div style={{ flex: 1, height: 1, background: "var(--app-border)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button style={{ height: 50, borderRadius: 12, background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 13 }}>
            <i data-lucide="fingerprint" style={{ width: 18, height: 18, color: "var(--app-accent)" }}></i>
            Face ID
          </button>
          <button style={{ height: 50, borderRadius: 12, background: "var(--app-surface)", border: "1px solid var(--app-border)", color: "var(--app-text)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600, fontSize: 13 }}>
            <i data-lucide="key-round" style={{ width: 18, height: 18, color: "var(--app-accent)" }}></i>
            Passkey
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", paddingBottom: 4 }}>
        <span style={{ fontSize: 13, color: "var(--app-muted)" }}>¿Nuevo en Pessaro?  </span>
        <a style={{ fontSize: 13, color: "var(--app-accent)", fontWeight: 700 }}>Abrir cuenta</a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7) KYC (step 2 of 3 — biometric / selfie scan)
// ─────────────────────────────────────────────────────────────
function MobKyc({ lang }) {
  const t = window.TAPP_I18N[lang];
  useLucide();
  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 54 }}>
      {/* Header */}
      <div className="mob-top" style={{ paddingBottom: 4 }}>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-text)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Verificación de identidad</div>
          <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Paso 2 de 3</div>
        </div>
        <button style={{ background: "transparent", border: 0, color: "var(--app-muted)", width: 38, height: 38, fontSize: 12 }}>Salir</button>
      </div>

      {/* Step progress */}
      <div style={{ padding: "10px 24px 18px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 9999,
              background: i <= 2 ? "var(--app-accent)" : "var(--app-surface-2)",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--app-muted)" }}>
          <span style={{ color: "var(--app-accent)", fontWeight: 600 }}>✓ Datos personales</span>
          <span style={{ color: "var(--app-accent)", fontWeight: 600 }}>Documento</span>
          <span>Selfie biométrica</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8, textAlign: "center" }}>
          Captura tu cédula <span style={{ color: "var(--app-accent)" }}>de identidad</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--app-muted)", textAlign: "center", lineHeight: 1.5, marginBottom: 24 }}>
          Coloca el frente de tu documento dentro del marco. Nuestro sistema OCR detectará los datos automáticamente.
        </div>

        {/* Document capture mock */}
        <div style={{ position: "relative", flex: 1, marginBottom: 16, borderRadius: 22, background: "var(--app-surface)", border: "1px solid var(--app-border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* dark camera mock */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, oklch(0.18 0.05 260), oklch(0.10 0.03 260))" }} />
          {/* document outline */}
          <div style={{
            position: "relative", width: "82%", aspectRatio: "1.586 / 1",
            border: "2px dashed var(--app-accent)",
            borderRadius: 14,
            background: "linear-gradient(180deg, oklch(0.85 0.05 240 / 0.10), oklch(0.85 0.05 240 / 0.04))",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            padding: 14, overflow: "hidden",
          }}>
            {/* corners */}
            {[{t:0,l:0,r:"50%",b:"50%"},{t:0,r:0,l:"50%",b:"50%"},{b:0,l:0,r:"50%",t:"50%"},{b:0,r:0,l:"50%",t:"50%"}].map((p, i) => (
              <span key={i} style={{
                position: "absolute", width: 22, height: 22,
                ...p,
                borderColor: "var(--app-accent)",
                borderStyle: "solid",
                borderWidth: `${p.t === 0 ? "3px" : 0} ${p.r === 0 ? "3px" : 0} ${p.b === 0 ? "3px" : 0} ${p.l === 0 ? "3px" : 0}`,
                borderRadius: 4,
              }} />
            ))}
            <div>
              <div style={{ fontSize: 9, color: "var(--app-muted-2)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>REPÚBLICA DE CHILE</div>
              <div style={{ fontSize: 8, color: "var(--app-muted-2)", marginTop: 2 }}>SERVICIO DE REGISTRO CIVIL</div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ width: 50, height: 64, background: "oklch(0.22 0.04 260)", borderRadius: 4, border: "1px solid var(--app-border)" }} />
              <div style={{ flex: 1, opacity: 0.7 }}>
                <div style={{ fontSize: 9, color: "var(--app-muted-2)", letterSpacing: "0.06em" }}>NOMBRES</div>
                <div style={{ fontSize: 11, color: "var(--app-text)", fontWeight: 600 }}>FRANCISCO J. ROJAS</div>
                <div style={{ fontSize: 9, color: "var(--app-muted-2)", marginTop: 4, letterSpacing: "0.06em" }}>RUN</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--app-text)", fontWeight: 600 }}>13.245.802-7</div>
              </div>
            </div>
          </div>

          {/* OCR scanning bar */}
          <div style={{
            position: "absolute", left: "9%", right: "9%", top: "50%",
            height: 2, background: "var(--app-accent)",
            boxShadow: "0 0 18px var(--app-accent)",
          }} />

          {/* status pill */}
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 9999, background: "oklch(0.18 0.05 260 / 0.80)", border: "1px solid var(--app-border)", backdropFilter: "blur(8px)", fontSize: 11, color: "var(--app-text)", fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: "var(--app-accent)", animation: "pulse 1.4s infinite" }} />
              Reconociendo datos…
            </span>
          </div>
        </div>

        {/* Hints */}
        <div style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 14, padding: 14, marginBottom: 14 }}>
          {[
            ["check-circle-2", "Iluminación suficiente", true],
            ["check-circle-2", "Documento centrado", true],
            ["circle", "Sin reflejos sobre la foto", false],
          ].map(([icon, txt, ok], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
              <i data-lucide={icon} style={{ width: 16, height: 16, color: ok ? "var(--app-up)" : "var(--app-muted)" }}></i>
              <span style={{ fontSize: 13, color: ok ? "var(--app-text)" : "var(--app-muted)" }}>{txt}</span>
            </div>
          ))}
        </div>

        <button style={{ width: "100%", height: 54, borderRadius: 14, background: "var(--app-accent)", color: "var(--app-bg)", border: 0, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <i data-lucide="camera" style={{ width: 18, height: 18 }}></i>
          Capturar documento
        </button>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "var(--app-muted)" }}>
          Tus datos están protegidos por encriptación AES-256-GCM
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 8) ONBOARDING — gamified risk-profile (step 1 of 3)
//    Original Pessaro design: pick an investor profile; selection
//    pre-tunes the app's default leverage, watchlist and risk caps.
// ─────────────────────────────────────────────────────────────
function MobOnboard({ lang }) {
  const t = window.TAPP_I18N[lang];
  const [sel, setSel] = React.useState("activo");
  useLucide([sel]);

  const profiles = [
    {
      key: "conservador",
      icon: "shield",
      title: "Conservador",
      desc: "Prefiero dividendos estables y baja volatilidad.",
      tags: ["1:30 máx.", "ETFs · Bonos"],
      tone: "var(--app-up)",
    },
    {
      key: "activo",
      icon: "activity",
      title: "Activo",
      desc: "Opero rupturas de rango durante la sesión.",
      tags: ["1:100 máx.", "Forex · Índices"],
      tone: "var(--app-accent)",
    },
    {
      key: "pro",
      icon: "flame",
      title: "Profesional",
      desc: "Opero derivados con apalancamiento avanzado.",
      tags: ["1:500 máx.", "CFD · Opciones"],
      tone: "var(--app-down)",
    },
  ];

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 54 }}>
      {/* Header */}
      <div className="mob-top" style={{ paddingBottom: 4 }}>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-text)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Perfil de inversor</div>
          <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Paso 1 de 3</div>
        </div>
        <button style={{ background: "transparent", border: 0, color: "var(--app-muted)", width: 38, height: 38, fontSize: 12 }}>Salir</button>
      </div>

      {/* Step progress */}
      <div style={{ padding: "10px 24px 18px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 9999,
              background: i <= 1 ? "var(--app-accent)" : "var(--app-surface-2)",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--app-muted)" }}>
          <span style={{ color: "var(--app-accent)", fontWeight: 600 }}>Perfil de riesgo</span>
          <span>Documento</span>
          <span>Selfie biométrica</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 24px", display: "flex", flexDirection: "column", overflow: "auto" }}>
        <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8 }}>
          ¿Cuál es tu <span style={{ color: "var(--app-accent)" }}>perfil real</span> en el mercado?
        </div>
        <div style={{ fontSize: 13, color: "var(--app-muted)", lineHeight: 1.5, marginBottom: 22 }}>
          Adaptamos tus límites de apalancamiento, tu lista de seguimiento y las alertas de riesgo a tu estilo. Podrás cambiarlo cuando quieras.
        </div>

        {/* Profile cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {profiles.map(p => {
            const active = sel === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setSel(p.key)}
                style={{
                  textAlign: "left",
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: 16,
                  borderRadius: 18,
                  background: active ? "var(--app-surface-2)" : "var(--app-surface)",
                  border: "1.5px solid " + (active ? p.tone : "var(--app-border)"),
                  boxShadow: active ? "0 0 0 4px color-mix(in oklch, " + p.tone + " 14%, transparent)" : "none",
                  cursor: "pointer",
                  transition: "border-color .18s ease, background .18s ease",
                }}
              >
                <span style={{
                  flexShrink: 0, width: 44, height: 44, borderRadius: 12,
                  background: "color-mix(in oklch, " + p.tone + " 16%, transparent)",
                  border: "1px solid color-mix(in oklch, " + p.tone + " 35%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i data-lucide={p.icon} style={{ width: 20, height: 20, color: p.tone }}></i>
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--app-text)" }}>{p.title}</span>
                    <span style={{
                      width: 20, height: 20, borderRadius: 9999, flexShrink: 0,
                      border: "2px solid " + (active ? p.tone : "var(--app-border)"),
                      background: active ? p.tone : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {active && <i data-lucide="check" style={{ width: 12, height: 12, color: "var(--app-bg)" }}></i>}
                    </span>
                  </span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--app-muted)", lineHeight: 1.45, marginTop: 3 }}>{p.desc}</span>
                  <span style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    {p.tags.map((tg, i) => (
                      <span key={i} style={{
                        fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600,
                        padding: "3px 8px", borderRadius: 9999,
                        background: "var(--app-surface-3, var(--app-surface))",
                        border: "1px solid var(--app-border)", color: "var(--app-muted)",
                      }}>{tg}</span>
                    ))}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "0 2px" }}>
          <i data-lucide="info" style={{ width: 14, height: 14, color: "var(--app-muted)", flexShrink: 0 }}></i>
          <span style={{ fontSize: 11, color: "var(--app-muted)", lineHeight: 1.4 }}>
            Un test de 60s ajustará tu perfil según cómo reaccionas a un mercado real.
          </span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "14px 24px calc(14px + env(safe-area-inset-bottom))" }}>
        <button style={{ width: "100%", height: 54, borderRadius: 14, background: "var(--app-accent)", color: "var(--app-bg)", border: 0, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          Continuar
          <i data-lucide="arrow-right" style={{ width: 18, height: 18 }}></i>
        </button>
      </div>
    </div>
  );
}

window.MobOnboard = MobOnboard;
window.MobLogin = MobLogin;
window.MobKyc = MobKyc;

// ─────────────────────────────────────────────────────────────
// 9) VINCULAR BRÓKER — lista privada de servidores Pessaro Capital
//    El usuario conecta su cuenta personal de trading eligiendo un
//    servidor de la lista privada (Real / Demo). Estilo MT5 server pick.
// ─────────────────────────────────────────────────────────────
const PESSARO_SERVERS = [
  { key: "prime",  name: "Pessaro Prime",  server: "Pessaro-Prime-Live",  region: "LD4 · Londres",        exec: "ECN", lat: 12, env: "real", lev: "1:500" },
  { key: "global", name: "Pessaro Global", server: "Pessaro-Global-Live", region: "NY4 · Nueva York",     exec: "ECN", lat: 31, env: "real", lev: "1:200" },
  { key: "asia",   name: "Pessaro Asia",   server: "Pessaro-Asia-Live",   region: "TY3 · Tokio",          exec: "STP", lat: 88, env: "real", lev: "1:100" },
  { key: "demo",   name: "Pessaro Demo",   server: "Pessaro-Demo",        region: "Cuenta de práctica",   exec: "Demo", lat: 18, env: "demo", lev: "1:500" },
];

function MobBrokerConnect({ lang }) {
  const t = window.TAPP_I18N[lang];
  const [env, setEnv] = React.useState("real");
  const [sel, setSel] = React.useState("prime");
  useLucide([env, sel]);

  const list = PESSARO_SERVERS.filter(s => s.env === env);
  const latColor = (l) => l < 25 ? "var(--app-up)" : l < 60 ? "var(--app-accent)" : "var(--app-down)";

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 54 }}>
      {/* Header */}
      <div className="mob-top" style={{ paddingBottom: 4 }}>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-text)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Vincular cuenta de trading</div>
          <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Lista privada Pessaro</div>
        </div>
        <button style={{ background: "transparent", border: 0, color: "var(--app-muted)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="help-circle" style={{ width: 18, height: 18 }}></i>
        </button>
      </div>

      <div style={{ flex: 1, padding: "8px 24px 0", display: "flex", flexDirection: "column", overflow: "auto" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Conecta tu cuenta a un <span style={{ color: "var(--app-accent)" }}>servidor Pessaro</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--app-muted)", lineHeight: 1.5, marginTop: 8, marginBottom: 18 }}>
          Selecciona el servidor de liquidez asignado a tu cuenta. Si no estás seguro, tu asesor te indicó cuál usar al abrir la cuenta.
        </div>

        {/* Real / Demo segmented */}
        <div style={{ display: "flex", gap: 6, padding: 4, background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, marginBottom: 16 }}>
          {[["real", "Cuenta real"], ["demo", "Demo"]].map(([k, label]) => (
            <button key={k} onClick={() => { setEnv(k); setSel(PESSARO_SERVERS.find(s => s.env === k).key); }} style={{
              flex: 1, height: 38, borderRadius: 9, border: 0, cursor: "pointer",
              background: env === k ? "var(--app-surface-3)" : "transparent",
              color: env === k ? "var(--app-text)" : "var(--app-muted)",
              fontWeight: 600, fontSize: 13,
            }}>{label}</button>
          ))}
        </div>

        {/* server list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map(s => {
            const active = sel === s.key;
            return (
              <button key={s.key} onClick={() => setSel(s.key)} style={{
                textAlign: "left", display: "flex", alignItems: "center", gap: 13, padding: 14, borderRadius: 16,
                background: active ? "var(--app-surface-2)" : "var(--app-surface)",
                border: "1.5px solid " + (active ? "var(--app-accent)" : "var(--app-border)"),
                boxShadow: active ? "0 0 0 4px color-mix(in oklch, var(--app-accent) 13%, transparent)" : "none",
                cursor: "pointer", transition: "border-color .18s ease, background .18s ease",
              }}>
                <span style={{
                  flexShrink: 0, width: 42, height: 42, borderRadius: 11,
                  background: "linear-gradient(135deg, var(--app-primary), var(--app-accent))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--app-bg)", fontWeight: 800, fontSize: 17,
                }}>P</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--app-text)" }}>{s.name}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em", padding: "2px 6px", borderRadius: 6, textTransform: "uppercase",
                      background: "color-mix(in oklch, var(--app-trust) 18%, transparent)", color: "var(--app-trust)", border: "1px solid color-mix(in oklch, var(--app-trust) 35%, transparent)" }}>{s.exec}</span>
                  </span>
                  <span className="mono" style={{ display: "block", fontSize: 11, color: "var(--app-muted)", marginTop: 3 }}>{s.server}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 7, fontSize: 11, color: "var(--app-muted)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i data-lucide="map-pin" style={{ width: 12, height: 12 }}></i>{s.region}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 9999, background: latColor(s.lat) }} />
                      <span className="mono">{s.lat}ms</span>
                    </span>
                  </span>
                </span>
                <span style={{
                  width: 20, height: 20, borderRadius: 9999, flexShrink: 0,
                  border: "2px solid " + (active ? "var(--app-accent)" : "var(--app-border)"),
                  background: active ? "var(--app-accent)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{active && <i data-lucide="check" style={{ width: 12, height: 12, color: "var(--app-bg)" }}></i>}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "12px 14px", background: "color-mix(in oklch, var(--app-trust) 9%, transparent)", border: "1px solid color-mix(in oklch, var(--app-trust) 22%, transparent)", borderRadius: 12 }}>
          <i data-lucide="shield-check" style={{ width: 18, height: 18, color: "var(--app-trust)", flexShrink: 0 }}></i>
          <span style={{ fontSize: 11.5, color: "var(--app-muted)", lineHeight: 1.4 }}>
            Fondos segregados y servidores regulados. Pessaro nunca puede retirar de tu cuenta.
          </span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "14px 24px calc(14px + env(safe-area-inset-bottom))" }}>
        <button style={{ width: "100%", height: 54, borderRadius: 14, background: "var(--app-accent)", color: "var(--app-bg)", border: 0, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          Continuar con {PESSARO_SERVERS.find(s => s.key === sel).name}
          <i data-lucide="arrow-right" style={{ width: 18, height: 18 }}></i>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 10) CREDENCIALES DEL BRÓKER — MT5-style (servidor + cuenta + clave)
// ─────────────────────────────────────────────────────────────
function MobBrokerCredentials({ lang }) {
  const t = window.TAPP_I18N[lang];
  const [investor, setInvestor] = React.useState(false);
  useLucide([investor]);
  const srv = PESSARO_SERVERS[0];

  const Field = ({ label, icon, value, mono, type, hint }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12, padding: "0 14px", height: 52 }}>
        <i data-lucide={icon} style={{ width: 16, height: 16, color: "var(--app-muted)", marginRight: 10 }}></i>
        <input type={type || "text"} defaultValue={value} style={{ flex: 1, background: "transparent", border: 0, outline: 0, color: "var(--app-text)", fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)", fontSize: 15, letterSpacing: type === "password" ? "0.12em" : "0" }} />
        {type === "password" && <i data-lucide="eye" style={{ width: 16, height: 16, color: "var(--app-muted)" }}></i>}
      </div>
      {hint && <div style={{ fontSize: 11, color: "var(--app-muted)", marginTop: 5 }}>{hint}</div>}
    </div>
  );

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 54 }}>
      <div className="mob-top" style={{ paddingBottom: 4 }}>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-text)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Acceso al bróker</div>
          <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Credenciales MT5</div>
        </div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ flex: 1, padding: "8px 24px 0", display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* selected server chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, background: "var(--app-surface)", border: "1px solid var(--app-border)", marginBottom: 20 }}>
          <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg, var(--app-primary), var(--app-accent))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-bg)", fontWeight: 800, fontSize: 16 }}>P</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{srv.name}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--app-muted)", marginTop: 2 }}>{srv.server} · {srv.region}</div>
          </div>
          <a style={{ fontSize: 12, color: "var(--app-accent)", fontWeight: 600 }}>Cambiar</a>
        </div>

        <Field label="Número de cuenta" icon="hash" value="50 421 887" mono hint="Lo encuentras en el correo de bienvenida de Pessaro." />
        <Field label={investor ? "Contraseña de inversor" : "Contraseña"} icon="lock" value="••••••••••••" type="password" mono />

        {/* investor (read-only) toggle */}
        <button onClick={() => setInvestor(v => !v)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, background: "var(--app-surface)", border: "1px solid var(--app-border)", cursor: "pointer", marginTop: 2 }}>
          <i data-lucide="glasses" style={{ width: 18, height: 18, color: "var(--app-trust)", flexShrink: 0 }}></i>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--app-text)" }}>Conectar en modo inversor</span>
            <span style={{ display: "block", fontSize: 11.5, color: "var(--app-muted)", marginTop: 2 }}>Solo lectura — ver posiciones sin poder operar.</span>
          </span>
          <span style={{ width: 44, height: 26, borderRadius: 9999, flexShrink: 0, background: investor ? "var(--app-accent)" : "var(--app-surface-3)", position: "relative", transition: "background .18s ease" }}>
            <span style={{ position: "absolute", top: 3, left: investor ? 21 : 3, width: 20, height: 20, borderRadius: 9999, background: "var(--app-bg)", transition: "left .18s ease" }} />
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "0 2px" }}>
          <i data-lucide="lock-keyhole" style={{ width: 14, height: 14, color: "var(--app-muted)", flexShrink: 0 }}></i>
          <span style={{ fontSize: 11, color: "var(--app-muted)", lineHeight: 1.4 }}>
            Tus credenciales se cifran con AES-256-GCM y nunca se almacenan en el dispositivo.
          </span>
        </div>
      </div>

      <div style={{ padding: "14px 24px calc(14px + env(safe-area-inset-bottom))" }}>
        <button style={{ width: "100%", height: 54, borderRadius: 14, background: "var(--app-primary)", color: "white", border: 0, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "var(--app-glow)" }}>
          <i data-lucide="plug" style={{ width: 18, height: 18 }}></i>
          Conectar cuenta
        </button>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 12 }}>
          <span style={{ color: "var(--app-muted)" }}>¿Sin credenciales? </span>
          <a style={{ color: "var(--app-accent)", fontWeight: 700 }}>Solicítalas a tu asesor</a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 11) CUENTAS VINCULADAS — selector + accesos directos
// ─────────────────────────────────────────────────────────────
function MobAccounts({ lang }) {
  const t = window.TAPP_I18N[lang];
  const [active, setActive] = React.useState("a1");
  useLucide([active]);

  const accounts = [
    { id: "a1", name: "Prime · Real",  acct: "50 421 887", server: "Pessaro-Prime-Live",  bal: "48,294.71", ccy: "USD", lev: "1:500", pnl: 2.74, status: "Conectada", env: "real" },
    { id: "a2", name: "Copy · Real",   acct: "50 730 114", server: "Pessaro-Global-Live", bal: "12,860.00", ccy: "USD", lev: "1:200", pnl: -0.81, status: "Conectada", env: "real" },
    { id: "a3", name: "Práctica · Demo", acct: "90 118 552", server: "Pessaro-Demo",      bal: "100,000.00", ccy: "USD", lev: "1:500", pnl: 5.12, status: "Demo", env: "demo" },
  ];

  const shortcuts = [
    { icon: "arrow-down-to-line", label: "Depositar", tone: "var(--app-accent)" },
    { icon: "layout-dashboard",   label: "Plataforma", tone: "var(--app-primary)" },
    { icon: "receipt-text",       label: "Histórico",  tone: "var(--app-trust)" },
    { icon: "headset",            label: "Soporte",    tone: "var(--app-muted)" },
  ];

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      <MobHeader t={t} lang={lang} title="Mis cuentas" showAvatar={true} />

      <div style={{ padding: "0 16px" }}>
        {/* account cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
          {accounts.map(a => {
            const sel = active === a.id;
            const up = a.pnl >= 0;
            return (
              <button key={a.id} onClick={() => setActive(a.id)} style={{
                textAlign: "left", display: "block", width: "100%", padding: 16, borderRadius: 18,
                background: sel ? "var(--app-surface-2)" : "var(--app-surface)",
                border: "1.5px solid " + (sel ? "var(--app-accent)" : "var(--app-border)"),
                boxShadow: sel ? "0 0 0 4px color-mix(in oklch, var(--app-accent) 12%, transparent)" : "none",
                cursor: "pointer", transition: "border-color .18s ease, background .18s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--app-text)" }}>{a.name}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em", padding: "2px 7px", borderRadius: 6, textTransform: "uppercase",
                    background: a.env === "demo" ? "var(--app-surface-3)" : "color-mix(in oklch, var(--app-up) 16%, transparent)",
                    color: a.env === "demo" ? "var(--app-muted)" : "var(--app-up)" }}>{a.status}</span>
                  <span style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: 9999, border: "2px solid " + (sel ? "var(--app-accent)" : "var(--app-border)"), background: sel ? "var(--app-accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {sel && <i data-lucide="check" style={{ width: 11, height: 11, color: "var(--app-bg)" }}></i>}
                  </span>
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--app-muted)", marginTop: 4 }}>#{a.acct} · {a.server}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Balance</div>
                    <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--app-text)", marginTop: 2 }}>{a.bal}<span style={{ fontSize: 12, color: "var(--app-muted)", marginLeft: 5 }}>{a.ccy}</span></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className={"pnl " + (up ? "delta-up-bg" : "delta-down-bg")} style={{ display: "inline-flex", padding: "4px 9px", borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>{up ? "+" : ""}{a.pnl.toFixed(2)}%</div>
                    <div style={{ fontSize: 10.5, color: "var(--app-muted)", marginTop: 6, fontFamily: "var(--font-mono)" }}>Apal. {a.lev}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* accesos directos */}
        <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Accesos directos</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 22 }}>
          {shortcuts.map((s, i) => (
            <button key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 6px", borderRadius: 16, background: "var(--app-surface)", border: "1px solid var(--app-border)", cursor: "pointer" }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: "color-mix(in oklch, " + s.tone + " 15%, transparent)", border: "1px solid color-mix(in oklch, " + s.tone + " 32%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i data-lucide={s.icon} style={{ width: 18, height: 18, color: s.tone }}></i>
              </span>
              <span style={{ fontSize: 11, color: "var(--app-text)", fontWeight: 600 }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* link new account */}
        <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 14, background: "transparent", border: "1.5px dashed var(--app-border)", color: "var(--app-accent)", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 100 }}>
          <i data-lucide="plus" style={{ width: 18, height: 18 }}></i>
          Vincular nueva cuenta
        </button>
      </div>

      <NavBarMobile t={t} active="profile" />
    </div>
  );
}

window.MobBrokerConnect = MobBrokerConnect;
window.MobBrokerCredentials = MobBrokerCredentials;
window.MobAccounts = MobAccounts;

// ─────────────────────────────────────────────────────────────
// 12) SEÑALES & ALERTAS — "The Signal Framework" feed
//     Alertas categorizadas con motivo (predictivas), impacto en la
//     cartera, acciones directas y nivel de urgencia háptica.
// ─────────────────────────────────────────────────────────────
const SIGNAL_FEED = [
  {
    id: "s1", kind: "signal", tone: "var(--app-accent)", icon: "zap",
    tag: "Señal · Volatilidad", time: "ahora", unread: true,
    title: "AAPL rompió el soporte de $180.00",
    body: "Ruptura con 3× el volumen promedio. Momentum bajista en M15.",
    spark: { seed: 1180, up: false },
    actions: [["Ver gráfico", "line-chart", false], ["Operar", "trending-down", true]],
  },
  {
    id: "s2", kind: "risk", tone: "var(--app-down)", icon: "shield-alert",
    tag: "Riesgo · Margen", time: "hace 2 min", unread: true, heartbeat: true,
    title: "Margen libre por debajo del 30%",
    body: "Cuenta Prime · Real (#50 421 887). Considera reducir exposición o depositar.",
    actions: [["Cerrar posición", "x-octagon", false], ["Depositar", "arrow-down-to-line", true]],
  },
  {
    id: "s3", kind: "price", tone: "var(--app-up)", icon: "target",
    tag: "Precio · Objetivo", time: "hace 14 min",
    title: "XAU/USD alcanzó tu objetivo 2,400.00",
    body: "Take profit sugerido a +1.8% sobre el precio de entrada.",
    spark: { seed: 2400, up: true },
    actions: [["Tomar ganancias", "circle-check", true]],
  },
  {
    id: "s4", kind: "news", tone: "var(--app-trust)", icon: "newspaper",
    tag: "Noticia · Macro", time: "hace 38 min",
    title: "La Fed mantiene las tasas de interés",
    body: "Impacto correlacionado en tu lista de seguimiento:",
    impact: [["BTC/USD", "+3.2%", true], ["US100", "+1.1%", true], ["USD/JPY", "-0.6%", false]],
  },
  {
    id: "s5", kind: "account", tone: "var(--app-muted)", icon: "wallet",
    tag: "Cuenta", time: "hace 1 h",
    title: "Depósito de USD 5,000 acreditado",
    body: "Disponible para operar en Prime · Real.",
  },
];

function MobSignals({ lang }) {
  const t = window.TAPP_I18N[lang];
  const [filter, setFilter] = React.useState("all");
  useLucide([filter]);
  const filters = [["all", "Todas"], ["signal", "Señales"], ["price", "Precio"], ["risk", "Riesgo"], ["news", "Noticias"]];
  const list = SIGNAL_FEED.filter(s => filter === "all" || s.kind === filter);

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      {/* Header */}
      <div className="mob-top" style={{ paddingBottom: 8 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Señales</div>
          <div style={{ fontSize: 12, color: "var(--app-muted)", marginTop: 2 }}>2 sin leer · motor predictivo activo</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-muted)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i data-lucide="check-check" style={{ width: 17, height: 17 }}></i>
          </button>
          <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-muted)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i data-lucide="settings-2" style={{ width: 17, height: 17 }}></i>
          </button>
        </div>
      </div>

      {/* filter chips */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", overflowX: "auto" }}>
        {filters.map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            background: filter === k ? "var(--app-surface-3)" : "transparent",
            border: "1px solid " + (filter === k ? "var(--app-border)" : "var(--app-border)"),
            color: filter === k ? "var(--app-text)" : "var(--app-muted)",
            padding: "7px 14px", borderRadius: 9999, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      {/* feed */}
      <div style={{ padding: "0 16px 100px", display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map(s => (
          <div key={s.id} style={{
            position: "relative", padding: 15, borderRadius: 18,
            background: "var(--app-surface)", border: "1px solid var(--app-border)",
            overflow: "hidden",
          }}>
            {/* left urgency rail */}
            <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: s.tone }} />
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{
                position: "relative", flexShrink: 0, width: 40, height: 40, borderRadius: 11,
                background: "color-mix(in oklch, " + s.tone + " 15%, transparent)",
                border: "1px solid color-mix(in oklch, " + s.tone + " 32%, transparent)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i data-lucide={s.icon} style={{ width: 19, height: 19, color: s.tone }}></i>
                {s.heartbeat && <span style={{ position: "absolute", inset: -3, borderRadius: 14, border: "1.5px solid " + s.tone, animation: "pulse 1.1s infinite", opacity: 0.5 }} />}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", color: s.tone }}>{s.tag}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--app-muted)", fontFamily: "var(--font-mono)" }}>{s.time}</span>
                  {s.unread && <span style={{ width: 7, height: 7, borderRadius: 9999, background: "var(--app-accent)" }} />}
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--app-text)", marginTop: 5, lineHeight: 1.25 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--app-muted)", marginTop: 4, lineHeight: 1.45 }}>{s.body}</div>

                {s.spark && (
                  <div style={{ marginTop: 10, height: 40 }}>
                    <window.SparkChart seed={s.spark.seed} up={s.spark.up} />
                  </div>
                )}

                {s.impact && (
                  <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                    {s.impact.map(([sym, dl, up], i) => (
                      <span key={i} style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
                        padding: "4px 9px", borderRadius: 9999,
                        background: up ? "var(--app-up-bg)" : "var(--app-down-bg)",
                        color: up ? "var(--app-up)" : "var(--app-down)",
                      }}>{sym} <span style={{ opacity: 0.85 }}>{dl}</span></span>
                    ))}
                  </div>
                )}

                {s.actions && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {s.actions.map(([label, icon, primary], i) => (
                      <button key={i} style={{
                        flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                        height: 38, borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
                        border: primary ? "0" : "1px solid var(--app-border)",
                        background: primary ? s.tone : "transparent",
                        color: primary ? "var(--app-bg)" : "var(--app-text)",
                      }}>
                        <i data-lucide={icon} style={{ width: 15, height: 15 }}></i>{label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <NavBarMobile t={t} active="home" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 13) PUSH ENRIQUECIDO — pantalla bloqueada (rich push iOS)
// ─────────────────────────────────────────────────────────────
function MobLockScreen({ lang }) {
  useLucide();
  return (
    <div className="tapp" style={{
      display: "flex", flexDirection: "column", overflow: "hidden",
      background: "linear-gradient(170deg, oklch(0.20 0.06 270) 0%, oklch(0.12 0.04 265) 45%, oklch(0.08 0.02 260) 100%)",
    }}>
      {/* time + date */}
      <div style={{ textAlign: "center", paddingTop: 78 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
          <i data-lucide="lock" style={{ width: 13, height: 13 }}></i>
          viernes, 30 de mayo
        </div>
        <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: "-0.03em", color: "white", lineHeight: 1, marginTop: 6, fontFamily: "var(--font-sans)" }}>9:41</div>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* rich push card */}
      <div style={{ padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textAlign: "center", fontWeight: 600, letterSpacing: "0.03em" }}>NOTIFICACIÓN · mantén pulsado para acciones</div>

        {/* expanded critical signal */}
        <div style={{
          borderRadius: 22, overflow: "hidden",
          background: "rgba(28,32,44,0.72)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}>
          <div style={{ padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, var(--app-primary), var(--app-accent))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--app-bg)", fontWeight: 800, fontSize: 14 }}>P</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Pessaro Trade</span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, color: "var(--app-accent)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <i data-lucide="zap" style={{ width: 12, height: 12 }}></i>Señal
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>ahora</span>
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: "white", lineHeight: 1.3 }}>BTC rompió resistencia en $69,400</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginTop: 4, lineHeight: 1.45 }}>
              +5% tras la aprobación del ETF en Hong Kong. Tu cartera cripto subió +3.2%.
            </div>

            {/* mini chart */}
            <div style={{ marginTop: 12, height: 64, borderRadius: 12, overflow: "hidden", background: "rgba(0,0,0,0.25)", padding: "8px 6px" }}>
              <window.SparkChart seed={6940} up={true} />
            </div>

            {/* rich actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: 40, borderRadius: 11, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "white", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                <i data-lucide="sliders-horizontal" style={{ width: 15, height: 15 }}></i>Ajustar SL
              </button>
              <button style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, height: 40, borderRadius: 11, border: 0, background: "var(--app-accent)", color: "var(--app-bg)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                <i data-lucide="circle-check" style={{ width: 15, height: 15 }}></i>Tomar ganancias
              </button>
            </div>
          </div>
        </div>

        {/* stacked collapsed notification underneath */}
        <div style={{
          margin: "0 10px", borderRadius: 18, padding: "12px 14px",
          background: "rgba(28,32,44,0.5)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: "color-mix(in oklch, var(--app-down) 24%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i data-lucide="shield-alert" style={{ width: 14, height: 14, color: "var(--app-down)" }}></i>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Margen libre por debajo del 30%</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Pessaro Trade · hace 2 min</div>
          </div>
        </div>
      </div>

      {/* bottom hint */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingBottom: 18 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
          <i data-lucide="fingerprint" style={{ width: 16, height: 16 }}></i>
          Desliza para abrir
        </div>
        <div style={{ width: 130, height: 5, borderRadius: 9999, background: "rgba(255,255,255,0.35)" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 14) REGLAS DE ALERTAS — tipos + niveles de urgencia háptica
// ─────────────────────────────────────────────────────────────
function MobAlertRules({ lang }) {
  const t = window.TAPP_I18N[lang];
  const [on, setOn] = React.useState({ vol: true, brk: true, tgt: true, margin: true, news: false, acct: true });
  useLucide([JSON.stringify(on)]);

  const Toggle = ({ k }) => (
    <span onClick={() => setOn(o => ({ ...o, [k]: !o[k] }))} style={{ width: 44, height: 26, borderRadius: 9999, flexShrink: 0, cursor: "pointer", background: on[k] ? "var(--app-accent)" : "var(--app-surface-3)", position: "relative", transition: "background .18s ease" }}>
      <span style={{ position: "absolute", top: 3, left: on[k] ? 21 : 3, width: 20, height: 20, borderRadius: 9999, background: "var(--app-bg)", transition: "left .18s ease" }} />
    </span>
  );

  const Row = ({ k, icon, tone, title, sub, haptic }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px" }}>
      <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: "color-mix(in oklch, " + tone + " 15%, transparent)", border: "1px solid color-mix(in oklch, " + tone + " 30%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i data-lucide={icon} style={{ width: 17, height: 17, color: tone }}></i>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--app-text)" }}>{title}</div>
        <div style={{ fontSize: 11.5, color: "var(--app-muted)", marginTop: 2 }}>{sub}</div>
      </div>
      {haptic && <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--app-muted)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{haptic}</span>}
      <Toggle k={k} />
    </div>
  );

  const Group = ({ title, children }) => (
    <div style={{ margin: "0 16px 16px" }}>
      <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, margin: "0 4px 8px" }}>{title}</div>
      <div style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {React.Children.map(children, (c, i) => (
          <>{i > 0 && <div style={{ height: 1, background: "var(--app-border)", marginLeft: 62 }} />}{c}</>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      <div className="mob-top" style={{ paddingBottom: 8 }}>
        <button style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 9999, color: "var(--app-text)", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }}></i>
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Reglas de alertas</div>
          <div style={{ fontSize: 10, color: "var(--app-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Signal Framework</div>
        </div>
        <div style={{ width: 38 }} />
      </div>

      {/* haptic legend */}
      <div style={{ margin: "0 16px 18px", padding: 14, borderRadius: 16, background: "var(--app-surface)", border: "1px solid var(--app-border)" }}>
        <div style={{ fontSize: 12.5, color: "var(--app-text)", fontWeight: 600, marginBottom: 12 }}>Niveles de urgencia háptica</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            ["Suave", "1 pulso · baja", "var(--app-trust)", "minus"],
            ["Doble", "2 pulsos · media", "var(--app-accent)", "equal"],
            ["Latido", "continuo · alta", "var(--app-down)", "activity"],
          ].map(([name, desc, tone, icon], i) => (
            <div key={i} style={{ textAlign: "center", padding: "12px 6px", borderRadius: 12, background: "color-mix(in oklch, " + tone + " 9%, transparent)", border: "1px solid color-mix(in oklch, " + tone + " 24%, transparent)" }}>
              <i data-lucide={icon} style={{ width: 18, height: 18, color: tone }}></i>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--app-text)", marginTop: 6 }}>{name}</div>
              <div style={{ fontSize: 9.5, color: "var(--app-muted)", marginTop: 2, lineHeight: 1.3 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <Group title="Señales de mercado">
        <Row k="vol" icon="zap" tone="var(--app-accent)" title="Picos de volatilidad" sub="Movimientos >2% con volumen anómalo" haptic="Doble" />
        <Row k="brk" icon="git-fork" tone="var(--app-accent)" title="Rupturas de soporte/resistencia" sub="Niveles técnicos clave en tu watchlist" haptic="Doble" />
      </Group>

      <Group title="Precio y posiciones">
        <Row k="tgt" icon="target" tone="var(--app-up)" title="Objetivo de precio alcanzado" sub="Take profit y stop loss configurados" haptic="Doble" />
        <Row k="margin" icon="shield-alert" tone="var(--app-down)" title="Riesgo de margen / liquidación" sub="Margen libre bajo el umbral crítico" haptic="Latido" />
      </Group>

      <Group title="Noticias y cuenta">
        <Row k="news" icon="newspaper" tone="var(--app-trust)" title="Noticias macro correlacionadas" sub="Eventos con impacto en tu cartera" haptic="Suave" />
        <Row k="acct" icon="wallet" tone="var(--app-muted)" title="Movimientos de cuenta" sub="Depósitos, retiros y ejecuciones" haptic="Suave" />
      </Group>

      <div style={{ height: 24 }} />
    </div>
  );
}

window.MobSignals = MobSignals;
window.MobLockScreen = MobLockScreen;
window.MobAlertRules = MobAlertRules;

// ─────────────────────────────────────────────────────────────
// 15) REPORTES & EXPORTAR — genera y descarga en varios formatos
//     (PDF · Excel · CSV · HTML interactivo · JSON · estado MT5)
// ─────────────────────────────────────────────────────────────
function MobReports({ lang }) {
  const t = window.TAPP_I18N[lang];
  const [period, setPeriod] = React.useState("mes");
  const [rtype, setRtype] = React.useState("estado");
  const [fmt, setFmt] = React.useState("pdf");
  useLucide([period, rtype, fmt]);

  const periods = [["mes", "Mes"], ["trim", "Trimestre"], ["anio", "Año"], ["custom", "Personalizado"]];
  const types = [
    ["estado", "file-text", "Estado de cuenta", "Saldos, depósitos, retiros y comisiones"],
    ["ops", "arrow-left-right", "Operaciones", "Historial completo de trades ejecutados"],
    ["rend", "trending-up", "Rendimiento", "P&L, métricas de riesgo y curva de equity"],
    ["fiscal", "landmark", "Resumen fiscal", "Ganancias realizadas para tu declaración"],
  ];
  const formats = [
    ["pdf", "file-text", "PDF", "~420 KB", "var(--app-down)"],
    ["xlsx", "table-2", "Excel", ".xlsx · 95 KB", "var(--app-up)"],
    ["csv", "table", "CSV", "~38 KB", "var(--app-trust)"],
    ["html", "globe", "HTML interactivo", "~1.2 MB", "var(--app-accent)"],
    ["json", "braces", "JSON", "~52 KB", "var(--app-muted)"],
    ["mt5", "terminal", "Estado MT5", ".htm · 88 KB", "var(--app-primary)"],
  ];
  const recent = [
    ["Estado de cuenta — Abril 2026", "PDF · 30 abr", "418 KB", "ready"],
    ["Operaciones Q1 2026", "Excel · 01 abr", "102 KB", "ready"],
    ["Resumen fiscal 2025", "PDF · 12 mar", "1.1 MB", "ready"],
    ["Rendimiento — Mayo 2026", "HTML · generando…", "—", "loading"],
  ];

  return (
    <div className="tapp" style={{ display: "flex", flexDirection: "column", overflow: "auto", paddingTop: 54 }}>
      <MobHeader t={t} lang={lang} title="Reportes" showAvatar={false} />

      {/* period segmented */}
      <div style={{ display: "flex", gap: 6, margin: "0 16px 18px", padding: 4, background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 12 }}>
        {periods.map(([k, label]) => (
          <button key={k} onClick={() => setPeriod(k)} style={{
            flex: 1, height: 36, borderRadius: 9, border: 0, cursor: "pointer", whiteSpace: "nowrap",
            background: period === k ? "var(--app-surface-3)" : "transparent",
            color: period === k ? "var(--app-text)" : "var(--app-muted)", fontWeight: 600, fontSize: 12.5,
          }}>{label}</button>
        ))}
      </div>

      {/* report type */}
      <div className="mkt-section" style={{ margin: "0 16px 18px" }}>
        <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, margin: "0 2px 10px" }}>Tipo de reporte</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {types.map(([k, icon, title, sub]) => {
            const active = rtype === k;
            return (
              <button key={k} onClick={() => setRtype(k)} style={{
                textAlign: "left", display: "flex", alignItems: "center", gap: 13, padding: 14, borderRadius: 16, cursor: "pointer",
                background: active ? "var(--app-surface-2)" : "var(--app-surface)",
                border: "1.5px solid " + (active ? "var(--app-accent)" : "var(--app-border)"),
                boxShadow: active ? "0 0 0 4px color-mix(in oklch, var(--app-accent) 12%, transparent)" : "none",
              }}>
                <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: "var(--app-tile)", border: "1px solid var(--app-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i data-lucide={icon} style={{ width: 18, height: 18, color: "var(--app-accent)" }}></i>
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "var(--app-text)" }}>{title}</span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--app-muted)", marginTop: 2, lineHeight: 1.35 }}>{sub}</span>
                </span>
                <span style={{ width: 20, height: 20, borderRadius: 9999, flexShrink: 0, border: "2px solid " + (active ? "var(--app-accent)" : "var(--app-border)"), background: active ? "var(--app-accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {active && <i data-lucide="check" style={{ width: 12, height: 12, color: "var(--app-bg)" }}></i>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* export format */}
      <div className="mkt-section" style={{ margin: "0 16px 18px" }}>
        <div style={{ fontSize: 11, color: "var(--app-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, margin: "0 2px 10px" }}>Formato de descarga</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {formats.map(([k, icon, name, size, tone]) => {
            const active = fmt === k;
            return (
              <button key={k} onClick={() => setFmt(k)} style={{
                position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "14px 6px", borderRadius: 14, cursor: "pointer",
                background: active ? "var(--app-surface-2)" : "var(--app-surface)",
                border: "1.5px solid " + (active ? tone : "var(--app-border)"),
              }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: "color-mix(in oklch, " + tone + " 15%, transparent)", border: "1px solid color-mix(in oklch, " + tone + " 30%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i data-lucide={icon} style={{ width: 18, height: 18, color: tone }}></i>
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--app-text)", textAlign: "center", lineHeight: 1.15 }}>{name}</span>
                <span className="mono" style={{ fontSize: 9.5, color: "var(--app-muted)" }}>{size}</span>
                {active && <span style={{ position: "absolute", top: 7, right: 7, width: 15, height: 15, borderRadius: 9999, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}><i data-lucide="check" style={{ width: 10, height: 10, color: "var(--app-bg)" }}></i></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* generate CTA */}
      <div style={{ margin: "0 16px 22px" }}>
        <button style={{ width: "100%", height: 54, borderRadius: 14, background: "var(--app-accent)", color: "var(--app-bg)", border: 0, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <i data-lucide="download" style={{ width: 18, height: 18 }}></i>
          Generar y descargar
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 10 }}>
          <i data-lucide="mail" style={{ width: 13, height: 13, color: "var(--app-muted)" }}></i>
          <span style={{ fontSize: 11.5, color: "var(--app-muted)" }}>También puedes <a style={{ color: "var(--app-accent)", fontWeight: 600 }}>enviarlo por correo</a> o programar envíos.</span>
        </div>
      </div>

      {/* recent reports */}
      <div className="mkt-section" style={{ margin: "0 16px", paddingBottom: 100 }}>
        <div className="head"><h3>Reportes recientes</h3></div>
        <div style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 18, overflow: "hidden" }}>
          {recent.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderTop: i ? "1px solid var(--app-border)" : "0" }}>
              <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: "var(--app-surface-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i data-lucide={r[3] === "loading" ? "loader" : "file-check-2"} style={{ width: 16, height: 16, color: r[3] === "loading" ? "var(--app-muted)" : "var(--app-accent)" }}></i>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--app-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r[0]}</div>
                <div style={{ fontSize: 11, color: "var(--app-muted)", marginTop: 2 }}>{r[1]} · {r[2]}</div>
              </div>
              <button style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: "transparent", border: "1px solid var(--app-border)", color: r[3] === "loading" ? "var(--app-muted-2)" : "var(--app-text)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <i data-lucide={r[3] === "loading" ? "more-horizontal" : "download"} style={{ width: 15, height: 15 }}></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <NavBarMobile t={t} active="portfolio" />
    </div>
  );
}

window.MobReports = MobReports;
