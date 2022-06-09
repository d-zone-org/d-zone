import { Commands } from '$/discord'

export default Commands.declare({
	name: 'register',
	description: 'Register guild on d-zone',

	directMessage: false,
	permission: [Commands.Permission.manageGuild],

	options: [
		{
			name: 'channel',
			description: 'Default channel d-zone should listen to',
			type: Commands.Option.CHANNEL,
			channel_types: [Commands.Channel.GUILD_TEXT],
			required: true,
		},
	],

	async execute(context) {
		const channel = context.options.channel

		await context.prisma.server.upsert({
			where: { id: channel.guild.id },
			create: { id: channel.guild.id, channel: channel.id },
			update: { channel: channel.id },
		})

		context.reply({
			description: `Now broadcasting <#${channel.id}> channel to d-zone`,
		})
	},
})
