const FLOOR = 0

export class Map3D {
	private data: Map<string, Cell3D>
	private readonly floorCell: Cell3D
	private readonly emptyCell: Cell3D
	constructor() {
		this.data = new Map()
		this.floorCell = new Cell3D({
			map: this,
			x: 0,
			y: 0,
			z: -1,
			properties: { platform: true, solid: true },
		})
		this.emptyCell = new Cell3D({
			map: this,
			x: 0,
			y: 0,
			z: 0,
			properties: { solid: false },
		})
	}
	getXYZ(grid: Grid): Cell3D {
		if (grid.z < FLOOR) return this.floorCell
		return this.data.get(Map3D.gridToHash(grid)) || this.emptyCell
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
	private readonly map: Map3D
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
		this.map.clearXYZ(this)
		Object.assign(this, grid)
		this.map.addCell(this)
	}
	getNeighbor(grid: Grid): Cell3D {
		return this.map.getXYZ({
			x: this.x + grid.x,
			y: this.y + grid.y,
			z: this.z + grid.z,
		})
	}
	spread(grid: Grid, cellProperties?: Cell3DProperties): void {
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
		this.map.clearXYZ(this)
	}
}

export interface Cell3DOptions {
	map: Map3D
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
