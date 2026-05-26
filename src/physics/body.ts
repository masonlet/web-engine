import type { RectBody, OBB, AABB } from "./types.ts";

/** Creates a {@link PhysicsBody} with zero initial velocity.
 * @param params.angle - Initial angle in radians. Default: `0`.
 */
export function createBody(params: {
  x: number;
  y: number;
  w: number;
  h: number;
  mass: number;
  angle?: number;
}): RectBody {
  return {
    position: { x: params.x, y: params.y },
    velocity: { x: 0, y: 0 },
    angle: params.angle ?? 0,
    w: params.w,
    h: params.h,
    mass: params.mass,
  };
}

/** Returns the {@link AABB} for the body's current position. */
export function getBodyAABB(body: RectBody): AABB {
  return {
    cx: body.position.x + body.w / 2,
    cy: body.position.y + body.h / 2,
    hw: body.w / 2,
    hh: body.h / 2,
  };
}

/** Returns the {@link OBB} for the body's current position and angle. */
export function getBodyOBB(body: RectBody): OBB {
  return {
    cx: body.position.x + body.w / 2,
    cy: body.position.y + body.h / 2,
    hw: body.w / 2,
    hh: body.h / 2,
    angle: body.angle,
  };
}
