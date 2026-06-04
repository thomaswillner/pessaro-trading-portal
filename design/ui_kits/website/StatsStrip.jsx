/* global React */
const { useEffect: useEffectS } = React;

const STATS = [
  { icon: "clock",         v: "15+",    k: "Años de Experiencia" },
  { icon: "bar-chart-3",   v: "120+",   k: "Activos Disponibles" },
  { icon: "users",         v: "40M+",   k: "Usuarios Globales"   },
  { icon: "trending-up",   v: "0.01s",  k: "Ejecución"           }
];

function StatsStrip() {
  useEffectS(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="stats-strip" data-screen-label="03 Stats">
      <div className="container">
        <div className="grid">
          {STATS.map((s, i) => (
            <div className="stat-cell" key={i}>
              <div className="tile"><i data-lucide={s.icon}></i></div>
              <div className="v">{s.v}</div>
              <div className="k">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.PessStatsStrip = StatsStrip;
