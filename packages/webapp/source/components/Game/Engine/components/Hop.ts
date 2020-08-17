import { Component, Types } from 'ecsy'

export default class Hop extends Component<Hop> {
	x!: number
	y!: number
	z!: number
	direction!: string
	progress!: number
	frame!: number
}

Hop.schema = {
	x: { type: Types.Number },
	y: { type: Types.Number },
	z: { type: Types.Number },
	direction: { type: Types.String },
	progress: { type: Types.Number },
	frame: { type: Types.Number },
}
