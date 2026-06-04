/* global React */
const { useEffect: useEffectF } = React;

function Footer({ onSubscribe, onWork }) {
  useEffectF(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <footer className="footer" data-screen-label="09 Footer">
      <div className="container">
        <div className="top">
          <div className="brand">
            <img src="../../assets/logo-pessaro.webp" alt="Pessaro Capital" />
            <p>
              Pessaro Capital es una entidad financiera líder con más de 15 años de experiencia
              proporcionando soluciones de inversión de vanguardia y acceso global a los mercados financieros.
            </p>
            <div className="social">
              <a href="#" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h6>Enlaces Rápidos</h6>
            <ul>
              <li><a href="#"><i data-lucide="chevron-right"></i>Inicio</a></li>
              <li><a href="#servicios"><i data-lucide="chevron-right"></i>Servicios</a></li>
              <li><a href="#instrumentos"><i data-lucide="chevron-right"></i>Instrumentos</a></li>
              <li><a href="#"><i data-lucide="chevron-right"></i>Educación</a></li>
              <li><a href="#"><i data-lucide="chevron-right"></i>Blog</a></li>
              <li><a href="#nosotros"><i data-lucide="chevron-right"></i>Nosotros</a></li>
              <li><a href="#"><i data-lucide="chevron-right"></i>Contacto</a></li>
            </ul>
          </div>
          <div>
            <h6>Mercados</h6>
            <ul>
              <li><a href="#"><i data-lucide="chevron-right"></i>Divisas / Forex</a></li>
              <li><a href="#"><i data-lucide="chevron-right"></i>Materias Primas</a></li>
              <li><a href="#"><i data-lucide="chevron-right"></i>Índices Bursátiles</a></li>
              <li><a href="#"><i data-lucide="chevron-right"></i>Acciones Globales</a></li>
              <li><a href="#"><i data-lucide="chevron-right"></i>Criptoactivos</a></li>
            </ul>
          </div>
          <div className="newsletter-col">
            <h6>Newsletter</h6>
            <p style={{fontSize: 13, color: "rgba(255,255,255,0.70)", margin: "0 0 14px"}}>
              Recibe análisis exclusivos y actualizaciones de mercado personalizadas
            </p>
            <button className="btn subscribe" onClick={onSubscribe}>Suscribirse</button>
            <button className="btn work" onClick={onWork}>Trabaja con Nosotros</button>
            <div className="contact-mini">
              <h6 style={{fontSize: 13, margin: "10px 0 4px"}}>Contacto</h6>
              <div className="row"><i data-lucide="phone"></i>+56 9 22 07 15 11</div>
              <div className="row"><i data-lucide="mail"></i>contacto@pessarocapital.com</div>
            </div>
          </div>
        </div>

        <div className="legal-row">
          <span>© 2026 Pessaro Capital. Todos los derechos reservados. Regulado bajo estándares internacionales de transparencia financiera.</span>
          <div className="links">
            <a href="#">Términos y Condiciones</a>
            <a href="#">Política de Privacidad</a>
            <a href="#">Advertencia de Riesgo</a>
            <a href="#">Perfil de Riesgo</a>
            <a href="#">Registro de Clientes</a>
            <a href="#">Contactar Asesor Comercial</a>
          </div>
        </div>

        <div className="risk-warning">
          <p>
            <strong>ADVERTENCIA DE RIESGO:</strong> El trading de instrumentos financieros conlleva un alto nivel de riesgo
            para su capital y puede resultar en pérdidas superiores a su depósito inicial. Los productos
            apalancados pueden no ser adecuados para todos los inversores. Por favor, asegúrese de comprender
            plenamente los riesgos involucrados y busque asesoramiento independiente si es necesario.
            Pessaro Capital no ofrece asesoramiento de inversión directo.
          </p>
        </div>
      </div>
    </footer>
  );
}

window.PessFooter = Footer;
