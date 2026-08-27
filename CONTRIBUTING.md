# Contributing

Changes must protect patient privacy, clinical accuracy, accessibility, and production reliability.

## Workflow

1. Read `INSTRUCTIONS.md`, `ARCHITECTURE.md`, and this guide.
2. Create a focused `feat/`, `fix/`, `docs/`, or `chore/` branch from current `main`.
3. Avoid unrelated formatting or dependency updates.
4. Run `npm run lint`, `npm test`, `git diff --check`, and review the diff.
5. Open a pull request and obtain code-owner approval.

Use clear imperative commits, preferably Conventional Commit style, such as `fix: correct mobile navigation focus order`.

## Pull-request requirements

- Explain the user problem and solution.
- Include desktop and mobile screenshots for visual changes.
- State accessibility and content checks performed.
- Identify approved sources for medical, doctor, address, telephone, policy, or pricing claims.
- Never include real patient data or secrets in test data or screenshots.
- Update documentation and tests when behavior changes.
- Keep CI green. Deployment occurs only from `main`.

Use strict TypeScript and existing React/App Router patterns. Prefer server components unless browser state or events require `"use client"`. Preserve semantic HTML, visible focus, sufficient contrast, keyboard access, reduced-motion behavior, and meaningful alternative text. Avoid dependencies unless their maintenance and security cost is justified.

Report vulnerabilities privately as described in `SECURITY.md`. By contributing, you agree to `CODE_OF_CONDUCT.md` and confirm that the project owner may use your contribution under the repository license.
