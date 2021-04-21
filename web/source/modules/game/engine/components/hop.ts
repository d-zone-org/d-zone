import { Component, Entity, EntityRef } from 'ape-ecs'
import { Direction } from '../../typings'

/** Data for hopping or attempting to hop. */
export default class Hop extends Component {
	/** The relative X coordinate of the hop. */
	x!: number
	/** The relative Y coordinate of the hop. */
	y!: number
	/** The relative Z coordinate of the hop. */
	z!: number
	/** The entity added to the map to reserve the target grid of the hop. */
	placeholder!: Entity | null
	/** The direction of the hop. */
	direction!: Direction
	/** The current tick number of the hop. */
	tick!: number
	/** The frame of the hop animation to display. */
	frame!: number
	static typeName = 'Hop'
	static key = 'hop'
	static properties = {
		x: 0,
		y: 0,
		z: 0,
		placeholder: EntityRef,
		direction: null,
		tick: 0,
		frame: 0,
	}
}
