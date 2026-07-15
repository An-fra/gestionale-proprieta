// Regole di dipendenza — AD-7 (direzione delle dipendenze, vincolo architetturale).
// ui → app → domain ; adapters implementano le porte di app e usano i tipi di domain.
// Una violazione fa uscire depcruise con codice != 0 → `npm run lint` fallisce → build bloccata.
module.exports = {
  forbidden: [
    {
      name: 'domain-puro',
      comment:
        'src/domain non deve importare da app, adapters o ui: il dominio è puro (AD-7).',
      severity: 'error',
      from: { path: '^src/domain' },
      to: { path: '^src/(app|adapters|ui)' },
    },
    {
      name: 'ui-solo-app',
      comment:
        'src/ui parla solo con src/app: niente import diretti da domain o adapters (AD-7).',
      severity: 'error',
      from: { path: '^src/ui' },
      to: { path: '^src/(domain|adapters)' },
    },
    {
      name: 'app-non-scende',
      comment:
        'src/app dipende solo da domain: non da adapters (iniettati via porte) né da ui (AD-7).',
      severity: 'error',
      from: { path: '^src/app' },
      to: { path: '^src/(adapters|ui)' },
    },
    {
      name: 'adapters-non-ui',
      comment:
        'src/adapters non importano da ui né da un altro adapter: solo app (porte) e domain (tipi) (AD-7).',
      severity: 'error',
      from: { path: '^src/adapters/([^/]+)' },
      to: { path: '^src/(ui)|^src/adapters/(?!$1)([^/]+)' },
    },
    {
      name: 'no-circular',
      comment: 'Nessuna dipendenza circolare.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
};
