import { ctx, sounds } from "./state";

export async function registerSound(key: string, path: string): Promise<void> {
  if (!ctx) throw new Error("audio: initAudio() not called");
  if (sounds.has(key)) throw new Error(`audio: key "${key}" is already registered`);

  const url = `${import.meta.env.BASE_URL}${path}`;
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  const buffer = await ctx.decodeAudioData(arr);

  sounds.set(key, { buffer, instances: new Set() });
}
