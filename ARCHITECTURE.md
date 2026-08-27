# Architecture

The React/Next.js App Router application is compiled by Vinext and Vite into a Cloudflare Worker. Static assets come from `public/`; routed responses pass through `worker/index.ts`.

```text
Browser -> Cloudflare custom domain -> Worker headers/image handling
        -> Vinext App Router -> React pages/components + public assets
```

## Components

- `app/layout.tsx`: global metadata and root layout.
- `app/page.tsx` and route folders: pages.
- `app/site-shell.tsx`: shared navigation and footer.
- `app/data.ts`: reusable public content.
- `app/globals.css`: global design implementation.
- `worker/index.ts`: app delegation, image endpoint, security headers.
- `vite.config.ts`: Vinext, artifact packager, and Cloudflare plugin.
- `build/sites-vite-plugin.ts`: deployable artifact/manifest packaging.
- `wrangler.jsonc`: production Worker and domain source of truth.

## Data and security

Current public content is source-controlled and no production database binding is declared. `db/` is a dormant Drizzle/D1 foundation. Before storing appointment submissions, design consent, retention, access control, encryption, auditing, breach response, and deletion with authorized hospital legal/security owners, then add an explicit D1 binding and tests.

Cloudflare terminates TLS. The Worker attaches CSP, HSTS, clickjacking, MIME-sniffing, permissions, opener, resource, and referrer controls. GitHub Actions holds deployment credentials. Production deploys originate from reviewed `main` commits after automated verification.

The build uses Linux utilities (`bash`, GNU `timeout`, and for clean installation `flock`); CI uses Ubuntu. Generated artifacts and runtime state remain untracked.
