import CookieConsent from "react-cookie-consent";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const isClient = process.browser;

  return (
    <>
      {/* {isClient && (
        <div id="cookie">
          <CookieBanner
            message="Cookie banner message"
            wholeDomain={true}
            onAccept={() => {}}
            onAcceptPreferences={() => {}}
            onAcceptStatistics={() => {}}
            onAcceptMarketing={() => {}}
          />
        </div>
      )} */}
      <CookieConsent
        buttonText="Ho capito"
        declineButtonText="Rifiuto"
        style={{ background: "#ddd", color: "#121212" }}
        buttonStyle={{
          color: "#e12862",
          background: "white",
          fontSize: "13px",
        }}
        onDecline={() => {
          window.location = "http://google.com";
        }}
      >
        Questo sito utilizza cookie e servizi di terze parti (Google, Mapbox)
        per fornire una migliore esperienza di utilizzo. Maggior informazioni
        sulla pagina della privacy policy.
      </CookieConsent>
      <Component {...pageProps} />
    </>
  );
}
