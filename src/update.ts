import { clearFramePointer } from "./input/pointer.ts";
import { clearFrameKeyboard } from "./input/keyboard.ts";

interface LoopOptions {
  tickRate?: number | "variable";
  maxDelta?: number;
}

export function startLoop(
  update: (dt: number) => void,
  render: () => void,
  { tickRate = 1/60, maxDelta = 0.25 }: LoopOptions = {},
): { stop: () => void } {
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
  let lastTime = performance.now() / 1000;

  function frame(nowMs: number) {
    clearFrameKeyboard();
    clearFramePointer();

    const now = nowMs / 1000;
    const elapsed = Math.min(now - lastTime, maxDelta);
    lastTime = now;

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

  return { stop: () => {
    if (reqId !== null) {
      cancelAnimationFrame(reqId);
      reqId = null;
    }
  } };
}
