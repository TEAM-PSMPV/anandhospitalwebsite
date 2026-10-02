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

The appointment intake integration also requires production secrets `APPOINTFLOW_URL` (https://appointflow.teampsmpv.com/) and `APPOINTFLOW_API_KEY` (the Anand Hospital website integration key). The deployment workflow passes these to Cloudflare Worker secret bindings before deploying. Never use `NEXT_PUBLIC_` variables for these credentials. For local development, use an ignored `.dev.vars` file with these same binding names.

The website posts to its own `/api/appointments` endpoint, which validates the form and forwards it to AppointFlow `/api/intake`. Only an accepted intake receipt triggers the thank-you screen. Retries of the unchanged form reuse the external ID so AppointFlow creates one request. Staff handle verification, appointment creation, queue assignment and communicating the token in AppointFlow's External requests console. The website does not automatically create patients or appointments or send token messages.

The intake fetch must use `redirect: "manual"`; Cloudflare Workers rejects `redirect: "error"` before making the request. Redirect responses are treated as intake failures to keep the authorization header on the configured endpoint. Failures return a safe `code` and emit `appointment-intake-failed` in Worker logs without patient details or credentials.

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

## Search visibility and performance

- All public routes use self-referencing canonicals, Open Graph and Twitter metadata. The sitemap is generated from `app/sitemap.ts` for both the framework and Worker endpoint to keep the route lists consistent. Search and missing pages are excluded from indexing.
- `/awards` displays 21 distinct recognitions and all 44 supplied award photographs. Dr Nidhi and Dr Subhash have separate collections; seven items with no visible recipient remain in an additional collection until attribution is confirmed. The archive catalogue supplies titles, issuers and dates; course/participation certificates are labelled as such.
- Surgery searches lead to `/doctors/dr-subhash-singh`, `/services/general-surgery` and related procedure guides. Women's health searches lead to `/doctors/dr-nidhi-thakur`, `/services/obstetrics-gynaecology` and related guides. Hospital searches lead to home, about, emergency and critical-care pages. The supplied keyword clusters are in `app/seo.tsx`; clinical and location text is server rendered.
- Google Search Console requires the owner's site property and ownership verification. Add `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` as GitHub repository or production environment secrets for the existing HTML verification tags. After deployment verify the HTTPS www property in each account and submit `https://www.anandhospitalmbd.org/sitemap.xml`. Existing DNS verification can also establish ownership. Account registration, ownership and sitemap submission cannot be confirmed from website code alone.
- The configured `INDEXNOW_KEY` produces a key file during deployment and submits the production sitemap URLs to IndexNow. Check the deployment's IndexNow step for an accepted submission; acceptance does not guarantee indexing. Do not confuse this key with Bing's `msvalidate.01` ownership code.
- The browser reports LCP, INP, CLS, FCP and TTFB to `/api/web-vitals`; validated events appear as `web-vital` in Cloudflare Workers observability logs. Review the p75 LCP, INP and CLS in Search Console's Core Web Vitals report when field data becomes available. Avoid treating a local Lighthouse score as field monitoring.
- Award photographs have pre-encoded WebP and AVIF versions, thumbnail versions, native dimensions and lazy loading. Existing Next Image components use Cloudflare image optimization with AVIF/WebP format negotiation. Home banners and CSS background photos are also pre-encoded WebP. `/brand/anand-hospital-social.webp` is a 1200×630 sharing card.
- Production checks in `scripts/smoke-production.mjs` require the awards content, canonical URLs, sitemap, robots sitemap reference, 301 normalization and a true custom 404 response before a deployment reports success.

Metadata titles and descriptions remain based on the existing website content; the separately referenced metadata screenshot was not present in the supplied archive.
