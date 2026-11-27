# Security policy (SocialFlow)

Status: early prototype. The public demo is a client-only page with synthetic data. It has no login and no server. Do not treat it as a secure product. Nothing here claims the system is fully secure.

## Principles
- Least privilege: each token gets only the scopes it needs.
- Secrets never live in the frontend or in commits. Use `.env.example` for names only.
- Server-side authorization and input validation on every API route.
- Strong password hashing (Argon2id or scrypt), session expiry, login rate limits.
- AI output is untrusted text. A human approves every publish, send, delete or payment.
- Uploads are validated (type, size, content sniffing). No card data is stored.
- Destructive actions need explicit approval.
- Security headers and a strict CSP on every response.

## Release gate
Before a production deploy, run the security tests and classify findings CRITICAL, HIGH, MEDIUM or LOW. CRITICAL and HIGH block release. See SECURITY_TEST_REPORT.md and DEPLOYMENT_SECURITY_CHECKLIST.md.

## Reporting
Report issues privately to the repository owner. Do not post secrets or real client data in issues.
