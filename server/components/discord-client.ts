import eris from 'eris'
import config from '../utils/config'

export default async () => {
	const client = new eris.Client(config.discordClientToken)

	client.on('error', (error) => {
		console.error(error)
	})

	await client.connect()
}
