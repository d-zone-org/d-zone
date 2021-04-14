import { ChatChannel } from '../../type'

import Discord from 'eris'

export const onMessageCreate = (channelMap: Map<string, ChatChannel>) => ({
	channel,
	author,
	content,
	id,
	timestamp,
}: Discord.Message) => {
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
