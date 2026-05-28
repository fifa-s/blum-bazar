import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export async function saveImage(file: File, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "uploads");
  const outputPath = path.join(uploadsDir, filename);

  fs.mkdirSync(uploadsDir, { recursive: true });

  return sharp(buffer)
    .resize({ width: 1280, height: 720, withoutEnlargement: true, fit: "inside" })
    .webp({ quality: 80 })
    .toFile(outputPath);
}
