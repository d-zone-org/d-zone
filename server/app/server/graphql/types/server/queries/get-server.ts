import { nonNull, queryField } from 'nexus'

export const GetServer = queryField('GetServer', {
	type: 'Server',
	args: { id: nonNull('String') },

	resolve(_source, args, context) {
		return context.prisma.server.findUnique({
			where: { id: args.id },
		})
	},
})
