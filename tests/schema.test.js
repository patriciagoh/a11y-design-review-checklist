import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const schema = JSON.parse(readFileSync(new URL('../checklist.schema.json', import.meta.url)));
const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

function load(fixture) {
  return JSON.parse(readFileSync(new URL(`./fixtures/${fixture}`, import.meta.url)));
}

test('accepts a minimal valid document', () => {
  const ok = validate(load('minimal-valid.json'));
  assert.equal(ok, true, JSON.stringify(validate.errors, null, 2));
});

test('rejects a document missing required top-level fields', () => {
  const ok = validate(load('missing-version.json'));
  assert.equal(ok, false);
  const paths = (validate.errors ?? []).map(e => e.instancePath + ' ' + e.keyword);
  assert.ok(paths.some(p => p.includes('required')), 'expected a required-keyword error');
});

test('rejects item with invalid id format', () => {
  const ok = validate(load('bad-id-format.json'));
  assert.equal(ok, false);
  assert.ok(validate.errors.some(e => e.instancePath.includes('/items/0/id')));
});

test('rejects item with invalid wcag_criterion format', () => {
  const ok = validate(load('bad-criterion-format.json'));
  assert.equal(ok, false);
  assert.ok(validate.errors.some(e => e.instancePath.includes('wcag_criterion')));
});

test('rejects item with invalid level', () => {
  const ok = validate(load('bad-level.json'));
  assert.equal(ok, false);
});

test('rejects item with invalid category', () => {
  const ok = validate(load('bad-category.json'));
  assert.equal(ok, false);
});

test('rejects item with unknown tag', () => {
  const ok = validate(load('unknown-tag.json'));
  assert.equal(ok, false);
});

test('rejects item with empty tags array', () => {
  const ok = validate(load('empty-tags.json'));
  assert.equal(ok, false);
});

test('rejects item with duplicate tags', () => {
  const ok = validate(load('duplicate-tags.json'));
  assert.equal(ok, false);
});
