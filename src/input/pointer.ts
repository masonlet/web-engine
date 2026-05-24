let isPointerInitialized = false;
const down = new Set<number>();
const clicked = new Set<number>();
const released = new Set<number>();
let clickedFrame = new Set<number>();
let releasedFrame = new Set<number>();

let canvasRef: HTMLCanvasElement | null = null;
let posX = 0;
let posY = 0;

function clearDown(): void {
  down.clear();
  clicked.clear();
  released.clear();
}

const updatePos = (e: PointerEvent) => {
  if (!canvasRef) return;
  const rect = canvasRef.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
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
const onBlur = () => clearDown();
const onMenu = (e: MouseEvent) => {
  clearDown();
  e.preventDefault();
}

/** Initializes pointer input listeners and binds to the given canvas for coordinate mapping.
 * @param canvas - The canvas element used to transform pointer coordinates.
 * @returns A cleanup function that removes all listeners and clears state.
 * @throws {Error} If already initialized.
 */
export function initPointer(canvas: HTMLCanvasElement): () => void {
  if (isPointerInitialized) throw new Error("initPointer: already initialized, call cleanup first");
  isPointerInitialized = true;

  canvasRef = canvas;

  window.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("blur", onBlur);
  window.addEventListener("contextmenu", onMenu);

  return () => {
    isPointerInitialized = false;
    canvasRef = null;
    clearDown();
    flushPointer();
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("contextmenu", onMenu);
  };
}

/** Returns `true` if the given pointer button is currently held down.
 * @param button - Pointer button index. Default: `0` (primary).
 */
export function isPointerDown(button = 0): boolean      { return down.has(button); }

/** Returns `true` if the given button was clicked this frame.
 * @param button - Pointer button index. Default: `0` (primary).
 */
export function wasPointerClicked(button = 0): boolean  { return clickedFrame.has(button); }

/** Returns `true` if the given button was released this frame.
 * @param button - Pointer button index. Default: `0` (primary).
 */
export function wasPointerReleased(button = 0): boolean { return releasedFrame.has(button); }

/** Returns the pointer's current X position in canvas pixel coordinates. */
export function pointerX(): number { return posX; }

/** Returns the pointer's current Y position in canvas pixel coordinates. */
export function pointerY(): number { return posY; }

/** Advances the per-frame click and release state. Called once per frame by {@link startLoop}. */
export function clearFramePointer(): void {
  clickedFrame = new Set(clicked);
  releasedFrame = new Set(released);
  clicked.clear();
  released.clear();
}

/** Clears the per-frame click and release state immediately. */
export function flushPointer(): void {
  clickedFrame.clear();
  releasedFrame.clear();
}
