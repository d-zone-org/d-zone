import { Cell3D, Cell3DOptions, Grid } from './map'

export default class ActorCell extends Cell3D {
	private static hopZLevels: number[] = [0, 1, -1]

	constructor(options: Cell3DOptions) {
		super(options)
		this.properties.solid = true
		this.properties.platform = true
	}

	getHopTarget(target: Grid): Grid | false {
		const aboveNeighbor = this.getNeighbor({ x: 0, y: 0, z: 1 })
		if (!aboveNeighbor || aboveNeighbor.properties.solid) return false
		const newTarget = { ...target }
		for (const z of ActorCell.hopZLevels) {
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
