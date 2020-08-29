import { Cell3D, Cell3DOptions, Grid } from './Map'

export default class ActorCell extends Cell3D {
	private static hopZLevels: number[] = [0, 1, -1]

	constructor(options: Cell3DOptions) {
		super(options)
		this.properties.solid = true
		this.properties.platform = true
	}

	getHopTarget(target: Grid): Grid | false {
		if (this.getNeighbor({ x: 0, y: 0, z: 1 }).properties.solid) return false
		let newTarget = { ...target }
		for (let z of ActorCell.hopZLevels) {
			newTarget.z = z
			if (
				!this.getNeighbor(newTarget).properties.solid &&
				this.getNeighbor({ ...target, z: newTarget.z - 1 }).properties.platform
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
