import type { PhysicsBody, OBB, AABB } from "./types.ts";

export function createBody(params: {
  x: number;
  y: number;
  w: number;
  h: number;
  mass: number;
  angle?: number;
}): PhysicsBody {
  return {
    position: { x: params.x, y: params.y },
    velocity: { x: 0, y: 0 },
    angle: params.angle ?? 0,
    w: params.w,
    h: params.h,
    mass: params.mass,
  };
}

export function getBodyAABB(body: PhysicsBody): AABB {
  return {
    x: body.position.x,
    y: body.position.y,
    w: body.w,
    h: body.h,
  };
}

export function getBodyOBB(body: PhysicsBody): OBB {
  return {
    cx: body.position.x + body.w / 2,
    cy: body.position.y + body.h / 2,
    hw: body.w / 2,
    hh: body.h / 2,
    angle: body.angle,
  };
}
