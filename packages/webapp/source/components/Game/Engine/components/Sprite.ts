import { Component, Types } from 'ecsy'

export default class Sprite extends Component<Sprite> {
	x!: number
	y!: number
	texture!: string
	zIndex!: number
}

Sprite.schema = {
	x: { type: Types.Number },
	y: { type: Types.Number },
	texture: { type: Types.String },
	zIndex: { type: Types.Number },
}
