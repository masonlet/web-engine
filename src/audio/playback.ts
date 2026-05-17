import { ctx, gain, sounds } from "./state.ts";

export function playSound(key: string, opts: { loop?: boolean } = {}): void {
  if (!ctx || !gain) throw new Error("audio: initAudio() not called");

  const sound = sounds.get(key);
  if (!sound) throw new Error(`audio: unknown key "${key}"`);

  const src = ctx.createBufferSource();
  src.buffer = sound.buffer;
  src.loop = opts.loop ?? false;
  src.connect(gain);

  sound.instances.add(src);
  src.onended = () => sound.instances.delete(src);
  src.start();
}

export function stopSound(key: string): void {
  const sound = sounds.get(key);
  if (!sound) return;

  for (const src of sound.instances) {
    try {
      src.stop();
    } catch (e) {
      if (!(e instanceof DOMException) || e.name !== "InvalidStateError") throw e;
    }
  }
  sound.instances.clear();
}
