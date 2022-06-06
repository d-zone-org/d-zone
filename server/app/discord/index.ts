import { PrismaClient } from '@prisma/client'
import Eris from 'eris'
import { configuration } from '$/config'
import { setChannelCommand as runtDZoneCommand } from './commands/set-channel'

import { commandInfo as runInfoCommand } from './commands/info'
import { joinCommand as runJoinCommand } from './commands/join'

export async function startBot(prisma: PrismaClient) {
	const token = configuration.get('discord.token')
	const prefix = 'd!'

	const client = new Eris.Client(token, {
		intents: ['guilds', 'guildMembers', 'guildMessages', 'guildPresences'],
	})

	client.on('messageCreate', (message) => {
		if (!message.content.startsWith(prefix)) return

		const content = message.content.slice(prefix.length).split(/\s/)
		const command = content.shift()

		switch (command) {
			case 'info':
			case 'i':
				return runInfoCommand(client, message)

			case 'join':
			case 'j':
				return runJoinCommand(client, message)

			case 'set-channel':
			case 'c':
				return runtDZoneCommand(client, message, prisma)

			default:
				break
		}
	})

	await client.connect()

	return client
}
