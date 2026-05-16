import { gain, muted, setState } from "./state.ts";

export function setMuted(value: boolean): void {
  if (!gain) throw new Error("audio: initAudio() not called");
  gain.gain.value = value ? 0 : 1;
  setState({muted: value})
}

export function isMuted(): boolean {
  return muted;
}
