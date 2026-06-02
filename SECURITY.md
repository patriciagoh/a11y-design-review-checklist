# Security Policy

## Reporting a vulnerability

Please report security issues privately by emailing **patricia.goh@ada.support** with details and
steps to reproduce. Do not open a public issue for security reports. You can expect an
acknowledgement within a few business days.

## Scope

This project is a static checklist dataset (`checklist.json` + schema), a generated Markdown view,
a static hosted audit UI (`index.html`, served from GitHub Pages), and a few local Node CLIs
(validate, markdown generation, PR-comment generation). There is no server and no user data is
collected.

## Secrets

No secrets are stored in this repository. The CLIs run locally against files in the repo and do not
require credentials. Do not paste tokens or keys into issues, PRs, or code.

## Supported versions

The latest `main` is the only supported version.
