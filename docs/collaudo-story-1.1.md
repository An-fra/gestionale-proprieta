# Collaudo — Story 1.1 (scaffolding e PWA installabile)

Guida per verificare con le tue mani cosa è stato costruito. Tempo richiesto: **~10 minuti**.

Apri il terminale e posizionati nella cartella del progetto:

```bash
cd "D:\Claude code\gestionale-proprieta"
```

Tutti i comandi qui sotto si eseguono da lì.

---

## Prerequisito — Node aggiornato

```bash
node --version
```

**Ti aspetti:** `v20.19` o superiore (sulla tua macchina è `v24.18.0` ✅).
**Se no:** Vite 8 non parte. Aggiorna Node.

---

## Test 1 — L'app si apre (30 secondi)

```bash
npm run dev
```

**Ti aspetti:** il terminale stampa un indirizzo tipo `http://localhost:5173/`. Aprilo nel browser.

**Cosa devi vedere:**
- Sfondo scuro sul marrone, titolo grande **"Gestionale Proprietà"**
- Sottotitolo "I conti dei tuoi affitti, sul tuo Google Drive."
- Il messaggio "Collegamento non ancora configurato…" ← **è corretto così**: l'accesso a Google arriva con la Story 1.3
- Nella scheda del browser, l'icona marrone con la casetta

**Se vedi una pagina bianca:** guarda la console del browser (F12) e riportami l'errore.

Per fermare il server: `Ctrl+C` nel terminale.

---

## Test 2 — I quattro cancelli di qualità (2 minuti)

Questi sono i controlli automatici che impediscono al progetto di degradare. Eseguili uno per uno.

```bash
npm run typecheck
```
**Ti aspetti:** nessun output (silenzio = tutto a posto). Verifica che i tipi TypeScript siano corretti sia in `src` che in `vite.config.ts`.

```bash
npm run lint
```
**Ti aspetti:** `✔ no dependency violations found (19 modules, 9 dependencies cruised)`

```bash
npm run test
```
**Ti aspetti:** `Test Files 1 passed (1)` e `Tests 2 passed (2)`

```bash
npm run build
```
**Ti aspetti:** `✓ built in ...ms` seguito da `PWA v1.3.0` e la lista dei file generati (`dist/sw.js`, `dist/manifest.webmanifest`).

**Se uno di questi fallisce:** è un problema vero, dimmelo.

---

## Test 3 — La PWA si installa davvero (3 minuti)

⚠️ **Importante:** l'installazione **non funziona con `npm run dev`**. Il service worker (il pezzo che rende l'app installabile e offline) viene generato solo nella build di produzione. Serve quindi il "preview".

```bash
npm run build
npm run preview
```

**Ti aspetti:** un indirizzo tipo `http://localhost:4173/`. Aprilo **in Chrome** (non Edge/Firefox per questo test).

**Cosa devi vedere e fare:**
1. Nella barra degli indirizzi, a destra, compare un'**icona di installazione** (un monitor con una freccia giù). Se non la vedi subito, attendi 2-3 secondi o ricarica.
2. Cliccala → Chrome chiede *"Installare Gestionale Proprietà?"* → **Installa**
3. L'app si apre in una **finestra sua**, senza barra degli indirizzi. Questa è la PWA.
4. Nel menu Start di Windows ora trovi "Gestionale Proprietà" come una normale applicazione.

**Verifica tecnica (facoltativa, per curiosità):** nella finestra dell'app premi F12 → scheda **Application** → **Manifest**: devi vedere nome, lingua `it`, `display: standalone` e le due icone. Sempre lì, sezione **Service Workers**: uno stato `activated and is running`.

**Se l'icona di installazione non compare:** dimmelo, controlliamo il manifest insieme.

Per disinstallare: nella finestra dell'app, menu `⋮` in alto a destra → Disinstalla.

---

## Test 4 — Il muro architetturale (2 minuti) 🧱

Questo è il test più interessante: dimostra che l'architettura **si difende da sola**. La regola dice che il "cuore" del sistema (`src/domain`) non può dipendere da nient'altro. Proviamo a violarla di proposito.

**Passo 1 — crea una violazione deliberata:**

```bash
echo 'import "../../app/ports.ts";' > src/domain/events/prova-violazione.ts
```

**Passo 2 — chiedi al controllo di verificare:**

```bash
npm run lint:boundaries
```

**Ti aspetti che FALLISCA**, con un messaggio tipo:
```
error domain-puro: src/domain/events/prova-violazione.ts → src/app/ports.ts
x 1 dependency violations (1 errors, 0 warnings).
```

✅ **Questo è il successo del test:** l'errore è la prova che il muro funziona. Se qualcuno (anche un'AI distratta, fra sei mesi) provasse a scrivere codice che rompe l'architettura, il progetto si rifiuterebbe di compilare.

**Passo 3 — rimuovi la violazione:**

```bash
rm src/domain/events/prova-violazione.ts
npm run lint:boundaries
```

**Ti aspetti:** `✔ no dependency violations found` — tutto torna verde.

---

## Cosa NON deve funzionare (ancora)

Per evitare falsi allarmi, ecco cosa è **normale** che manchi in questa fase:

| Non funziona | Arriva con |
|---|---|
| Accesso con Google / collegamento a Drive | Story 1.3 |
| Cartelle create su Drive | Story 1.4 |
| L'app pubblicata su internet (URL pubblico) | Story 1.2 |
| Scelta del profilo (Andre / secondo amministratore) | Story 1.5 |
| Registrare spese, canoni, documenti | Epic 2 e 3 |

La Story 1.1 aveva un solo obiettivo: **le fondamenta esistono e sono verificabili**. Tutto il resto poggia qui sopra.

---

## Esito del collaudo

Se i Test 1, 2, 3 e 4 sono andati come descritto, la Story 1.1 è confermata sul campo. Se qualcosa si discosta, annotalo e riportamelo: è più utile un difetto trovato ora che fra tre epiche.
