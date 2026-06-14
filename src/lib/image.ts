// Ridimensiona e comprime una foto in un data URL JPEG, lato browser,
// per ridurre il payload inviato al modello.
export async function fileADataUrl(
  file: File,
  maxLato = 1280,
  qualita = 0.82,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > maxLato || height > maxLato) {
    const scala = maxLato / Math.max(width, height);
    width = Math.round(width * scala);
    height = Math.round(height * scala);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non disponibile");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", qualita);
}
