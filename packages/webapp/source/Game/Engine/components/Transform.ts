import { Component, Types } from 'ecsy'

export default class Transform extends Component<Transform> {
	x!: number
	y!: number
	z!: number
}

Transform.schema = {
	x: { type: Types.Number },
	y: { type: Types.Number },
	z: { type: Types.Number },
}
