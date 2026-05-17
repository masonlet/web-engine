import { ctx, sounds } from "./state";

export async function registerSound(
  key: string, path: string, baseUrl = "/"
): Promise<void> {
  if (!ctx) throw new Error("audio: initAudio() not called");
  if (sounds.has(key)) throw new Error(`audio: key "${key}" is already registered`);

  const url = `${baseUrl}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(
    `audio: failed to load "${key}" from "${path}" (${res.status} ${res.statusText})`
  );

  const arr = await res.arrayBuffer();
  const buffer = await ctx.decodeAudioData(arr);

  sounds.set(key, { buffer, instances: new Set() });
}
