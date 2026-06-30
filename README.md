# Seinenboek

Mobile multiple-choice quiz for training Dutch railway signals ("seinbeelden")
from [bijlage 4 of the Regeling spoorverkeer (BWBR0017707)](https://wetten.overheid.nl/BWBR0017707/2026-01-01).

Shows a signal image and four possible meanings, one correct and the rest
plausible distractors pulled from related signals. Score is kept in
`localStorage` and can be reset at any time.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploys automatically to GitHub Pages on every push to `main` via
`.github/workflows/deploy.yml`.
