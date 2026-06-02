# a11y-design-review-checklist — Matcha Oat Reskin (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Reskin the static audit UI (`index.html`) to the Matcha Oat identity by consuming `matcha-oat-design-system` tokens — clean & restrained — preserving all functionality and WCAG 2.2 AA.

**Architecture:** Vendor `tokens.css` + `fonts.css` from the `matcha-oat-design-system` git devDependency (a sync script keeps the committed copies current; CI fails on drift). `index.html` links those, and its inline `<style>` is rewritten so every value is `var(--…)` (Matcha Oat + the new semantic status layer `--ok/--bad/--warn/--neutral`). The matcha-oat guardrail runs in CI to forbid hardcoded hex/font literals.

**Tech Stack:** Static HTML/CSS/vanilla JS, Node dev scripts (`node --test`), GitHub Actions, Pages (legacy branch-serve).

**Visual target:** the approved mockup `matcha-reskin-preview.html` (in the repo root, uncommitted) — match its look. Delete it at the end.

**Branch:** create `phase1-matcha-reskin` off `main`.

---

## Token mapping (old a11y `:root` var → Matcha Oat / semantic)

| Old var | New |
|---|---|
| `--ink` | `--ink` (kept) |
| `--muted`, `--muted-2` | `--muted` |
| `--line` / `--line-2` | `--line` / `--line-2` |
| `--control-line` (form borders, 1.4.11 ≥3:1) | `--muted` (4.85:1 on paper, 4.53:1 on oat) |
| `--bg` | `--oat` |
| `--card` | `--paper` |
| `--card-2` (input/pill fill) | `--paper` with `--line-2` border (inputs); `--matcha-tint` (pills) |
| `--accent` / `--accent-soft` / `--accent-ink` | `--matcha-deep` / `--matcha-tint` / `--matcha-deep` |
| `--green-*` (pass) | `--ok` / `--ok-bg` / `--ok-border` |
| `--red-*` (fail) | `--bad` / `--bad-bg` / `--bad-border` |
| `--amber-*` (needs-investigation) | `--warn` / `--warn-bg` / `--warn-border` |
| `--gray-*` (n/a) | `--neutral` / `--neutral-bg` / `--neutral-border` |
| `--code-bg` / `--code-ink` | `--term-bg` / `--term-text` |
| `--shadow` | `--shadow-card` |
| body font | `var(--sans)`; code/mono → `var(--mono)`; headings (`.app-title`, section `h2`, `.item h3`) → `var(--serif)` |

Coverage bar segments: `b-pass`→`--matcha`, `b-fail`→`--bad-border`, `b-na`→`--muted`, `b-ni`→`--yolk`.

---

### Task 1: Vendor tokens via the design-system dependency + sync script

**Files:** Modify `package.json`; Create `scripts/sync-tokens.mjs`; Create (generated) `tokens.css`, `fonts.css`.

- [ ] **Step 1: Add the design system as a git devDependency**

```bash
cd /Users/patricia/a11y-design-review-checklist
npm install --save-dev github:patriciagoh/matcha-oat-design-system
```
Expected: adds `"matcha-oat-design-system": "github:patriciagoh/matcha-oat-design-system"` to `devDependencies` and updates `package-lock.json`.

- [ ] **Step 2: Write `scripts/sync-tokens.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Copy the canonical tokens + fonts from the matcha-oat-design-system dependency
 * into the repo root, so the build-less static index.html can link real files.
 * CI re-runs this and fails if the committed copies drift from the pinned dep.
 */
import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dep = join(root, "node_modules", "matcha-oat-design-system");

for (const file of ["tokens.css", "fonts.css"]) {
  copyFileSync(join(dep, file), join(root, file));
  console.log(`synced ${file}`);
}
```

- [ ] **Step 3: Add the `sync-tokens` script to `package.json`** (in `"scripts"`, after `"check-md"`):

```json
    "sync-tokens": "node scripts/sync-tokens.mjs",
```

- [ ] **Step 4: Run it to vendor the files**

Run: `cd /Users/patricia/a11y-design-review-checklist && npm run sync-tokens`
Expected: prints `synced tokens.css` / `synced fonts.css`; `tokens.css` + `fonts.css` now exist at repo root and contain the Matcha Oat tokens (`grep -- '--ok:' tokens.css` → present).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json scripts/sync-tokens.mjs tokens.css fonts.css
git commit -m "feat: vendor matcha-oat-design-system tokens via sync script"
```

---

### Task 2: CI — token drift check + no-raw-values guardrail

**Files:** Modify `.github/workflows/validate.yml`.

- [ ] **Step 1: Add two steps after the existing `npm ci` step** (the workflow currently runs ci → validate → check-md → test):

```yaml
      - name: Design tokens in sync with matcha-oat-design-system
        run: |
          npm run sync-tokens
          git diff --exit-code tokens.css fonts.css
```
and add, as the final step:
```yaml
      - name: No hardcoded design values (tokens only)
        run: node node_modules/matcha-oat-design-system/scripts/check-no-raw-values.mjs index.html
```

- [ ] **Step 2: Verify locally**

Run:
```bash
cd /Users/patricia/a11y-design-review-checklist
npm run sync-tokens && git diff --exit-code tokens.css fonts.css && echo "no drift ✓"
```
Expected: `no drift ✓` (the vendored copies match the dep).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/validate.yml
git commit -m "ci: token drift check + no-raw-values guardrail"
```

---

### Task 3: Reskin `index.html` to Matcha Oat

**Files:** Modify `index.html` (the `<head>` links, the inline `<style>`, the 6 inline `style=` attributes, and the ~10 JS `.style.cssText`/color strings).

**Reference:** match `matcha-reskin-preview.html` (approved mockup). Preserve every class name, element id, `aria-*`, and all JavaScript behavior — this is a **visual** change only.

- [ ] **Step 1: Link the vendored tokens + fonts** — in `<head>`, **before** the inline `<style>`, add:

```html
<link rel="stylesheet" href="fonts.css" />
<link rel="stylesheet" href="tokens.css" />
```

- [ ] **Step 2: Rewrite the inline `<style>` `:root`** — delete the old Tailwind-gray/blue token block (the `--ink … --shadow` definitions) entirely. The page now gets design values from the linked `tokens.css`. Keep only any *app-specific* layout vars that aren't design tokens (e.g. a sidebar width) — and even those need no raw colors. Update the top comment from "stock Tailwind blue/gray" to note it consumes `matcha-oat-design-system` tokens.

- [ ] **Step 3: Restyle component rules** using the Token Mapping table above — apply across every selector in the inventory (`.app`, `.app-title`, `.app-tag`, `.field`, `.pills`, `.pill`, `.status-pills`, `.status-seg`/`.seg`/`.state`, `.summary`, `.bar` (+`.b-pass/.b-fail/.b-na/.b-ni`), `.coverage`, `.actions`, `.btn` (+`.primary`/`.danger`), `.item` (+status border-left), `.item-head`/`.item-desc`/`.item-meta`/`.item-controls`, `.chip`, `.count-chip`, `.main-head`, `.rail-section`, `.mode-radios`, `.note-toggle`/`.note-wrap`, `.ctx-hint`, `.legend`, `.clear-link`, `.skip-link`, `.sr-only`, `.note`). Headings use `var(--serif)`, labels/stats/code use `var(--mono)`, body uses `var(--sans)`, matching the mockup. Every color/font value must be `var(--…)`.

- [ ] **Step 4: Tokenize inline + JS styles** — convert the 6 `style="…"` attributes and the JS `.style.cssText`/color assignments to `var(--…)`. Dynamic *layout* values (e.g. coverage bar `width:NN%`) stay as-is; only colors/fonts move to tokens. (e.g. the import-textarea `cssText` border/background/color → `var(--line-2)`/`var(--paper)`/`var(--ink)`.)

- [ ] **Step 5: Preserve accessibility** — ensure the reskinned `<style>` keeps a visible focus ring (`:focus-visible { outline: var(--focus); outline-offset: var(--focus-offset); }`), a `@media (prefers-reduced-motion: reduce)` block, and form-control borders at `var(--muted)` (≥3:1, WCAG 1.4.11). Keep `.sr-only` and `.skip-link` intact.

- [ ] **Step 6: Verify it renders + guardrail passes**

Run:
```bash
cd /Users/patricia/a11y-design-review-checklist
node node_modules/matcha-oat-design-system/scripts/check-no-raw-values.mjs index.html && echo "no raw values ✓"
open index.html   # confirm it matches the mockup; click status buttons, check summary updates
```
Expected: `no raw values ✓`, and the page renders in Matcha Oat with working interactions.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: reskin audit UI to Matcha Oat (consumes design-system tokens)"
```

---

### Task 4: Docs + cleanup + verification

**Files:** Modify `README.md`; delete `matcha-reskin-preview.html`.

- [ ] **Step 1: Update README** — the project description / "Get it" notes that mention the UI's look should reference the Matcha Oat design system. Add a line under the hosted-UI mention: "The UI is styled with the [matcha-oat-design-system](https://github.com/patriciagoh/matcha-oat-design-system) tokens (single source of truth)." Add a changelog entry: "**1.3.0** — Reskinned the audit UI to the Matcha Oat design system (consumes matcha-oat-design-system tokens; WCAG 2.2 AA preserved)." Bump `package.json` version to `1.3.0`.

- [ ] **Step 2: Remove the throwaway mockup**

```bash
cd /Users/patricia/a11y-design-review-checklist && git rm -f --ignore-unmatch matcha-reskin-preview.html 2>/dev/null; rm -f matcha-reskin-preview.html
```

- [ ] **Step 3: Full verification (CI-equivalent)**

```bash
cd /Users/patricia/a11y-design-review-checklist
npm ci
npm run validate && npm run check-md && npm test
npm run sync-tokens && git diff --exit-code tokens.css fonts.css && echo "no token drift ✓"
node node_modules/matcha-oat-design-system/scripts/check-no-raw-values.mjs index.html && echo "no raw values ✓"
```
Expected: validate OK, md in sync, tests pass, no drift, no raw values.

- [ ] **Step 4: Contrast spot-check** — confirm the new status combos pass AA: pass (matcha-deep on matcha-tint 5.25:1), fail (`#9B3D2E` on `#FBEEEA` 5.97:1), needs-investigation (yolk-tint-text on yolk-tint 6.3:1), n/a (ink-2 on neutral-bg 7:1), body (ink-2 on oat 8.5:1), control borders (muted ≥3:1). Already computed; confirm the reskin used those token pairings (no off-token combos).

- [ ] **Step 5: Commit**

```bash
git add README.md package.json
git commit -m "docs: note Matcha Oat reskin; bump to 1.3.0; drop preview mockup"
```

---

## Self-Review

**Spec coverage** (parent spec Phase 1):
- Consume matcha-oat tokens (synced copy, not submodule) → Task 1 ✓
- CI drift check + guardrail → Task 2 ✓
- Reskin to Matcha Oat clean & restrained, semantic statuses → Task 3 ✓ (mockup as visual spec)
- Preserve functionality + WCAG 2.2 AA (focus, reduced-motion, 1.4.11 control borders, AA contrast) → Task 3 steps 4–5, Task 4 step 4 ✓
- Fonts via CDN (fonts.css) → Task 1 (vendored) + Task 3 step 1 ✓

**Placeholder scan:** sync script + CI steps are complete code; the reskin's per-selector CSS is delegated to the implementer via the explicit Token Mapping table + the approved mockup as the visual spec (appropriate for a ~550-line visual rewrite — the mapping makes it deterministic, not vague).

**Consistency:** semantic token names (`--ok/--bad/--warn/--neutral` + `-bg`/`-border`) match what was just added to `matcha-oat-design-system/tokens.css`. The guardrail path `node_modules/matcha-oat-design-system/scripts/check-no-raw-values.mjs` matches the dep's `files`. `node --test tests/*.test.js` (existing) is Node-24-safe.

**Note:** guardrail runs on `index.html` only (the app surface). The vendored `tokens.css` legitimately holds raw values (it's the token source) and is not scanned.
