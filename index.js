import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const checklist = JSON.parse(
  readFileSync(path.join(__dirname, 'checklist.json'), 'utf8')
);

export const schema = JSON.parse(
  readFileSync(path.join(__dirname, 'checklist.schema.json'), 'utf8')
);
