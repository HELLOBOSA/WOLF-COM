# Redirect stubs

This repository contains approximately 1,011 redirect HTML files alongside the real content pages.

Redirect files are lightweight stubs (canonical tag + meta refresh + JS redirect) that catch old WordPress URLs and send visitors to the correct location on the static site. They exist at the root level and under language prefix directories (de/, fr/, pt/, sv/, el/, zh/).

## Real content locations

- `/studio/` -- studio hub, why-wolfblanc, project-monitoring, culture
- `/services/` -- all service pages and sub-services
- `/projects/` -- case study pages (was /portfolio/)
- `/journal/` -- articles (was /news/)
- `/locations/` -- market and city pages
- `/faq/` -- frequently asked questions
- `/contact/` -- contact and inquiry form
- `/careers/` -- careers hub
- `/legal/` -- legal, privacy, cookies
- `/clients/` -- password-gated project dashboards

## How to tell them apart

Redirect files are small (under 500 bytes), contain `<meta http-equiv="refresh"`, and have no `<main>` element. Real content pages are full HTML documents with nav, content sections, footer, and inline styles.

## Language prefix directories

The `/de/`, `/fr/`, `/pt/`, `/sv/`, `/el/`, `/zh/` directories contain only redirect stubs. All content is bilingual EN/ES via in-page toggle, not separate URL paths.
