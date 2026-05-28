# a11y-design-review-checklist

A WCAG 2.2 AA accessibility checklist for **design-review UI patterns** — interfaces where users navigate visual artifacts, anchor annotations to spatial locations, manage conversation threads, track version history, and move through approval workflows.

Built as **infrastructure for teams building, auditing, or testing design review tools** — not as documentation for end users. The checklist is a strict JSON Schema, a hand-authored JSON document, and a generated Markdown rendering.

## Why this exists

Generic WCAG checklists treat "annotation" as "image with alt text" and miss the failure modes that are specific to this UI pattern: pin contrast against user-provided artifacts, focus order through anchored threads, live-region etiquette for remote collaborators, focus-not-obscured behavior when an approval toolbar overlays a pin. This checklist names those failure modes concretely so toolmakers can ship for them and auditors can test for them.

## Who it's for

- **Tool builders** shipping design-review, design-QA, or annotation tools.
- **Internal a11y teams** auditing such tools or writing remediation tickets against them.
- **Independent auditors** running WCAG 2.2 AA conformance reviews on this category of tool.

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

## Consume the JSON

```javascript
import checklist from 'a11y-design-review-checklist/checklist.json' with { type: 'json' };

const contrastItems = checklist.items.filter(i => i.tags.includes('contrast'));
const aaOnly = checklist.items.filter(i => i.level === 'AA');
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

[`checklist.md`](./checklist.md) is the human-readable rendering, generated from `checklist.json`.

## Schema

[`checklist.schema.json`](./checklist.schema.json) is JSON Schema Draft 2020-12. Strict (`additionalProperties: false` throughout, closed enums for `level`, `category`, and `tags`). See the schema for the full field reference.

## Versioning

- **Patch:** typo, clarification, new reference link on an existing item.
- **Minor:** new item added, new tag added (schema enum extended), new optional field with safe default.
- **Major:** item removed or `id` renamed, required field changed, tag removed.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
