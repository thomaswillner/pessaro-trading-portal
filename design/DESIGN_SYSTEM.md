# Pessaro Capital — Design System

A reusable design system for **Pessaro Capital** (`pessaro.cl`), a Chilean financial services firm offering retail and institutional access to global trading markets — Forex, commodities, indices, equities, ETFs and crypto. The brand positions itself as institutional-grade ("Sovereign Trust & Precision") while staying approachable for retail investors.

This system codifies the visual language, copy tone, components, and screen patterns observed across the public website and client portal so future designs ship on-brand without redoing the exploration.

## Sources

The user attached **fcorojaslatamfx/apptradingpessarocapital**, but that repo is essentially an empty placeholder. The actual product code lives in adjacent repos under the same owner — all reviewed for this design system:

- 🔗 [`fcorojaslatamfx/apptradingpessarocapital`](https://github.com/fcorojaslatamfx/apptradingpessarocapital) — the attached repo (placeholder only)
- 🔗 [`fcorojaslatamfx/pessaro_CL`](https://github.com/fcorojaslatamfx/pessaro_CL) — **primary source**: the institutional website + client portal (Vite + React + Tailwind v4 + shadcn/Radix). Contains the design tokens, full page set, and Spanish copy used here.
- 🔗 [`fcorojaslatamfx/pessaro-crm`](https://github.com/fcorojaslatamfx/pessaro-crm) — internal CRM
- 🔗 [`fcorojaslatamfx/pessaro-trading-portal`](https://github.com/fcorojaslatamfx/pessaro-trading-portal) (private) — trading analysis portal (React + TradingView)
- 🔗 [`fcorojaslatamfx/pessaro`](https://github.com/fcorojaslatamfx/pessaro) (private) — institutional frontend + CMS

If you want richer designs than this system supports, **explore those repos for components, copy and screens** before inventing new patterns.

## Product context

Pessaro Capital is built around a few surfaces:

| Surface | Audience | Tone | Notes |
|---|---|---|---|
| **Marketing website** (`pessaro.cl`) | Prospective traders, LATAM | Institutional, aspirational | Hero + bento sections, full-bleed dark imagery, CTAs to "Abrir Cuenta" / "Prueba Demo" |
| **Client portal** (`login.pessaro.cl`) | Logged-in traders | Pro-terminal, dense | Account dashboard, market widgets, KYC flows |
| **CMS / internal** | Staff | Utilitarian | Manages blog, services, instruments, leads |

Everything is in Spanish (Chile / LATAM). All currency, phones and addresses are CLP / +56 / Santiago.

---

## Index — what's in this folder

```
README.md                 ← you are here
SKILL.md                  ← entrypoint for Claude / agent skills
colors_and_type.css       ← all design tokens (vars + semantic styles)
assets/                   ← logos, favicons, photography
fonts/                    ← (Google-hosted; no local files)
preview/                  ← Design System tab cards
ui_kits/
  website/                ← marketing site recreation
    index.html
    *.jsx
```

## CONTENT FUNDAMENTALS

**Language.** Spanish (Chile/LATAM). Direct, formal, second-person plural ("Acceda", "Opere", "Conozca") — the imperative "usted" voice. Never `tú`. Never first-person ("nosotros" only in institutional copy: "*Nuestro equipo*", "*Nuestra plataforma*").

**Tone.** Institutional with a confident edge. The brand wants to sound like a global bank that ships fast software — never folksy, never startup-cute. Lots of authority words: *Precisión*, *Trayectoria*, *Excelencia*, *Vanguardia*, *Institucional*, *Regulado*, *Transparencia*.

**Casing.**
- **Title Case** for H1/H2 in marketing copy: *"Domine los Mercados con Precisión Institucional"*, *"Trayectoria, Confianza y Resultados"*.
- **Sentence case** for body and microcopy.
- **ALL CAPS** is reserved for the risk-warning block at the bottom of every page ("ADVERTENCIA DE RIESGO:") and for tiny tracking-label captions on cards ("SPREAD", "APALANCAMIENTO").

**Numbers.** Always concrete and specific. The website opens with `15+`, `120+`, `40M+`, `0.01s`. Spreads quoted as `0.0 pips`, leverage as `1:500`, deposits as `USD 5,000`. Decimals use `.` (English convention) even though copy is Spanish.

**Specific copy patterns:**
- Two-tone headline: *"Servicios Financieros de **Elite**"* — neutral phrase + accent-colored payoff word, always at end of line.
- Pill-style trust badges above hero: *"🛡 Mercado Regulado y Fondos Segregados"*.
- CTAs are short verbs: *Abrir Cuenta*, *Operar*, *Suscribirse*, *Ver detalles*, *Contactar Asesor*.
- Stat blocks are big-number-plus-label: `15+` / *Años de Experiencia*.
- Disclaimers always say *"Pessaro Capital no ofrece asesoramiento de inversión directo."* and warn about leverage.

**Emoji.** Used sparingly in the newsletter chips (📈 💱 📊 ₿ 🏛️) and that's about it. Headings, buttons and labels use **Lucide icons**, never emoji. Don't sprinkle emoji into new copy.

**Examples to mimic:**

> *"Domine los Mercados con Precisión Institucional"* (H1)
> *"Acceda a Forex, Commodities e Índices con tecnología de baja latencia y el respaldo de 15 años de excelencia financiera."* (subhead)
> *"Spreads desde 0.0 pips en EUR/USD"* (benefit bullet)
> *"ADVERTENCIA DE RIESGO: El trading de instrumentos financieros conlleva un alto nivel de riesgo…"* (legal)

---

## VISUAL FOUNDATIONS

**Two-mode brand.** The website ships in a **light institutional mode** (default — white surfaces, blue/purple primary) and a **dark "Corporate Futurism" mode** (deep indigo background with vivid accents). The default `:root` is light; `.dark` and `[data-theme="navy"|"gold"|"carbon"]` override. Most marketing imagery (hero, newsletter, contact) is full-bleed dark blue regardless of mode — light/dark only flips body chrome and cards.

**Palette philosophy.** Indigo/navy for trust, purple for the brand mark, mint green for accent + success, bright blue for trust elements, warm orange for opportunity, true red for destructive only. Color is loaded as **OKLCH** with hue families ~250 (blue), ~280 (purple), ~160 (mint), ~220 (sky), ~50 (orange), ~15 (red). Themed palettes (`gold` ≈ amber, `carbon` ≈ green-on-black, `navy` ≈ deeper blue+violet) are the only way users customise.

**Typography.**
- **Plus Jakarta Sans** (400/500/600/700/800) — body + display. Geometric, high x-height, reads well in Spanish.
- **JetBrains Mono** (400/500) — strictly for market quotes, symbols, spreads, leverage, prices, anywhere numbers need to align. Never for prose.
- H1–H6 are `font-semibold tracking-tight`; body uses `cv02 cv03 cv04 cv11` OpenType features.

**Type rhythm.** Marketing pages use the fluid scale (`text-fluid-3xl` → ~30→72px hero). Title pattern is **stacked H1 with two colors**: a neutral white/foreground line, then a mint/accent line under it.

**Spacing & radii.** Tailwind v4 scale. Base radius **0.625rem (10px)** with `sm/md/lg/xl` derived. Cards round to `lg` or `xl` (16px). Pills/badges round to `full`. Container max widths: `max-w-4xl` narrow, `max-w-7xl` wide.

**Backgrounds.** Three flavours:
1. **Solid `background`** — most light-mode sections.
2. **Dark gradient** — `from-blue-900 via-blue-800 to-indigo-900` on hero/newsletter/CTA, often with a **30% opacity full-bleed trading-chart photo** behind it and a vertical gradient overlay (`from-background/50 via-transparent to-background/70`).
3. **`bg-muted/30` or `bg-secondary/50`** — quiet stripes between heavy sections, used to separate stats and FAQ.

Backgrounds **never** use repeating patterns, hand-drawn illustrations or AI-textured "blob" gradients. Imagery is always real photography — financial charts, professional portraits, office interiors — colour-graded cool/blue.

**Shadows & elevation.** Soft, blue-tinted: cards rest on `shadow-sm`, lift to `shadow-xl` (and `shadow-accent/40` on accent buttons) on hover. The institutional aesthetic prefers **subtle rim-lights via `ring-1 ring-border/20`** plus a faint inner `shadow-inner` on icon tiles — that "physical layers" feel the AI-handover note in `index.css` calls out.

**Borders.** Almost always `border-border/40` or `/60` — half-strength, never full opacity. Inputs and cards share the same `border-input` token. Accent borders (`border-accent/30`) appear on trust badges and active states.

**Blur & transparency.** `backdrop-blur-md` on the sticky header once scrolled, on dialogs, and on cards layered over hero imagery. Card opacity in dark mode often `bg-card/60` so the chart photo bleeds through.

**Hover states.**
- Buttons: `hover:bg-{color}/90` (10% darker) + `shadow-{color}/30` ring glow on accent buttons.
- Cards: lift via `whileHover={{ y: -8 }}` (Framer Motion spring 300/20) and `hover:border-accent/40`.
- Links: `hover:text-green-400` in footer; `hover:opacity-100` (from 80) on muted links.
- Icon CTAs: `group-hover:translate-x-1` on the trailing arrow.

**Press states.** `active:bg-white/40` on carousel buttons. Mostly relies on Tailwind defaults (no custom scale-down).

**Animation.** **Framer Motion** is the engine. Pattern is `initial={{opacity:0,y:20}}, whileInView={{opacity:1,y:0}}, viewport={{once:true}}, transition={{duration:0.5-0.8, ease:"easeOut"}}`. Spring for hover (`{type:"spring", stiffness:300, damping:20}`). Scroll-smooth on the html element. **No bounces or playful eases** — strictly entrance fades, lifts, and 500ms carousel slides. Respects `prefers-reduced-motion`.

**Iconography.** **Lucide React** is the single source — flat 1.5-stroke line icons, `size-4` default, color-inherit. Often inside a `w-12 h-12 rounded-xl bg-primary/5 ring-1 ring-border/20` tile. Brand mark also uses **react-icons/SiLinkedin** for the LinkedIn social (we treat that the same as Lucide for substitution). No emoji-as-icon, no Phosphor, no Material.

**Buttons.**
- `default` / primary → indigo `bg-primary` with white text, soft shadow.
- **Accent CTA** → mint `bg-accent` with white text + `shadow-accent/40` on hover. The biggest hero CTA always uses accent.
- `outline` → transparent with `border-input`, hover fills with accent.
- `ghost` → transparent, hover fills with accent.
- `link` → primary-coloured text, underline on hover.
- Sizes: `sm` 36px, `default` 40px, `lg` 44px. Touch targets enforced at 44×44 minimum.

**Cards.** Rounded `lg`/`xl`, half-strength border, `shadow-sm` at rest. Service cards have an icon tile in the corner. Instrument cards have a two-column footer (Spread / Apalancamiento) using mono font for the numbers, then a small "Operar" pill button.

**Layout rules.** Sticky 50–60px header with `backdrop-blur-md` once scrolled. Footer is a 4-column dark grid. Sections are vertically padded `py-16 sm:py-20 md:py-24` (we expose this as `--space-section`). Hero is min-height 85–100vh.

**Image color vibe.** Cool, slightly blue-graded, high-contrast professional photography. Trading screens, suited professionals, modern offices. Charts are the visual anthem of the brand. No warmth, no candid lifestyle, no AI-generated illustration.

---

## ICONOGRAPHY

Pessaro uses **Lucide React** (`lucide-react@0.462.0`) as its single icon system. Every icon you see on the website is from Lucide. To replicate this in static HTML we link **Lucide via CDN** (`https://unpkg.com/lucide@latest`) and call `lucide.createIcons()` after DOM ready. Stroke `1.5`, size `16/20/24`, color inherits the surrounding text.

Common Lucide icons in the codebase: `ArrowRight`, `TrendingUp`, `TrendingDown`, `ShieldCheck`, `Globe2`, `Zap`, `CheckCircle2`, `MessageSquare`, `Send`, `BarChart3`, `Users`, `Clock`, `ChevronLeft`, `ChevronRight`, `Phone`, `Mail`, `Quote`, `Star`, `LineChart`, `Wallet`, `BookOpen`, `Headphones`, `Linkedin`. For brand-named social icons (LinkedIn) the codebase pulls **react-icons/Si\***; we substitute the matching Lucide glyph when staying inside one library is easier.

Emoji is **only** used in the newsletter topic chips (📈 💱 📊 ₿ 🏛️) — copy these verbatim if you're recreating that block, otherwise stick to Lucide. Unicode chars are not used as icons.

**Logos.** The wordmark is a stylised **X** with "Pessaro Capital" set below in a custom geometric italic. Lives at `assets/logo-pessaro.webp` — already on a blue radial gradient, so place it on any dark background and it integrates. There is no light-mode-only or knockout variant in the public repo. Favicons (`192`, `512`) are also in `assets/`.

---

## UI Kits

| Kit | Path | What it covers |
|---|---|---|
| **Website** | `ui_kits/website/` | Marketing site recreation: header, hero, stats strip, service cards, instrument cards, testimonials carousel, newsletter, footer, risk-warning block. |
| **Trading App** | `ui_kits/trading-app/` | Multi-platform trading app — 5 mobile screens (Dashboard, Asset detail, Order ticket, Markets, Portfolio) in iOS frames, split-pane tablet dashboard, and two full desktop layouts (Trading workstation + Portfolio analytics). Tweaks for palette (indigo / gold / carbon), density, chart style, P&L colors, and language (ES / EN / PT). |

Each kit's `index.html` is a click-thru hi-fi mock. Modal/dialog/form components are sketched only where the marketing site uses them.

---

## Substitutions / things to flag

- **Fonts**: Plus Jakarta Sans + JetBrains Mono are loaded from **Google Fonts via CDN** — no local TTF files in `fonts/`. If you need offline use, download them from <https://fonts.google.com>.
- **Imagery**: Only one team photo (`team-francisco-rojas.webp`) and three reference investor portraits (Buffett, Dalio, Soros) are bundled. The site uses many more (Yellen, Powell, Greenspan, Lagarde, Volcker) — grab them from `pessaro_CL/public/images/` if you need them.
- **No private-repo content**: trading portal screens, CRM tables, and CMS admin views are inferred from `pessaro_CL` only. If you need pixel-fidelity on the logged-in trader dashboard or CRM, pull from the private repos directly.
