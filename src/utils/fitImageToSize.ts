type ImageResult = { blob: Blob; width: number; height: number; original: boolean };

async function encodeJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob?.size || blob.type !== 'image/jpeg') throw new Error('JPEG encoding failed');
  return blob;
}

async function inputFormat(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte)) return 'image/png';
  const header = String.fromCharCode(...bytes);
  if (header.startsWith('RIFF') && header.endsWith('WEBP')) return 'image/webp';
  throw new Error('Unsupported image');
}

export async function fitImageToSize(file: File, limit: number, allowResize: boolean): Promise<ImageResult | null> {
  const mime = await inputFormat(file);
  const source = file.slice(0, file.size, mime);
  const url = URL.createObjectURL(source);
  const canvas = document.createElement('canvas');
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    let width = image.naturalWidth;
    let height = image.naturalHeight;
    if (source.size <= limit) return { blob: source, width, height, original: true };

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas unavailable');
    while (true) {
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      let low = 0.40;
      let high = 0.94;
      const bestQuality = await encodeJpeg(canvas, high);
      if (bestQuality.size <= limit) return { blob: bestQuality, width, height, original: false };
      let best = await encodeJpeg(canvas, low);
      if (best.size <= limit) {
        for (let i = 0; i < 6; i++) {
          const quality = (low + high) / 2;
          const candidate = await encodeJpeg(canvas, quality);
          if (candidate.size <= limit) {
            best = candidate;
            low = quality;
          } else {
            high = quality;
          }
        }
        return { blob: best, width, height, original: false };
      }
      if (!allowResize || (width === 1 && height === 1)) return null;
      const scale = Math.min(0.85, Math.sqrt(limit / best.size) * 0.95);
      width = Math.max(1, Math.floor(width * scale));
      height = Math.max(1, Math.floor(height * scale));
    }
  } finally {
    canvas.width = canvas.height = 0;
    URL.revokeObjectURL(url);
  }
}
