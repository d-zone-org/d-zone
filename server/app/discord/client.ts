import events from 'events'
import Eris from 'eris'
import { Logger } from 'tslog'
import { PrismaClient } from '@prisma/client'

import { configuration } from '$/config'
import { Commands } from './handler'

import JoinCommand from './commands/join'
import RegisterCommand from './commands/register'
import StatusCommand from './commands/status'

export async function startBot(prisma: PrismaClient) {
	const logger = new Logger({ name: 'discord' })
	const config = configuration.get('discord')

	const client = new Eris.Client(config.token, {
		guildCreateTimeout: 30 * 1000,
		intents: ['guilds', 'guildMembers', 'guildMessages', 'guildPresences'],
	})

	const commands = new Commands({
		client,
		prisma,
		logger,
		embed: { color: 0x9e908f },
	})

	commands.register(JoinCommand)
	commands.register(RegisterCommand)
	commands.register(StatusCommand)

	await client.connect()
	await events.once(client, 'ready')
	logger.info('Connected to discord gateway')

	await commands.initialize()
	logger.info('Initialized commands')

	return client
}
