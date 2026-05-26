import type { OBB, AABB } from "./types.ts";
import { obbCorners     } from "./geometry.ts";
import { obbVsAabb      } from "./collision.ts";

/** Returns all regions from `regions` that overlap the given OBB. */
export function overlappingRegions(obb: OBB, regions: AABB[]): AABB[] {
  const hits: AABB[] = [];
  for (const r of regions) if (obbVsAabb(obb, r)) hits.push(r);
  return hits;
}

/** Returns `true` if all corners of the OBB are inside the AABB.
 * @param padding - Inset applied to all sides of the AABB. Default: `0`.
 */
export function obbInsideAabb(obb: OBB, aabb: AABB, padding = 0): boolean {
  const minX = aabb.cx - aabb.hw + padding;
  const minY = aabb.cy - aabb.hh + padding;
  const maxX = aabb.cx + aabb.hw - padding;
  const maxY = aabb.cy + aabb.hh - padding;
  if (maxX <= minX || maxY <= minY) return false;

  for (const c of obbCorners(obb)) if (
    c.x < minX || c.x > maxX || c.y < minY || c.y > maxY
  ) return false;

  return true;
}
