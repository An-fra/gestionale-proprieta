// src/ui — React. Parla SOLO con src/app (AD-7). In Story 1.1 una schermata placeholder.
import './App.css';

export function App() {
  return (
    <main className="app-shell">
      <h1>Gestionale Proprietà</h1>
      <p className="tagline">
        I conti dei tuoi affitti, sul tuo Google Drive.
      </p>
      <p className="stato" role="status">
        Collegamento non ancora configurato — arriverà con l'accesso all'account
        di gestione.
      </p>
    </main>
  );
}
