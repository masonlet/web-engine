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
    pressedFrame.clear();
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
  }
}

export function isDown(code: string): boolean     { return keys.has(code); }
export function wasPressed(code: string): boolean { return pressedFrame.has(code); }

export function clearFrameKeyboard(): void {
  pressedFrame = new Set(pressedThisFrame);
  pressedThisFrame.clear();
}
