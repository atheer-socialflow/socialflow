# Deployment security checklist

Do not deploy a production version until every box is checked.

- [ ] No secrets in the repo or history (scan done)
- [ ] `.env.example` has names only
- [ ] Login with hashed passwords, session expiry, login rate limit
- [ ] Server-side authorization on every route
- [ ] Input validation and output escaping
- [ ] CSP and security headers set
- [ ] Upload validation
- [ ] Dependency scan, no known CRITICAL/HIGH
- [ ] Security tests run, results in SECURITY_TEST_REPORT.md
- [ ] No CRITICAL or HIGH findings open
- [ ] Human approval gate verified before any publish
- [ ] Backup and rollback plan
