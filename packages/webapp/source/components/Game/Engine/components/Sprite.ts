import { Component, Types } from 'ecsy'

export default class Sprite extends Component<Sprite> {
	x!: number
	y!: number
	width!: number
	height!: number
	spriteName!: string
	zIndex!: number
}

Sprite.schema = {
	x: { type: Types.Number },
	y: { type: Types.Number },
	width: { type: Types.Number },
	height: { type: Types.Number },
	spriteName: { type: Types.String },
	zIndex: { type: Types.Number },
}
