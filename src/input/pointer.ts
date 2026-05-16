const down = new Set<number>();
const clicked = new Set<number>();
const released = new Set<number>();

let canvasRef: HTMLCanvasElement | null = null;
let posX = 0;
let posY = 0;

const updatePos = (e: PointerEvent) => {
  if (!canvasRef) return;
  const rect = canvasRef.getBoundingClientRect();
  const scaleX = canvasRef.width / rect.width;
  const scaleY = canvasRef.height / rect.height;
  posX = (e.clientX - rect.left) * scaleX;
  posY = (e.clientY - rect.top) * scaleY;
};

const onDown = (e: PointerEvent) => {
  updatePos(e);
  if (!down.has(e.button)) clicked.add(e.button);
  down.add(e.button);
};
const onUp = (e: PointerEvent) => {
  updatePos(e);
  down.delete(e.button);
  released.add(e.button);
};
const onMove = (e: PointerEvent) => updatePos(e);
const onBlur = () => down.clear();

export function initPointer(canvas: HTMLCanvasElement): () => void {
  canvasRef = canvas;

  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("blur", onBlur);

  return () => {
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("blur", onBlur);
  };
}

export function isPointerDown(button = 0): boolean      { return down.has(button); }
export function wasPointerClicked(button = 0): boolean  { return clicked.has(button); }
export function wasPointerReleased(button = 0): boolean { return released.has(button); }
export function pointerX(): number { return posX; }
export function pointerY(): number { return posY; }

export function clearFramePointer(): void {
  clicked.clear();
  released.clear();
}
