import { initialized, ctx, sounds, setState } from "./state.ts";
import { stopSound } from "./playback.ts";

export function initAudio(): () => void {
  if (initialized) throw new Error("initAudio: already initialized, call cleanup first");

  const newCtx = new AudioContext();
  const newGain = newCtx.createGain();
  newGain.connect(newCtx.destination);

  setState({ ctx: newCtx, gain: newGain, initialized: true });

  const unlock = () => {
    if (newCtx.state === "suspended") newCtx.resume();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };

  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);

  return () => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    for (const key of sounds.keys()) stopSound(key);
    sounds.clear();
    ctx?.close();
    setState({ ctx: null, gain: null, muted: false, initialized: false });
  };
}

export function resumeAudio(): Promise<void> {
  if (!ctx) throw new Error("audio: initAudio() not called");
  return ctx.resume();
}

export function audioState(): AudioContextState {
  if (!ctx) throw new Error("audio: initAudio() not called");
  return ctx.state;
}

export function isAudioInitialized(): boolean {
  return initialized;
}
