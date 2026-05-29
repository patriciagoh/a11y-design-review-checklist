# a11y-design-review-checklist

A WCAG 2.2 AA accessibility checklist for **design-review UI patterns** — interfaces where users navigate visual artifacts, anchor annotations to spatial locations, manage conversation threads, track version history, and move through approval workflows.

Built as **infrastructure for teams building, auditing, or testing design review tools** — not as documentation for end users. Ships a strict JSON Schema, a hand-authored JSON dataset, a generated Markdown rendering, a Node validator CLI, an **interactive web UI for running an audit**, and a **PR comment generator** for posting audit results on a pull request.

## Why this exists

Generic WCAG checklists treat "annotation" as "image with alt text" and miss the failure modes that are specific to this UI pattern: pin contrast against user-provided artifacts, focus order through anchored threads, live-region etiquette for remote collaborators, focus-not-obscured behavior when an approval toolbar overlays a pin. This checklist names those failure modes concretely so toolmakers can ship for them and auditors can test for them.

## Who it's for

- **Engineers shipping a design-review tool** — run a pre-PR self-audit on the surface you're touching, paste the report on your pull request.
- **Internal a11y teams** auditing such tools or writing remediation tickets against them.
- **Independent auditors** running WCAG 2.2 AA conformance reviews on this category of tool.

## What's in this repo

| File | Purpose |
|---|---|
| `checklist.json` | Source of truth — 95 hand-authored items |
| `checklist.schema.json` | JSON Schema (Draft 2020-12) — strict, closed enums |
| `checklist.md` | Human-readable rendering, generated from `checklist.json` |
| `index.html` | Interactive web UI for running an audit |
| `validate.js` | Node CLI — schema validation + semantic checks |
| `generate-pr-comment.js` | Node CLI — turns an audit report JSON into a Markdown PR comment |
| `scripts/generate-markdown.js` | Regenerates `checklist.md` from `checklist.json` |

## Install

```bash
npm install a11y-design-review-checklist
```

Or as a git submodule:

```bash
git submodule add https://github.com/patriciagoh/a11y-design-review-checklist vendor/a11y-design-review-checklist
```

Or fetch the raw JSON:

```bash
curl -L https://raw.githubusercontent.com/patriciagoh/a11y-design-review-checklist/main/checklist.json
```

## Run an audit (the web UI)

Open `index.html` in a browser. The page fetches `checklist.json` from the same directory and renders an interactive checklist.

**Easiest way to run it locally:**

```bash
# From the project root (or anywhere checklist.json + index.html sit together)
python3 -m http.server 8000
# → open http://localhost:8000
```

You can also host it on GitHub Pages straight from the repo, or stick the two files behind any static file server.

### What the web UI does

- **Three modes:**
  - **Pre-PR self-audit** — pick the surface(s) your component lives on, see only items in scope, mark each one as you go.
  - **Design review** — same scoped list but with notes fields surfaced for collaborative review sessions.
  - **Full audit** — every item in the checklist, exportable as a comprehensive report.
- **Filter** by surface area (9 CoLab-specific surfaces), tag (full vocabulary with CoLab-relevant tags surfaced as quick filters), WCAG level (A / AA), and audit status (unmarked / pass / fail / etc.).
- **Mark each item** as Pass / Fail / N/A / Needs investigation, with a freetext note per item.
- **Live summary** — pass/fail/coverage counts update as you go.
- **State persists in localStorage** so refreshing won't lose your work.
- **Export** the audit as a structured JSON report — see [report format](#report-format).
- **Import** a previously-exported report to continue or hand off an audit.
- **Dark mode** — follows your OS theme, or toggle manually.

### Report format

The web UI exports (and the PR generator consumes) JSON in this shape:

```json
{
  "meta": {
    "component": "FeedbackPanel",
    "surface": "Annotation pins & markups",
    "auditor": "patricia",
    "date": "2026-05-29",
    "mode": "pre-pr",
    "checklist_version": "1.1.0"
  },
  "results": [
    {
      "id": "1.1.1-annotation-icon-labels",
      "status": "fail",
      "note": "Pin markers only announce 'button' — no author or thread context"
    },
    { "id": "1.3.1-thread-structure-semantics", "status": "pass", "note": "" }
  ],
  "summary": {
    "total": 95,
    "scoped": 12,
    "pass": 8,
    "fail": 2,
    "na": 1,
    "needs_investigation": 1,
    "by_surface": {
      "Annotation pins & markups": { "pass": 5, "fail": 2, "na": 0, "needs_investigation": 1 }
    }
  }
}
```

## Post the audit on a PR (generate-pr-comment.js)

Turn an exported report into a GitHub-flavored Markdown PR comment:

```bash
node generate-pr-comment.js \
  --report audit-report.json \
  --component "FeedbackPanel" \
  --surface "Annotation pins & markups"
```

Pipe straight into `gh`:

```bash
node generate-pr-comment.js \
  --report audit-report.json \
  --component "FeedbackPanel" \
  --surface "Annotation pins & markups" \
  | gh pr comment 42 --body-file -
```

The comment includes:
- A summary table (component, surface, audit date, pass/fail/NA counts, coverage %)
- A surface-area context block ("3 failures in annotation pins, 1 in review workflow") so a reviewer scanning the PR can triage at a glance
- A collapsible `<details>` block per failed item with WCAG criterion, title, the note the engineer left, and a link to the W3C Understanding doc
- A collapsible block for "Needs investigation" items
- A footer linking back to this repo

## Surfaces

Every item is tagged with a CoLab surface — the part of the product where the failure mode actually manifests:

| Surface | What it covers |
|---|---|
| **3D model viewer** | The canvas itself: zoom, pan, rotate, section planes, measurements |
| **Annotation pins & markups** | Pin placement, region markers, markup toolbar, target sizes, pin contrast |
| **Discussion threads** | Reply, resolve, mention, thread reading order, comment composer |
| **Review workflow & status** | Approve / request changes, status badges, role transitions, review key |
| **Version history & comparison** | Version list, diff highlights, compare slider, page titles |
| **Issue tracking** | Ticket queue (reserved — no v1.1 items here yet) |
| **Notifications & live updates** | Presence, live cursors, connection state, real-time announcements |
| **AI-generated content** | AI comment attribution and distinguishability |
| **Notebooks & documents** | Pre-reads, requirements docs, decision logs, document chrome |

The web UI filters by surface, and `generate-pr-comment.js` takes the surface as a flag (`--surface "..."`) so the comment can headline the surface a reviewer should care about.

## Consume the JSON programmatically

```javascript
import checklist from 'a11y-design-review-checklist/checklist.json' with { type: 'json' };

const contrastItems = checklist.items.filter(i => i.tags.includes('contrast'));
const aaOnly = checklist.items.filter(i => i.level === 'AA');
const annotationsOnly = checklist.items.filter(i => i.surface === 'Annotation pins & markups');
const focusInRealtime = checklist.items.filter(i =>
  i.tags.includes('focus') && i.tags.includes('realtime')
);
```

## Validate a fork or extension

If you fork this checklist to extend it with team-specific items, validate your fork in CI:

```yaml
# .github/workflows/checklist.yml
- run: npx a11y-design-review-checklist-validate ./my-checklist.json
```

Exit 0 = passes schema + semantic checks. Exit 1 = failures (printed to stderr).

## Read the checklist

[`checklist.md`](./checklist.md) is the human-readable rendering, generated from `checklist.json`. Each item shows its WCAG criterion, surface, tags, description, how-to-test steps, pass criteria, fail examples, and references.

## Schema

[`checklist.schema.json`](./checklist.schema.json) is JSON Schema Draft 2020-12. Strict (`additionalProperties: false` throughout, closed enums for `level`, `category`, `surface`, and `tags`). See the schema for the full field reference.

## Versioning

- **Patch:** typo, clarification, new reference link on an existing item.
- **Minor:** new item added, new tag or surface added, new optional field with safe default.
- **Major:** item removed or `id` renamed, required field changed, tag or surface removed.

### Changelog

- **1.1.0** (2026-05-29) — Added `surface` field (required, 9-value enum) for CoLab-style scoping. Added 9 new tags (`canvas`, `viewer`, `status`, `color`, `workflow`, `touch-target`, `toolbar`, `wcag22`, `ai-content`). Added 8 new items covering 3D viewer keyboard controls, status badge color reliance, toolbar target sizes, AI comment attribution, measurement output, section plane announcements, notebook heading structure, and review key accessibility. Shipped the interactive web UI (`index.html`) and the PR comment generator (`generate-pr-comment.js`).
- **1.0.0** (2026-05-28) — Initial release. 87 items across all WCAG 2.2 AA criteria.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
