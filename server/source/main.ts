import 'dotenv/config'

import { handleError } from './error'

import { Logger } from 'tslog'
import { PrismaClient } from './prisma'

import { createDiscordModule } from './chat/discord'

async function main() {
	const DISCORD_TOKEN = process.env['DISCORD_TOKEN']

	const logger = new Logger()
	const prisma = new PrismaClient()

	const chatModules = [
		await createDiscordModule(DISCORD_TOKEN!, prisma, logger.getChildLogger()),
	]

	chatModules.forEach((modules) =>
		modules.channelMap.forEach((chat) => chat.events.on('message', console.log))
	)
}

main().catch(handleError)
