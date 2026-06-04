/* global React */
const { useEffect: useEffectA } = React;

function AboutSection() {
  useEffectA(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="about" id="nosotros" data-screen-label="06 About">
      <div className="container">
        <div className="grid">
          <div>
            <h2>Trayectoria, Confianza y <span className="accent">Resultados</span></h2>
            <p>
              Con más de 15 años en los mercados financieros, Pessaro Capital se ha consolidado como un referente en servicios de inversión.
              Nuestra plataforma combina tecnología de última generación con la experiencia de un equipo de profesionales altamente cualificados.
            </p>
            <div className="features">
              <div className="feat"><i data-lucide="shield-check"></i>Regulación Internacional</div>
              <div className="feat"><i data-lucide="check-circle-2"></i>Fondos Segregados</div>
              <div className="feat"><i data-lucide="message-square"></i>Soporte 24/7</div>
              <div className="feat"><i data-lucide="zap"></i>Ejecución Instantánea</div>
            </div>
            <button className="open-account" style={{height: 44, padding: "0 22px", fontSize: 14, background: "oklch(0.55 0.25 290)", color: "white", border: 0, borderRadius: 10, boxShadow: "0 8px 24px -6px oklch(0.55 0.25 290 / 0.40)"}}>
              Conozca Nuestro Equipo
            </button>
          </div>
          <div className="portrait">
            <img src="../../assets/team-francisco-rojas.webp" alt="Francisco Rojas — Fundador, Pessaro Capital" />
          </div>
        </div>
      </div>
    </section>
  );
}

window.PessAboutSection = AboutSection;
