import { createServer as createHTTPServer } from 'http'

import config from './utils/config'
import createWebSocketServer from './components/websocket'
import createNextWrapper from './components/next-wrapper'
import createDiscordClient from './components/discord-client'

const main = async () => {
	const bot = await createDiscordClient()
	const nextWrapper = await createNextWrapper()
	const server = createHTTPServer(nextWrapper.requestHandler)
	const ws = await createWebSocketServer({ server })

	// quick code to get messages from the first server
	// do not judge

	const guild = bot.guilds.find(({ id }) => id === '700890186883530844')
	if (!guild) throw new Error('Guild not found')

	bot.on('messageCreate', (message) => {
		if (message.guildID !== guild.id) return
		ws.sendData({ type: 'SERVER_MESSAGE', data: { message: message.content } })
	})

	server.listen(config.port)
	console.log(`Listening on - ${config.port}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
