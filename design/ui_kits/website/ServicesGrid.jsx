/* global React */
const { useEffect: useEffectSv } = React;

const SERVICES = [
  {
    icon: "trending-up",
    title: "Forex Trading",
    desc: "Opere con más de 60 pares de divisas con spreads desde 0.0 pips y ejecución instantánea.",
    benefits: ["Spreads desde 0.0 pips en EUR/USD", "Apalancamiento hasta 1:500", "Ejecución en menos de 30ms"]
  },
  {
    icon: "wallet",
    title: "Materias Primas",
    desc: "Invierta en oro, plata, petróleo y productos agrícolas con márgenes competitivos.",
    benefits: ["Oro y plata sin comisiones", "Petróleo WTI y Brent", "Cobertura contra inflación"]
  },
  {
    icon: "bar-chart-3",
    title: "Índices Bursátiles",
    desc: "Opere con los principales índices mundiales: S&P 500, NASDAQ, DAX, FTSE y más.",
    benefits: ["S&P 500, NASDAQ, Dow Jones", "Spreads fijos garantizados", "Horarios extendidos"]
  },
  {
    icon: "zap",
    title: "Criptomonedas",
    desc: "Bitcoin, Ethereum y las principales altcoins con apalancamiento y sin custodia.",
    benefits: ["Bitcoin, Ethereum, Litecoin", "Trading 24/7 sin interrupciones", "Apalancamiento hasta 1:10"]
  }
];

function ServicesGrid() {
  useEffectSv(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="section" id="servicios" data-screen-label="04 Services">
      <div className="container">
        <div className="head">
          <h2>Servicios Financieros de <span className="accent">Elite</span></h2>
          <p>Ofrecemos un ecosistema completo para el inversor moderno, combinando tecnología de vanguardia con asesoría experta.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <article className="svc-card" key={i}>
              <div className="tile"><i data-lucide={s.icon}></i></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>
                {s.benefits.map((b, j) => (
                  <li key={j}><span className="dot"></span>{b}</li>
                ))}
              </ul>
              <a className="more" href="#">Ver detalles <i data-lucide="arrow-right"></i></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

window.PessServicesGrid = ServicesGrid;
