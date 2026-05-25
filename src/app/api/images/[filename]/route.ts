import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;

  const filePath = path.join(process.cwd(), "uploads", filename);
  if (!fs.existsSync(filePath)) {
    return new Response(JSON.stringify({ ok: false, message: "Image not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const file = await readFile(filePath);
  return new Response(file, {
    headers: { "Content-Type": "image/webp" },
  });
}
