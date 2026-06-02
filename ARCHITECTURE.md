# Architecture

This repo is two things at once: the **source of a WCAG 2.2 AA design-review accessibility
checklist** (data + hosted UI + CLIs) and a **Claude skill** that audits a design-review UI against
that checklist.

## Surfaces

| Path | What it is | Audience |
|---|---|---|
| `checklist.json` | The checklist — `items[]`, the single source of truth (`id`, `surface`, `how_to_test`, `pass_criteria`, `fail_examples`, …) | Everyone |
| `checklist.schema.json` | JSON Schema; enforced by `validate.js` (`npm run validate`) | Maintainers / CI |
| `checklist.md` | Human-readable view, generated from JSON (`scripts/generate-markdown.js`) | Readers |
| `index.html` | Hosted interactive audit UI; exports an audit-report JSON | End users |
| `generate-pr-comment.js` | Renders an audit-report JSON into a GitHub PR comment | End users / the skill |
| `SKILL.md` | Claude skill: audits a user's design-review code against the checklist and emits a PR comment | Claude / engineers |

## Data flow

`checklist.json` is authored → `validate.js` checks it against the schema → `generate-markdown.js`
renders `checklist.md` (kept in sync; CI runs `--check`). An **audit** (from the web UI or the
skill) produces an **audit-report JSON** (`meta` / `summary` / `results[]` with
`status: pass | fail | na | needs_investigation`); `generate-pr-comment.js` turns that into a PR
comment. The skill additionally supplies a per-failure `fix` + `location`.

## The skill

`SKILL.md` + the bundled `checklist.json` are the skill. Invoked in a user's product repo, Claude
detects design-review surfaces, confirms scope, reads the relevant code, classifies each scoped
item, writes `audit-report.json`, and renders the PR comment via `generate-pr-comment.js`. It
suggests fixes; it never edits the user's code unless asked. Runtime / assistive-tech behavior is
classified `needs_investigation`, never silently passed.

## Hosting

GitHub Pages serves `index.html` directly from `main` (legacy branch-serve, `source: / (root)`) —
no build step or deploy workflow. CI (`.github/workflows/validate.yml`) runs schema validation,
the Markdown sync check, and the unit tests on every PR and push.

## Reusing this layout

For another checklist-style skill: keep one machine-readable source file + schema + validator,
generate human views from it, and put the audit logic in `SKILL.md` with a small renderer
(`generate-pr-comment.js`) that the skill and any UI share.
