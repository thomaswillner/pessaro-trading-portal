/* global React, ReactDOM */
// Trading App — host. Stitches together the design canvas with mobile,
// tablet and desktop artboards, all sharing the same Tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "indigo",
  "density": "cozy",
  "chartType": "candles",
  "pnl": "classic",
  "lang": "es"
}/*EDITMODE-END*/;

function PessTradingApp() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply palette/density/pnl to <html> so portal'd focus overlays inherit too.
  React.useEffect(() => {
    document.documentElement.dataset.palette = t.palette;
    document.documentElement.dataset.density = t.density;
    document.documentElement.dataset.pnl = t.pnl;
  }, [t.palette, t.density, t.pnl]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <window.DesignCanvas>
        <window.DCSection id="auth" title="Onboarding & Auth" subtitle="iOS · 393×852 · first-run flow → login → KYC">
          <window.DCArtboard id="m-onboard" label="Risk profile" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobOnboard lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-login" label="Login" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobLogin lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-kyc" label="KYC · document" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobKyc lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="broker" title="Cuenta & Bróker" subtitle="iOS · 393×852 · vincular cuenta de trading desde la lista privada Pessaro">
          <window.DCArtboard id="m-broker-connect" label="Vincular bróker" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobBrokerConnect lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-broker-creds" label="Credenciales MT5" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobBrokerCredentials lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-accounts" label="Cuentas vinculadas" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobAccounts lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="mobile" title="Mobile" subtitle="iOS · 393×852 · core trader flows">
          <window.DCArtboard id="m-dashboard" label="Dashboard" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobDashboard lang={t.lang} chartType={t.chartType} density={t.density} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-asset" label="Asset detail" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobAssetDetail lang={t.lang} chartType={t.chartType} density={t.density} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-order" label="Order ticket" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobOrderTicket lang={t.lang} chartType={t.chartType} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-markets" label="Markets" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobMarkets lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-portfolio" label="Portfolio" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobPortfolio lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="signals" title="Señales & Notificaciones" subtitle="iOS · 393×852 · Signal Framework — alertas predictivas, push enriquecido y hápticos">
          <window.DCArtboard id="m-signals" label="Bandeja de señales" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobSignals lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-lockscreen" label="Push · pantalla bloqueada" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobLockScreen lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
          <window.DCArtboard id="m-alert-rules" label="Reglas & hápticos" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobAlertRules lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="reports" title="Reportes & Exportar" subtitle="iOS · 393×852 · genera y descarga en PDF · Excel · CSV · HTML interactivo · JSON · MT5">
          <window.DCArtboard id="m-reports" label="Reportes" width={393} height={852}>
            <window.IOSDevice width={393} height={852} dark={true}>
              <window.MobReports lang={t.lang} />
            </window.IOSDevice>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="tablet" title="Tablet" subtitle="iPad landscape · 1024×720 · split-pane trading">
          <window.DCArtboard id="t-dashboard" label="Split dashboard" width={1024} height={720}>
            <div style={{ width: 1024, height: 720, background: "var(--app-bg)", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px -16px rgba(0,0,0,0.45)" }}>
              <window.TabletDashboard lang={t.lang} chartType={t.chartType} />
            </div>
          </window.DCArtboard>
        </window.DCSection>

        <window.DCSection id="desktop" title="Desktop" subtitle="Web app · 1440×860 · pro workstation + analytics">
          <window.DCArtboard id="d-workstation" label="Trading workstation" width={1440} height={860}>
            <window.ChromeWindow url="https://app.pessaro.cl/trade" width={1440} height={860}>
              <window.DesktopWorkstation lang={t.lang} chartType={t.chartType} />
            </window.ChromeWindow>
          </window.DCArtboard>
          <window.DCArtboard id="d-analytics" label="Portfolio analytics" width={1440} height={860}>
            <window.ChromeWindow url="https://app.pessaro.cl/portfolio" width={1440} height={860}>
              <window.DesktopAnalytics lang={t.lang} chartType={t.chartType} />
            </window.ChromeWindow>
          </window.DCArtboard>
        </window.DCSection>
      </window.DesignCanvas>

      <window.TweaksPanel>
        <window.TweakSection label="Palette" />
        <window.TweakRadio
          label="Theme"
          value={t.palette}
          options={["indigo", "gold", "carbon"]}
          onChange={(v) => setTweak("palette", v)}
        />

        <window.TweakSection label="Layout" />
        <window.TweakRadio
          label="Density"
          value={t.density}
          options={["cozy", "compact"]}
          onChange={(v) => setTweak("density", v)}
        />

        <window.TweakSection label="Charts" />
        <window.TweakRadio
          label="Style"
          value={t.chartType}
          options={["candles", "line", "area"]}
          onChange={(v) => setTweak("chartType", v)}
        />
        <window.TweakRadio
          label="P&L colors"
          value={t.pnl}
          options={["classic", "cb"]}
          onChange={(v) => setTweak("pnl", v)}
        />

        <window.TweakSection label="Language" />
        <window.TweakRadio
          label="Idioma"
          value={t.lang}
          options={["es", "en", "pt"]}
          onChange={(v) => setTweak("lang", v)}
        />
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PessTradingApp />);
