import { PrismaClient } from '../../../prisma'
import { ChatEvents, ChatChannel } from '../../type'
import { handleError } from '../../../error'

import Discord from 'eris'
import EventEmitter from 'eventemitter3'
import { Logger } from 'tslog'

const populateChannelMap = async ({
	id,
	datastore,
	client,
	channelMap,
}: {
	id: string
	datastore: PrismaClient
	client: Discord.Client
	channelMap: Map<string, ChatChannel>
}) => {
	const databaseChannels = await datastore.chatChannel.findMany({
		where: { module: id },
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
}

export const onClientReady = (
	{
		id,
		channelMap,
		client,
		datastore,
		logger,
	}: {
		id: string
		channelMap: Map<string, ChatChannel>
		client: Discord.Client
		datastore: PrismaClient
		logger: Logger
	},
	callback: () => Promise<void> | void
) => () => {
	logger.info('Connected to discord gateway')

	populateChannelMap({
		id,
		channelMap,
		client,
		datastore,
	})
		.then(() => callback())
		.catch(handleError)
}
