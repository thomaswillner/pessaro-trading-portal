/* global React */
const { useEffect: useEffectT, useState: useStateT } = React;

const TESTIMONIALS = [
  {
    name: "María González", role: "Trader Profesional",
    avatar: "../../assets/photo-warren-buffett.webp",
    text: "Pessaro Capital ha revolucionado mi forma de operar. Sus análisis de mercado son precisos y su plataforma tecnológica es excepcional. Los spreads competitivos me han permitido maximizar mis ganancias."
  },
  {
    name: "Carlos Mendoza", role: "Inversor Institucional",
    avatar: "../../assets/photo-ray-dalio.webp",
    text: "La gestión de riesgo que ofrece Pessaro Capital es sobresaliente. Durante 15 años de experiencia, nunca había encontrado un equipo tan profesional y dedicado a proteger el capital de sus clientes."
  },
  {
    name: "Ana Ruiz", role: "Gestora de Fondos",
    avatar: "../../assets/photo-george-soros.webp",
    text: "Lo que más valoro es la transparencia total en cada operación. Mi asesor me mantiene informada en tiempo real y cada decisión está respaldada por análisis fundamentales sólidos."
  }
];

function TestimonialsCarousel() {
  const [i, setI] = useStateT(0);
  useEffectT(() => { if (window.lucide) window.lucide.createIcons(); }, [i]);
  useEffectT(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <section className="testimonials" data-screen-label="07 Testimonials">
      <div className="container">
        <div className="head">
          <h2><span>Lo que dicen nuestros</span> <span className="accent">inversores</span></h2>
          <p>Más de 15,000 inversionistas confían en nuestra asesoría personalizada y gestión profesional.</p>
        </div>
        <div className="carousel">
          <button className="nav-btn prev" aria-label="Anterior" onClick={() => setI((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>
            <i data-lucide="chevron-left"></i>
          </button>
          <div className="slide">
            <div className="stars">
              {[0,1,2,3,4].map((s) => <i data-lucide="star" key={s}></i>)}
            </div>
            <blockquote>"{t.text}"</blockquote>
            <div className="author">
              <img className="avatar" src={t.avatar} alt={t.name} />
              <div>
                <div className="nm">{t.name}</div>
                <div className="ro">{t.role}</div>
              </div>
            </div>
          </div>
          <button className="nav-btn next" aria-label="Siguiente" onClick={() => setI((p) => (p + 1) % TESTIMONIALS.length)}>
            <i data-lucide="chevron-right"></i>
          </button>
          <div className="dots">
            {TESTIMONIALS.map((_, idx) => (
              <button key={idx} className={"dot" + (idx === i ? " active" : "")} onClick={() => setI(idx)} aria-label={`Testimonio ${idx+1}`}></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.PessTestimonialsCarousel = TestimonialsCarousel;
