# Security policy

## Supported version

Only the latest production revision on `main` is supported with security fixes.

## Report a vulnerability

Do not open a public issue. Use GitHub's **Security** tab → **Report a vulnerability** to submit a private advisory. If private reporting is unavailable, contact an authorized TEAM PSMPV repository administrator and request a private channel without including exploit details initially.

Include the affected URL/component, impact, reproduction steps, a proof of concept where safe, and mitigation ideas. Do not access, modify, download, or retain patient or third-party data; do not perform denial-of-service testing; stop if sensitive data appears.

Maintainers should acknowledge reports within 3 business days, provide an initial assessment within 7 business days, and coordinate disclosure after remediation. Timelines may change with severity and complexity.

## Secrets and sensitive data

Never commit API tokens, credentials, `.env*`, `.dev.vars*`, Cloudflare state, private keys, patient data, appointment submissions, or local AI-tool metadata. GitHub deployment credentials must be least-privilege secrets. If exposed, revoke and rotate immediately, review logs/deployments, remove the value from Git history, and notify the owner.

This policy does not authorize production testing or data access.
