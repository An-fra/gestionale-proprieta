import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from './App.tsx';
import { ConnectionProvider } from './connection-context.tsx';
import type { Connection } from '../app/connection.ts';

// Connessione finta ferma su "disconnesso": la UI deve mostrare il pulsante di accesso.
// getState restituisce SEMPRE lo stesso riferimento: useSyncExternalStore esige uno
// snapshot stabile, altrimenti va in loop di render.
function fakeConnection(): Connection {
  const state = { status: 'disconnesso' } as const;
  return {
    getState: () => state,
    subscribe: () => () => {},
    connect: async () => {},
    getToken: () => null,
    ensureToken: async () => null,
  };
}

function renderApp() {
  render(
    <ConnectionProvider connection={fakeConnection()}>
      <App />
    </ConnectionProvider>,
  );
}

describe('App', () => {
  it('mostra il titolo dell\'app', () => {
    renderApp();
    expect(
      screen.getByRole('heading', { name: /Gestionale Proprietà/i }),
    ).toBeInTheDocument();
  });

  it('mostra il pulsante di accesso quando disconnesso', () => {
    renderApp();
    expect(
      screen.getByRole('button', { name: /Accedi con Google/i }),
    ).toBeInTheDocument();
  });
});
