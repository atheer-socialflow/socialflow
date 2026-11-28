# sadawave security test report (current)
Product name: sadawave (repo and Worker keep the internal name socialflow). Status: limited self-test, no known Critical or High findings. This is not an audit, not a certification, and not a claim that the platform is secure.
Date: 2026-11-28. Target: Cloudflare Worker socialflow-app (D1, free plan). Tests ran on local builds of the same worker.js that is deployed, plus curl probes on the live login page. This is a limited self-test, not a certification. No claim of "100% secure". Not found is not proof of absence.

## Results (all 0 fail)
Server suites: test.sh 65, test-publish.sh 31, test-safety.sh 30, test-idem.sh 35, test-sec.sh 75, test-approval.sh 18, test-csrf.sh 17 (new).
UI suites (headless Chrome): 28, 43, 13, 10, 21, 10, 11, 9, 8, 8 (approval UI 9), 20, 14 (manual-assist), 14 (results and reports), 8 (hostile-data test, ui-test13).
Raw outputs: tests/*-results.txt, scripts: tests/*.sh and tests/ui-test*.js.

## What was checked
- Auth: no session -> 401 on state, snapshots, audit, connections, publish; forged cookie 401; logout invalidates; cookie flags; registration closed after the owner exists; login rate limit (per IP) with lockout.
- Authorization / IDOR: all data is keyed by the session user id on the server; snapshots, audit and connections are per user; foreign ids return 404/401 in the suites.
- CSRF: SameSite=Strict cookie, Origin check, and (new, 28 Nov) a session-bound token: every POST/PUT/DELETE under /api needs an x-csrf header equal to a value derived from the session; missing, wrong, other-session and logged-out tokens are refused (403/401). Tested in test-csrf.sh. The token is placed in the app page only after login.
- CSP of the app page after login (local build, csp-app-page-local.txt): script-src is a per-response nonce, no unsafe-inline for scripts, zero inline event-handler attributes. Earlier reports that said script-src unsafe-inline were out of date. style-src still has unsafe-inline.
- Login lockout: per IP (5 failures / 15 min) and, new, per account (10 failures / 15 min from any IP, same 429 for unknown emails). Tested in test-csrf.sh. Trade-off: someone who knows the owner email can lock the owner out for 15 minutes.
- Input: payload size limits (413), JSON shape checks (400), version conflicts (If-Match, 409), parallel saves (exactly one wins), bad post ids rejected.
- Uploads: the app has no upload endpoint and stores no files.
- XSS: user text is escaped on render. ui-test13 saves hostile values (HTML in caption, hook, live link, client name, metrics) and checks that nothing executes on the manual and results screens.
- Export: CSV cells starting with = + - @ are prefixed with a quote.
- Approval binding: approval is stamped by the server with a content fingerprint; any change to caption, hook, accounts or content type without an explicit re-approve sends the post back to draft; restore cannot bring back a stale approval.
- Publisher: DRY-RUN and OFF. The publish gate only returns blocked or dry_run. The code has no platform adapter and no call to X, TikTok, Instagram or any social API. Real publishing needs a separate approval from the owner and is not built.
- Credentials: connections are a stub that accepts FAKE- tokens only (AES-GCM, key in the Worker secret TOKEN_KEY). X and TikTok are manual-assist. The app has no field for any social password. Council review (28 Nov) rejected storing the X password and logging in from a cloud browser.
- Live login page (curl, 28 Nov, on version 42eccee0; the CSRF and lockout build is not deployed yet): HTTP 200; CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy no-referrer, Permissions-Policy present; no external links or scripts (only inline data images); /api/state and /api/me return 401 without a session; title is "sadawave".

## Fixed in this round
- MEDIUM (fixed 28 Nov): no CSRF token. Added a session-bound x-csrf token (see above), 17 new tests.
- MEDIUM (fixed 28 Nov): no per-account login lockout. Added (10 failures / 15 min).
- MEDIUM (fixed): result metrics typed as text in saved state were concatenated as strings (a stored value of "5" produced a 5000% engagement rate). Client and report now count only numbers 0 to 1e9. Server now drops non-numeric metrics, unknown metric keys, invalid live links and malformed checklist values (cleanPh2).
- LOW (fixed): a corrupt checklist value could break the checklist toggle. It is now reset to three flags.
- LOW (fixed earlier today): "I posted it" could be accepted with an empty checklist. All three ticks are now required (X posts).

## Open findings
- MEDIUM: no MFA (second factor). Free option exists (TOTP built in the Worker); not built yet. Needs an enrolment flow with recovery codes so the owner cannot be locked out.
- MEDIUM: style-src needs unsafe-inline (inline styles). Scripts use a nonce.
- MEDIUM: server validates post shape, ids and the new fields, but not caption/hook content (it is only ever rendered escaped). The state is one JSON document written by the owner's own session.
- MEDIUM: TOKEN_KEY rotation not implemented.
- LOW: PBKDF2 uses 100k iterations.
- LOW: the account lockout can be used to lock the owner out for 15 minutes (denial of service by a person who knows the email).
- LOW: If-Match is optional for legacy clients. To be made mandatory.
- GATE for real publishing: the test crash hook (SIM_CRASH) still exists in the publish path. It is used by the no-double-posting test. It must be removed before any real publishing is turned on; real publishing is not built and needs the owner's separate approval.
- LOW (public repo): all 17 commits in the public repo atheer-socialflow/socialflow carry the agency account email as the commit author. This is git metadata, not a leak of client data. Options: use GitHub's noreply address for future commits. History is not rewritten.
- INFO: public repo history checked on 28 Nov by a full clone: 17 commits, all synthetic demo data ("Demo Brand A/B", "[SAMPLE]" captions), docs and an early demo index.html. No tokens, passwords, phone numbers, real handles or client names found by pattern search.
- Not done: dependency scan, independent penetration test, live test of add/revoke connection (no live session for the tester), live test of the logged-in app.
Critical: none found. High: none found.
