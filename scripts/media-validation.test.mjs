import assert from 'node:assert/strict';
import test from 'node:test';

await import('../public/admin/image-signatures.js');

let changeHandler;
const alerts = [];

class MockFileInput {
  constructor(filename, bytes) {
    this.type = 'file';
    this.value = filename;
    this.dispatchCount = 0;
    this.files = [{
      name: filename,
      slice: () => ({ arrayBuffer: async () => Uint8Array.from(bytes).buffer }),
    }];
  }

  dispatchEvent() {
    this.dispatchCount += 1;
    changeHandler({ target: this, stopImmediatePropagation() {} });
    return true;
  }
}

globalThis.HTMLInputElement = MockFileInput;
globalThis.window = {
  MCSCImageSignatures: globalThis.MCSCImageSignatures,
  alert: (message) => alerts.push(message),
};
globalThis.document = {
  addEventListener: (type, handler, capture) => {
    assert.equal(type, 'change');
    assert.equal(capture, true);
    changeHandler = handler;
  },
};

await import('../public/admin/media-validation.js');

const settleValidation = () => new Promise((resolve) => setImmediate(resolve));

test('blocks and clears a mislabeled HEIC upload', async () => {
  const bytes = [
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70,
    0x68, 0x65, 0x69, 0x63,
  ];
  const input = new MockFileInput('photo.jpg', bytes);
  let stopped = false;

  changeHandler({
    target: input,
    stopImmediatePropagation: () => { stopped = true; },
  });
  await settleValidation();

  assert.equal(stopped, true);
  assert.equal(input.value, '');
  assert.equal(input.dispatchCount, 0);
  assert.match(alerts.at(-1), /Upload blocked/);
});

test('passes a genuine JPEG selection on to the CMS', async () => {
  const input = new MockFileInput('photo.jpg', [0xff, 0xd8, 0xff, 0xe0]);

  changeHandler({ target: input, stopImmediatePropagation() {} });
  await settleValidation();

  assert.equal(input.value, 'photo.jpg');
  assert.equal(input.dispatchCount, 1);
});
