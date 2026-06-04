# Pessaro Capital — Handoff de implementación

> **Para Claude Code:** este documento describe **exactamente** lo que debes
> construir. El objetivo es reproducir, en el código real del producto, los
> diseños hi‑fi que ya validamos: el **sitio de marketing** (`pessaro.cl`) y la
> **app de trading** (móvil + tablet + escritorio). Lee este archivo completo
> antes de escribir código.

---

## 0. Cómo usar este paquete

Los archivos `.html` / `.jsx` de este bundle son **referencias de diseño**
(prototipos creados en HTML para mostrar el look & feel y el comportamiento
final), **no** código de producción para copiar tal cual. Tu tarea es
**recrear estos diseños en el entorno real del repo** usando sus patrones y
librerías ya establecidos.

- Si ya existe un stack (Vite + React + Tailwind v4 + shadcn/Radix, según
  `pessaro_CL`), **úsalo** y respeta sus convenciones.
- Si no existe entorno aún, elige el stack indicado abajo y móntalo.
- Fidelidad: **alta (hi‑fi)**. Colores, tipografía, espaciado e interacciones
  son finales — reprodúcelos con precisión pixel‑a‑pixel usando las librerías
  del repo.

### Repos fuente (código real — preferir sobre adivinar)

| Repo | Qué es |
|---|---|
| `fcorojaslatamfx/pessaro_CL` | **Fuente primaria**: sitio institucional + portal de cliente. Vite + React + Tailwind v4 + shadcn/Radix. Contiene los tokens, el set de páginas y el copy en español. |
| `fcorojaslatamfx/pessaro-crm` | CRM interno |
| `fcorojaslatamfx/pessaro-trading-portal` (privado) | Portal de análisis (React + TradingView) |
| `fcorojaslatamfx/pessaro` (privado) | Frontend institucional + CMS |
| `fcorojaslatamfx/apptradingpessarocapital` | Repo adjunto (placeholder vacío) |

### Archivos de este bundle

```
design_handoff_pessaro/
  CLAUDE.md                  ← este documento (puedes renombrarlo a CLAUDE.md en tu repo)
  colors_and_type.css        ← TODOS los design tokens (copiar / portar)
  assets/                    ← logo wordmark, favicons, fotografía de referencia
  ui_kits/website/           ← recreación del sitio de marketing (index.html + *.jsx)
  ui_kits/trading-app/       ← recreación de la app de trading (index.html + *.jsx)
  preview/                   ← especímenes (tipo, color, componentes) — referencia rápida
  screenshots/               ← capturas hi-fi de cada pantalla (README.md indexa todo)
    website/                 ← 8 secciones del sitio
    trading/                 ← 18 pantallas de la app
```

> **Referencia visual:** `screenshots/` contiene una captura de cada sección
> del sitio y cada pantalla de la app (tema indigo · es). Úsalas para validar
> fidelidad pixel-a-pixel; las medidas exactas están en este documento.

---

## 1. Stack objetivo

**Sitio de marketing y portal de cliente** (replicar `pessaro_CL`):

- **Vite + React 18 + TypeScript**
- **Tailwind CSS v4** (los tokens viven como `@theme` / CSS custom properties)
- **shadcn/ui + Radix** para primitivos (Button, Dialog, Tabs, etc.)
- **Framer Motion** para animaciones
- **lucide-react** `@0.462.0` como **único** sistema de iconos
- **react-icons/Si\*** sólo para marcas (LinkedIn). Sustituible por Lucide.
- Fuentes vía Google Fonts: **Plus Jakarta Sans** + **JetBrains Mono**

**App de trading**: misma base; los gráficos deben ir con
**`lightweight-charts`** (en las referencias son SVG estáticos — reemplazar por
charts reales con zoom/crosshair). Datos de mercado: WebSocket / feed real.

---

## 2. Design tokens (fuente de verdad: `colors_and_type.css`)

Porta este archivo a tu capa de tokens (Tailwind v4 `@theme` o `:root`). Todo
el color es **OKLCH**. Hay un modo claro por defecto, un `.dark` ("Corporate
Futurism") y 3 temas alternativos `[data-theme="gold|carbon|navy"]`.

### Color — modo claro (`:root`)

| Token | Valor | Uso |
|---|---|---|
| `--background` | `oklch(0.99 0.01 220)` | superficie base |
| `--foreground` | `oklch(0.15 0.06 220)` | tinta |
| `--card` | `oklch(1 0 0)` | tarjetas |
| `--muted` | `oklch(0.96 0.01 240)` | franjas suaves |
| `--muted-foreground` | `oklch(0.45 0.04 240)` | texto secundario |
| `--primary` | `oklch(0.35 0.20 250)` (~`#061deb`) | azul de marca, CTA primario |
| `--secondary` | `oklch(0.25 0.18 250)` (~`#0A2687`) | azul Pessaro |
| `--accent` | `oklch(0.45 0.25 280)` (~`#5e17eb`) | púrpura, CTA acento |
| `--success` | `oklch(0.68 0.16 150)` | verde menta (tick / up) |
| `--warning` | `oklch(0.70 0.18 50)` | naranja (oportunidad) |
| `--destructive` | `oklch(0.55 0.22 15)` | rojo (sólo destructivo) |
| `--border` / `--input` | `oklch(0.91 0.02 220)` | líneas (usar a 40–60% opacidad) |
| `--ring` | `oklch(0.45 0.25 280)` | foco púrpura |
| `--title-accent` | `oklch(0.75 0.18 160)` | palabra‑payoff menta en H1 |
| `--navbar-bg` | `#1a1f6e` | navbar índigo profundo |

### Color — modo oscuro (`.dark`, "Corporate Futurism")

`--background: oklch(0.12 0.03 260)` (índigo profundo), `--card: oklch(0.15
0.04 260)`, `--foreground: oklch(0.92 0.01 0)`, `--navbar-bg: #0d1230`.
Primary/secondary/accent se mantienen. Bordes a `oklch(0.20 0.04 260)`.

### Temas alternativos (`[data-theme]`)

- **gold** — ámbar sobre negro cálido (`--primary: oklch(0.72 0.14 75)`).
- **carbon** — verde sobre negro puro (`--primary: oklch(0.72 0.18 158)`).
- **navy** — azul+violeta más profundo (`--primary: oklch(0.58 0.22 290)`).

### Tipografía

- **Plus Jakarta Sans** (400/500/600/700/800) — cuerpo + display.
  `font-feature-settings: "cv02","cv03","cv04","cv11"`.
- **JetBrains Mono** (400/500) — **sólo** números de mercado: precios, spreads,
  apalancamiento, símbolos, %. `font-variant-numeric: tabular-nums`. Nunca prosa.
- Escala fluida (px): xs 12 · sm 14 · base 16 · lg 18 · xl 20 · 2xl 24 ·
  3xl 30 · 4xl 36 · 5xl 48 · 6xl 60 · 7xl 72.
- H1–H6 `font-semibold tracking-tight`. H1 `clamp(36px,5vw,72px)`,
  `line-height:1.05`, `letter-spacing:-0.02em`.
- **Patrón H1 dos tonos**: línea neutra + palabra‑payoff en menta debajo.
  `<h1><span class="t-primary">…</span> <span class="t-accent">Elite</span></h1>`

### Radios, espaciado, sombras

- Radio base **0.625rem (10px)**; sm 6 · md 8 · lg 10 · xl 14 · 2xl 22 · full.
  Tarjetas → `lg`/`xl`; pills/badges → `full`.
- `--space-section: clamp(3rem, 5vw, 6rem)` (padding vertical de sección).
- Containers: `max-w-4xl` angosto · `max-w-7xl` ancho.
- Sombras azuladas y suaves: reposo `shadow-sm`, hover `shadow-xl`. Botones
  acento usan `--shadow-accent-glow` en hover. Tiles de icono con
  `--shadow-inner-tile` (rim‑light interno).
- Bordes casi siempre a media fuerza (`border/40`–`/60`), nunca opacidad plena.

### Motion

- **Framer Motion**. Entrada: `initial={{opacity:0,y:20}}`,
  `whileInView={{opacity:1,y:0}}`, `viewport={{once:true}}`,
  `transition={{duration:0.5–0.8, ease:"easeOut"}}`.
- Hover de tarjeta: `whileHover={{y:-8}}`, spring `{stiffness:300,damping:20}`.
- Carrusel: slides de 500ms. **Sin** rebotes ni eases juguetones. Respeta
  `prefers-reduced-motion`.

---

## 3. Contenido y voz (reglas duras)

- **Idioma: español (Chile / LATAM).** Voz formal "usted": *Acceda, Opere,
  Conozca*. Nunca `tú`. "Nosotros" sólo en copy institucional.
- **Title Case** en H1/H2 de marketing; **sentence case** en cuerpo;
  **MAYÚSCULAS** sólo en la advertencia de riesgo y micro‑labels de tarjeta
  (`SPREAD`, `APALANCAMIENTO`).
- **Números concretos y en mono**: `15+`, `120+`, `40M+`, `0.01s`,
  `0.0 pips`, `1:500`, `USD 5,000`. Decimales con `.`.
- **Sin emoji**, excepto los 5 chips del newsletter (📈 💱 📊 ₿ 🏛️).
- **Iconos: sólo Lucide** (stroke 1.5). Si falta un glifo, inline SVG que
  imite el estilo de Lucide. Nada de Phosphor/Material/SVG dibujado a mano.
- **Imágenes: fotografía real**, graduada fría/azul (charts, profesionales
  trajeados, oficinas). Sin ilustración IA, sin patrones repetidos, sin stock
  cálido de lifestyle.
- **Advertencia de riesgo SIEMPRE** al pie de cualquier superficie pública:
  *"ADVERTENCIA DE RIESGO: El trading de instrumentos financieros conlleva un
  alto nivel de riesgo…"* + *"Pessaro Capital no ofrece asesoramiento de
  inversión directo."*

Ejemplos de copy a imitar:
> H1: *"Domine los Mercados con Precisión Institucional"*
> Subhead: *"Acceda a Forex, Commodities e Índices con tecnología de baja
> latencia y el respaldo de 15 años de excelencia financiera."*
> CTAs: *Abrir Cuenta · Operar · Suscribirse · Ver detalles · Contactar Asesor*

---

## 4. Componentes base

Mapea a tu shadcn/ui. Specs en `colors_and_type.css` (`.btn`, `.pill`,
`.trust-badge`, `.icon-tile`, `.surface-card`).

**Botones** (alto: sm 36 · default 40 · lg 44; touch mínimo 44×44):
- `primary` → `bg-primary` texto blanco, sombra suave.
- `accent` (CTA hero principal) → `bg-accent` blanco + `shadow-accent/40` glow + `translateY(-1px)` en hover.
- `outline` → transparente, `border-input`; hover rellena con accent.
- `ghost` → transparente; hover rellena con accent.
- `link` → texto primary, subrayado en hover.

**Trust badge** — pill con icono + texto small‑caps, fondo accent al ~18%,
borde accent ~32%, texto menta. Ej.: *"🛡 Mercado Regulado y Fondos Segregados"*
(el escudo es icono Lucide, no emoji).

**Icon tile** — `3.5rem` cuadrado, radio xl, `bg-accent/6`, color accent,
`shadow-inner-tile`. Va en la esquina de las service cards.

**Cards** — radio lg/xl, borde media fuerza, `shadow-sm` reposo. En dark sobre
imágenes, `bg-card/60` + `backdrop-blur-md`.

---

## 5. Sitio de marketing — `ui_kits/website/`

SPA de una página. Orden de secciones (ver cada `*.jsx`):

| # | Componente | Especificación |
|---|---|---|
| 1 | **Header** (`Header.jsx`) | Navbar fija índigo (`--navbar-bg`), 50–60px, `backdrop-blur-md` al hacer scroll. Logo wordmark, nav links, switcher de tema, botón **Abrir Cuenta** + menú login. |
| 2 | **Hero** (`Hero.jsx`) | `min-height` 85–100vh. Gradiente `from-blue-900 via-blue-800 to-indigo-900` + foto de chart al **30% opacidad** full‑bleed + overlay vertical. Trust pill arriba, **H1 dos tonos**, subhead, dos CTAs (accent + outline). |
| 3 | **StatsStrip** (`StatsStrip.jsx`) | Banda índigo con `15+` / `120+` / `40M+` / `0.01s` (número grande mono + label). |
| 4 | **ServicesGrid** (`ServicesGrid.jsx`) | 4 service cards: Forex, Commodities, Índices, Crypto. Icon tile en esquina, hover lift `y:-8`. |
| 5 | **InstrumentsGrid** (`InstrumentsGrid.jsx`) | 8 mini‑tickers con spread / apalancamiento / % delta en mono. Footer dos columnas (Spread / Apalancamiento) + pill **Operar**. |
| 6 | **AboutSection** (`AboutSection.jsx`) | Copy + ticks de features (CheckCircle2) + retrato (`assets/team-francisco-rojas.webp`). |
| 7 | **TestimonialsCarousel** (`TestimonialsCarousel.jsx`) | Carrusel de reseñas, slides 500ms, flechas Chevron. |
| 8 | **NewsletterCta** (`NewsletterCta.jsx`) | Full‑bleed oscuro, chips de tema con los 5 emoji, campo email + CTA Suscribirse. |
| 9 | **Footer** (`Footer.jsx`) | Grid oscuro 4 columnas + **bloque de advertencia de riesgo** en MAYÚSCULAS. |

Fondos: (1) `background` sólido en la mayoría de secciones claras; (2)
gradiente azul oscuro en hero/newsletter/CTA con foto de chart al 30%; (3)
`bg-muted/30` para franjas tranquilas entre secciones pesadas.

**Fuera de alcance del kit** (sacar de `pessaro_CL` directo): login, KYC,
portal de cliente, CMS. Los formularios sólo renderizan (diálogos stubbeados).

---

## 6. App de trading — `ui_kits/trading-app/`

Multi‑plataforma. Tokens propios en `ui_kits/trading-app/tokens.css`
(prefijo `--app-*`), seleccionables por `[data-palette]`, `[data-density]`,
`[data-pnl]`. Hereda fundaciones de `colors_and_type.css`.

### Ejes configurables (paridad con los Tweaks del prototipo)

- **Palette**: `indigo` (Corporate Futurism real) · `gold` (Premium Luxury) · `carbon` (verde sobre negro).
- **Density**: `cozy` (filas 56px) · `compact` (filas 40px, oculta sparklines/glyphs).
- **Chart style**: `candles` · `line` · `area`.
- **P&L colors**: `classic` verde/rojo · `cb` azul/naranja (daltónico‑seguro).
- **Idioma**: `es` (CL) · `en` · `pt` (BR). i18n en `shared.jsx`.

### Móvil (iOS · 393×852) — `mobile-screens.jsx`

| Pantalla | Contenido |
|---|---|
| **Dashboard** | Saludo + pill de estado, balance card con mini‑equity chart, 4 quick‑actions, posiciones abiertas, watchlist, bottom nav (5 tabs). |
| **Asset detail** | XAU/USD: símbolo/precio/delta, 6 pills de timeframe, chart completo, strip de indicadores, order book (L2), bloque "acerca de", CTAs sticky Comprar/Vender. |
| **Order ticket** | Bottom sheet sobre Asset detail: tabs Buy/Sell, Market/Limit/Stop, stepper de volumen, SL/TP, bloque de review, **slide‑to‑confirm** en arco (`ArcConfirm`, dispara >90%). |
| **Markets** | Buscador + tabs (Forex/Commodities/Índices/Crypto) + filas de mini‑quote con sparklines. |
| **Portfolio** | Donut de asignación, P&L all‑time, historial con pills de estado. |

### Otras secciones móviles iOS (393×852)

- **Reportes & Exportar** — segmento de período, picker de tipo, grid de **6 formatos** (PDF, Excel, CSV, HTML, JSON, Estado MT5) con tamaño estimado; CTA "Generar y descargar" + recientes con descarga por fila.
- **Señales & Notificaciones** — bandeja categorizada con rieles de urgencia, push en pantalla bloqueada (frosted, long‑press actions), reglas & hápticos (3 tiers: Suave/Doble/Latido).
- **Cuenta & Bróker** — vincular bróker (servidores Prime LD4 / Global NY4 / Asia TY3 / Demo con latencia live), credenciales MT5 (AES‑256, modo inversor), cuentas vinculadas (switcher + accesos directos).
- **Onboarding & Auth** — risk profile (Conservador/Activo/Profesional, 3 pasos), login (Face ID + Passkey), KYC (cédula chilena con OCR scan‑line).

### Tablet (iPad landscape · 1024×720) — `desktop-screens.jsx`

**Split dashboard** — panel izq: balance, búsqueda, watchlist multi‑categoría con mini‑spark. Panel der: header de activo + chart + order book + resumen de posición + CTAs sticky.

### Escritorio (Web · 1440×860) — `desktop-screens.jsx`

| Pantalla | Contenido |
|---|---|
| **Trading workstation** | 4 columnas: sidebar de mercados · chart con timeframe + indicadores · tabla de posiciones · order book + trades recientes · order ticket con preview de costo + advertencia de riesgo. |
| **Portfolio analytics** | Grid de 4 KPIs, curva de equity, tabla de transacciones, donut de asignación, stats de win‑rate (Sharpe / drawdown), feed de insights de mercado. |

### Patrones CSS clave (de `tokens.css`)

- `.tapp` — reset de app (font sans, `--app-bg`, `--app-text`).
- `.balance-card` — radio 22px, gradiente radial primary al 22% sobre surface; total en mono 34px.
- `.mkt-row` — grid `36px 1fr 78px 84px`; glyph circular, precio mono, delta chip.
- `.tf-row` — pills de timeframe en mono.
- `.sheet` — bottom sheet radio `24px 24px 0 0`, scrim `rgba(0,0,0,.55)` + blur.
- `.book` — order book 3 columnas mono con barras de profundidad (`bid`=up, `ask`=down).
- `.dt-topbar` / `.dt-card` — chrome de escritorio (topbar 56px, cards radio 14px).
- `.bottom-nav` — 5 tabs, 84px alto, tab activa en accent.

### Limitaciones a resolver en producción

- **Charts**: reemplazar los SVG estáticos por `lightweight-charts` (candles/line/area reales).
- **Order book**: está fingido con patrón senoidal determinista → conectar feed real.
- **Risk‑profile** sólo en español → aplicar i18n del tweak de idioma.

---

## 7. Assets

En `assets/`:

- `logo-pessaro.webp` — wordmark (X estilizada + "Pessaro Capital"), ya sobre
  gradiente radial azul → colócalo sobre cualquier fondo oscuro.
- `logo-pessaro-trade.svg`, `logo-pessaro-trade-wordmark.svg` — variantes.
- `favicon-192.png`, `favicon-512.png`.
- Fotos de referencia: `team-francisco-rojas.webp` (retrato del equipo) y
  retratos de inversores (Buffett, Dalio, Soros) sólo como muestra.

El sitio real usa muchas más imágenes (Yellen, Powell, Lagarde, Volcker, etc.)
→ tomarlas de `pessaro_CL/public/images/`. No hay variante knockout/light del
logo en el repo público.

---

## 8. Checklist de implementación

1. [ ] Portar `colors_and_type.css` a la capa de tokens del repo (Tailwind v4 `@theme`).
2. [ ] Configurar fuentes (Plus Jakarta Sans + JetBrains Mono) y `lucide-react`.
3. [ ] Construir primitivos shadcn con los specs de §4 (Button variants, pill, trust‑badge, icon‑tile, card).
4. [ ] Sitio de marketing: 9 secciones de §5, en orden, con Framer Motion.
5. [ ] Bloque de advertencia de riesgo reutilizable, presente en toda superficie pública.
6. [ ] App de trading: pantallas de §6 con los ejes palette/density/pnl/idioma.
7. [ ] Sustituir charts SVG por `lightweight-charts` y conectar datos reales.
8. [ ] Verificar voz "usted", números en mono, sin emoji (salvo chips newsletter), sólo iconos Lucide.
9. [ ] Probar los 3 temas (gold/carbon/navy) + claro/oscuro.

Ante la duda, abre los repos de §0 — componentes, copy y pantallas reales,
mucho mejor que adivinar.
