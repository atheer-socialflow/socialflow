# Threat model (SocialFlow)

Assets: social API tokens, scheduled posts and media, client data, user sessions.

| Threat | Impact | Mitigation | Status |
|---|---|---|---|
| Real data in a public repo | Leak of client content | Public repo synthetic only; real queue in a private repo | Done (old repo deleted) |
| Token leak via frontend or git | Account takeover | Tokens only in a secret store; never in repo; `.gitignore` | Partly done (no tokens in repo) |
| Unauthorized access to the panel | Posts changed or published | Login, sessions, server-side authorization | NOT BUILT |
| Brute-force login | Account takeover | Rate limit, lockout, hashing | NOT BUILT |
| XSS in captions or previews | Session theft | Output escaping, CSP | Not reviewed |
| Malicious upload | Server or viewer compromise | Type/size validation, no execution | NOT BUILT |
| AI-generated text published unreviewed | Brand harm | Human approval gate; publisher dry-run by default | Done in publisher |
| Compromised CI | Token theft | Least-privilege workflow permissions, secrets scoped to live job | Partly done |
| Third-party API abuse (TikTok/X limits) | Bans, costs | Manual-assist for TikTok and X | Done |
