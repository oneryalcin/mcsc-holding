import assert from 'node:assert/strict';
import test from 'node:test';

await import('../public/admin/image-signatures.js');

const { detectImageType, validateImageBytes } = globalThis.MCSCImageSignatures;

test('accepts JPEG bytes with a JPEG extension', () => {
  const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]);
  assert.equal(detectImageType(bytes), 'jpeg');
  assert.equal(validateImageBytes('photo.jpg', bytes).valid, true);
});

test('accepts PNG bytes with a PNG extension', () => {
  const bytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(detectImageType(bytes), 'png');
  assert.equal(validateImageBytes('photo.png', bytes).valid, true);
});

test('rejects HEIC bytes hidden behind a JPEG extension', () => {
  const bytes = Uint8Array.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70,
    0x68, 0x65, 0x69, 0x63,
  ]);
  const result = validateImageBytes('photo.jpg', bytes);
  assert.equal(result.detected, 'heif');
  assert.equal(result.valid, false);
});

test('rejects a PNG filename containing JPEG bytes', () => {
  const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]);
  assert.equal(validateImageBytes('photo.png', bytes).valid, false);
});

test('rejects files uploaded with a HEIC extension', () => {
  assert.equal(validateImageBytes('photo.heic', new Uint8Array()).valid, false);
});

test('accepts AVIF without treating it as unsupported HEIC', () => {
  const bytes = Uint8Array.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70,
    0x61, 0x76, 0x69, 0x66,
  ]);
  assert.equal(detectImageType(bytes), 'avif');
  assert.equal(validateImageBytes('photo.avif', bytes).valid, true);
});
