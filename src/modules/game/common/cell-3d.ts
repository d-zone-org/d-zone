import Map3D from './map-3d'
import { IGrid } from '../typings'

const DEFAULT_ATTRIBUTES: ICell3DAttributes = {
	solid: false,
	platform: false,
}

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

	moveTo(grid: IGrid): Cell3D[] {
		return this.map.moveCellToGrid(this, grid)
	}

	getCellsAtNeighbor(grid: IGrid): Cell3D[] {
		return this.map.getCellsAtGrid({
			x: this.x + grid.x,
			y: this.y + grid.y,
			z: this.z + grid.z,
		})
	}

	spread(grid: IGrid, attributes?: ICell3DAttributes): Cell3D[] {
		return this.map.addCell(
			new Cell3D({
				map: this.map,
				x: this.x + grid.x,
				y: this.y + grid.y,
				z: this.z + grid.z,
				parentCell: this,
				attributes: attributes,
			})
		)
	}

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
	solid?: boolean
	platform?: boolean
}
