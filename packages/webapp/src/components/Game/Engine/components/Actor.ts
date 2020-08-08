import { Component, Types } from 'ecsy'

export default class Actor extends Component<Actor> {
	userID!: string
	username!: string
	color!: number
}

Actor.schema = {
	userID: { type: Types.String },
	username: { type: Types.String },
	color: { type: Types.Number },
}
