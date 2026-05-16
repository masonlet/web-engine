import type { Sound } from "./types";

export let ctx: AudioContext | null = null;
export let gain: GainNode | null = null;
export let volume: number = 1;
export let muted = false;
export let initialized = false;
export const sounds = new Map<string, Sound>();

export function setState(state: {
  ctx?: AudioContext | null;
  gain?: GainNode | null;
  volume?: number;
  muted?: boolean;
  initialized?: boolean;
}): void {
  if ("ctx" in state) ctx = state.ctx!;
  if ("gain" in state) gain = state.gain!;
  if ("volume" in state) volume = state.volume!;
  if ("muted" in state) muted = state.muted!;
  if ("initialized" in state) initialized = state.initialized!;
}
