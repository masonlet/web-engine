import { initialized, ctx, sounds, setState } from "./state";
import { stopSound } from "./playback";

export function initAudio(): () => void {
  if (initialized) throw new Error("initAudio: already initialized, call cleanup first");

  const newCtx = new AudioContext();
  const newGain = newCtx.createGain();
  newGain.connect(newCtx.destination);

  setState({ ctx: newCtx, gain: newGain, initialized: true });

  return () => {
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
