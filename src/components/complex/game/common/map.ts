const FLOOR = 0

export class Map3D {
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
export class Cell3D {
	private readonly map: Map3D | null
	x: number
	y: number
	z: number
	parentCell?: Cell3D
	properties: Cell3DProperties = {}
	constructor(options: Cell3DOptions) {
		this.map = options.map
		this.x = options.x
		this.y = options.y
		this.z = options.z
		if (options.parentCell) this.parentCell = options.parentCell
		Object.assign(this.properties, options.properties)
	}
	getHash(): string {
		return this.x + ':' + this.y + ':' + this.z
	}
	moveTo(grid: Grid): void {
		if (!this.map) return
		this.map.clearXYZ(this)
		Object.assign(this, grid)
		this.map.addCell(this)
	}
	getNeighbor(grid: Grid): Cell3D | void {
		if (!this.map) return
		return this.map.getXYZ({
			x: this.x + grid.x,
			y: this.y + grid.y,
			z: this.z + grid.z,
		})
	}
	spread(grid: Grid, cellProperties?: Cell3DProperties): void {
		if (!this.map) return
		this.map.addCell(
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
	destroy(): void {
		if (!this.map) return
		this.map.clearXYZ(this)
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

export interface Cell3DOptions {
	map: Map3D | null
	x: number
	y: number
	z: number
	parentCell?: Cell3D
	properties?: Cell3DProperties
}

interface Cell3DProperties {
	solid?: boolean
	platform?: boolean
}

export interface Grid {
	x: number
	y: number
	z: number
}
