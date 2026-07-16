import { describe, it, expect } from 'vitest';
import { createConnection } from './connection.ts';
import type { AuthPort, AuthSession } from './ports.ts';

const sessione = (over: Partial<AuthSession> = {}): AuthSession => ({
  email: 'gestione@example.com',
  token: 'tok',
  expiresAt: 10_000,
  ...over,
});

describe('createConnection', () => {
  it('parte disconnesso', () => {
    const auth: AuthPort = {
      connect: async () => sessione(),
      renewSilently: async () => null,
    };
    expect(createConnection(auth).getState().status).toBe('disconnesso');
  });

  it('dopo connect è collegato, con email e token validi', async () => {
    const auth: AuthPort = {
      connect: async () => sessione(),
      renewSilently: async () => null,
    };
    const c = createConnection(auth, () => 0);
    await c.connect();
    expect(c.getState()).toEqual({ status: 'collegato', email: 'gestione@example.com' });
    expect(c.getToken()).toBe('tok');
  });

  it('se connect fallisce torna disconnesso, senza lanciare', async () => {
    const auth: AuthPort = {
      connect: async () => {
        throw new Error('annullato');
      },
      renewSilently: async () => null,
    };
    const c = createConnection(auth);
    await c.connect();
    expect(c.getState().status).toBe('disconnesso');
    expect(c.getToken()).toBeNull();
  });

  it('token scaduto senza rinnovo → stato riconnetti', async () => {
    const auth: AuthPort = {
      connect: async () => sessione({ expiresAt: 100 }),
      renewSilently: async () => null,
    };
    let t = 0;
    const c = createConnection(auth, () => t);
    await c.connect();
    t = 200;
    expect(c.getToken()).toBeNull();
    expect(await c.ensureToken()).toBeNull();
    expect(c.getState()).toEqual({ status: 'riconnetti', email: 'gestione@example.com' });
  });

  it('token scaduto con rinnovo silenzioso → resta collegato col nuovo token', async () => {
    const auth: AuthPort = {
      connect: async () => sessione({ expiresAt: 100 }),
      renewSilently: async () => sessione({ token: 'tok2', expiresAt: 10_000 }),
    };
    let t = 0;
    const c = createConnection(auth, () => t);
    await c.connect();
    t = 200;
    expect(await c.ensureToken()).toBe('tok2');
    expect(c.getState().status).toBe('collegato');
  });

  it('notifica i subscriber a ogni cambio di stato', async () => {
    const auth: AuthPort = {
      connect: async () => sessione(),
      renewSilently: async () => null,
    };
    const c = createConnection(auth, () => 0);
    let n = 0;
    const unsub = c.subscribe(() => n++);
    await c.connect(); // in-connessione + collegato = 2 notifiche
    expect(n).toBe(2);
    unsub();
    await c.connect();
    expect(n).toBe(2); // dopo unsubscribe non arrivano più
  });
});
