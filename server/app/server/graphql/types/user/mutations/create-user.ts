import { mutationField } from 'nexus'

export const CreateUser = mutationField('CreateUser', {
	type: 'User',

	async resolve(_source, _args, context) {
		const user = context.session.user!

		const servers = context.client.guilds
			.filter((guild) => guild.members.has(user.id))
			.map((guild) => guild.id)

		const optedInServers = await context.prisma.server.findMany({
			where: { id: { in: servers } },
			select: { id: true },
		})

		return context.prisma.user
			.create({
				data: {
					...user,
					servers: { connect: optedInServers },
				},
			})
			.then((user) => ({ ...user, registered: true }))
	},
})
