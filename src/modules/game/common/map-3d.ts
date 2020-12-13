import { Cell3D, Grid } from 'web/modules/game/common/cell-3d'

const FLOOR = 0

export default class Map3D {
	private data: Map<string, Cell3D>
	constructor() {
		this.data = new Map()
	}
	getXYZ(grid: Grid): Cell3D {
		if (grid.z < FLOOR) return FloorCell
		return this.data.get(Map3D.gridToHash(grid)) || EmptyCell
	}
	addCell(cell: Cell3D): void {
		this.data.set(cell.getHash(), cell)
	}
	clearXYZ(grid: Grid): void {
		this.data.delete(Map3D.gridToHash(grid))
	}
	private static gridToHash(grid: Grid): string {
		return grid.x + ':' + grid.y + ':' + grid.z
	}
}
const EmptyCell = new Cell3D({
	map: null,
	x: 0,
	y: 0,
	z: 0,
	properties: { solid: false },
})
const FloorCell = new Cell3D({
	map: null,
	x: 0,
	y: 0,
	z: -1,
	properties: { platform: true, solid: true },
})
