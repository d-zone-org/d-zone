import { ChatChannel, ChatEvents, ChatModule } from './type'
import { PrismaClient } from '../prisma'

import Discord, { Client } from 'eris'
import { EventEmitter } from 'eventemitter3'
import { Logger } from 'tslog'

export const ID = 'd'

export const createDiscordModule = (
	token: string,
	datastore: PrismaClient,
	logger: Logger
) =>
	new Promise<ChatModule>((resolve, reject) => {
		const client = new Client(token)

		const channelMap = new Map<string, ChatChannel>()

		client.on('ready', () => {
			const main = async () => {
				logger.info('Connected to discord')

				const databaseChannels = await datastore.chatChannel.findMany({
					where: { module: ID },
				})

				const discordChannels = databaseChannels.map(
					(channel) => client.getChannel(channel.id) as Discord.TextChannel
				)

				for (const channel of discordChannels) {
					const events = new EventEmitter<ChatEvents>()

					channelMap.set(channel.id, {
						id: channel.id,
						events,
						activeUsers: new Map(),
					})
				}

				return { id: ID, channelMap }
			}

			main().then(resolve).catch(reject)
		})

		client.on(
			'messageCreate',
			({ channel, author, content, id, timestamp }) => {
				const chatChannel = channelMap.get(channel.id)

				if (chatChannel) {
					const user = { id: author.id, name: author.username }

					if (!chatChannel.activeUsers.has(author.id)) {
						chatChannel.activeUsers.set(author.id, user)
						chatChannel.events.emit('join', user)
					}

					chatChannel.events.emit('message', {
						content,
						id,
						timestamp: new Date(timestamp),
						user,
					})
				}
			}
		)

		logger.debug('Connecting to discord')
		client.connect().catch(reject)
	})
