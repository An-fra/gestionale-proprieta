import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from './App.tsx';

// Smoke test: lo scheletro si monta e renderizza senza errori (Story 1.1, AC-1/AC-4).
describe('App', () => {
  it('mostra il titolo dell\'app', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /Gestionale Proprietà/i }),
    ).toBeInTheDocument();
  });

  it('mostra lo stato di collegamento non ancora configurato', () => {
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent(
      /Collegamento non ancora configurato/i,
    );
  });
});
