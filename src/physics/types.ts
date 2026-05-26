/** 2D vector. */
export interface Vec2 {
  x: number;
  y: number;
}

/** Oriented Bounding Box - a rotated rectangle defined by center, half-extents, and angle. */
export interface OBB {
  /** Center x in world pixels. */
  cx: number;
  /** Center y in world pixels. */
  cy: number;
  /** Half-width along local X (forward) axis. */
  hw: number;
  /** Half-height along local Y (lateral) axis. */
  hh: number;
  /** Rotation in radians. 0 = local X aligned with world +X. */
  angle: number;
}

/** Axis-Aligned Bounding Box - a non-rotated rectangle defined by center and size. */
export interface AABB {
  /** Center x in world pixels. */
  cx: number;
  /** Center y in world pixels. */
  cy: number;
  /** Half-width in pixels. */
  hw: number;
  /** Half-height in pixels. */
  hh: number;
}

/** Circle defined by center and radius. */
export interface Circle {
  /** Center x in world pixels. */
  cx: number;
  /** Center y in world pixels. */
  cy: number;
  /** Radius in pixels. */
  r: number;
}

/** Minimum Translation Vector - the axis and depth needed to resolve a collision. */
export interface MTV {
  /** Unit vector pointing from shape A toward shape B. */
  axis: Vec2;
  /** Penetration depth along axis. */
  depth: number;
}

/** A rectangle with position, velocity, angle, and dimensions. */
export interface RectBody {
  /** World-space position in pixels. */
  position: Vec2;
  /** Velocity in pixels per second. */
  velocity: Vec2;
  /** Facing angle in radians. 0 = facing right. */
  angle: number;
  /** Hitbox width in pixels. */
  w: number;
  /** Hitbox height in pixels. */
  h: number;
  /** Mass. */
  mass: number;
}

/** A circle with velocity.*/
export interface CircleBody extends Circle {
  /** Velocity X in pixels per second. */
  vx: number;
  /** Velocity Y in pixels per second. */
  vy: number;
  /** Mass. */
  mass: number;
}
