import type { Vec2, OBB, AABB, MTV, Circle } from "./types.ts";
import { obbCorners, aabbCorners, project } from "./geometry.ts";

/** Tests an OBB against an AABB using the Separating Axis Theorem.
 * @returns The {@link MTV} to resolve the collision, or `null` if no overlap.
 */
export function obbVsAabb(obb: OBB, aabb: AABB): MTV | null {
  const cos = Math.cos(obb.angle);
  const sin = Math.sin(obb.angle);
  const ux: Vec2 = { x: cos, y: sin };
  const uy: Vec2 = { x: -sin, y: cos };
  const wx: Vec2 = { x: 1, y: 0 };
  const wy: Vec2 = { x: 0, y: 1 };

  const obbCs:  Vec2[] = obbCorners(obb);
  const aabbCs: Vec2[] = aabbCorners(aabb);
  const axes:   Vec2[] = [ux, uy, wx, wy];

  let minDepth      = Infinity;
  let minAxis: Vec2 = { x: 0, y: 0 };

  for (const axis of axes) {
    const [aMin, aMax] = project(obbCs, axis);
    const [bMin, bMax] = project(aabbCs, axis);
    const overlap = Math.min(aMax, bMax) - Math.max(aMin, bMin);
    if (overlap <= 0) return null;

    if (overlap < minDepth) {
      minDepth = overlap;
      const dir = (obb.cx - aabb.cx) * axis.x + (obb.cy - aabb.cy) * axis.y;
      minAxis = dir < 0 ? { x: -axis.x, y: -axis.y } : axis;
    }
  }
  return { axis: minAxis, depth: minDepth };
}

/** Tests two OBBs against each other using the Separating Axis Theorem.
 * @returns The {@link MTV} to resolve the collision, or `null` if no overlap.
 */
export function obbVsObb(a: OBB, b: OBB): MTV | null {
  const aCos = Math.cos(a.angle), aSin = Math.sin(a.angle);
  const bCos = Math.cos(b.angle), bSin = Math.sin(b.angle);
  const aux: Vec2 = { x: aCos, y: aSin };
  const auy: Vec2 = { x: -aSin, y: aCos };
  const bux: Vec2 = { x: bCos, y: bSin };
  const buy: Vec2 = { x: -bSin, y: bCos };

  const aCorners: Vec2[] = obbCorners(a);
  const bCorners: Vec2[] = obbCorners(b);
  const axes:     Vec2[] = [aux, auy, bux, buy];

  let minDepth      = Infinity;
  let minAxis: Vec2 = { x: 0, y: 0 };

  for (const axis of axes) {
    const [aMin, aMax] = project(aCorners, axis);
    const [bMin, bMax] = project(bCorners, axis);
    const overlap = Math.min(aMax, bMax) - Math.max(aMin, bMin);
    if (overlap <= 0) return null;

    if (overlap < minDepth) {
      minDepth = overlap;
      const dir = (a.cx - b.cx) * axis.x + (a.cy - b.cy) * axis.y;
      minAxis = dir < 0 ? { x: -axis.x, y: -axis.y } : axis;
    }
  }
  return { axis: minAxis, depth: minDepth };
}

/** Tests two circles for overlap.
 * @returns The {@link MTV} to resolve the collision, or `null` if no overlap.
*/
export function circleVsCircle(a: Circle, b: Circle): MTV | null {
  const dx      = b.cx - a.cx;
  const dy      = b.cy - a.cy;
  const distSq  = dx * dx + dy * dy;
  const minDist = a.r + b.r;
  if (distSq >= minDist * minDist) return null;

  const dist  = Math.sqrt(distSq);
  const depth = minDist - dist;
  if (dist === 0) return { axis: { x: 1, y: 0 }, depth };

  return { axis: { x: dx / dist, y: dy / dist }, depth };
}

/** Tests a circle against an AABB.
 * @returns The {@link MTV} to resolve the collision, or `null` if no overlap.
 */
export function circleVsAabb(c: Circle, aabb: AABB): MTV | null {
  const nearX  = Math.max(aabb.cx - aabb.hw, Math.min(aabb.cx + aabb.hw, c.cx));
  const nearY  = Math.max(aabb.cy - aabb.hh, Math.min(aabb.cy + aabb.hh, c.cy));
  const dx     = c.cx - nearX;
  const dy     = c.cy - nearY;
  const distSq = dx * dx + dy * dy;
  if (distSq >= c.r * c.r || distSq === 0) return null;

  const dist = Math.sqrt(distSq);
  return { axis: { x: dx / dist, y: dy / dist }, depth: c.r - dist };
}

/** Tests a circle against an OBB.
 * @returns The {@link MTV} to resolve the collision, or `null` if no overlap.
 */
export function circleVsObb(c: Circle, obb: OBB): MTV | null {
  const cos    = Math.cos(obb.angle);
  const sin    = Math.sin(obb.angle);
  const dx     = c.cx - obb.cx;
  const dy     = c.cy - obb.cy;
  const localX = dx * cos + dy * sin;
  const localY = -dx * sin + dy * cos;
  const nearX  = Math.max(-obb.hw, Math.min(obb.hw, localX));
  const nearY  = Math.max(-obb.hh, Math.min(obb.hh, localY));
  const diffX  = localX - nearX;
  const diffY  = localY - nearY;
  const distSq = diffX * diffX + diffY * diffY;
  if (distSq >= c.r * c.r || distSq === 0) return null;

  const dist   = Math.sqrt(distSq);
  const worldX = diffX * cos - diffY * sin;
  const worldY = diffX * sin + diffY * cos;
  return { axis: { x: worldX / dist, y: worldY / dist }, depth: c.r - dist };
}
