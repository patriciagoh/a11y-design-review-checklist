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
