# Beginner developer instructions

This guide assumes you have never worked on this project. Run commands from the project folder unless a step says otherwise.

## 1. Install the tools

Install Git, Node.js 22.13 or newer (Node 22 LTS is recommended), and a code editor. Check them with:

```bash
git --version
node --version
npm --version
```

## 2. Download and run the website

```bash
git clone https://github.com/TEAM-PSMPV/anandhospitalwebsite.git
cd anandhospitalwebsite
npm ci
npm run dev
```

Keep the terminal open. Visit the local URL Vite prints, usually `http://localhost:5173`. Stop the server with `Ctrl+C`.

Use `npm ci` when you need the exact locked dependencies. If dependencies intentionally change, use `npm install <package>` and commit both `package.json` and `package-lock.json`.

## 3. Understand the folders

- `app/`: pages, components, content data, and global styles.
- `public/`: images, icons, fonts, and public files.
- `worker/`: Cloudflare Worker and security headers.
- `tests/`: automated tests.
- `scripts/`: repeatable install/build/artifact checks.
- `.github/`: automation, ownership, and templates.
- `wrangler.jsonc`: Worker, assets, observability, and domain configuration.

Do not edit `node_modules/`, `dist/`, `.sites-runtime/`, or `.wrangler/`; they are generated locally.

## 4. Make a change safely

```bash
git switch main
git pull --ff-only
git switch -c fix/short-description
```

Run the site, edit a small group of related files, and inspect desktop and mobile layouts. For content changes, verify spelling, medical accuracy, phone numbers, names, qualifications, and image permissions with the hospital owner.

Before committing:

```bash
npm run lint
npm test
git status
git diff --check
git diff
```

Stage only intended files:

```bash
git add path/to/file
git commit -m "fix: describe the user-visible change"
git push -u origin fix/short-description
```

Open a pull request into `main`, complete the template, wait for CI, and request review. Do not bypass a failing check.

## 5. Pages, content, and accessibility

Routes follow the Next.js App Router. For `/example`, create `app/example/page.tsx`. Prefer existing layout, spacing, typography, and components. Use headings in order, label every form control, provide useful image alternative text, and support keyboard navigation.

Shared content belongs in `app/data.ts` or a focused component. Put approved, web-sized assets in `public/` and reference them with paths such as `/images/example.webp`. Prefer WebP for photos and SVG for simple vectors. Never include patient-identifying information without documented authorization.

## 6. Configuration and secrets

Public configuration belongs in `wrangler.jsonc`. Secrets belong in GitHub Actions secrets or Cloudflare Worker secrets—never source files. Use ignored `.env.local` or `.dev.vars` files for local-only values. Never paste a token into an issue, pull request, screenshot, log, or chat. If exposed, revoke it immediately and follow `SECURITY.md`.

The `.openai`, `.agents`, and `.codex` directories are local tooling metadata and intentionally excluded.

## 7. CI/CD

Pull requests and pushes to `main` run `.github/workflows/ci.yml`. A successful push to `main` runs `.github/workflows/deploy.yml`, authenticates with repository secrets, builds, deploys, and checks the public URL.

Do not deploy an unreviewed branch. For an authorized manual deployment:

```bash
npx wrangler login
npm run lint
npm test
npm run deploy
```

Read `DEPLOYMENT.md` before a first deployment or domain change.

## 8. Common problems

- `node: command not found`: install Node.js and open a new terminal.
- Dependency errors: confirm Node 22+, then rerun `npm ci`.
- Port used: stop the old server or run `npm run dev -- --port 5174`.
- Build timeout: close duplicate builds, check disk/RAM, and rerun `npm test`.
- Cloudflare authentication error: confirm both GitHub secrets and token scope.
- Domain conflict: inspect DNS and Worker routes; a conflicting CNAME cannot become a Worker Custom Domain.

When stuck, capture the command, error, Node version, branch, and commit SHA, then follow `SUPPORT.md`.
