# Anand Hospital website

[![CI](https://github.com/TEAM-PSMPV/anandhospitalwebsite/actions/workflows/ci.yml/badge.svg)](https://github.com/TEAM-PSMPV/anandhospitalwebsite/actions/workflows/ci.yml)
[![Deploy](https://github.com/TEAM-PSMPV/anandhospitalwebsite/actions/workflows/deploy.yml/badge.svg)](https://github.com/TEAM-PSMPV/anandhospitalwebsite/actions/workflows/deploy.yml)

Production website for Anand Hospital, Moradabad: [www.anandhospitalmbd.org](https://www.anandhospitalmbd.org/). The Worker also remains available at [anand-hospital.anandhospital.workers.dev](https://anand-hospital.anandhospital.workers.dev/).

The responsive site uses the Next.js App Router, React, TypeScript, Vinext/Vite, Tailwind CSS, and Cloudflare Workers. The Worker adds security headers and uses Cloudflare Images for compatible image optimization.

## Routes

- `/` — home
- `/about` — hospital profile and facilities
- `/doctors` — doctors and departments
- `/services` — service directory
- `/health-library` — health information
- `/appointment` — appointment request interface
- `/search` — site search

## Quick start

Requirements: Node.js 22.13 or newer, npm, Git, and a Bash-compatible shell.

```bash
git clone https://github.com/TEAM-PSMPV/anandhospitalwebsite.git
cd anandhospitalwebsite
npm ci
npm run dev
```

Open the URL printed by Vite. For a complete beginner-friendly walkthrough, read [INSTRUCTIONS.md](INSTRUCTIONS.md).

## Quality checks

```bash
npm run lint
npm test
```

`npm test` performs a production build, validates the Worker artifact, and tests the rendered HTML. Generated output is written to `dist/` and is not committed.

## Deployment

Pushes to `main` run CI and deploy the Worker to the apex and `www` Custom Domains. GitHub must contain these production-environment Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

See [DEPLOYMENT.md](DEPLOYMENT.md) for permissions, first-deployment checks, rollback, and troubleshooting.

## Documentation

- [INSTRUCTIONS.md](INSTRUCTIONS.md) — beginner setup and daily workflow
- [ARCHITECTURE.md](ARCHITECTURE.md) — system and directory design
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution rules
- [SECURITY.md](SECURITY.md) — private vulnerability reporting
- [SUPPORT.md](SUPPORT.md) — support boundaries
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — community expectations
- [CHANGELOG.md](CHANGELOG.md) — notable releases

## Important content safeguards

Medical, doctor, contact, appointment, and legal content must be approved by an authorized Anand Hospital representative before production deployment. Do not commit patient data, credentials, `.env` files, `.dev.vars`, `.openai`, or local Cloudflare state.

## License

Copyright © Anand Hospital and TEAM PSMPV. All rights reserved. See [LICENSE](LICENSE).
