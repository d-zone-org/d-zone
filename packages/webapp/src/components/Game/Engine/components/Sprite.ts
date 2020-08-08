import { Component, Types } from 'ecsy'

export default class Sprite extends Component<Sprite> {
	x!: number
	y!: number
	width!: number
	height!: number
	sheet!: string
	render!: boolean
	dirty!: boolean
	zIndex!: number
}

Sprite.schema = {
	x: { type: Types.Number },
	y: { type: Types.Number },
	width: { type: Types.Number },
	height: { type: Types.Number },
	sheet: { type: Types.String },
	render: { type: Types.Boolean },
	dirty: { type: Types.Boolean },
	zIndex: { type: Types.Number },
}
