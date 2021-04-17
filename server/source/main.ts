import 'dotenv/config'

import http from 'http'

import { Logger } from 'tslog'

import { PrismaClient } from './prisma'
import { handleError } from './error'

import { createDiscordModule } from './chat/discord'
import { createSocketServer, connectSocketChat } from './socket'

import { createNextServer } from './next'

/** Main entry point for runtime */
async function main() {
	const DISCORD_TOKEN = process.env['DISCORD_TOKEN']
	const PORT = process.env['PORT'] || 8080
	const DEV = !process.env['PRODUCTION']

	if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN not set')

	const logger = new Logger()
	const prisma = new PrismaClient()

	const httpServer = http.createServer(
		await createNextServer(DEV, logger.getChildLogger())
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
