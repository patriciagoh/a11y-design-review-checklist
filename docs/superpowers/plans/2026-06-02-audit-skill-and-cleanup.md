# a11y Audit Skill + OSS-Hygiene Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make this repo a Claude skill that audits design-review UI code against the WCAG 2.2 AA checklist and emits a PR comment with fix suggestions, and bring it to the `wcag-explainer` reference-grade OSS bar.

**Architecture:** A `SKILL.md` drives the audit (Claude reads the user's code; `checklist.json` is the source of truth). The existing `generate-pr-comment.js` already renders an audit-report JSON; we extend it *additively* to show a per-item `fix` + `location`, then the skill produces that report shape and reuses the generator. Plus mechanical OSS-hygiene files.

**Tech Stack:** Node ≥18 (ESM), `node --test`, ajv (existing), GitHub Actions, GitHub Pages (legacy branch-serve).

**Branch:** `feat/audit-skill-and-cleanup` (already created).

---

## File Structure

**Group A — skill + generator:**
- Modify `generate-pr-comment.js` — additive `fix`/`location` rendering in `renderItemBlock`
- Create `tests/generate-pr-comment.test.js` — renderer tests (enriched + legacy + needs_investigation)
- Create `SKILL.md` — the audit procedure (detect → confirm → evaluate → render → deliver)

**Group B — OSS hygiene (mechanical):**
- Create `CODE_OF_CONDUCT.md`, `SECURITY.md`, `ARCHITECTURE.md`
- Create `.github/ISSUE_TEMPLATE/{bug_report.yml,feature_request.yml,config.yml}`
- Modify `.github/workflows/validate.yml` (Node 20 → 24)
- Modify `README.md` (add a "use as a Claude skill" entry)

---

# GROUP A — Skill + Generator

### Task 1: `fix`/`location` rendering in the PR-comment generator (TDD)

**Files:**
- Test: `tests/generate-pr-comment.test.js` (create)
- Modify: `generate-pr-comment.js` (`renderItemBlock`)

- [ ] **Step 1: Write the failing test**

Create `tests/generate-pr-comment.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdtempSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = path.join(root, 'generate-pr-comment.js');

// A real id from checklist.json (the generator looks ids up there).
const REAL_ID = '1.1.1-artifact-alt-text';

function run(reportObj) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'a11y-pr-'));
  const reportPath = path.join(dir, 'report.json');
  writeFileSync(reportPath, JSON.stringify(reportObj));
  return spawnSync(
    'node',
    [script, '--report', reportPath, '--component', 'CommentThread', '--surface', '3D model viewer'],
    { encoding: 'utf8' },
  );
}

test('renders fix and location for a failed item when present', () => {
  const res = run({
    meta: { date: '2026-06-02', mode: 'skill', auditor: 'claude' },
    summary: { pass: 0, fail: 1, na: 0, needs_investigation: 0, scoped: 1 },
    results: [{
      id: REAL_ID,
      status: 'fail',
      fix: 'Add an alt-text field and wire it to the viewer header aria-label.',
      location: 'src/Viewer.tsx:42',
      note: 'filename used as alt',
    }],
  });
  assert.equal(res.status, 0, res.stderr);
  assert.match(res.stdout, /\*\*Suggested fix:\*\*/);
  assert.match(res.stdout, /aria-label/);
  assert.match(res.stdout, /`src\/Viewer\.tsx:42`/);
  assert.match(res.stdout, /❌ Failed items \(1\)/);
});

test('legacy report without fix/location still renders (no Suggested fix / Location lines)', () => {
  const res = run({
    meta: { date: '2026-06-02' },
    summary: { pass: 0, fail: 1, na: 0, needs_investigation: 0, scoped: 1 },
    results: [{ id: REAL_ID, status: 'fail', note: 'x' }],
  });
  assert.equal(res.status, 0, res.stderr);
  assert.doesNotMatch(res.stdout, /\*\*Suggested fix:\*\*/);
  assert.doesNotMatch(res.stdout, /\*\*Location:\*\*/);
});

test('renders needs_investigation items', () => {
  const res = run({
    meta: {},
    summary: { pass: 0, fail: 0, na: 0, needs_investigation: 1, scoped: 1 },
    results: [{ id: REAL_ID, status: 'needs_investigation', note: 'verify with a screen reader' }],
  });
  assert.equal(res.status, 0, res.stderr);
  assert.match(res.stdout, /Needs investigation \(1\)/);
});
```

- [ ] **Step 2: Run the test, watch it fail**

Run: `cd /Users/patricia/a11y-design-review-checklist && node --test tests/generate-pr-comment.test.js`
Expected: the first test FAILS (no "Suggested fix" / location in output); the other two may pass.

- [ ] **Step 3: Implement the additive rendering**

In `generate-pr-comment.js`, replace the `renderItemBlock` function with:

```javascript
function renderItemBlock(result, item, repoUrl) {
  const understandingUrl = findUnderstandingURL(item);
  const noteBlock = result.note && result.note.trim()
    ? `\n> ${result.note.trim().replace(/\n/g, '\n> ')}`
    : '\n> _(no note left)_';

  const lines = [
    `<details>`,
    `<summary><strong>${escape(item.title)}</strong> &nbsp;·&nbsp; <code>${item.id}</code></summary>`,
    ``,
    `- **WCAG ${item.wcag_criterion}** ${escape(item.wcag_title)} (Level ${item.level})`,
    `- **Surface:** ${escape(item.surface)}`,
  ];

  // Audit-mode extras: only emitted when the report supplies them, so reports
  // exported from the web UI (which lack these fields) render exactly as before.
  if (result.location && String(result.location).trim()) {
    lines.push(`- **Location:** \`${escape(String(result.location).trim())}\``);
  }
  lines.push(`- **Understanding:** ${understandingUrl}`);
  if (result.fix && String(result.fix).trim()) {
    lines.push(``, `**Suggested fix:** ${escape(String(result.fix).trim())}`);
  }

  lines.push(
    ``,
    `**Engineer note:**${noteBlock}`,
    ``,
    `[View item in checklist](${repoUrl}/blob/main/checklist.md#${slugifyHeader(item.title)})`,
    `</details>`,
    ``,
  );
  return lines.join('\n');
}
```

- [ ] **Step 4: Run the test, watch it pass**

Run: `cd /Users/patricia/a11y-design-review-checklist && node --test tests/generate-pr-comment.test.js`
Expected: all 3 tests PASS.

- [ ] **Step 5: Run the full suite + validate (no regressions)**

Run: `cd /Users/patricia/a11y-design-review-checklist && npm ci && npm test && npm run validate && npm run check-md`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
git add generate-pr-comment.js tests/generate-pr-comment.test.js
git commit -m "feat: render suggested fix + location in audit PR comments"
```

---

### Task 2: `SKILL.md` — the audit procedure

**Files:**
- Create: `SKILL.md`

- [ ] **Step 1: Write `SKILL.md`**

```markdown
---
name: a11y-design-review-checklist
description: Audits a design-review / collaboration UI (annotations, comment threads, version history, presence, media review, 3D/canvas viewers, AI-assisted comments) against the WCAG 2.2 AA design-review checklist and produces a GitHub PR comment with fix suggestions. Use when an engineer wants an accessibility audit of a design-review or commenting feature, or a PR-ready a11y findings comment for one.
---

# a11y-design-review-checklist skill

> A hosted, interactive version of this checklist is at
> <https://patriciagoh.github.io/a11y-design-review-checklist/>. This skill audits the user's own
> code against it and produces a PR comment with fixes.

The judgement is yours (read the user's code); `checklist.json` (next to this `SKILL.md`) is the
source of truth; the bundled `generate-pr-comment.js` renders the PR comment. Suggest fixes — do
**not** edit the user's code unless they ask.

When invoked:

## 1. Detect the design-review surfaces

Read `checklist.json` to get the exact `surface` values and the items under each. Then scan the
user's repository (their cwd) for design-review / collaboration surfaces, e.g.:

- annotation pins / markups on an artifact or canvas
- comment threads / reply chains / @mentions
- version history / compare / diff views
- presence / live cursors / real-time collaboration
- media or video review (recorded walkthroughs, captions)
- 3D / canvas / image viewers
- AI-assisted comments or summaries

## 2. Confirm scope with the user

Tell the user which surfaces you detected and how many checklist items apply, and ask them to
confirm or adjust (add/remove a surface, or point you at specific directories). Don't audit
surfaces that clearly aren't present.

## 3. Evaluate each scoped item against the code

For each item in scope, read the relevant components and judge it against the item's `how_to_test`
and `pass_criteria`. Assign exactly one status:

- `pass` — the code clearly satisfies the pass criteria. Cite `file:line`.
- `fail` — the code clearly violates it. Provide a concrete `fix` and a `location` (`file:line`).
- `needs_investigation` — depends on runtime, screen-reader, or visual behavior you cannot confirm
  by reading code. Put what a human must check in `note`.
- `na` — the surface is in scope but this item doesn't apply to the implementation.

**Honesty rules — do not break these:**

- Never mark a runtime / assistive-tech / visual behavior `pass` from static reading. If you can't
  confirm it in the code, it is `needs_investigation`.
- Every `pass` and `fail` must cite a `file:line`.
- When unsure, prefer `needs_investigation` over guessing.

## 4. Write the audit report JSON

Write `audit-report.json` in the user's repo with this shape:

​```json
{
  "meta": { "date": "<YYYY-MM-DD>", "mode": "skill", "auditor": "claude" },
  "summary": { "pass": 0, "fail": 0, "na": 0, "needs_investigation": 0, "scoped": 0 },
  "results": [
    { "id": "<checklist item id>", "status": "fail",
      "fix": "<concrete fix>", "location": "src/Foo.tsx:42", "note": "<optional>" }
  ]
}
​```

`scoped` is the number of items audited; the `summary` counts must match `results`.

## 5. Render the PR comment

Run the bundled generator (it reads `checklist.json` from its own directory):

​```bash
node <skill-dir>/generate-pr-comment.js \
  --report audit-report.json \
  --component "<feature/component name>" \
  --surface "<primary surface>" > a11y-design-review-audit.md
​```

(`<skill-dir>` is this skill's directory.) Write the output to `a11y-design-review-audit.md` in the
user's repo.

## 6. Report back

Show the user the summary counts, the top failures with their fixes, and the list of
`needs_investigation` items they must verify manually (screen reader, keyboard, captions, etc.).
Make clear this is a static audit plus a manual-verification list — not a full accessibility
sign-off.
```

> Note: in the JSON/bash fences above, the leading `​` marks are zero-width and must NOT be copied — write normal triple-backtick fences. (If you see them literally, strip them.) Simplest: write the file with ordinary nested fences using 4-backtick outer fences if needed, or just plain ```` ``` ```` blocks since this is a standalone file, not nested.

- [ ] **Step 2: Verify the frontmatter parses (name + description present)**

Run:
```bash
cd /Users/patricia/a11y-design-review-checklist
head -4 SKILL.md | grep -q "name: a11y-design-review-checklist" && grep -q "^description:" SKILL.md && echo "frontmatter ok"
```
Expected: `frontmatter ok`

- [ ] **Step 3: Sanity-check the generator invocation documented in SKILL.md actually works**

Run (proves the documented command renders without error against a real id):
```bash
cd /Users/patricia/a11y-design-review-checklist
printf '%s' '{"meta":{"date":"2026-06-02","mode":"skill","auditor":"claude"},"summary":{"pass":0,"fail":1,"na":0,"needs_investigation":0,"scoped":1},"results":[{"id":"1.1.1-artifact-alt-text","status":"fail","fix":"Wire authored alt text to the viewer header accessible name.","location":"src/Viewer.tsx:42"}]}' > /tmp/a11y-smoke.json
node generate-pr-comment.js --report /tmp/a11y-smoke.json --component "Viewer" --surface "3D model viewer" | grep -q "Suggested fix" && echo "render ok"
```
Expected: `render ok`

- [ ] **Step 4: Commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
git add SKILL.md
git commit -m "feat: add a11y-design-review-checklist audit skill (SKILL.md)"
```

---

# GROUP B — OSS Hygiene

### Task 3: CODE_OF_CONDUCT.md

**Files:**
- Create: `CODE_OF_CONDUCT.md`

- [ ] **Step 1: Add the Contributor Covenant 2.1 text with the contact set**

Use the canonical text from
<https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md>. In the
"Enforcement" section, set the reporting contact to **patricia.goh@ada.support**. Do not alter
other wording.

Verify: `cd /Users/patricia/a11y-design-review-checklist && grep -q "patricia.goh@ada.support" CODE_OF_CONDUCT.md && echo ok`
Expected: `ok`

- [ ] **Step 2: Commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
git add CODE_OF_CONDUCT.md
git commit -m "docs: add Contributor Covenant code of conduct"
```

---

### Task 4: SECURITY.md

**Files:**
- Create: `SECURITY.md`

- [ ] **Step 1: Write the file**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
git add SECURITY.md
git commit -m "docs: add security policy"
```

---

### Task 5: ARCHITECTURE.md

**Files:**
- Create: `ARCHITECTURE.md`

- [ ] **Step 1: Write the file**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
git add ARCHITECTURE.md
git commit -m "docs: add architecture doc (dual skill + checklist nature)"
```

---

### Task 6: Issue templates

**Files:**
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/ISSUE_TEMPLATE/config.yml`

- [ ] **Step 1: Write `bug_report.yml`**

```yaml
name: Bug report
description: A checklist item, the audit skill, a CLI, or the hosted UI isn't working
labels: [bug]
body:
  - type: dropdown
    id: area
    attributes:
      label: Area
      options:
        - Checklist content (an item is wrong/unclear)
        - The audit skill (SKILL.md)
        - A CLI (validate / generate-md / pr-comment)
        - The hosted audit UI
        - Docs
    validations:
      required: true
  - type: textarea
    id: what
    attributes:
      label: What happened?
      description: What did you expect, and what happened instead?
    validations:
      required: true
  - type: textarea
    id: repro
    attributes:
      label: Steps to reproduce
    validations:
      required: true
```

- [ ] **Step 2: Write `feature_request.yml`**

```yaml
name: Feature request
description: Suggest a checklist item, surface, or skill/CLI improvement
labels: [enhancement]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What gap or problem would this address?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposed change
      description: A new checklist item, a new surface, or a skill/CLI improvement.
```

- [ ] **Step 3: Write `config.yml`**

```yaml
blank_issues_enabled: false
contact_links:
  - name: Run an audit (hosted UI)
    url: https://patriciagoh.github.io/a11y-design-review-checklist/
    about: Use the hosted interactive checklist to audit a design-review UI — no setup needed.
```

- [ ] **Step 4: Commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
git add .github/ISSUE_TEMPLATE
git commit -m "docs: add issue templates"
```

---

### Task 7: Bump CI to Node 24

**Files:**
- Modify: `.github/workflows/validate.yml`

- [ ] **Step 1: Change the Node version**

In `.github/workflows/validate.yml`, change:
```yaml
          node-version: '20'
```
to:
```yaml
          node-version: '24'
```

- [ ] **Step 2: Verify**

Run: `cd /Users/patricia/a11y-design-review-checklist && grep -n "node-version" .github/workflows/validate.yml`
Expected: shows `node-version: '24'`

- [ ] **Step 3: Commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
git add .github/workflows/validate.yml
git commit -m "ci: bump workflow Node version 20 -> 24"
```

---

### Task 8: README — surface the skill

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a skill row to the "Get it" use-case table**

In `README.md`, in the `## Get it` table (the one with "Use case | How" rows), add this row as the
**first** body row (right after the header separator):

```markdown
| **Audit your design-review UI (Claude skill)** | In any Claude Code session, ask Claude to use the `a11y-design-review-checklist` skill — it audits your code against the checklist and produces a PR comment with fixes. See [SKILL.md](SKILL.md). |
```

- [ ] **Step 2: Add a changelog entry**

In the `### Changelog` section, add as the newest entry:

```markdown
- **1.2.0** (2026-06-02) — Added a Claude skill (`SKILL.md`) that audits a design-review UI against the checklist and renders a PR comment with fix suggestions; the PR-comment generator now shows a per-failure suggested fix + `file:line`. Added OSS-hygiene files (Code of Conduct, Security policy, Architecture, issue templates) and bumped CI to Node 24.
```

- [ ] **Step 3: Bump `package.json` version to match the changelog**

In `package.json`, change `"version": "1.1.2"` to `"version": "1.2.0"`.

- [ ] **Step 4: Verify + commit**

```bash
cd /Users/patricia/a11y-design-review-checklist
grep -q "a11y-design-review-checklist\` skill" README.md && grep -q '"version": "1.2.0"' package.json && echo ok
git add README.md package.json
git commit -m "docs: surface the audit skill in README; bump to 1.2.0"
```

---

### Task 9: Full verification

- [ ] **Step 1: Tests + validation green**

Run: `cd /Users/patricia/a11y-design-review-checklist && npm ci && npm test && npm run validate && npm run check-md`
Expected: all pass (including `tests/generate-pr-comment.test.js`).

- [ ] **Step 2: Community-standards files present**

Run:
```bash
cd /Users/patricia/a11y-design-review-checklist
for f in README.md LICENSE CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md ARCHITECTURE.md SKILL.md .github/PULL_REQUEST_TEMPLATE.md .github/ISSUE_TEMPLATE/config.yml .github/workflows/validate.yml; do [ -f "$f" ] && echo "ok $f" || echo "MISSING $f"; done
```
Expected: all `ok`.

- [ ] **Step 3: SKILL.md frontmatter valid + no stray zero-width chars**

Run:
```bash
cd /Users/patricia/a11y-design-review-checklist
head -1 SKILL.md | grep -q '^---$' && grep -q "^name: a11y-design-review-checklist$" SKILL.md && echo "frontmatter ok"
LC_ALL=C grep -n $'\xe2\x80\x8b' SKILL.md && echo "ZERO-WIDTH FOUND (fix)" || echo "no zero-width chars ok"
```
Expected: `frontmatter ok` and `no zero-width chars ok`.

---

## Self-Review

**Spec coverage:**
- Skill (`SKILL.md`) with detect→confirm→evaluate→render→deliver → Task 2 ✓
- Reuse existing audit-report JSON + generator → Task 1 (additive) + Task 2 (produces the shape) ✓
- Additive `fix`/`location` rendering, backward-compatible → Task 1 ✓
- Honesty constraints (needs_investigation, file:line) → Task 2 (SKILL.md body) ✓
- Dual nature documented → Task 5 (ARCHITECTURE) ✓
- OSS hygiene: CoC/SECURITY/ARCHITECTURE/issue templates/Node 24 → Tasks 3–7 ✓
- README surfaces the skill → Task 8 ✓
- Testing (renderer fixture; existing suite green) → Task 1 steps 1–5, Task 9 ✓
- Not adding Pages workflow / eslint → omitted by design ✓

**Placeholder scan:** No TBD/TODO. The only `<…>` are inside the SKILL.md *instructions* (intended runtime placeholders Claude fills), not plan gaps. The CoC uses the canonical named source + concrete contact.

**Type consistency:** Report shape (`meta`/`summary`/`results[]` with `status`, `fix`, `location`, `note`) is identical across Task 1 (test + renderer) and Task 2 (SKILL.md). Status vocabulary `pass|fail|na|needs_investigation` matches the existing generator. The real item id `1.1.1-artifact-alt-text` is used consistently in tests + smoke check.
