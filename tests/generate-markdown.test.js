import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = path.join(root, 'scripts/generate-markdown.js');

function runIn(cwd, args = []) {
  return spawnSync('node', [script, ...args], { encoding: 'utf8', cwd });
}

function tempProject() {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'a11y-gen-'));
  copyFileSync(path.join(root, 'tests/fixtures/minimal-valid.json'), path.join(dir, 'checklist.json'));
  return dir;
}

test('generates checklist.md from checklist.json', () => {
  const dir = tempProject();
  const result = runIn(dir);
  assert.equal(result.status, 0, result.stderr);
  const md = readFileSync(path.join(dir, 'checklist.md'), 'utf8');
  assert.match(md, /# a11y-design-review-checklist/);
  assert.match(md, /1\.1\.1/);
  assert.match(md, /Placeholder/);
});
