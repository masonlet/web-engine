let isKeyboardInitialized = false;
const keys = new Set<string>();
const pressedThisFrame = new Set<string>();
let pressedFrame = new Set<string>();

const onKeyDown = (e: KeyboardEvent) => {
  if (!keys.has(e.code)) pressedThisFrame.add(e.code);
  keys.add(e.code);
};
const onKeyUp = (e: KeyboardEvent) => { keys.delete(e.code); };
const onBlur = () => { keys.clear(); pressedThisFrame.clear(); };

/** Initializes keyboard input listeners.
 * @returns A cleanup function that removes all listeners and clears state.
 * @throws {Error} If already initialized.
 */
export function initKeyboard(): () => void {
  if (isKeyboardInitialized) throw new Error("initKeyboard: already initialized, call cleanup first");
  isKeyboardInitialized = true;

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  return () => {
    isKeyboardInitialized = false;
    keys.clear();
    pressedThisFrame.clear();
    flushKeyboard();
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
  }
}

/** Returns `true` if the key is currently held down.
 * @param code - A `KeyboardEvent.code` value (e.g. `"KeyA"`, `"Space"`, `"Digit1"`).
 */
export function isDown(code: string): boolean     { return keys.has(code); }

/** Returns `true` if the key was pressed this frame.
 * @param code - A `KeyboardEvent.code` value (e.g. `"KeyA"`, `"Space"`).
 */
export function wasPressed(code: string): boolean { return pressedFrame.has(code); }

/** Advances the per-frame pressed state. Called once per frame by {@link startLoop}. */
export function clearFrameKeyboard(): void {
  pressedFrame = new Set(pressedThisFrame);
  pressedThisFrame.clear();
}

/** Clears the per-frame pressed state immediately. */
export function flushKeyboard(): void {
  pressedFrame.clear();
}
