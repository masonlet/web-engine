let initialized = false;
const keys = new Set<string>();
const pressedThisFrame = new Set<string>();

const onKeyDown = (e: KeyboardEvent) => {
  if (!keys.has(e.code)) pressedThisFrame.add(e.code);
  keys.add(e.code);
};
const onKeyUp = (e: KeyboardEvent) => { keys.delete(e.code); };
const onBlur = () => keys.clear();

export function initKeyboard(): () => void {
  if (initialized) throw new Error("initKeyboard: already initialized, call cleanup first");
  initialized = true;

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  return () => {
    initialized = false;
    keys.clear();
    pressedThisFrame.clear();
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
  }
}

export function isDown(code: string): boolean     { return keys.has(code); }
export function wasPressed(code: string): boolean {
  if (pressedThisFrame.has(code)) {
    pressedThisFrame.delete(code);
    return true;
  }
  return false;
}
