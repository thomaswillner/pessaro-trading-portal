# Website UI Kit — Pessaro Capital

A pixel-honest recreation of the public marketing site (`pessaro.cl`) as a single-page hi-fi prototype.

## What's covered

- **Header** — fixed indigo navbar with logo, nav links, theme switcher, "Abrir Cuenta" + login menu
- **Hero** — gradient + trading-chart overlay, trust pill, two-tone H1, dual CTAs
- **StatsStrip** — `15+` / `120+` / `40M+` / `0.01s` block on indigo
- **ServicesGrid** — four service cards (Forex, Commodities, Indices, Crypto)
- **InstrumentsGrid** — eight mini instrument tickers with spread / leverage / % delta
- **AboutSection** — copy + feature ticks + portrait
- **TestimonialsCarousel** — slide-based reviewer carousel
- **NewsletterCta** — full-bleed dark, topic chips, CTA
- **Footer** — 4-col dark + ALL-CAPS risk warning

## Open

Open `index.html` directly — everything loads via CDN (React 18, Tailwind-substitute via `colors_and_type.css`, Lucide).

## What's not modelled

- Login flow, KYC verification, client portal, CMS — out of scope for this kit. Pull those from `pessaro_CL` directly if needed.
- Forms only render — none of the dialogs / popups are wired (they are stubbed as alerts).
