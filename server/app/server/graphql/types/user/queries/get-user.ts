import { queryField } from 'nexus'

export const GetUser = queryField('GetUser', {
	type: 'User',
	args: { id: 'String' },

	async resolve(_source, args, context) {
		const id = args.id || context.session.user?.id

		if (id)
			return context.prisma.user.findUnique({
				where: { id },
			})
		else return null
	},
})
