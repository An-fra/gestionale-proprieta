// Tipi minimi per la parte di Google Identity Services usata dall'adapter.
// Copre solo ciò che serve (token model), non l'intera libreria.
export {};

declare global {
  interface GisTokenResponse {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  }

  interface GisTokenClientConfig {
    client_id: string;
    scope: string;
    callback: (response: GisTokenResponse) => void;
    error_callback?: (error: { type?: string; message?: string }) => void;
  }

  interface GisTokenClient {
    requestAccessToken(overrides?: { prompt?: string }): void;
  }

  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: GisTokenClientConfig): GisTokenClient;
        };
      };
    };
  }
}
