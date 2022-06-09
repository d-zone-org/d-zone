import ws from 'ws'
import Eris from 'eris'
import { ServerOptions } from 'graphql-ws'
import { Extra, useServer } from 'graphql-ws/lib/use/ws'

import { Context } from './context'
import { schema } from './schema'
import { PrismaClient } from '$/database'
import { sessionHandler } from '$/server/session'

export function startGraphQLServer(
	server: ws.Server,
	prisma: PrismaClient,
	client: Eris.Client
) {
	const getSession = sessionHandler({ prisma })

	const options: ServerOptions = {
		schema,

		context: async ({ extra }: { extra: Extra }): Promise<Context> => {
			const session = getSession(extra.request)
			const data = await session.get()
			return { prisma, session: data, client }
		},
	}

	useServer(options, server)
}
