import { Component } from 'ape-ecs'

export default class Hop extends Component {
	x!: number
	y!: number
	z!: number
	direction!: 'east' | 'west' | 'south' | 'north'
	progress!: number
	frame!: number
	static typeName = 'Hop'
	static properties = {
		x: 0,
		y: 0,
		z: 0,
		direction: null,
		progress: 0,
		frame: 0,
	}
}
