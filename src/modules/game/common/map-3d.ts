import { Direction, IGrid, IGridDirection } from '../typings'

/**
 * A manager used for storing objects of type `T` as "cells" and providing
 * methods to manipulate them.
 */
export default class Map3D<T> {
	/**
	 * Stores the cells indexed by grid location. Use [[Map3D.gridToHash]] to
	 * generate the hash string used for indexing.
	 *
	 * Note: Methods returning sets from this data should always return shallow copies.
	 */
	private cellMap: Map<string, Set<T>> = new Map()

	/**
	 * Stores grid locations of all cells, indexed by cell. This can be used to
	 * retrieve the location of any cell in the map.
	 *
	 * Note: Methods returning grids from this data should always return shallow copies.
	 */
	private cellGrids: Map<T, IGrid> = new Map()

	/**
	 * Gets the cells at a specified grid location.
	 *
	 * @param grid - The grid location to retrieve cells from.
	 * @returns - A Set containing the cells at the input grid location.
	 */
	getCellsAtGrid(grid: IGrid): Set<T> {
		const hash = Map3D.gridToHash(grid)
		let cells = this.cellMap.get(hash)
		if (!cells) {
			cells = new Set()
			this.cellMap.set(hash, cells)
		}
		return new Set(cells)
	}

	/**
	 * Adds a cell to the specified grid location, and returns a Set containing the
	 * cells at that location.
	 *
	 * @param cell - The map cell to be added.
	 * @param grid - The grid location to add the cell to.
	 * @returns - A Set containing the cells at the input grid location.
	 */
	addCellToGrid(cell: T, grid: IGrid): Set<T> {
		const cells = new Set([...this.getCellsAtGrid(grid), cell])
		this.cellMap.set(Map3D.gridToHash(grid), cells)
		this.cellGrids.set(cell, { ...grid })
		return new Set(cells)
	}

	/**
	 * Removes a cell from the specified grid location, and returns a Set
	 * containing the cells at that location.
	 *
	 * @param cell - The map cell to be removed.
	 * @param grid - The grid location to remove the cell from.
	 * @returns - A Set containing the cells at the input grid location.
	 */
	removeCellFromGrid(cell: T, grid: IGrid): Set<T> {
		const cellsAtGrid = this.cellMap.get(Map3D.gridToHash(grid))
		if (cellsAtGrid) cellsAtGrid.delete(cell)
		this.cellGrids.delete(cell)
		return this.getCellsAtGrid(grid)
	}

	/**
	 * Moves a cell to the specified grid location, and returns a Set containing
	 * the cells at that location.
	 *
	 * @param cell - The map cell to be moved.
	 * @param grid - The grid location to move the cell to.
	 * @returns - A Set containing the cells at the input grid location.
	 */
	moveCellToGrid(cell: T, grid: IGrid): Set<T> {
		const prevGrid = this.cellGrids.get(cell)
		if (prevGrid) {
			if (Map3D.gridToHash(prevGrid) === Map3D.gridToHash(grid)) {
				return this.getCellsAtGrid(grid)
			}
			this.removeCellFromGrid(cell, prevGrid)
		}
		return this.addCellToGrid(cell, grid)
	}

	/**
	 * Returns the grid location of a cell in the map.
	 *
	 * @param cell - The map cell to obtain the grid from.
	 * @returns - The grid location of the input cell.
	 */
	getCellGrid(cell: T): IGrid | undefined {
		const grid = this.cellGrids.get(cell)
		return grid ? { ...grid } : undefined
	}

	/**
	 * Returns the string representation (hash) of a grid.
	 *
	 * Note: This hash is used to index the [[data]] of [[Map3D]].
	 *
	 * @param __namedParameters - The grid object to convert into a hash.
	 * @returns - Grid coordinates in string format.
	 */
	static gridToHash({ x, y, z }: IGrid): string {
		return x + ':' + y + ':' + z
	}

	/**
	 * Returns the sum of two or more grid objects.
	 *
	 * @param grids - An array of grids to be summed.
	 * @returns - The summed grid location.
	 */
	static addGrids(...grids: IGrid[]): IGrid {
		const summedGrid = { x: 0, y: 0, z: 0 }
		for (const grid of grids) {
			summedGrid.x += grid.x
			summedGrid.y += grid.y
			summedGrid.z += grid.z
		}
		return summedGrid
	}

	/**
	 * A constant containing objects that represent the four cardinal directions.
	 *
	 * Note: This can be used when creating [[Hop]] components.
	 */
	static Directions: Record<Direction, IGridDirection> = {
		east: { x: 1, y: 0, z: 0, direction: Direction.East },
		west: { x: -1, y: 0, z: 0, direction: Direction.West },
		south: { y: 1, x: 0, z: 0, direction: Direction.South },
		north: { y: -1, x: 0, z: 0, direction: Direction.North },
	} as const
}
