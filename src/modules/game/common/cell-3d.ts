import Map3D from './map-3d'
import { IGrid } from '../typings'

export class Cell3D {
	readonly map: Map3D
	x: number
	y: number
	z: number
	parentCell?: Cell3D
	properties: ICell3DProperties = {}
	constructor(options: ICell3DOptions) {
		this.map = options.map
		this.x = options.x
		this.y = options.y
		this.z = options.z
		if (options.parentCell) this.parentCell = options.parentCell
		Object.assign(this.properties, options.properties)
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
	spread(grid: IGrid, cellProperties?: ICell3DProperties): Cell3D[] {
		return this.map.addCell(
			new Cell3D({
				map: this.map,
				x: this.x + grid.x,
				y: this.y + grid.y,
				z: this.z + grid.z,
				parentCell: this,
				properties: cellProperties,
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
	properties?: ICell3DProperties
}

interface ICell3DProperties {
	solid?: boolean
	platform?: boolean
}
