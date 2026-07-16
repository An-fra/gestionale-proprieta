/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Client ID OAuth (pubblico) dell'app. Vedi .env.development / .env.production. */
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
