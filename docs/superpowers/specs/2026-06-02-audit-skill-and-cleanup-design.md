# a11y-design-review-checklist — Audit Skill + OSS-Hygiene Cleanup

**Date:** 2026-06-02
**Status:** Approved (design)
**Scope:** This repository. Adds a Claude skill (Approach A) and brings the repo to the
`wcag-explainer` reference-grade OSS bar.

## Goal

Turn this repo into a **Claude skill** that audits an engineer's design-review/collaboration UI
code against the WCAG 2.2 AA checklist and produces a **PR comment with fix suggestions** — while
keeping it the checklist data + hosted-UI project it already is. Plus the agreed OSS-hygiene cleanup.

## Context (what already exists)

- `checklist.json` — 95 items (`items[]`), each with `id`, `wcag_criterion`, `wcag_title`,
  `level`, `category`, `surface`, `title`, `description`, `how_to_test[]`, and references.
  `surface` is a human-readable string (e.g. "3D model viewer", "Annotation pins & markups").
- `checklist.schema.json` — JSON Schema; `validate.js` enforces it (`npm run validate`).
- `checklist.md` — generated from JSON (`scripts/generate-markdown.js`).
- `index.html` — hosted interactive audit UI (GitHub Pages, legacy branch-serve from `main`/root).
- **`generate-pr-comment.js` — already renders an audit PR comment from an audit-report JSON**
  exported by the web UI. That report shape is the existing contract:

  ```jsonc
  {
    "meta":    { "date": "2026-06-02", "mode": "...", "auditor": "..." },
    "summary": { "pass": N, "fail": N, "na": N, "needs_investigation": N, "scoped": N },
    "results": [ { "id": "<item id>", "status": "pass|fail|na|needs_investigation", "note": "..." } ]
  }
  ```
  The generator looks each `result.id` up in `checklist.json`, renders a summary table, a
  "where failures landed" surface breakdown, and `<details>` blocks for failed +
  needs-investigation items (showing the `note` as an "Engineer note").

The skill **produces this same report JSON and reuses the existing generator** — it does not
invent a parallel format.

## Approach (A, as approved)

`SKILL.md`-driven. The judgment lives in Claude reading the user's code; the bundled
`checklist.json` is the source of truth; the existing `generate-pr-comment.js` renders the output.
The only new runtime code is a small, additive, backward-compatible enhancement to the generator.

## Dual nature of the repo

Like `wcag-explainer`: still the checklist **data + hosted UI** project, and now **also a Claude
skill**. New `SKILL.md` at the root; `checklist.json` + `checklist.schema.json` are bundled with
the skill. When invoked in the user's *product* repo, Claude reads the bundled checklist and audits
the code in their cwd. Nothing is copied into the user's repo — the audit report/PR comment is the
only artifact produced.

## The audit flow (what `SKILL.md` encodes)

1. **Detect.** Scan the user's repo (cwd) for design-review/collaboration surfaces — annotation
   pins/markups, comment threads, version history, presence/cursors, media/video review with
   captions, 3D/canvas viewers, AI-assisted comments — and map them to the checklist `surface`
   values (+ `category`/`wcag_criterion`).
2. **Confirm.** Present the detected surfaces and the count of applicable items; let the user
   add/remove surfaces or point at specific directories before the audit runs.
3. **Evaluate.** For each scoped item, read the relevant components and judge against the item's
   `how_to_test[]`, assigning one of the existing report statuses:
   - `pass` — code clearly satisfies it.
   - `fail` — clearly violated. Attach a concrete **fix suggestion** and a `file:line` location.
   - `needs_investigation` — runtime/AT/visual behavior the skill cannot confirm statically
     (this is the "manual-verify" bucket). The `note` says exactly what a human must check.
   - `na` — the scoped surface is present but this item doesn't apply to the implementation.
4. **Render.** Write `audit-report.json` (the shape above), then run
   `node <skill-dir>/generate-pr-comment.js --report audit-report.json --component <name> --surface <surface>`
   to produce the PR-comment Markdown.
5. **Deliver.** Write the PR comment to the user's repo (default `a11y-design-review-audit.md`) and
   print a summary inline (✅/❌/🔎 counts + the top failures with fixes). **Fixes are suggested,
   never auto-applied.**

## Generator enhancement (additive, backward-compatible)

Extend `renderItemBlock` in `generate-pr-comment.js` so that, when a `result` has them, it renders:
- **Suggested fix:** `result.fix` (a short prose fix).
- **Location:** `result.location` (e.g. `src/CommentThread.tsx:42`).

Reports without these fields (e.g. exported from the web UI) render exactly as today — the new
lines are emitted only when present. The skill's `fail` results populate `fix` + `location`; it may
still also use `note`.

## Honesty constraints (non-negotiable in `SKILL.md`)

- Never mark a runtime/AT behavior `pass` from static reading; ambiguous → `needs_investigation`.
- Every `pass`/`fail` cites a `file:line`.
- The inline summary states plainly what was statically checked vs. what still needs human/AT
  verification, so the PR comment is never mistaken for a full a11y sign-off.

## Components / files

- **Create** `SKILL.md` (root) — the audit procedure above, with frontmatter
  (`name: a11y-design-review-checklist`, a `description` that triggers on design-review/annotation/
  collaboration-UI accessibility audits).
- **Modify** `generate-pr-comment.js` — additive `fix`/`location` rendering in `renderItemBlock`.
- **Add** `tests/generate-pr-comment.test.js` (or extend an existing test) — fixture report →
  asserts the rendered Markdown (summary counts, a failed item with `fix`+`location`, a
  needs-investigation item, and that a report *without* `fix`/`location` still renders).
- **Bundled, unchanged:** `checklist.json`, `checklist.schema.json`.

## Out of scope (YAGNI)

- No auto-applying code edits (suggest only).
- No new static-analysis CLI — the checklist is about behavior, not grep-able patterns.
- No running the user's app.
- No copying `checklist.json` into the user's repo.
- No change to checklist content, the schema, or the web UI.

## Testing

- Unit-test the generator enhancement against a fixture `audit-report.json` using the repo's
  existing `node --test` setup; assert both the enriched (with `fix`/`location`) and legacy
  (without) renderings.
- Keep `npm run validate`, `npm run check-md`, and the existing test suite green.
- The `SKILL.md` procedure itself is instructions (not unit-tested); the renderer + report shape are.

## OSS-hygiene cleanup (parallel workstream, mechanical)

To match the `wcag-explainer` bar:
- Add `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1, contact `patricia.goh@ada.support`).
- Add `SECURITY.md` (static app + data + CLIs; no server; report channel; note no secrets).
- Add `ARCHITECTURE.md` documenting the dual skill + data/UI nature, the surfaces (checklist.json
  source → generated md → hosted UI → CLIs → SKILL.md audit), and the Pages branch-serve hosting.
- Add `.github/ISSUE_TEMPLATE/` — `bug_report.yml`, `feature_request.yml` (framed for checklist
  items / the audit skill), `config.yml` pointing to the hosted audit UI.
- Bump `.github/workflows/validate.yml` Node `20 → 24`.
- **Not** adding a Pages deploy workflow (legacy branch-serve already serves `index.html`) or eslint
  (small plain-ESM project; low value).

## Success criteria

- `SKILL.md` is a valid skill (frontmatter) that, invoked in a design-review-UI repo, detects
  surfaces, confirms scope, and produces an `audit-report.json` + a rendered PR comment with fixes
  and honest `needs_investigation` items.
- `generate-pr-comment.js` renders `fix`/`location` when present and is unchanged for legacy reports;
  covered by a unit test.
- All existing checks stay green; hygiene files present; CI on Node 24.
