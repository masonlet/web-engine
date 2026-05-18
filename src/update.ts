import { clearFramePointer } from "./input/pointer.ts";
import { clearFrameKeyboard } from "./input/keyboard.ts";

interface LoopOptions {
  tickRate?: number | "variable";
  maxDelta?: number;
}

export interface LoopHandle {
  stop():   void;
  pause():  void;
  resume(): void;
}

export function startLoop(
  update: (dt: number) => void,
  render: () => void,
  { tickRate = 1000/60, maxDelta = 250 }: LoopOptions = {},
): LoopHandle {
  if (typeof tickRate === "number" && (!Number.isFinite(tickRate) || tickRate <= 0)) {
    throw new RangeError(
      `startLoop: tickRate must be "variable" or a positive finite number, got ${tickRate}`
    )
  }

  if (!Number.isFinite(maxDelta) || maxDelta <= 0) {
    throw new RangeError(
      `startLoop: maxDelta must be a positive finite number, got ${maxDelta}`
    )
  }

  let reqId: number | null = null;
  let accumulator = 0;
  let lastTime    = performance.now();
  let paused      = false;

  function frame(nowMs: number) {
    if (paused) {
      lastTime = nowMs;
      reqId = requestAnimationFrame(frame);
      return;
    }

    clearFrameKeyboard();
    clearFramePointer();

    const elapsed = Math.min(nowMs - lastTime, maxDelta);
    lastTime = nowMs;

    if (tickRate === "variable") update(elapsed);
    else {
      accumulator += elapsed;
      while (accumulator >= tickRate) {
        update(tickRate);
        accumulator -= tickRate;
      }
    }

    render();
    reqId = requestAnimationFrame(frame);
  }
  reqId = requestAnimationFrame(frame);

  return {
    stop:   () => { if (reqId !== null) { cancelAnimationFrame(reqId); reqId = null; } },
    pause:  () => { paused = true; },
    resume: () => { paused = false; },
  };
}
