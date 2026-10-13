# Security policy

## Supported versions

| Version | Supported |
|---|---|
| 1.x (latest minor) | Yes |
| < 1.0 | No |

Security fixes land on the latest minor release of the current major version.

## Reporting a vulnerability

**Please don't open a public issue for security problems.**

Report privately through GitHub: **Security › Report a vulnerability** on the repository
(`https://github.com/saishmenon/evenkeel/security/advisories/new`). Only the maintainers can see these reports.

Please include:

- the affected version of `evenkeel-ui` (or the Figma file version),
- what an attacker could do, and how,
- a minimal reproduction or proof of concept, if you have one.

What to expect:

- an acknowledgement within **5 working days**,
- an assessment and, if confirmed, a fix plan within **14 days**,
- credit in the release notes and advisory, unless you'd rather stay anonymous.

## Scope

Evenkeel is a client-side UI library. Things we especially want to hear about:

- cross-site scripting through component props (for example, content rendered without escaping),
- unsafe handling of URLs in `Link`, `Card` or navigation components,
- `applyTheme()` accepting input that injects CSS outside the intended custom properties,
- compromised or typo-squatted dependencies in the published package.

Out of scope: vulnerabilities in your own app's use of the components (for example, passing untrusted HTML you sanitised yourself), and issues in the sample "Mintline" data, which is fictional.

## Supply chain

Releases are published from GitHub Actions with [npm provenance](https://docs.npmjs.com/generating-provenance-statements), so you can verify that a version was built from this repository:

```sh
npm audit signatures
```
