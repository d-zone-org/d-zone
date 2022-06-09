import { queryField } from 'nexus'

export const GetSessionUser = queryField('GetSessionUser', {
	type: 'User',

	async resolve(_source, _args, context) {
		const user = context.session.user
		if (!user) return null

		const databaseUser = await context.prisma.user.findUnique({
			where: { id: user.id },
		})

		if (databaseUser) return { ...databaseUser, registered: true }
		else return { ...user, registered: false }
	},
})
