/* global React */
const { useEffect } = React;

function Header() {
  useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <header className="site-header" data-screen-label="01 Header">
      <div className="container inner">
        <a className="logo" href="#">
          <img src="../../assets/logo-pessaro.webp" alt="Pessaro Capital" />
        </a>
        <nav>
          <a className="active" href="#">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#instrumentos">Instrumentos</a>
          <a href="#educacion">Educación</a>
          <a href="#blog">Blog</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="actions">
          <span className="theme-pill">
            <i data-lucide="palette"></i>
            <span className="dot" style={{background: "oklch(0.45 0.25 280)"}}></span>
            Tema
          </span>
          <button className="open-account" onClick={() => alert('Abrir Cuenta — perfil de riesgo')}>
            Abrir Cuenta
          </button>
          <span className="login-menu">
            <i data-lucide="user"></i>
            Acceso Cliente
            <i data-lucide="chevron-down"></i>
          </span>
        </div>
      </div>
    </header>
  );
}

window.PessHeader = Header;
