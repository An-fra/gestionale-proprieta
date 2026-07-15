# Setup — Gestionale Proprietà

Guida ai passaggi che vanno fatti a mano, una volta sola. Cresce insieme al progetto: oggi copre la pubblicazione (Story 1.2), più avanti l'account di gestione e l'accesso a Google (Story 1.3).

---

## 1. Pubblicare l'app su GitHub Pages

### Cosa serve

- Un account GitHub (gratuito).
- Il repository **deve essere pubblico**: è il vincolo del piano gratuito di GitHub Pages, accettato consapevolmente in fase di architettura (AD-11).

### Perché un repo pubblico non è un problema

Nel repository **non finisce mai un dato tuo**. Ci vive solo il codice dell'app. Tutto ciò che è privato — importi, contratti, documenti, nomi degli inquilini — vive esclusivamente sul Google Drive di gestione, che resta tuo e privato. Chi guarda il repository vede *come* è fatta l'app, mai *cosa* ci hai messo dentro.

L'unico valore "sensibile" che comparirà in futuro (Story 1.3) è il **client ID OAuth**, che per progettazione è un identificativo pubblico: non è una password e non dà accesso a nulla da solo.

Se un giorno preferissi comunque un repository privato, l'alternativa a costo zero è **Cloudflare Pages** (stessa architettura, stesso deploy automatico).

### Passaggi

1. **Crea il repository su GitHub**
   - Vai su [github.com/new](https://github.com/new)
   - Nome: `gestionale-proprieta` ← **deve essere esattamente questo**: l'app è configurata per vivere all'indirizzo `/gestionale-proprieta/`. Un nome diverso richiede di aggiornare `BASE` in `vite.config.ts`.
   - Visibilità: **Public**
   - **Non** aggiungere README, .gitignore o licenza (ci sono già)
   - Crea

2. **Collega il progetto locale e pubblica** (dalla cartella `gestionale-proprieta`):

   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Story 1.1 e 1.2: scaffolding, PWA e deploy automatico"
   git remote add origin https://github.com/<TUO-UTENTE>/gestionale-proprieta.git
   git push -u origin main
   ```

   Sostituisci `<TUO-UTENTE>` col tuo nome utente GitHub.

3. **Guarda il deploy partire da solo**
   - Sul repository, scheda **Actions**: un workflow "Deploy su GitHub Pages" è in esecuzione
   - Esegue nell'ordine: lint (codice + confini architetturali) → test → build → pubblicazione
   - **Se uno dei controlli fallisce, la pubblicazione non avviene**: è voluto, è la rete di protezione
   - Al termine (1-2 minuti) l'app è online su:
     **`https://<TUO-UTENTE>.github.io/gestionale-proprieta/`**

   La prima esecuzione attiva GitHub Pages da sola (`enablement: true`): non devi toccare le impostazioni del repository.

4. **Da qui in poi**: ogni `git push` su `main` ripubblica l'app automaticamente. Nessun altro passaggio.

---

## 2. Installare l'app sui dispositivi

Apri l'URL pubblico (`https://<TUO-UTENTE>.github.io/gestionale-proprieta/`) sul dispositivo.

### Android (Chrome)

1. Apri l'indirizzo in Chrome
2. Compare il banner *"Aggiungi a schermata Home"*, oppure: menu `⋮` → **Installa app**
3. L'app compare tra le applicazioni, con la sua icona, e si apre senza barra degli indirizzi

### iPhone / iPad (Safari)

⚠️ Su iOS **non esiste** il prompt automatico di installazione: è una limitazione di Apple, non un difetto dell'app.

1. Apri l'indirizzo **in Safari** (non in Chrome: su iOS solo Safari può installare PWA)
2. Tocca il pulsante **Condividi** (quadrato con la freccia in su)
3. Scorri e tocca **Aggiungi a schermata Home**
4. Conferma

### Desktop (Chrome / Edge)

1. Apri l'indirizzo
2. Nella barra degli indirizzi, a destra, l'icona di **installazione** (monitor con freccia)
3. L'app compare nel menu Start come applicazione normale

### Aggiornamenti

Non devi mai reinstallare. Quando pubblichi una nuova versione, i dispositivi la prendono da soli: basta chiudere e riaprire l'app (`registerType: autoUpdate`).

---

## 3. Cosa vive nel repository e cosa no

| Nel repository (pubblico) | Solo sul tuo Drive (privato) |
|---|---|
| Codice dell'app | Importi, canoni, spese |
| Configurazione build e deploy | Contratti e dati degli inquilini |
| Documentazione | Foto di bollette e giustificativi |
| Icone e stili | Qualunque dato personale |

**Regola di ferro (AD-11):** nessun segreto e nessun dato personale entra mai nel repository. Il `.gitignore` esclude già `node_modules`, `dist` e i file `.env`.

---

## 4. Account Google di gestione e accesso

*(Story 1.3 — non ancora implementato. Questa sezione verrà scritta quando arriveremo lì: creazione dell'account di gestione dedicato, progetto Google Cloud, schermata di consenso OAuth, condivisione in sola lettura per gli account personali.)*
