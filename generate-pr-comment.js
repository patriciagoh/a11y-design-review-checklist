#!/usr/bin/env node
/**
 * Generate a GitHub PR comment (markdown) from an audit report JSON.
 *
 * Usage:
 *   node generate-pr-comment.js --report audit-report.json \
 *                               --component "FeedbackPanel" \
 *                               --surface "Annotation pins & markups"
 *
 * Pipe into the GitHub CLI:
 *   node generate-pr-comment.js ... | gh pr comment <PR> --body-file -
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_URL = 'https://github.com/patriciagoh/a11y-design-review-checklist';

function parseArgs(argv) {
  const args = { report: null, component: null, surface: null };
  for (let i = 2; i < argv.length; i++) {
    const flag = argv[i];
    const val = argv[i + 1];
    if (flag === '--report') { args.report = val; i++; }
    else if (flag === '--component') { args.component = val; i++; }
    else if (flag === '--surface') { args.surface = val; i++; }
    else if (flag === '--help' || flag === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return args;
}

function printHelp() {
  process.stdout.write(`Usage: node generate-pr-comment.js --report <path> --component <name> --surface <surface>

Generates a GitHub PR comment in Markdown from an audit report JSON.

Required flags:
  --report <path>          Path to the audit report JSON (from the web UI or the audit skill)
  --component <name>       Component name (e.g. "FeedbackPanel")
  --surface <surface>      Primary CoLab surface (e.g. "Annotation pins & markups")

Output is written to stdout.
`);
}

function loadJSON(p) {
  return JSON.parse(readFileSync(path.resolve(p), 'utf8'));
}

function findUnderstandingURL(item) {
  // Prefer a reference URL if it points to W3C Understanding docs
  if (Array.isArray(item.references)) {
    const w3c = item.references.find(r => /WAI\/WCAG\d+\/Understanding\//.test(r.url));
    if (w3c) return w3c.url;
  }
  // Otherwise construct from criterion (best-effort generic Understanding root)
  return `https://www.w3.org/WAI/WCAG22/Understanding/`;
}

function renderSummaryTable({ component, surface, date, pass, fail, na, needs, coveragePct, scoped }) {
  return [
    '| | |',
    '|---|---|',
    `| **Component** | \`${component}\` |`,
    `| **Surface** | ${surface} |`,
    `| **Audit date** | ${date} |`,
    `| **Scope** | ${scoped} items |`,
    `| **Pass** | ${pass} |`,
    `| **Fail** | ${fail} |`,
    `| **N/A** | ${na} |`,
    `| **Needs investigation** | ${needs} |`,
    `| **Coverage** | ${coveragePct}% |`,
  ].join('\n');
}

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
    // Strip backticks — a file:line value should never contain them, and they
    // would break the inline code span (GFM doesn't honor backslash escapes there).
    const loc = escape(String(result.location).trim()).replace(/`/g, '');
    lines.push(`- **Location:** \`${loc}\``);
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

function renderSurfaceContext(failedResults, itemsById) {
  const counts = {};
  for (const r of failedResults) {
    const item = itemsById[r.id];
    if (!item) continue;
    counts[item.surface] = (counts[item.surface] || 0) + 1;
  }
  const rows = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([surface, n]) => `- **${n}** in ${surface}`);
  return rows.length > 0 ? rows.join('\n') : '_No failures._';
}

function escape(s) {
  return String(s).replace(/[<>]/g, c => c === '<' ? '&lt;' : '&gt;');
}

function slugifyHeader(title) {
  // GitHub anchor convention for h3 in checklist.md
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function main(argv) {
  const args = parseArgs(argv);

  if (!args.report || !args.component || !args.surface) {
    process.stderr.write('Error: --report, --component, and --surface are all required.\n\n');
    printHelp();
    return 1;
  }

  let report;
  try {
    report = loadJSON(args.report);
  } catch (err) {
    process.stderr.write(`Error reading report at ${args.report}: ${err.message}\n`);
    return 1;
  }

  // Load checklist.json (sibling of this script) to look up item details
  let checklist;
  try {
    checklist = loadJSON(path.join(__dirname, 'checklist.json'));
  } catch (err) {
    process.stderr.write(`Error reading checklist.json: ${err.message}\n`);
    return 1;
  }

  const itemsById = Object.fromEntries(checklist.items.map(i => [i.id, i]));

  const results = report.results || [];
  const failed = results.filter(r => r.status === 'fail');
  const investigation = results.filter(r => r.status === 'needs_investigation' || r.status === 'needs-investigation');

  const summary = report.summary || {};
  const pass = summary.pass ?? results.filter(r => r.status === 'pass').length;
  const fail = summary.fail ?? failed.length;
  const na = summary.na ?? results.filter(r => r.status === 'na').length;
  const needs = summary.needs_investigation ?? investigation.length;
  const scoped = summary.scoped ?? results.length;
  const markedTotal = pass + fail + na + needs;
  const coveragePct = scoped > 0 ? Math.round((markedTotal / scoped) * 100) : 0;

  const auditDate = report.meta?.date ?? new Date().toISOString().slice(0, 10);

  // Build the output
  const out = [];
  const verdict = fail > 0
    ? `⚠️ **${fail} accessibility issue${fail === 1 ? '' : 's'}** to address before merge`
    : (needs > 0
        ? `🔎 **${needs} item${needs === 1 ? '' : 's'} need${needs === 1 ? 's' : ''} investigation**`
        : `✅ **Accessibility audit clean** for this scope`);

  out.push(`### ♿ Accessibility audit — \`${args.component}\``);
  out.push('');
  out.push(verdict);
  out.push('');
  out.push(renderSummaryTable({
    component: args.component,
    surface: args.surface,
    date: auditDate,
    pass, fail, na, needs, scoped, coveragePct,
  }));
  out.push('');

  // Surface context
  if (fail > 0) {
    out.push('#### Where failures landed');
    out.push('');
    out.push(renderSurfaceContext(failed, itemsById));
    out.push('');
  }

  // Failed items
  if (fail > 0) {
    out.push(`#### ❌ Failed items (${fail})`);
    out.push('');
    for (const r of failed) {
      const item = itemsById[r.id];
      if (!item) {
        out.push(`<details><summary><code>${r.id}</code> — _(item not found in checklist)_</summary></details>`);
        out.push('');
        continue;
      }
      out.push(renderItemBlock(r, item, REPO_URL));
    }
  }

  // Investigation items
  if (needs > 0) {
    out.push(`#### 🔎 Needs investigation (${needs})`);
    out.push('');
    for (const r of investigation) {
      const item = itemsById[r.id];
      if (!item) {
        out.push(`<details><summary><code>${r.id}</code> — _(item not found in checklist)_</summary></details>`);
        out.push('');
        continue;
      }
      out.push(renderItemBlock(r, item, REPO_URL));
    }
  }

  // Footer
  out.push('---');
  out.push('');
  out.push(`<sub>Generated from [a11y-design-review-checklist](${REPO_URL}) v${checklist.version} · audit mode: \`${report.meta?.mode ?? 'unknown'}\` · auditor: \`${report.meta?.auditor ?? 'unknown'}\`</sub>`);

  process.stdout.write(out.join('\n') + '\n');
  return 0;
}

process.exit(main(process.argv));
