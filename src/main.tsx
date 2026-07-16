// Composition root: qui — e solo qui — si cablano insieme adapter (infra) e app.
// main.tsx sta fuori dai layer con confini (AD-7), quindi può importare da tutti.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App.tsx';
import { ConnectionProvider } from './ui/connection-context.tsx';
import { createConnection } from './app/connection.ts';
import { createGisAuth } from './adapters/auth/gis.ts';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error(
    'VITE_GOOGLE_CLIENT_ID non configurato: manca il file .env con il client ID OAuth',
  );
}

const connection = createConnection(createGisAuth(clientId));

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Elemento #root non trovato in index.html');
}

createRoot(rootEl).render(
  <StrictMode>
    <ConnectionProvider connection={connection}>
      <App />
    </ConnectionProvider>
  </StrictMode>,
);
