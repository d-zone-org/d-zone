import { Component } from 'ape-ecs'

export default class Transform extends Component {
	x!: number
	y!: number
	z!: number

	static properties = {
		x: 0,
		y: 0,
		z: 0,
	}
}
