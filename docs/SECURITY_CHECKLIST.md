# Security Testing Checklist

Use this checklist before every production release to ensure the application's security posture is maintained.

## 1. Authentication & Session Management

- [ ] **Token Storage**: Verify auth tokens are stored in `sessionStorage` (encrypted) and NOT `localStorage`.
- [ ] **Session Clearing**: Verify `sessionStorage` is cleared upon "Logout".
- [ ] **Session Expiry**: Verify session is cleared when browser tab is closed (sessionStorage behavior).
- [ ] **Guard Protection**: Try accessing `/profile` without logging in. Should redirect to `/auth/login`.

## 2. Input Validation (XSS)

- [ ] **Contact Form**: Submit form with `<script>alert('xss')</script>` in Name and Message fields.
  - [ ] Check inputs are sanitized or escaped when displayed (if applicable).
  - [ ] Check logs for attempted XSS warnings.
- [ ] **URL Parameters**: Manipulate URL parameters/query strings to inject scripts.
- [ ] **Translation Data**: Verify no `innerHTML` usage with user-controlled data.

## 3. CSRF Protection

- [ ] **Interceptor**: Verify `X-XSRF-TOKEN` header is present on `POST` requests to Formspree.
- [ ] **Cookie**: Verify `XSRF-TOKEN` cookie is present (if applicable/implemented).

## 4. Security Headers (Production)

- [ ] **CSP**: Check browser console for "Content Security Policy" violations.
- [ ] **Headers check**: Use [securityheaders.com](https://securityheaders.com) or `curl -I` to verify:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`

## 5. Rate Limiting & Anti-Spam

- [ ] **Cooldown**: Submit contact form, try submitting immediately again. Should see cooldown timer.
- [ ] **Honeypot**: Manually fill the hidden `_gotcha` field (via DevTools) and submit. Request should NOT be sent.
- [ ] **API Limits**: (If possible) Verify server returns 429 when limits exceeded.

## 6. Dependency Management

- [ ] **Audit**: Run `npm audit` to check for known vulnerabilities.
- [ ] **Review**: Check GitHub "Security" tab for Dependabot alerts.
- [ ] **Code Scanning**: Verify GitHub CodeQL workflow passed on the release commit.

## 7. Third-Party Integrations

- [ ] **Google Analytics**: Verify script is loaded only from `googletagmanager.com`.
- [ ] **Formspree**: Verify form posts only to `formspree.io`.
