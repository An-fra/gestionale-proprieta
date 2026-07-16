// src/app/connection — stato di connessione all'account Google (macchina a stati).
// Dipende solo da domain/porte (AD-7); framework-agnostico e testabile senza rete.
import type { AuthPort, AuthSession } from './ports.ts';

export type ConnectionState =
  | { readonly status: 'disconnesso' }
  | { readonly status: 'in-connessione' }
  | { readonly status: 'collegato'; readonly email: string }
  | { readonly status: 'riconnetti'; readonly email: string };

export interface Connection {
  getState(): ConnectionState;
  subscribe(listener: () => void): () => void;
  /** Avvia l'accesso interattivo. Non lancia: gli errori diventano stato 'disconnesso'. */
  connect(): Promise<void>;
  /** Il token valido corrente, o null se scaduto/assente (sincrono, non rinnova). */
  getToken(): string | null;
  /** Il token valido, tentando un rinnovo silenzioso se scaduto. Null se serve riconnettere. */
  ensureToken(): Promise<string | null>;
}

export function createConnection(
  auth: AuthPort,
  now: () => number = Date.now,
): Connection {
  let state: ConnectionState = { status: 'disconnesso' };
  let session: AuthSession | null = null;
  const listeners = new Set<() => void>();

  function set(next: ConnectionState): void {
    state = next;
    for (const listener of listeners) listener();
  }

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    async connect() {
      set({ status: 'in-connessione' });
      try {
        session = await auth.connect();
        set({ status: 'collegato', email: session.email });
      } catch {
        session = null;
        set({ status: 'disconnesso' });
      }
    },

    getToken() {
      if (session && session.expiresAt > now()) return session.token;
      return null;
    },

    async ensureToken() {
      if (session && session.expiresAt > now()) return session.token;
      if (session === null) return null; // mai connesso
      // sessione presente ma scaduta: tenta il rinnovo silenzioso
      const renewed = await auth.renewSilently();
      if (renewed) {
        session = renewed;
        set({ status: 'collegato', email: renewed.email });
        return renewed.token;
      }
      set({ status: 'riconnetti', email: session.email });
      return null;
    },
  };
}
