#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadSchema() {
  return JSON.parse(readFileSync(path.join(__dirname, 'checklist.schema.json'), 'utf8'));
}

function loadDoc(filePath) {
  return JSON.parse(readFileSync(path.resolve(filePath), 'utf8'));
}

function formatErrors(errors) {
  return errors.map(e => {
    const where = e.instancePath || '<root>';
    return `  ${where} ${e.keyword}: ${e.message}`;
  }).join('\n');
}

function main(argv) {
  const target = argv[2] ?? path.join(__dirname, 'checklist.json');

  const schema = loadSchema();
  const ajv = new Ajv({ strict: true, allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  let doc;
  try {
    doc = loadDoc(target);
  } catch (err) {
    process.stderr.write(`Could not read ${target}: ${err.message}\n`);
    return 1;
  }

  if (!validate(doc)) {
    process.stderr.write(`Schema validation failed for ${target}:\n`);
    process.stderr.write(formatErrors(validate.errors) + '\n');
    return 1;
  }

  const semanticErrors = [];

  const seen = new Map();
  for (let i = 0; i < doc.items.length; i++) {
    const item = doc.items[i];
    if (seen.has(item.id)) {
      semanticErrors.push(`Duplicate id "${item.id}" at items[${i}] (first seen at items[${seen.get(item.id)}])`);
    } else {
      seen.set(item.id, i);
    }
  }

  if (semanticErrors.length > 0) {
    process.stderr.write(`Semantic validation failed for ${target}:\n`);
    for (const err of semanticErrors) process.stderr.write(`  ${err}\n`);
    return 1;
  }

  process.stdout.write(`OK — ${target} (${doc.items.length} items)\n`);
  return 0;
}

process.exit(main(process.argv));
