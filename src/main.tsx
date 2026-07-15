// Bootstrap dell'app. main → ui soltanto (AD-7).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App.tsx';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Elemento #root non trovato in index.html');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
