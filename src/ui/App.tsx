// src/ui — React. Parla SOLO con src/app (AD-7).
import './App.css';
import { useConnection } from './connection-context.tsx';

export function App() {
  const { state, connect } = useConnection();
  return (
    <main className="app-shell">
      <h1>Gestionale Proprietà</h1>
      <p className="tagline">I conti dei tuoi affitti, sul tuo Google Drive.</p>

      {state.status === 'disconnesso' && (
        <button className="azione" type="button" onClick={connect}>
          Accedi con Google
        </button>
      )}
      {state.status === 'in-connessione' && (
        <p className="stato" role="status">
          Connessione in corso…
        </p>
      )}
      {state.status === 'collegato' && (
        <p className="stato" role="status">
          Collegato come {state.email}
        </p>
      )}
      {state.status === 'riconnetti' && (
        <>
          <p className="stato" role="status">
            Sessione scaduta.
          </p>
          <button className="azione" type="button" onClick={connect}>
            Riconnetti
          </button>
        </>
      )}
    </main>
  );
}
