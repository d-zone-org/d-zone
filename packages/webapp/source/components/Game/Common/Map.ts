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
		// Throw if occupied?
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
	private map: Map3D
	private x: number
	private y: number
	private z: number
	entity: Entity
	constructor(map: Map3D, x: number, y: number, z: number, entity: Entity) {
		this.map = map
		this.x = x
		this.y = y
		this.z = z
		this.entity = entity
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
	destroy(): void {
		this.map.clearXYZ(this.x, this.y, this.z)
	}
}
