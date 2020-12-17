import { Cell3D } from './cell-3d'
import { Direction, IGrid, IGridDirection } from '../typings'

export default class Map3D {
	private data: Map<string, Cell3D[]> = new Map()

	getCellsAtGrid(grid: IGrid): Cell3D[] {
		const hash = Map3D.gridToHash(grid)
		let cells = this.data.get(hash)
		if (!cells) {
			cells = []
			this.data.set(hash, cells)
		}
		return [...cells]
	}

	addCell(cell: Cell3D): Cell3D[] {
		const cells = [...this.getCellsAtGrid(cell), cell]
		this.data.set(Map3D.gridToHash(cell), cells)
		return [...cells]
	}

	removeCellFromGrid(cell: Cell3D, grid: IGrid): Cell3D[] {
		const cells = this.getCellsAtGrid(grid).filter((c) => c !== cell)
		this.data.set(Map3D.gridToHash(cell), cells)
		return [...cells]
	}

	moveCellToGrid(cell: Cell3D, grid: IGrid): Cell3D[] {
		this.removeCellFromGrid(cell, cell)
		cell.setGrid(grid)
		return this.addCell(cell)
	}

	static gridToHash({ x, y, z }: IGrid): string {
		return x + ':' + y + ':' + z
	}

	static Directions: Record<Direction, IGridDirection> = {
		east: { x: 1, y: 0, z: 0, direction: Direction.East },
		west: { x: -1, y: 0, z: 0, direction: Direction.West },
		south: { y: 1, x: 0, z: 0, direction: Direction.South },
		north: { y: -1, x: 0, z: 0, direction: Direction.North },
	}
}
