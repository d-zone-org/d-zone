import 'dotenv/config'

import http from 'http'

import { Logger } from 'tslog'

import { PrismaClient } from './prisma'
import { handleError } from './error'
import { createDiscordModule } from './chat/discord'
import { createSocketServer } from './socket'
import { createNextServer } from './next'

async function main() {
	const DISCORD_TOKEN = process.env['DISCORD_TOKEN']
	const PORT = process.env['PORT'] || 8080
	const DEV = !process.env['PRODUCTION']

	const logger = new Logger()
	const prisma = new PrismaClient()

	const httpServer = http.createServer(
		await createNextServer(DEV, logger.getChildLogger())
	)

	createSocketServer(httpServer, logger.getChildLogger())

	// @ts-expect-error Connect this to sockets
	const chatModules = [
		await createDiscordModule(DISCORD_TOKEN!, prisma, logger.getChildLogger()),
	]

	httpServer.listen(PORT, () => logger.info(`Listening on ${PORT}`))
}

main().catch(handleError)
