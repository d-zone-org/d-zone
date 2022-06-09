import http from 'http'

import ws from 'ws'
import Eris from 'eris'
import { Logger } from 'tslog'

import { PrismaClient } from '$/database'
import { startAuthenticationServer } from './authentication/server'
import { startGraphQLServer } from './graphql/server'

export function startServers(prisma: PrismaClient, client: Eris.Client) {
	const logger = new Logger({ name: 'server' })
	const httpServer = http.createServer()
	const webSocketServer = new ws.Server({
		server: httpServer,
		path: '/graphql',
	})

	startAuthenticationServer(httpServer, prisma)
	startGraphQLServer(webSocketServer, prisma, client)

	httpServer.listen(4000, () => logger.info('Listening on 4000'))
}
