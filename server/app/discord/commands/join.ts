import { Commands } from '$/discord'

export default Commands.declare({
	name: 'join',
	description: "Join this server's d-zone",
	directMessage: false,

	async execute(context) {
		return context.reply({
			title: 'Join d-zone!',
			description: `Click on [this](https://localhost:8080/create-account) link to join d-zone`,
		})
	},
})
