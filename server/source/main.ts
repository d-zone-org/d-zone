import 'dotenv/config'

import http from 'http'

import { Logger } from 'tslog'

import { PrismaClient } from './prisma'
import { handleError } from './error'

import { createDiscordModule } from './chat/discord'
import { createSocketServer, connectSocketChat } from './socket'
import { createHTTPServer } from './http'

/** Main entry point for runtime */
async function main() {
	const logger = new Logger()

	const DISCORD_TOKEN = process.env['DISCORD_TOKEN']
	const PORT = process.env['PORT'] || 8080
	const DEV = process.env['NODE_ENV'] !== 'production'

	logger.info(`Development mode`, DEV)

	if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN not set')

	const prisma = new PrismaClient()

	const httpServer = http.createServer(
		await createHTTPServer(DEV, logger.getChildLogger())
	)

	const socketServer = createSocketServer(httpServer, logger.getChildLogger())

	const chatModules = [
		await createDiscordModule(DISCORD_TOKEN, prisma, logger.getChildLogger()),
	]

	connectSocketChat(chatModules, socketServer)

	httpServer.listen(PORT, () => logger.info(`Listening on ${PORT}`))
}

main().catch(handleError)

export * from './socket/type'
export * from './chat/type'
