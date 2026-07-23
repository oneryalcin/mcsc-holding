(function registerImageSignatures(root) {
  const HEIF_BRANDS = new Set([
    'heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1',
  ]);
  const AVIF_BRANDS = new Set(['avif', 'avis']);

  function hasBytes(bytes, offset, expected) {
    return expected.every((value, index) => bytes[offset + index] === value);
  }

  function ascii(bytes, offset, length) {
    return String.fromCharCode(...bytes.slice(offset, offset + length));
  }

  function detectImageType(input) {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);

    if (bytes.length >= 3 && hasBytes(bytes, 0, [0xff, 0xd8, 0xff])) {
      return 'jpeg';
    }

    if (
      bytes.length >= 8 &&
      hasBytes(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    ) {
      return 'png';
    }

    if (bytes.length >= 12 && ascii(bytes, 4, 4) === 'ftyp') {
      const brand = ascii(bytes, 8, 4);
      if (AVIF_BRANDS.has(brand)) {
        return 'avif';
      }
      if (HEIF_BRANDS.has(brand)) {
        return 'heif';
      }
    }

    return 'unknown';
  }

  function validateImageBytes(filename, input) {
    const extension = filename.split('.').pop()?.toLowerCase() ?? '';
    const detected = detectImageType(input);

    if (extension === 'heic' || extension === 'heif' || detected === 'heif') {
      return {
        valid: false,
        detected,
        message: `${filename} is a HEIC/HEIF image. Export it as JPEG or PNG before uploading.`,
      };
    }

    if ((extension === 'jpg' || extension === 'jpeg') && detected !== 'jpeg') {
      return {
        valid: false,
        detected,
        message: `${filename} has a JPEG filename but its file bytes are not JPEG. Export it as JPEG before uploading.`,
      };
    }

    if (extension === 'png' && detected !== 'png') {
      return {
        valid: false,
        detected,
        message: `${filename} has a PNG filename but its file bytes are not PNG. Export it as PNG before uploading.`,
      };
    }

    if (extension === 'avif' && detected !== 'avif') {
      return {
        valid: false,
        detected,
        message: `${filename} has an AVIF filename but its file bytes are not AVIF. Export it as AVIF before uploading.`,
      };
    }

    return { valid: true, detected, message: '' };
  }

  root.MCSCImageSignatures = { detectImageType, validateImageBytes };
})(typeof window === 'undefined' ? globalThis : window);
