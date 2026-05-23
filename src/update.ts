import { clearFramePointer  } from "./input/pointer.ts";
import { clearFrameKeyboard } from "./input/keyboard.ts";

/** Options for configuring the game loop. */
interface LoopOptions {
  /**
   * Fixed timestep in **ms**, or "variable" for frame-rate dependent updates.
   * @default 1000/60
   */
  tickRate: number | "variable";
  /**
   * Maximum elapsed time per frame in **ms**.
   * @default 250
   */
  maxDelta: number;
}

/** Handle returned by {@link startLoop} to control the running game loop. */
export interface LoopHandle {
  /** Permanently stops the loop and cancels the animation frame. */
  stop():   void;
  /** Pauses update and render calls without cancelling the animation frame. */
  pause():  void;
  /** Resumes a paused loop. */
  resume(): void;
}

/** Starts a game loop using `requestAnimationFrame`.
 *
 * When `tickRate` is a number, uses a fixed timestep accumulator
 * so `update` is always called with a consistent delta.
 * When `"variable"`, `update` receives the raw frame delta.
 *
 * @param update - Called each tick with the delta time in **ms**.
 * @param render - Called once per frame after all update ticks.
 * @param options - Loop configuration. See {@link LoopOptions}.
 * @returns A {@link LoopHandle} to stop, pause, or resume the loop.
 *
 * @throws {RangeError} If `tickRate` is not `"variable"` or a positive finite number.
 * @throws {RangeError} If `maxDelta` is not a positive finite number.
 */
export function startLoop(
  update: (/** **Milliseconds** */ dt: number) => void,
  render: () => void,
  options: LoopOptions,
): LoopHandle {
  const { tickRate, maxDelta } = options;
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
