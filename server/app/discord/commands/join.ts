import Eris from 'eris'

export function joinCommand(
	client: Eris.Client,
	message: Eris.Message<Eris.PossiblyUncachedTextableChannel>
) {
	const channel = client.getChannel(message.channel.id) as Eris.TextChannel

	return channel.createMessage({
		embed: {
			title: 'Join d-zone!',
			color: 0x9e908f,
			description: `Click on [this](https://localhost:8080/create-account) link to join d-zone`,
		},
	})
}
