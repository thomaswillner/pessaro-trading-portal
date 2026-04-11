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

1. Desarrollar en `trading-portal-dev`
2. PR hacia `main` cuando esté listo
3. Mergear Supabase branch en Dashboard
4. Vercel despliega automáticamente a producción

---

## Próximos pasos

- [ ] Edge Function: `sync-trades` (import desde MT4/cTrader via CSV o API)
- [ ] Edge Function: `price-feed` (OHLC desde proveedor de datos)
- [ ] Autenticación por email (Supabase Auth ya configurado)
- [ ] Modo demo con datos seed
- [ ] Sección PAMM / Cuentas administradas
