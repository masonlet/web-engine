import { gain, volume, muted, setState } from "./state.ts";

export function setVolume(value: number): void {
  if (!gain) throw new Error("audio: initAudio() not called");
  const v = Math.max(0, Math.min(1, value));
  setState({ volume: v });
  if (!muted) gain.gain.value = v;
}

export function getVolume(): number { return volume; }

export function setMuted(value: boolean): void {
  if (!gain) throw new Error("audio: initAudio() not called");
  gain.gain.value = value ? 0 : volume;
  setState({muted: value})
}

export function isMuted(): boolean {
  return muted;
}
