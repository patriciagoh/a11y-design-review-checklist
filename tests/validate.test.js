import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const validateBin = path.join(root, 'validate.js');

function run(args = []) {
  return spawnSync('node', [validateBin, ...args], { encoding: 'utf8', cwd: root });
}

test('exits 0 on a valid checklist file', () => {
  const result = run(['tests/fixtures/minimal-valid.json']);
  assert.equal(result.status, 0, result.stderr);
});

test('exits 1 on a schema-invalid file', () => {
  const result = run(['tests/fixtures/bad-level.json']);
  assert.equal(result.status, 1);
  assert.match(result.stderr + result.stdout, /level/);
});
