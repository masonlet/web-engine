import type { Sound } from "./types";

export let   ctx:         AudioContext | null = null;
export let   gain:        GainNode     | null = null;

export const sounds:      Map<string, Sound> = new Map();

export let   volume:      number  = 1;
export let   muted:       boolean = false;
export let   initialized: boolean = false;

export function setState(state: {
  ctx?:         AudioContext | null;
  gain?:        GainNode | null;
  volume?:      number;
  muted?:       boolean;
  initialized?: boolean;
}): void {
  if ("ctx"         in state) ctx         = state.ctx         ?? null;
  if ("gain"        in state) gain        = state.gain        ?? null;
  if ("volume"      in state) volume      = state.volume      ?? 1;
  if ("muted"       in state) muted       = state.muted       ?? false;
  if ("initialized" in state) initialized = state.initialized ?? false;
}
