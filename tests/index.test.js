import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checklist, schema } from '../index.js';

test('checklist export has items array', () => {
  assert.ok(Array.isArray(checklist.items));
  assert.ok(checklist.items.length > 0);
});

test('schema export has $defs.item', () => {
  assert.ok(schema.$defs);
  assert.ok(schema.$defs.item);
});
