(function registerMediaValidation() {
  const validatedInputs = new WeakSet();

  async function validateSelection(input) {
    const files = Array.from(input.files ?? []);

    for (const file of files) {
      const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
      const result = window.MCSCImageSignatures.validateImageBytes(file.name, bytes);

      if (!result.valid) {
        return result.message;
      }
    }

    return '';
  }

  document.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'file' || !input.files?.length) {
      return;
    }

    if (validatedInputs.has(input)) {
      validatedInputs.delete(input);
      return;
    }

    event.stopImmediatePropagation();

    validateSelection(input).then((error) => {
      if (error) {
        input.value = '';
        window.alert(`Upload blocked\n\n${error}`);
        return;
      }

      validatedInputs.add(input);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }, true);
})();
