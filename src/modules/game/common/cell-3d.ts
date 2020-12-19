import Map3D from './map-3d'
import { IGrid } from '../typings'

const DEFAULT_ATTRIBUTES: ICell3DAttributes = {
	solid: false,
	platform: false,
}

/**
 * A position marker containing an `{ X, Y, Z }` grid location to be stored in a [[Map3D]] instance.
 */
export class Cell3D {
	readonly map: Map3D
	x: number
	y: number
	z: number
	parentCell?: Cell3D
	attributes: ICell3DAttributes

	constructor({ map, parentCell, attributes, x, y, z }: ICell3DOptions) {
		this.map = map
		this.x = x
		this.y = y
		this.z = z
		this.parentCell = parentCell
		this.attributes = { ...DEFAULT_ATTRIBUTES, ...attributes }
	}

	/**
	 * Sets the grid location of the cell without changing the map.
	 *
	 * @param __namedParameters - The grid location to set the cell location to.
	 */
	setGrid({ x, y, z }: IGrid): void {
		this.x = x
		this.y = y
		this.z = z
	}

	/**
	 * Moves the cell to the target grid location.
	 *
	 * @param grid - The grid location to move the cell to.
	 * @returns - An array of the cells at the input grid location.
	 * */
	moveToGrid(grid: IGrid): Cell3D[] {
		return this.map.moveCellToGrid(this, grid)
	}

	/**
	 * Gets the cells at a grid location relative to the cell.
	 *
	 * @param grid - The grid location relative to the cell.
	 * @returns - An array of the cells at the input relative grid location.
	 * */
	getCellsAtNeighbor({ x, y, z }: IGrid): Cell3D[] {
		return this.map.getCellsAtGrid({
			x: this.x + x,
			y: this.y + y,
			z: this.z + z,
		})
	}

	/**
	 * Creates a new cell at a grid location relative to the cell.
	 *
	 * @param __namedParameters - The grid location relative to the cell.
	 * @param attributes - Cell attributes to assign to the new cell.
	 * @returns - An array of the cells at the input relative grid location.
	 */
	spread({ x, y, z }: IGrid, attributes?: ICell3DAttributes): Cell3D[] {
		return this.map.addCell(
			new Cell3D({
				map: this.map,
				x: this.x + x,
				y: this.y + y,
				z: this.z + z,
				parentCell: this,
				attributes,
			})
		)
	}

	/**
	 * Removes the cell from its [[Map3D]] instance.
	 *
	 * @returns - An array of the cells at the cell's location.
	 */
	destroy(): Cell3D[] {
		return this.map.removeCellFromGrid(this, this)
	}
}

export interface ICell3DOptions extends IGrid {
	map: Map3D
	parentCell?: Cell3D
	attributes?: ICell3DAttributes
}

interface ICell3DAttributes {
	/**
	 * Whether the cell should be able to occupy the same space as another solid cell.
	 *
	 * @default false
	 * */
	solid?: boolean
	/**
	 * Whether the cell should be able to support another cell on top of it.
	 *
	 * @default false
	 * */
	platform?: boolean
}
