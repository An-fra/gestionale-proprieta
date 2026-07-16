// src/adapters/auth — implementa AuthPort su Google Identity Services (token model).
// Può importare da src/app (porte); mai da ui o altri adapter (AD-7).
import type { AuthPort, AuthSession } from '../../app/ports.ts';

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const ABOUT_URL = 'https://www.googleapis.com/drive/v3/about?fields=user';

/** Carica la libreria GIS una volta sola. */
function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Caricamento di Google Identity Services fallito')),
      );
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Caricamento di Google Identity Services fallito'));
    document.head.appendChild(script);
  });
}

/** Legge l'email dell'account collegato: prova anche che il token e lo scope funzionano. */
async function fetchEmail(token: string): Promise<string> {
  const response = await fetch(ABOUT_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Drive ha risposto ${String(response.status)}`);
  }
  const data = (await response.json()) as { user?: { emailAddress?: string } };
  return data.user?.emailAddress ?? 'account sconosciuto';
}

export function createGisAuth(clientId: string): AuthPort {
  let client: GisTokenClient | null = null;
  let pending: {
    resolve: (r: GisTokenResponse) => void;
    reject: (e: Error) => void;
  } | null = null;

  async function ensureClient(): Promise<GisTokenClient> {
    if (client) return client;
    await loadGis();
    const google = window.google;
    if (!google) throw new Error('Google Identity Services non disponibile');
    client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        const p = pending;
        pending = null;
        if (!p) return;
        if (response.error) {
          p.reject(new Error(response.error_description ?? response.error));
        } else {
          p.resolve(response);
        }
      },
      error_callback: (error) => {
        const p = pending;
        pending = null;
        if (p) p.reject(new Error(error.message ?? 'Accesso annullato'));
      },
    });
    return client;
  }

  function request(prompt?: string): Promise<GisTokenResponse> {
    return ensureClient().then(
      (c) =>
        new Promise<GisTokenResponse>((resolve, reject) => {
          pending = { resolve, reject };
          c.requestAccessToken(prompt === undefined ? {} : { prompt });
        }),
    );
  }

  async function toSession(response: GisTokenResponse): Promise<AuthSession> {
    if (!response.access_token) throw new Error('Nessun token ricevuto');
    const email = await fetchEmail(response.access_token);
    return {
      email,
      token: response.access_token,
      expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000,
    };
  }

  return {
    async connect() {
      return toSession(await request());
    },
    async renewSilently() {
      try {
        return await toSession(await request(''));
      } catch {
        return null;
      }
    },
  };
}
