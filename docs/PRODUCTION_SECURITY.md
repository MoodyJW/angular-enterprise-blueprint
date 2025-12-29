# Production Security Configuration

This guide outlines the required security headers and server-side configurations for deploying the Angular Enterprise Blueprint to production.

## 1. Required HTTP Security Headers

Configure your web server (Nginx, Apache, etc.) or CDN (Netlify, Vercel, Firebase) to serve these headers with every response.

### Nginx Configuration

```nginx
server {
  # ... other config ...

  # Security Headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

  # Content Security Policy (CSP)
  # IMPORTANT: Maintain strict CSP to prevent XSS
  add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.github.com https://formspree.io;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://formspree.io;
  " always;
}
```

### Netlify Configuration (`netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://formspree.io; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://formspree.io;"
```

### Vercel Configuration (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
      ]
    }
  ]
}
```

---

## 2. Rate Limiting Requirements

The application implements basic client-side rate limiting (cooldown timer) and a honeypot field. However, **server-side rate limiting is mandatory** for production to prevent abuse properly.

### Server-Side Implementation Checklist

- [ ] **IP-based Rate Limiting**: Limit requests to API endpoints (e.g., 5 requests per hour per IP).
- [ ] **Distributed Limiting**: Use Redis or similar if running multiple instances.
- [ ] **HTTP 429**: Return `429 Too Many Requests` status code when limit exceeded.
