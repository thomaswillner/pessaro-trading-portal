/* global React */
const { useEffect: useEffectH } = React;

function Hero({ onOpenAccount }) {
  useEffectH(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="hero" data-screen-label="02 Hero">
      <div className="inner">
        <div className="trust-pill">
          <i data-lucide="shield-check"></i>
          Mercado Regulado y Fondos Segregados
        </div>
        <h1>
          <span className="a1">Domine los Mercados con</span>
          <span className="a2">Precisión Institucional</span>
        </h1>
        <p className="subhead">
          Acceda a Forex, Commodities e Índices con tecnología de baja latencia y el respaldo de 15 años de excelencia financiera.
        </p>
        <div className="cta-row">
          <button className="btn-accent" onClick={onOpenAccount}>
            Abrir Cuenta Real
            <i data-lucide="arrow-right"></i>
          </button>
          <button className="btn-outline" onClick={onOpenAccount}>Prueba Demo Gratis</button>
        </div>
      </div>
    </section>
  );
}

window.PessHero = Hero;
