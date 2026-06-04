# Pessaro Trading Portal
Portal de análisis de trading para clientes de **Pessaro Capital**. Stack: React + Vite + Supabase + TradingView Lightweight Charts, desplegado en Vercel.
## Stack
| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 |
| Routing | React Router v6 |
| Charts | Recharts + TradingView Lightweight Charts v4 |
| Backend | Supabase (PostgreSQL 17 + Auth + Realtime) |
| Deploy | Vercel (pessaro-portal) |
| Fonts | Syne + JetBrains Mono |
---
## Setup local
```bash
# 1. Clonar repo
git clone https://github.com/TU_ORG/pessaro-trading-portal.git
cd pessaro-trading-portal
# 2. Instalar dependencias
npm install
# 3. Variables de entorno
cp .env.example .env
# Edita .env con tus valores (ver abajo)
# 4. Correr en desarrollo
npm run dev
```
### Variables de entorno
```env
# Supabase – Branch: trading-portal-dev
VITE_SUPABASE_URL=https://sgkuhtpkmjoqkenqgowl.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_aTrLTTVLUZrUyddVgUOccA_IO1NcYRk
```
---
## Estructura del proyecto
```
src/
├── pages/
│   ├── Overview.jsx       # Dashboard principal (KPIs, equity curve, posiciones)
│   ├── Performance.jsx    # Rendimiento detallado (FXBlue-style)
│   ├── Trades.jsx         # Historial con filtros y export CSV
│   ├── ChartPage.jsx      # Gráfico de velas (TradingView)
│   ├── Calendar.jsx       # Calendario P&L por mes
│   └── Risk.jsx           # Drawdown, heatmap, exposición
├── components/
│   ├── Layout/Sidebar.jsx
│   ├── Charts/TradingViewChart.jsx
│   └── ui/index.jsx       # KPICard, Pill, PnLVal, TH, TD, etc.
├── hooks/
│   ├── useTrades.js       # Fetch + filtro de trades desde Supabase
│   └── useAccount.js      # Cuenta + posiciones + realtime
└── lib/
    ├── supabase.js        # Client Supabase
    └── helpers.js         # Formatters, computeStats, buildCurve, etc.
```

> **Diseño:** la carpeta `design/` contiene el sistema de diseño (fuente de verdad visual): `DESIGN_SYSTEM.md`, `colors_and_type.css`, `ui_kits/`, `assets/` y referencias en `preview/` y `screenshots/`. Toda la UI debe seguir esos tokens y componentes.
---
## Supabase — Branch de desarrollo
**Branch:** `trading-portal-dev`  
**Project ref:** `sgkuhtpkmjoqkenqgowl`  
**Tablas creadas:**
| Tabla | Descripción |
|-------|-------------|
| `tp_accounts` | Cuentas de trading (balance, equity, margen) |
| `tp_trades` | Historial de operaciones cerradas |
| `tp_open_positions` | Posiciones abiertas (realtime) |
| `tp_equity_snapshots` | Snapshots diarios de equity |
| `tp_ohlc` | Datos OHLC para gráfico de velas |
Todas las tablas tienen **RLS activo** y políticas por `user_id`.
### Aplicar migración en producción
```bash
# Cuando esté listo para producción, mergear el branch en Supabase Dashboard
# O correr la migración manualmente:
supabase db push --project-ref ldlflxujrjihiybrcree
```
---
## Vercel — Deploy
**Proyecto:** `pessaro-portal`  
**Variables de entorno en Vercel:**
```
VITE_SUPABASE_URL     = https://sgkuhtpkmjoqkenqgowl.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_aTrLTTVLUZrUyddVgUOccA_IO1NcYRk
```
El archivo `vercel.json` ya configura el rewrite para SPA routing.
---
## GitHub — Flujo recomendado
```
main ──────────────────────────────────── producción (pessaro.cl)
  └── trading-portal-dev ─────────────── preview Vercel + Supabase branch
        └── feature/nueva-funcionalidad
```
---
## Roadmap — Orden de desarrollo de la UI (multiplataforma)

La interfaz se construye y adapta en **fases secuenciales, no en paralelo**. No se avanza a la siguiente fase hasta cerrar y aprobar la anterior. Punto de partida en cada fase: el sistema de diseño en `design/` (`DESIGN_SYSTEM.md` y `colors_and_type.css`).

### Fase 1 — Web App (escritorio) 🖥️ · PRIORIDAD
Vista principal de trading optimizada para escritorio. Es la base de todo lo demás.
- [ ] Aplicar el sistema de diseño (`design/`) a todas las páginas (`Overview`, `Performance`, `Trades`, `ChartPage`, `Calendar`, `Risk`)
- [ ] Layout de escritorio con sidebar fijo
- [ ] KPIs, equity curve, gráficos y tablas según el diseño
- [ ] Revisión y aprobación antes de avanzar a Fase 2

### Fase 2 — App (móvil / teléfono) 📱
Adaptación responsive para teléfono, una vez cerrada la web.
- [ ] Sidebar → menú colapsable o navegación inferior
- [ ] Tablas con scroll horizontal o vista en tarjetas
- [ ] Gráficos adaptados a pantalla angosta
- [ ] Tamaños táctiles y tipografía móvil según el diseño
- [ ] Revisión y aprobación antes de avanzar a Fase 3

### Fase 3 — Tablet 📐
Adaptación responsive para tablet, al final.
- [ ] Layout intermedio (aprovechar el ancho sin perder densidad de datos)
- [ ] Ajuste de columnas, paneles y gráficos
- [ ] Soporte de orientación vertical y horizontal
- [ ] Revisión final

**Breakpoints sugeridos:** escritorio ≥ 1024px · tablet 768–1023px · móvil < 768px (ajustar según `design/`).
