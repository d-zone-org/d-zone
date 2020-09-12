export const SCALE = 8

export function get2dCoordsFromIso(
	x: number,
	y: number,
	z: number
): [number, number] {
	return [(x - y) * SCALE * 2, (x + y - z) * SCALE]
}

export function getZIndex(x: number, y: number, z: number): number {
	return x + y + z * 0.01 // Z coordinate should not overcome X + Y
}
