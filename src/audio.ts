export type Sound = { buffer: AudioBuffer; instances: Set<AudioBufferSourceNode> };

export class Audio {
  private ctx:          AudioContext | null = null;
  private gain:         GainNode     | null = null;
  private sounds:       Map<string, Sound>  = new Map();

  private _initialized: boolean = false;
  private _volume:      number  = 1;
  private _muted:       boolean = false;

  get initialized(): boolean { return this._initialized; }
  get volume():      number  { return this._volume; }
  get muted():       boolean { return this._muted; }
  get state():       AudioContextState {
    if (!this.ctx) throw new Error("AudioSystem: not initialized");
    return this.ctx.state;
  }

  init(): () => void {
    if (this._initialized) throw new Error("AudioSystem: already initialized");

    this.ctx  = new AudioContext();
    this.gain = this.ctx.createGain();
    this.gain.connect(this.ctx.destination);
    this._initialized = true;

    const unlock = () => {
      if (this.ctx?.state === "suspended") this.ctx.resume();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      for (const key of this.sounds.keys()) this.stopSound(key);
      this.sounds.clear();
      this.ctx?.close();
      this.ctx          = null;
      this.gain         = null;
      this._muted       = false;
      this._initialized = false;
    };
  }

  resume(): Promise<void> {
    if (!this.ctx) throw new Error("AudioSystem: not initialized");
    return this.ctx.resume();
  }

  setVolume(value: number): void {
    if (!this.gain) throw new Error("AudioSystem: not initialized");
    this._volume = Math.max(0, Math.min(1, value));
    if (!this._muted) this.gain.gain.value = this._volume;
  }

  setMuted(value: boolean): void {
    if (!this.gain) throw new Error("AudioSystem: not initialized");
    this._muted = value;
    this.gain.gain.value = value ? 0 : this._volume;
  }

  async registerSound(key: string, path: string, baseUrl = "/"): Promise<void> {
    if (!this.ctx) throw new Error("AudioSystem: not initialized");
    if (this.sounds.has(key)) throw new Error(`AudioSystem: key "${key}" already registered`);

    const url = new URL(path, new URL(baseUrl, location.href).href).toString();
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`AudioSystem: failed to load "${key}" (${res.status} ${res.statusText})`);

    const buffer = await this.ctx.decodeAudioData(await res.arrayBuffer());
    this.sounds.set(key, { buffer, instances: new Set() });
  }

  playSound(key: string, opts: { loop?: boolean } = {}): void {
    if (!this.ctx || !this.gain) throw new Error("AudioSystem: not initialized");
    const sound = this.sounds.get(key);
    if (!sound) throw new Error(`AudioSystem: unknown key "${key}"`);

    const src = this.ctx.createBufferSource();
    src.buffer = sound.buffer;
    src.loop   = opts.loop ?? false;
    src.connect(this.gain);
    sound.instances.add(src);
    src.onended = () => sound.instances.delete(src);
    src.start();
  }

  stopSound(key: string): void {
    const sound = this.sounds.get(key);
    if (!sound) return;
    for (const src of sound.instances) {
      try { src.stop(); }
      catch (e) {
        if (!(e instanceof DOMException) || e.name !== "InvalidStateError") throw e;
      }
    }
    sound.instances.clear();
  }
}
