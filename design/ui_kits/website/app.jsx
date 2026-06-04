/* global React, ReactDOM */
const { useState: useStateApp } = React;

function App() {
  const [toast, setToast] = useStateApp(null);
  const show = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const Header = window.PessHeader;
  const Hero = window.PessHero;
  const StatsStrip = window.PessStatsStrip;
  const ServicesGrid = window.PessServicesGrid;
  const InstrumentsGrid = window.PessInstrumentsGrid;
  const AboutSection = window.PessAboutSection;
  const TestimonialsCarousel = window.PessTestimonialsCarousel;
  const NewsletterCta = window.PessNewsletterCta;
  const Footer = window.PessFooter;

  return (
    <>
      <Header />
      <main>
        <Hero onOpenAccount={() => show("Perfil de Riesgo — completa tu evaluación antes de abrir cuenta")} />
        <StatsStrip />
        <ServicesGrid />
        <InstrumentsGrid onTrade={() => show("Abrir cuenta real para operar EUR/USD")} />
        <AboutSection />
        <TestimonialsCarousel />
        <NewsletterCta onSubscribe={() => show("Suscripción al newsletter enviada")} />
      </main>
      <Footer
        onSubscribe={() => show("Suscripción al newsletter enviada")}
        onWork={() => show("Formulario · Trabaja con Nosotros")}
      />
      {toast && (
        <div role="status" style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "oklch(0.18 0.10 250)", color: "white",
          padding: "12px 22px", borderRadius: 10,
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
          boxShadow: "0 16px 40px -8px rgba(0,0,0,0.40)",
          border: "1px solid oklch(0.30 0.10 280)",
          zIndex: 100
        }}>
          {toast}
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
