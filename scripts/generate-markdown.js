#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const CATEGORIES = [
  ['perceivable', 'Perceivable'],
  ['operable', 'Operable'],
  ['understandable', 'Understandable'],
  ['robust', 'Robust'],
  ['dynamic_collaborative', 'Dynamic & Collaborative Patterns'],
];

function renderItem(item) {
  const lines = [];
  lines.push(`### ${item.title}`);
  lines.push('');
  lines.push(`- **ID:** \`${item.id}\``);
  lines.push(`- **WCAG ${item.wcag_criterion}** ${item.wcag_title} (Level ${item.level})`);
  lines.push(`- **Surface:** ${item.surface}`);
  lines.push(`- **Tags:** ${item.tags.map(t => `\`${t}\``).join(', ')}`);
  lines.push('');
  lines.push(item.description);
  lines.push('');
  lines.push('**How to test:**');
  for (const step of item.how_to_test) lines.push(`- ${step}`);
  lines.push('');
  lines.push('**Pass criteria:**');
  for (const c of item.pass_criteria) lines.push(`- ${c}`);
  lines.push('');
  lines.push('**Fail examples:**');
  for (const f of item.fail_examples) lines.push(`- ${f}`);
  if (item.references && item.references.length > 0) {
    lines.push('');
    lines.push('**References:**');
    for (const r of item.references) lines.push(`- [${r.label}](${r.url})`);
  }
  lines.push('');
  return lines.join('\n');
}

function renderDocument(doc) {
  const out = [];
  out.push('# a11y-design-review-checklist');
  out.push('');
  out.push(`> Generated from \`checklist.json\`. Do not edit by hand.`);
  out.push(`> Version ${doc.version} · WCAG ${doc.wcag_version} ${doc.conformance_level} · Released ${doc.released_at}`);
  out.push('');
  out.push(`Total items: ${doc.items.length}`);
  out.push('');

  for (const [key, label] of CATEGORIES) {
    const items = doc.items.filter(i => i.category === key);
    if (items.length === 0) continue;
    out.push(`## ${label}`);
    out.push('');
    items.sort((a, b) => a.id.localeCompare(b.id, 'en'));
    for (const item of items) out.push(renderItem(item));
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function main(argv) {
  const cwd = process.cwd();
  const checkMode = argv.includes('--check');
  const docPath = path.join(cwd, 'checklist.json');
  const outPath = path.join(cwd, 'checklist.md');

  const doc = JSON.parse(readFileSync(docPath, 'utf8'));
  const rendered = renderDocument(doc);

  if (checkMode) {
    let existing;
    try {
      existing = readFileSync(outPath, 'utf8');
    } catch {
      process.stderr.write('checklist.md is missing — run `npm run generate-md`.\n');
      return 1;
    }
    if (existing !== rendered) {
      process.stderr.write('checklist.md is out of sync with checklist.json — run `npm run generate-md`.\n');
      return 1;
    }
    process.stdout.write('checklist.md is in sync.\n');
    return 0;
  }

  writeFileSync(outPath, rendered);
  process.stdout.write(`Wrote ${outPath}\n`);
  return 0;
}

process.exit(main(process.argv));
