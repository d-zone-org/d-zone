import { Component } from 'ape-ecs'
import { Direction } from '../../typings'

export default class Hop extends Component {
	x!: number
	y!: number
	z!: number
	direction!: Direction
	progress!: number
	frame!: number
	static typeName = 'Hop'
	static key = 'hop'
	static properties = {
		x: 0,
		y: 0,
		z: 0,
		direction: null,
		progress: 0,
		frame: 0,
	}
}
