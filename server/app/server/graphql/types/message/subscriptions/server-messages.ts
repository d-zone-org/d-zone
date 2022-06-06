import events from 'events'
import { GuildChannel, Message } from 'eris'
import { nonNull, subscriptionField } from 'nexus'

export const ServerMessages = subscriptionField('ServerMessages', {
	type: 'Message',
	args: { id: nonNull('String') },
	resolve: (value) => value as any,

	subscribe: async function* (_, args, context) {
		const messages: AsyncIterableIterator<[Message]> = events.on(
			context.client,
			'messageCreate'
		)

		for await (const [message] of messages) {
			if (!(message.channel instanceof GuildChannel)) continue
			if (message.channel.guild.id !== args.id) continue

			const user = await context.prisma.user.findUnique({
				where: { id: message.author.id },
			})

			if (user === null) continue

			yield {
				...message,
				author: user,
			}
		}
	},
})
