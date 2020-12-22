/** Number of vertical pixels per grid unit. */
export const SCALE = 8

/**
 * Converts a 3D grid location to a 2D isometric screen projection.
 *
 * @param x - The X grid coordinate in 3D space.
 * @param y - The Y grid coordinate in 3D space.
 * @param z - The Z grid coordinate in 3D space.
 * @returns - An `[X, Y]` array of the 2D screen coordinates.
 */
export function get2dCoordsFromIso(
	x: number,
	y: number,
	z: number
): [number, number] {
	return [(x - y) * SCALE * 2, (x + y - z) * SCALE]
}

/**
 * Gets the Z-index of a grid location.
 *
 * @param x - The X grid coordinate in 3D space.
 * @param y - The Y grid coordinate in 3D space.
 * @param z - The Z grid coordinate in 3D space.
 * @remarks
 * This is used to draw sprites to the screen in the correct order
 *     (back to front, bottom to top).
 * @returns - The Z-index of the input grid coordinates.
 */
export function getZIndex(x: number, y: number, z: number): number {
	return x + y + z * 0.01 // Z coordinate should not overcome X + Y
}
