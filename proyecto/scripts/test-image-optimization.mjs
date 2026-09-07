import sharp from "sharp";

const original = await sharp({
  create: { width: 3000, height: 2000, channels: 3, background: { r: 192, g: 181, b: 162 } },
}).jpeg({ quality: 95 }).toBuffer();

const optimized = await sharp(original, { failOn: "none", limitInputPixels: 40_000_000 })
  .rotate()
  .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
  .webp({ quality: 86, effort: 5, smartSubsample: true })
  .toBuffer();

const metadata = await sharp(optimized).metadata();
if (metadata.format !== "webp" || (metadata.width ?? 9999) > 2048 || (metadata.height ?? 9999) > 2048) {
  throw new Error(`Unexpected optimized image result: ${JSON.stringify(metadata)}`);
}
console.log(JSON.stringify({ originalBytes: original.length, optimizedBytes: optimized.length, format: metadata.format, width: metadata.width, height: metadata.height }));
