export interface CanvasOptions {
  imageSmoothing?: boolean;
}

/** Creates a full-window canvas and appends it to `document.body`.
 *
 * The canvas is automatically resized to fill the window on creation,
 * and on every subsequent `resize` event.
 *
 * Pixel-art rendering is (temporarily) enabled by default (`imageSmoothingEnabled = false`).
 *
 * @returns The canvas element, its 2D context, and a `destroy` function
 * to remove the canvas and clean up the resize listener.
 *
 * @throws {Error} If a 2D canvas context cannot be obtained.
 */
export function createGameCanvas({ imageSmoothing = true }: CanvasOptions = {}): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** Removes the canvas from the DOM and cleans up the resize listener. */
  destroy: () => void
} {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context not found");
  ctx.imageSmoothingEnabled = imageSmoothing;

  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", onResize);
  onResize();

  let destroyed = false;
  return {
    canvas,
    ctx,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener("resize", onResize);
      canvas.remove();
    }
  };
}
