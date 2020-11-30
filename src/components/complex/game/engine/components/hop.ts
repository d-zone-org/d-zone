import { Component } from 'ape-ecs'

export default class Hop extends Component {
	x!: number
	y!: number
	z!: number
	direction!: string
	progress!: number
	frame!: number

	static properties = {
		x: 0,
		y: 0,
		z: 0,
		direction: 'east' || 'west' || 'south' || 'north',
		progress: 0,
		frame: 0,
	}
}
