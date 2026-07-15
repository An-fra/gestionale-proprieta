// src/app — casi d'uso, outbox, sincronizzazione. Definisce le porte (ports.ts).
// Può importare da src/domain; mai da adapters o ui (AD-7).
// In Story 1.1 espone solo le porte; i casi d'uso arrivano nelle epiche successive.

export type {
  StoragePort,
  CachePort,
  PdfPort,
  MediaPort,
} from './ports.ts';
