# Deployment runbook

## Production target

- Worker: `anand-hospital`
- Primary target: `www.anandhospitalmbd.org`
- Custom domains: `anandhospitalmbd.org` and `www.anandhospitalmbd.org`
- Worker fallback: `anand-hospital.anandhospital.workers.dev`
- Configuration: `wrangler.jsonc`
- Pipeline: `.github/workflows/deploy.yml`

## Required GitHub configuration

Add production-environment Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. They must belong to the same account that owns the `anandhospitalmbd.org` zone. Restrict the token to that account and zone with Worker script and route permissions. Never store values in files.

Create a GitHub environment named `production`, restrict it to `main`, optionally add required reviewers, and place the secrets there (repository secrets also work).

## First deployment checks

1. Confirm `anandhospitalmbd.org` is an active proxied zone in the account identified by the secret.
2. Confirm both custom hostnames are attached to the `anand-hospital` Worker and have no conflicting DNS records.
3. Obtain hospital approval for contact/doctor details, photos, legal text, and medical statements.
4. Protect `main`: require pull requests, code-owner review, and CI.
5. Run `npm ci`, `npm run lint`, and `npm test` locally.

An approved push to `main` deploys automatically; `workflow_dispatch` allows an authorized manual rerun. The job installs the lockfile, verifies, deploys through Wrangler, and retries an HTTPS smoke check. Concurrency prevents racing deployments.

## Manual deployment

```bash
npx wrangler login
npm ci
npm run lint
npm test
npm run deploy
```

## Verify and roll back

Check both custom domains, the `workers.dev` fallback, key routes, mobile and keyboard navigation, assets, response headers, and Worker logs. Verify the expected commit before announcing release.

Prefer Cloudflare's Worker rollback controls for fast restoration. Then revert the faulty Git commit through a pull request so source and production agree. Do not rewrite shared history. Document cause, impact, timeline, and prevention without secrets or patient data.

Common failures: check secret names/token scope for authentication, DNS/Worker routes for domain conflicts, Node 22 plus `npm ci && npm test` for builds, and Cloudflare certificate status/logs for smoke-test failures.
