/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Gestionale Proprietà — PWA installabile.
// registerType 'autoUpdate': una nuova versione pubblicata si attiva al riavvio dell'app (AD-11, Story 1.2).
// GitHub Pages di progetto serve da https://<utente>.github.io/gestionale-proprieta/.
// Senza questo base, asset e service worker punterebbero a "/" e l'app pubblicata
// sarebbe una pagina bianca. Vale anche in dev: il server locale serve sotto lo
// stesso percorso, così dev e produzione non divergono (Story 1.2).
// Unica fonte di verità: `scope` e `start_url` del manifest derivano da qui, così
// non possono divergere dal base (uno start_url fuori scope invalida il manifest).
const BASE = '/gestionale-proprieta/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Gestionale Proprietà',
        short_name: 'Proprietà',
        description:
          'Gestione degli affitti multi-dispositivo, con i dati sul tuo Google Drive.',
        lang: 'it',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#1a1410',
        theme_color: '#7a5c3a',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
