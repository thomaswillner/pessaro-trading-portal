# Pessaro Trading Portal — Contexto del proyecto

## Qué es
Web app de trading de PessaroCapital.
Stack: **Vite + Supabase**, gráficos con **TradingView**.
Desplegada en **Vercel** (portal.pessaro.cl) con **deploy automático en cada push a `main`**.

## Estructura del repo
- `src/` — código de la app (Vite)
- `index.html`, `vite.config.js`, `package.json` — configuración y build
- `supabase/` — backend, esquema y migraciones
- `vercel.json` — configuración de despliegue
- `design/` — **sistema de diseño (fuente de verdad visual)**. NO es código de la app: son los lineamientos a respetar.

## Sistema de diseño — LÉELO ANTES DE TOCAR LA UI
Antes de crear o modificar cualquier interfaz, lee y respeta lo que está en `design/`:
- `design/DESIGN_SYSTEM.md` — reglas del sistema de diseño
- `design/colors_and_type.css` — **paleta de colores y tipografía oficiales** (usa estos tokens, no inventes estilos)
- `design/ui_kits/` — componentes y kits de UI de referencia
- `design/assets/` — recursos gráficos
- `design/preview/` y `design/screenshots/` — referencia visual del resultado esperado

Toda la UI debe seguir estos colores, tipografía y componentes. Si algo no está definido en `design/`, pregúntame antes de improvisar.

## Orden de trabajo (prioridad estricta)
Implementa y adapta la interfaz en este orden, NO en paralelo:

1. **Web app (escritorio)** — la vista de trading principal. Prioridad #1. Déjala completa y pulida antes de avanzar.
2. **App (móvil / teléfono)** — adaptación responsive una vez lista la web.
3. **Tablet** — adaptación responsive al final.

Reglas del orden:
- No empieces el móvil hasta que la web esté lista; ni la tablet hasta que el móvil esté listo.
- Al terminar cada etapa, **avísame y espera mi OK** antes de pasar a la siguiente.

## Reglas importantes
- **Producción en vivo:** cada push a `main` despliega automático en Vercel. Antes de proponer un push, confirma que el build pasa sin errores.
- **Cambios pequeños y verificables:** trabaja por componentes, no reescrituras masivas. Evita introducir errores nuevos al "mejorar" código que ya funciona.
- **Supabase:** no modifiques esquema, migraciones ni variables de entorno sin confirmarme primero.
- **Secretos:** nunca subas claves, tokens ni credenciales al repo.
- **Commits:** mensajes claros y en español.

## Comandos
Usa los scripts definidos en `package.json` (revísalos). Típicamente en un proyecto Vite:
- instalar dependencias: `npm install`
- desarrollo local: `npm run dev`
- build de producción (debe pasar antes de cualquier push): `npm run build`

## Cómo empezar cada sesión
1. Lee `design/` completo (empezando por `DESIGN_SYSTEM.md` y `colors_and_type.css`).
2. Revisa la UI actual en `src/`.
3. Propón un plan antes de cambiar código. No reescribas sin mostrarme el plan primero.
