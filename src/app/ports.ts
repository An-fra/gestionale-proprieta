/* eslint-disable @typescript-eslint/no-empty-object-type --
   Porte segnaposto (solo firme in Story 1.1). Le operazioni reali vengono
   aggiunte nelle epiche che le implementano; gli adapter le realizzano (AD-7). */

// src/app/ports — le porte del sistema (interfacce). Gli adapter le implementano;
// il dominio non le conosce; la UI le usa solo tramite i casi d'uso di src/app.

/** Persistenza su Google Drive (verità). Implementata in adapters/drive — Story 1.4+. */
export interface StoragePort {}

/** Cache locale IndexedDB, ricostruibile. Implementata in adapters/db — Epic 2/3. */
export interface CachePort {}

/** Generazione PDF lato client (Ricevute). Implementata in adapters/pdf — Epic 4. */
export interface PdfPort {}

/** Fotocamera e compressione immagini. Implementata in adapters/media — Epic 3. */
export interface MediaPort {}
