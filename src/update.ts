import { clearFramePointer } from "./input/pointer.ts";

export function startLoop(
  update: (dt: number) => void,
  render: () => void,
  tickRate: number | "variable" = 1/60,
): void {
  let accumulator = 0;
  let lastTime = performance.now() / 1000;

  function frame(nowMs: number) {
    const now = nowMs / 1000;
    const elapsed = Math.min(now - lastTime, 0.25);
    lastTime = now;

    if (tickRate === "variable") update(elapsed);
    else {
      accumulator += elapsed;
      while(accumulator >= tickRate) {
        update(tickRate);
        accumulator -= tickRate;
      }
    }

    render();
    clearFramePointer();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
