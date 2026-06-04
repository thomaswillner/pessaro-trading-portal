/* global React */
const { useEffect: useEffectN } = React;

const CHIPS = [
  "📈 Análisis de Mercados",
  "💱 Forex & Divisas",
  "📊 Acciones & ETF",
  "₿ Criptomonedas",
  "🏛️ Política Económica"
];

function NewsletterCta({ onSubscribe }) {
  useEffectN(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <section className="newsletter" data-screen-label="08 Newsletter">
      <div className="inner">
        <h2><span>Mantente</span> <span className="accent">Informado</span></h2>
        <p>
          Recibe análisis de mercado exclusivos, estrategias de trading personalizadas y alertas de oportunidades directamente en tu correo. Selecciona los temas que más te interesan.
        </p>
        <div className="chips">
          {CHIPS.map((c, i) => <span className="chip" key={i}>{c}</span>)}
        </div>
        <button className="submit" onClick={onSubscribe}>
          <i data-lucide="send"></i>
          Suscribirse al Newsletter
        </button>
        <div className="meta">Únete a más de 10,000 traders que ya reciben nuestros análisis exclusivos. Sin spam, solo contenido de valor.</div>
      </div>
    </section>
  );
}

window.PessNewsletterCta = NewsletterCta;
