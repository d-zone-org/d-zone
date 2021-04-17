import { Client } from 'eris'
import { Logger } from 'tslog'

import { ChatChannel, ChatModule } from '../type'
import { PrismaClient } from '../../prisma'

import { onClientReady } from './events/ready'
import { onMessageCreate } from './events/message-create'

export const ID = 'd'

export const createDiscordModule = (
	token: string,
	datastore: PrismaClient,
	logger: Logger
) =>
	new Promise<ChatModule>((resolve, reject) => {
		const client = new Client(token)
		const channelMap = new Map<string, ChatChannel>()

		client.on(
			'ready',
			onClientReady(
				{
					id: ID,
					channelMap,
					client,
					datastore,
					logger,
				},
				() => resolve({ id: ID, channelMap })
			)
		)

		client.on('messageCreate', onMessageCreate(channelMap))

		client.connect().catch(reject)
	})
