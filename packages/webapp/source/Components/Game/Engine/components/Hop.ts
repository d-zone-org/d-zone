import { Component, Types } from 'ecsy'

export default class Hop extends Component<Hop> {
	x!: number
	y!: number
	z!: number
	progress!: number
}

Hop.schema = {
	x: { type: Types.Number },
	y: { type: Types.Number },
	z: { type: Types.Number },
	progress: { type: Types.Number },
}
