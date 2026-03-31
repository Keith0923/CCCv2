import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve(process.cwd(), 'dist-electron');
await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, 'package.json'), '{\n  "type": "commonjs"\n}\n', 'utf8');
console.log('wrote dist-electron/package.json with type=commonjs');
