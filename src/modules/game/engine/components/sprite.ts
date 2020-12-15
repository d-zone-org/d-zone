import { Component } from 'ape-ecs'

export default class Sprite extends Component {
	x!: number
	y!: number
	texture!: string
	zIndex!: number
	static typeName = 'Sprite'
	static key = 'sprite'
	static properties = {
		x: 0,
		y: 0,
		texture: '',
		zIndex: 0,
	}
}
