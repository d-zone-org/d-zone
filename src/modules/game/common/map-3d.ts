import { Cell3D } from './cell-3d'
import { Direction, IGrid, IGridDirection } from '../typings'

export default class Map3D {
	private data: Map<string, Cell3D[]>
	constructor() {
		this.data = new Map()
	}
	getCellsAtGrid(grid: IGrid): Cell3D[] {
		const hash = Map3D.gridToHash(grid)
		let cells = this.data.get(hash)
		if (!cells) {
			cells = []
			this.data.set(hash, cells)
		}
		return cells
	}
	addCell(cell: Cell3D): Cell3D[] {
		const cells = this.getCellsAtGrid(cell)
		cells.push(cell)
		return cells
	}
	removeCellFromGrid(cell: Cell3D, grid: IGrid): Cell3D[] {
		const cells = this.getCellsAtGrid(grid)
		const cellIndex = cells.indexOf(cell)
		if (cellIndex >= 0) cells.splice(cellIndex, 1)
		return cells
	}
	moveCellToGrid(cell: Cell3D, grid: IGrid): Cell3D[] {
		this.removeCellFromGrid(cell, cell)
		Object.assign(cell, grid)
		return this.addCell(cell)
	}
	static gridToHash(grid: IGrid): string {
		return grid.x + ':' + grid.y + ':' + grid.z
	}
	static Directions: Record<Direction, IGridDirection> = {
		east: { x: 1, y: 0, z: 0, direction: Direction.East },
		west: { x: -1, y: 0, z: 0, direction: Direction.West },
		south: { y: 1, x: 0, z: 0, direction: Direction.South },
		north: { y: -1, x: 0, z: 0, direction: Direction.North },
	}
}
