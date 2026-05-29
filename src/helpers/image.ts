import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export async function saveImage(file: File, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "uploads");
  const outputPath = path.join(uploadsDir, filename);

  fs.mkdirSync(uploadsDir, { recursive: true });

  try {
    return await sharp(buffer)
      .resize({ width: 1280, height: 720, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 80 })
      .toFile(outputPath);
  } catch (error) {
    // Clean up any partially written file before re-throwing
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    throw new Error(`Image processing failed: unsupported format or corrupted file. ${error}`);
  }
}
export function deleteImage(filename: string) {
  const filePath = path.join(process.cwd(), "uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
