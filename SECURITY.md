# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in JSON Flow, please **do not open a public issue**. Instead, report it privately:

- Go to the repository's **Security** tab → **Advisories** → **New draft advisory**
- Or reach out to the maintainer via the email in commit history

You should receive a response within 48 hours.

## Scope

| In scope | Out of scope |
|----------|-------------|
| XSS via user-provided JSON | Missing CSP headers (tracked as issue) |
| Server-side code execution | Rate limiting (tracked as issue) |
| Data exposure | Dependency vulnerabilities (Dependabot tracked) |

## Supported Versions

The `main` branch receives security fixes. The engine (`@andro.dev/jsonflow-engine`) on npm is versioned — check the CHANGELOG for security patches.
