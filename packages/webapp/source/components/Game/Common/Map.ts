export class Map3D {
	private data: Map<string, any>
	constructor() {
		this.data = new Map()
	}
	getXYZ(x: number, y: number, z: number) {
		return this.data.get(Map3D.xyzToHash(x, y, z))
	}
	setXYZ(x: number, y: number, z: number, value: any): void {
		this.data.set(Map3D.xyzToHash(x, y, z), value)
	}
	private static xyzToHash(x: number, y: number, z: number): string {
		return x + ':' + y + ':' + z
	}
}
