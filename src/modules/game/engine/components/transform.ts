import { Component } from 'ape-ecs'

/**
 * Data for an entity's location in 3D space. Systems should manipulate this
 * component instead of the [[MapCell | map cell component]]. Changes made to
 * this component will be copied to the map cell.
 */
export default class Transform extends Component {
	/** The X coordinate of the entity's location. Negative is West, positive is East. */
	x!: number
	/** The Y coordinate of the entity's location. Negative is North, positive is South. */
	y!: number
	/** The Z coordinate of the entity's location. Negative is down, positive is up. */
	z!: number
	static typeName = 'Transform'
	static key = 'transform'
	static properties = {
		x: 0,
		y: 0,
		z: 0,
	}
}
