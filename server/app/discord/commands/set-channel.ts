import Eris from 'eris'
import { PrismaClient } from 'server/.gen/prisma'

export async function setChannelCommand(
	client: Eris.Client,
	message: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
	prisma: PrismaClient
) {
	const channel = client.getChannel(message.channel.id) as Eris.TextChannel

	if (!('guild' in channel))
		return channel.createMessage('This command can only be run in guilds')

	const author = channel.guild.members.get(message.author.id)!

	if (!author.permissions.has('manageChannels'))
		return channel.createMessage('You are not the owner')

	const dzoneChannelId = message.channelMentions.shift()
	const dzoneChannel = dzoneChannelId
		? channel.guild.channels.get(dzoneChannelId)
		: null

	if (!dzoneChannel) return channel.createMessage('Channel not found')

	await prisma.server.upsert({
		where: { id: channel.guild.id },
		create: { id: channel.guild.id, channel: dzoneChannel.id },
		update: { channel: dzoneChannel.id },
	})

	return channel.createMessage(`Set <#${dzoneChannel.id}> as d-zone channel`)
}
