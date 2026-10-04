---
status: accepted
---

# Keep static landing output separate from hosting and release configuration

The public landing is owned and prerendered by this Astro repository. Production preview runs independently from the product application's dashboard, authentication and Articles. The application origin is an explicit integration URL, not a source or deployment requirement for the landing.

## Consequences

- Preview defaults to noindex. PUBLIC_APP_ORIGIN builds direct locale-specific dashboard and Articles URLs; it does not read a login session.
- SIGNAPSE_PUBLIC_ORIGIN is an explicit HTTPS origin. A non-indexable build with a missing or invalid origin omits canonical/language alternates and does not infer a hostname. An indexable build requires a valid explicit origin. Root remains noindex and self-canonicalizes to the default locale when configured.
- Hostnames are environment configuration, not fixed values in the design contract. Static files do not negotiate Accept-Language from request headers.
- Request-language negotiation, domain redirects, publication and deployment are separate hosting/release work. They are not proven by a successful local build or preview.
- Analytics and Speed Insights are opt-in integrations; hosting must provide their endpoints before they are enabled.
- Code, documentation, tests and the currently accepted Astro landing are the authority for future changes. Release gates use the tests and production preview defined in this repository.
