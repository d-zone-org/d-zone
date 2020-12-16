import type { IGrid } from '../../typings'
import { Cell3D } from '../../common/cell-3d'
import Map3D from '../../common/map-3d'

const HOP_Z_LEVELS = [0, 1, -1] as const

export function reserveTarget(cell: Cell3D, target: IGrid): void {
	cell.spread(target, { solid: true })
}

export function getHopTarget(cell: Cell3D, target: IGrid): IGrid | false {
	const aboveNeighbor = cell.getCellsAtNeighbor({ x: 0, y: 0, z: 1 })
	if (aboveNeighbor.some((cell) => cell.properties.solid)) return false
	const newTarget = { ...target }
	for (const z of HOP_Z_LEVELS) {
		newTarget.z = z
		const newTargetCells = cell.getCellsAtNeighbor(newTarget)
		if (
			gridIsAbovePlatform(cell.map, target) &&
			!newTargetCells.some((cell) => cell.properties.solid)
		) {
			return newTarget
		}
	}
	return false
}

function gridIsAbovePlatform(map: Map3D, grid: IGrid): boolean {
	if (grid.z <= 0) return true
	const underNewTarget = map.getCellsAtGrid({
		...grid,
		z: grid.z - 1,
	})
	return underNewTarget.some((cell) => cell.properties.platform)
}
