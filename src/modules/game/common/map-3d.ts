import { Cell3D } from './cell-3d'
import { Direction, IGrid, IGridDirection } from '../typings'

/** A manager used for storing instances of [[Cell3D]] and providing methods to manipulate them. */
export default class Map3D {
	/**
	 * Stores the map cells indexed by grid location. Use [[Map3D.gridToHash]] to generate the hash string used for indexing.
	 *
	 * @remarks
	 * Methods that return arrays from this data should always return shallow copies.
	 * */
	private data: Map<string, Cell3D[]> = new Map()

	/**
	 * Gets the cells at a specified grid location.
	 *
	 * @param grid - The grid location to retrieve cells from.
	 * @returns - An array of the cells at the input grid location.
	 */
	getCellsAtGrid(grid: IGrid): Cell3D[] {
		const hash = Map3D.gridToHash(grid)
		let cells = this.data.get(hash)
		if (!cells) {
			cells = []
			this.data.set(hash, cells)
		}
		return [...cells]
	}

	/**
	 * Adds a cell to the map. The target grid is inferred from the cell's properties.
	 *
	 * @param cell - The map cell to add to the map.
	 * @returns - An array of the cells at the location the input cell was added to.
	 */
	addCell(cell: Cell3D): Cell3D[] {
		const cells = [...this.getCellsAtGrid(cell), cell]
		this.data.set(Map3D.gridToHash(cell), cells)
		return [...cells]
	}

	/**
	 * Removes a cell from the specified grid location, and returns an array of cells at that location.
	 *
	 * @param cell - The map cell to be removed.
	 * @param grid - The grid location to remove the cell from.
	 * @returns - An array of the cells at the input grid location.
	 */
	removeCellFromGrid(cell: Cell3D, grid: IGrid): Cell3D[] {
		const cells = this.getCellsAtGrid(grid).filter((c) => c !== cell)
		this.data.set(Map3D.gridToHash(cell), cells)
		return [...cells]
	}

	/**
	 * Moves a cell to the specified grid location, and returns an array of cells at that location.
	 *
	 * @param cell - The map cell to be moved.
	 * @param grid - The grid location to move the cell to.
	 * @returns - An array of the cells at the input grid location.
	 */
	moveCellToGrid(cell: Cell3D, grid: IGrid): Cell3D[] {
		if (Map3D.gridToHash(cell) === Map3D.gridToHash(grid)) {
			return this.getCellsAtGrid(grid)
		}
		this.removeCellFromGrid(cell, cell)
		cell.setGrid(grid)
		return this.addCell(cell)
	}

	/**
	 * Returns the string representation (hash) of a grid.
	 *
	 * @remarks
	 * This hash is used to index the [[data]] of [[Map3D]].
	 *
	 * @param __namedParameters - The grid object to convert into a hash.
	 * @returns - Grid coordinates in string format.
	 */
	static gridToHash({ x, y, z }: IGrid): string {
		return x + ':' + y + ':' + z
	}

	/**
	 * A constant containing objects that represent the four cardinal directions.
	 *
	 * @remarks
	 * This can be used when creating [[Hop]] components.
	 * */
	static Directions: Record<Direction, IGridDirection> = {
		east: { x: 1, y: 0, z: 0, direction: Direction.East },
		west: { x: -1, y: 0, z: 0, direction: Direction.West },
		south: { y: 1, x: 0, z: 0, direction: Direction.South },
		north: { y: -1, x: 0, z: 0, direction: Direction.North },
	} as const
}
