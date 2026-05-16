export function createGameCanvas(): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  destroy: () => void
} {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context not found");
  ctx.imageSmoothingEnabled = false;

  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", onResize);
  onResize();

  return {
    canvas,
    ctx,
    destroy: () => {
      window.removeEventListener("resize", onResize);
      canvas.remove();
    }
  };
}
