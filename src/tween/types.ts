import { type EasingName } from "./easing.ts";

/** An object whose properties can be animated by the tween system. */
export type TweenTarget = {
  alpha?: number;
  y?: number;
};
/** A single target, or an array of targets to animate in parallel. */
export type TweenTargets = TweenTarget | readonly TweenTarget[];

/** A target value: number (tweens from current) or explicit from/to. */
export type TweenPropValue = number | { from: number; to: number };

/** Map of supported property names to target values. */
export type TweenProps = Partial<Record<keyof TweenTarget, TweenPropValue>>;

export interface TweenConfig {
  /** Target or array of targets whose properties will be animated. */
  targets: TweenTargets;
  /** Map of supported property names to target values. */
  props: TweenProps;

  /** Duration of one pass in milliseconds. */
  duration: number;
  /** Delay before starting in milliseconds. Default: 0. */
  delay?: number;

  /** Easing function. Default: 'linear'. */
  ease?: EasingName;
  /** Reverse the animation at the end of each pass. Default: false. */
  yoyo?: boolean;
  /**
   * Additional repeat count after the first play. 0 = play once, -1 = infinite.
   * With yoyo, each forward+backward pair counts as one repeat.
   * Default: 0.
   */
  repeat?: number;

  /** Called once when the tween starts (after any delay). */
  onStart?: () => void;
  /** Called every frame with the eased progress value (0–1). */
  onUpdate?: (progress: number) => void;
  /** Called each time a yoyo reverses direction (forward → backward). */
  onYoyo?: () => void;
  /** Called at the start of each new repeat cycle (backward → forward). */
  onRepeat?: () => void;
  /** Called when the tween fully completes. Not called for infinite repeats. */
  onComplete?: () => void;
}

export interface TweenHandle {
  /** Immediately stop and remove the tween. */
  stop(): void;
  /** Pause without removing. */
  pause(): void;
  /** Resume a paused tween. */
  resume(): void;
  readonly isPlaying: boolean;
}
