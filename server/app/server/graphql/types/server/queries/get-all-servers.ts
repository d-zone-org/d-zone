import { list, queryField } from 'nexus'

export const GetAllServers = queryField('GetAllServers', {
	type: list('Server'),

	resolve(_source, _args, context) {
		return context.prisma.server.findMany({})
	},
})
