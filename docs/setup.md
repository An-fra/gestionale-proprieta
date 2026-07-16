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

## 4. Account Google di gestione e accesso (Story 1.3)

Questa è la configurazione che collega l'app al tuo Google Drive. Si fa **una volta sola**. Sono tutti clic nell'interfaccia web di Google — nessun codice. Tempo: ~15 minuti.

Alla fine avrai **due "client ID"** (uno per lo sviluppo, uno per l'app online) da consegnare a chi implementa il codice. Il client ID è un identificativo **pubblico**, non una password: condividerlo è sicuro.

### Perché un account dedicato

Questo account Google diventa la "cassaforte" degli affitti: l'app lo usa su tutti i dispositivi e tutti i dati (importi, contratti, documenti) vivono sul **suo** Drive. Tenendolo separato dal tuo account personale, i 15 GB gratuiti sono tutti per gli affitti e la vita digitale privata resta separata.

---

### Passo 1 — Crea l'account Google di gestione

1. In una finestra del browser **in incognito** (per non mischiare con l'account personale), vai su [accounts.google.com/signup](https://accounts.google.com/signup)
2. Crea un account dedicato, es. `gestione.proprieta.franzoni@gmail.com` (scegli tu il nome)
3. Annota da qualche parte di sicuro email e password: è l'account che apre la cassaforte
4. **Da qui in poi, resta loggato con QUESTO account** per tutti i passi successivi

### Passo 2 — Crea il progetto Google Cloud

1. Vai su [console.cloud.google.com](https://console.cloud.google.com) (loggato con l'account di gestione)
2. Accetta i termini se richiesto (è gratuito, non serve carta di credito per questo uso)
3. In alto, menu di selezione progetto → **Nuovo progetto**
4. Nome: `Gestionale Proprietà` → **Crea** → attendi qualche secondo e selezionalo

### Passo 3 — Abilita l'API di Google Drive

1. Menu ☰ → **API e servizi** → **Libreria**
2. Cerca **Google Drive API** → aprila → **Abilita**

> ⚠️ Senza questo passo, l'app otterrebbe il permesso ma le chiamate a Drive fallirebbero.

### Passo 4 — Configura la schermata di consenso OAuth

*(Nella console recente questa sezione può chiamarsi "Google Auth Platform" o "Branding" — è la stessa cosa.)*

1. Menu ☰ → **API e servizi** → **Schermata consenso OAuth**
2. Tipo di utente: **Esterno** → **Crea**
3. Compila i campi obbligatori:
   - **Nome dell'app**: `Gestionale Proprietà`
   - **Email di supporto**: l'email dell'account di gestione
   - **Email di contatto sviluppatore**: la stessa
   - Il resto lascialo vuoto → **Salva e continua**
4. **Ambiti (scopes)**: **Aggiungi o rimuovi ambiti** → cerca e spunta **`.../auth/drive.file`** (descrizione: "Vedere, modificare, creare ed eliminare solo i file di Google Drive specifici che usi con questa app") → **Aggiorna** → **Salva e continua**
5. **Utenti di test**: puoi lasciarlo vuoto → **Salva e continua**
6. Torna alla panoramica della schermata di consenso e cerca il pulsante **"Pubblica app"** → **Pubblica** → conferma

> 🔑 **Il passo più importante è "Pubblica app".** Se l'app resta in modalità "Test", Google ti farebbe rifare l'accesso **ogni 7 giorni**, per sempre. Pubblicandola "In produzione" questo sparisce. E poiché lo scope `drive.file` è "non sensibile", la pubblicazione **NON richiede alcuna verifica di Google** — è immediata.

### Passo 5 — Crea i due client OAuth

Menu ☰ → **API e servizi** → **Credenziali** → **Crea credenziali** → **ID client OAuth**.

**Client A — Produzione** (l'app online):
1. Tipo di applicazione: **Applicazione web**
2. Nome: `Gestionale Proprietà - prod`
3. **Origini JavaScript autorizzate** → Aggiungi URI: **`https://an-fra.github.io`**
   - ⚠️ Solo l'origine, **senza** `/gestionale-proprieta/` alla fine. Solo `https://an-fra.github.io`.
4. **Crea** → copia il **client ID** che appare (finisce con `.apps.googleusercontent.com`)

**Client B — Sviluppo** (per provare in locale). Ripeti "Crea credenziali → ID client OAuth":
1. Tipo: **Applicazione web**
2. Nome: `Gestionale Proprietà - dev`
3. **Origini JavaScript autorizzate** → Aggiungi URI: **`http://localhost:5173`**
4. **Crea** → copia il secondo **client ID**

> Se Google mostra anche un "client secret": **ignoralo, non serve** per un'app web come questa e non va mai condiviso né committato.

### Passo 6 — Consegna i due client ID

Copia i due client ID e passali a chi implementa. Hanno questo aspetto:
```
prod: 123456789-abcdef.apps.googleusercontent.com
dev:  987654321-ghijkl.apps.googleusercontent.com
```
Sono pubblici: la sicurezza sta nelle origini autorizzate (Passo 5), non nella segretezza del client ID.

---

### Passo 7 — Condivisione in sola lettura (facoltativo, per la famiglia)

*(Si può fare ora o più avanti.)* Quando l'app avrà creato le cartelle su Drive (Story 1.4), potrai condividere la cartella `Gestionale Proprietà` **in sola lettura** con i tuoi account personali e quelli di famiglia: così chiunque può *vedere* l'archivio da Drive anche senza l'app (trasparenza e sicurezza a lungo termine), senza poter modificare nulla.

---

### Cosa succede dopo

Con i due client ID, chi implementa scrive l'adapter di autenticazione, e al primo avvio l'app ti chiederà di accedere con l'account di gestione, mostrando **solo** il permesso `drive.file` ("file che usi con questa app") — non l'accesso a tutto il tuo Drive.
