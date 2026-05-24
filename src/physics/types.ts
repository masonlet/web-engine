/** 2D vector. */
export interface Vec2 {
  x: number;
  y: number;
}

/** A physics body with position, velocity, angle, and dimensions. */
export interface PhysicsBody {
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

/** Axis-Aligned Bounding Box - a non-rotated rectangle defined by top-left corner and size. */
export interface AABB {
  /** Top-left x in world pixels. */
  x: number;
  /** Top-left y in world pixels. */
  y: number;
  /** Width in pixels. */
  w: number;
  /** Height in pixels. */
  h: number;
}

/** Minimum Translation Vector - the axis and depth needed to resolve a collision. */
export interface MTV {
  /** Unit vector pointing out of the AABB toward the OBB. */
  axis: Vec2;
  /** Penetration depth along axis. */
  depth: number;
}
