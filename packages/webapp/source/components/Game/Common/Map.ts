import { Entity } from 'ecsy'

export class Map3D {
	private data: Map<string, Cell3D>
	constructor() {
		this.data = new Map()
	}
	getXYZ(x: number, y: number, z: number): Cell3D | undefined {
		return this.data.get(Map3D.xyzToHash(x, y, z))
	}
	addCell(cell: Cell3D): void {
		this.data.set(cell.getHash(), cell)
	}
	clearXYZ(x: number, y: number, z: number): void {
		this.data.delete(Map3D.xyzToHash(x, y, z))
	}
	private static xyzToHash(x: number, y: number, z: number): string {
		return x + ':' + y + ':' + z
	}
}
export class Cell3D {
	private readonly map: Map3D
	private x: number
	private y: number
	private z: number
	entity?: Entity
	parentCell?: Cell3D
	constructor(
		map: Map3D,
		x: number,
		y: number,
		z: number,
		entity?: Entity,
		parentCell?: Cell3D
	) {
		this.map = map
		this.x = x
		this.y = y
		this.z = z
		if (entity) this.entity = entity
		if (parentCell) this.parentCell = parentCell
	}
	getHash(): string {
		return this.x + ':' + this.y + ':' + this.z
	}
	moveTo(x: number, y: number, z: number): void {
		this.map.clearXYZ(this.x, this.y, this.z)
		this.x = x
		this.y = y
		this.z = z
		this.map.addCell(this)
	}
	getNeighbor(x: number, y: number, z: number): Cell3D | undefined {
		return this.map.getXYZ(this.x + x, this.y + y, this.z + z)
	}
	spread(x: number, y: number, z: number): void {
		this.map.addCell(
			new Cell3D(this.map, this.x + x, this.y + y, this.z + z, undefined, this)
		)
	}
	destroy(): void {
		this.map.clearXYZ(this.x, this.y, this.z)
	}
}
