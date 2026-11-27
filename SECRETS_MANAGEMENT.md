# Secrets management

- Secrets (API tokens, passwords, keys) are never committed and never sent to the browser.
- Names only are documented in `.env.example`. Real values live in the platform secret store (GitHub Actions secrets, Cloudflare secrets).
- Live publishing requires `LIVE=1` plus the post marked approved plus the token variables. Default is dry-run.
- Rotate a token immediately if it appears in a log, chat or commit. Remove it from history and revoke it.
- Tokens have the minimum scopes; record expiry dates and renew before they lapse.
- Never print secrets in CI logs.
