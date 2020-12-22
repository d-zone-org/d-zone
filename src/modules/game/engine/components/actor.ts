import { Component } from 'ape-ecs'

/** Data related to the Discord user that the actor represents. */
export default class Actor extends Component {
	/** The Discord user ID. */
	userID!: string
	/** The Discord username, or nickname if available. */
	username!: string
	/** The Discord user color, determined by highest role color. */
	color!: number
	static typeName = 'Actor'
	static key = 'actor'
	static properties = {
		userID: '',
		username: '',
		color: 0,
	}
}
