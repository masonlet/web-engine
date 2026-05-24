/** Loads an image from the given Path or URL.
 *
 * @param src - Path or URL of the image to load.
 * @returns A promise that resolves with the loaded {@link HTMLImageElement}.
 * @throws {Error} If the image fails to load.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Returns a new offscreen canvas with the source image tinted by the given colour.
 *  Non-transparent pixels are filled with `color`; transparency is preserved.
 *
 * @param source - The source image to tint.
 * @param color - Any valid CSS colour string.
 * @returns An offscreen {@link HTMLCanvasElement} with the tinted result.
 * @throws {Error} If a 2D context cannot be obtained.
 */
export function tintImage(
  source: HTMLImageElement,
  color: string,
): HTMLCanvasElement {
  const off = document.createElement("canvas");
  off.width = source.width;
  off.height = source.height;
  const c = off.getContext("2d");
  if (!c) throw new Error("Failed to get offscreen 2d context");

  c.drawImage(source, 0, 0);
  c.globalCompositeOperation = "source-in";
  c.fillStyle = color;
  c.fillRect(0, 0, off.width, off.height);

  return off;
}
