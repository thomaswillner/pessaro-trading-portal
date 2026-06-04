# Trading App UI Kit — Pessaro Capital

Hi-fi recreation of a multi-platform trading app for **mobile, tablet and desktop**, on top of the Pessaro Capital design system.

## What's inside

Open `index.html` (already registered in the Design System tab). Everything renders inside a single design canvas you can pan, zoom and open fullscreen.

### Reportes & Exportar (iOS · 393×852)

| Screen | What it shows |
|---|---|
| **Reportes** | Generate + download account activity — period segmented (Mes/Trimestre/Año/Personalizado), report-type picker (Estado de cuenta / Operaciones / Rendimiento / Resumen fiscal), and a **6-format export grid**: PDF, Excel (.xlsx), CSV, HTML interactivo, JSON, Estado MT5 (.htm), each with size estimate. "Generar y descargar" CTA + recent-reports list with per-row download. |

### Señales & Notificaciones (iOS · 393×852)

The spec's **"Signal Framework"** — alerts that explain *why*, route to direct action, and tier urgency by haptic pattern.

| Screen | What it shows |
|---|---|
| **Bandeja de señales** | Categorized feed (filter chips Todas/Señales/Precio/Riesgo/Noticias) — volatility break with Ver gráfico/Operar actions, margin-risk card with heartbeat ring, price-target hit, macro news with correlated-impact chips, account movement. Each card has a colored urgency rail. |
| **Push · pantalla bloqueada** | iOS lock-screen rich push — frosted Pessaro Trade notification with reason copy, mini chart and long-press actions (Ajustar SL / Tomar ganancias), plus a stacked collapsed margin alert. |
| **Reglas & hápticos** | Alert settings — three urgency tiers (Suave/Doble/Latido) and grouped toggle rules for market signals, price/positions, news and account. |

### Cuenta & Bróker (iOS · 393×852)

| Screen | What it shows |
|---|---|
| **Vincular bróker** | Connect a personal trading account to a server from Pessaro's **private broker list** — Real/Demo toggle, server cards (Prime LD4 / Global NY4 / Asia TY3 / Demo) with execution type + live latency, segregated-funds reassurance. |
| **Credenciales MT5** | MT5-style access form — selected server chip, account number + password, "modo inversor (solo lectura)" toggle, AES-256 note, "solicítalas a tu asesor" fallback. |
| **Cuentas vinculadas** | Account switcher — multiple linked accounts (Prime/Copy/Demo) with balance, P&L, leverage; **accesos directos** grid (Depositar / Plataforma / Histórico / Soporte) and "vincular nueva cuenta". |

### Onboarding & Auth (iOS · 393×852)

| Screen | What it shows |
|---|---|
| **Risk profile** | Gamified first-run step 1/3 — pick investor profile (Conservador / Activo / Profesional); selection pre-tunes leverage caps, watchlist and risk alerts. 3-step progress, original Pessaro design. |
| **Login** | Logo, email + password, remember/forgot, primary CTA, Face ID + Passkey, "Abrir cuenta" footer. |
| **KYC · document** | Step 2/3 — Chilean cédula capture with OCR scan-line, live capture checklist, AES-256 reassurance. |

### Mobile (iOS · 393×852)

| Screen | What it shows |
|---|---|
| **Dashboard** | Greeting + status pill, balance card with mini equity chart, four quick-actions, open positions, watchlist, bottom nav |
| **Asset detail** | XAU/USD — sym/price/delta, 6-timeframe pills, full chart, indicator strip, order book (L2), about block, sticky Comprar/Vender CTAs |
| **Order ticket** | Bottom sheet over Asset detail — Buy/Sell tabs, Market/Limit/Stop, volume stepper, SL/TP, review block, confirm button |
| **Markets** | Search + category tabs (Forex / Commodities / Indices / Crypto) + scrollable mini-quote rows with sparklines |
| **Portfolio** | Allocation donut, all-time P&L, transaction history with status pills |

### Tablet (iPad landscape · 1024×720)

**Split dashboard** — left pane: balance, search, multi-category watchlist with mini-spark per row. Right pane: asset header + chart + order book + position summary + sticky CTAs.

### Desktop (Web · 1440×860)

| Screen | What it shows |
|---|---|
| **Trading workstation** | 4-column workstation — markets sidebar, chart with timeframe + indicators, full positions table, order book + recent trades, order ticket with cost preview + risk-warning block |
| **Portfolio analytics** | KPI grid (4 cards), equity curve, transactions table, allocation donut, win-rate stats grid (Sharpe / drawdown / etc), live market insights feed |

## Tweaks

The floating Tweaks panel (bottom-right, toggle from toolbar) exposes:

- **Palette** — `indigo` (real Pessaro Corporate Futurism), `gold` (the pasted-spec "Premium Luxury" take), `carbon` (green-on-black)
- **Density** — `cozy` / `compact` (tighter row heights for pro traders)
- **Chart style** — `candles` / `line` / `area`
- **P&L colors** — `classic` green/red / `cb` colorblind blue/orange
- **Language** — `es` / `en` / `pt` (Spanish CL · English · Portuguese BR)

All preferences persist to disk through the Tweak protocol and reflect across every artboard live.

## Files

```
ui_kits/trading-app/
  index.html              ← entry
  tokens.css              ← palette + density + sizing
  app.jsx                 ← root: design canvas + tweaks panel
  shared.jsx              ← i18n, demo data, chart components, order book
  mobile-screens.jsx      ← Dashboard, AssetDetail, Markets, OrderTicket, Portfolio
  desktop-screens.jsx     ← TabletDashboard, DesktopWorkstation, DesktopAnalytics
  ios-frame.jsx           ← starter: iOS device frame
  browser-window.jsx      ← starter: Chrome window chrome
  design-canvas.jsx       ← starter: pan/zoom canvas
  tweaks-panel.jsx        ← starter: tweaks shell
```

## Known limitations / next steps

- **Charts are SVG sketches**, not live TradingView. Realistic candles/area/line but no zoom or crosshair. Swap in `lightweight-charts` (the spec's recommendation) for a production build.
- **Order book is faked** from a deterministic sine pattern — looks live, isn't.
- **Onboarding, login and KYC** now live in the **Onboarding & Auth** section (risk profile → login → document capture). Risk-profile copy is Spanish-only (doesn't follow the language tweak yet), matching login/KYC.
- **Slide-to-confirm arc** is live on the order ticket (`ArcConfirm`) — drag the thumb along the curve past 90% to fire; tap the success pill to reset. The remaining spec items (immersive landscape terminal, smartwatch) are not drawn.
- **The starter `browser-window.jsx`** was edited locally to use a transparent content background so the trading app's dark surface shows through inside the chrome.
