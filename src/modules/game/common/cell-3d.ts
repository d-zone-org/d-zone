import Map3D from './map-3d'

export class Cell3D {
	private readonly map: Map3D | null
	private static hopZLevels: number[] = [0, 1, -1]
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
	getHopTarget(target: Grid): Grid | false {
		const aboveNeighbor = this.getNeighbor({ x: 0, y: 0, z: 1 })
		if (!aboveNeighbor || aboveNeighbor.properties.solid) return false
		const newTarget = { ...target }
		for (const z of Cell3D.hopZLevels) {
			newTarget.z = z
			const newTargetCell = this.getNeighbor(newTarget)
			const underNewTarget = this.getNeighbor({ ...target, z: newTarget.z - 1 })
			if (
				newTargetCell &&
				!newTargetCell.properties.solid &&
				underNewTarget &&
				underNewTarget.properties.platform
			) {
				return newTarget
			}
		}
		return false
	}
	reserveTarget(target: Grid): void {
		this.spread(target, { solid: true })
	}
}

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
