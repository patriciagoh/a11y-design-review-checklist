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

First, read `checklist.json` and extract the canonical set of `surface` values (and the items
under each) — that list, not the examples below, is authoritative. Then scan the user's repository
(their cwd) to determine which of those surfaces are actually present. Typical surfaces look like:

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
surfaces that clearly aren't present. If you detect no design-review surfaces at all, stop and tell
the user (this checklist only covers design-review / collaboration UI) rather than inventing scope.

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

```json
{
  "meta": { "date": "<YYYY-MM-DD>", "mode": "skill", "auditor": "claude" },
  "summary": { "pass": 0, "fail": 0, "na": 0, "needs_investigation": 0, "scoped": 0 },
  "results": [
    { "id": "<id>", "status": "fail", "fix": "<concrete fix>", "location": "src/Foo.tsx:42", "note": "<optional>" },
    { "id": "<id>", "status": "pass", "location": "src/Bar.tsx:18" },
    { "id": "<id>", "status": "needs_investigation", "note": "<what a human must verify>" },
    { "id": "<id>", "status": "na" }
  ]
}
```

Field rules: a `pass` includes `location`; a `fail` includes `fix` + `location`; a
`needs_investigation` includes `note`. `scoped` is the count of items you evaluated after step 2
(not the full checklist length), and the `summary` counts must add up across `results`. If
`audit-report.json` already exists in the user's repo, warn before overwriting it.

## 5. Render the PR comment

Run the bundled generator (it reads `checklist.json` from its own directory):

```bash
node <skill-dir>/generate-pr-comment.js \
  --report audit-report.json \
  --component "<feature/component name>" \
  --surface "<primary surface>" > a11y-design-review-audit.md
```

Here `<skill-dir>` is the absolute path of the directory this `SKILL.md` was loaded from (provided
to you when the skill is invoked) — that's where `generate-pr-comment.js` and `checklist.json`
live, **not** the user's repo. Write the rendered output to `a11y-design-review-audit.md` in the
user's repo.

## 6. Report back

Show the user the summary counts, the top failures with their fixes, and the list of
`needs_investigation` items they must verify manually (screen reader, keyboard, captions, etc.).
Make clear this is a static audit plus a manual-verification list — not a full accessibility
sign-off.
