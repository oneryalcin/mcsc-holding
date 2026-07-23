import { open, readdir } from 'node:fs/promises';
import path from 'node:path';

await import('../public/admin/image-signatures.js');

const imageRoot = path.resolve('public/images');
const failures = [];

async function validateDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await validateDirectory(filePath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const bytes = Buffer.alloc(32);
    const handle = await open(filePath, 'r');
    try {
      await handle.read(bytes, 0, bytes.length, 0);
    } finally {
      await handle.close();
    }
    const result = globalThis.MCSCImageSignatures.validateImageBytes(
      entry.name,
      bytes,
    );

    if (!result.valid) {
      failures.push(`${path.relative(process.cwd(), filePath)}: ${result.message}`);
    }
  }
}

await validateDirectory(imageRoot);

if (failures.length > 0) {
  console.error('Image validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Image validation passed.');
}
