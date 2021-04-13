import http, { createServer as createHTTPServer } from 'http'
import url from 'url'
import discord from 'eris'

import { parseConfig } from './utils/config'
import { handleError } from './utils/error'
import { Logger } from './utils/logger'
import { ClientManager } from './client-manager'
import { WebSocketServer } from './websocket-server'
import { IServerPayload, IClientPayload } from './typings/payload'

/** Main function. Everything starts here. */
export async function initServer(
	middlewareFactory: (
		devMode: boolean
	) => Promise<
		(
			req: http.IncomingMessage,
			res: http.ServerResponse,
			parsedUrl?: url.UrlWithParsedQuery | undefined
		) => Promise<void>
	>
) {
	const mainLogger = new Logger('❄️ MAIN')

	// Get the configuration
	const config = parseConfig({
		dev: process.env.NODE_ENV !== 'production',
		discord: { token: process.env.DISCORD_CLIENT_TOKEN },
		port: parseInt(process.env.PORT || '3000'),
	})

	// Create servers and discord client
	const middleware = await middlewareFactory(config.dev)
	const httpServer = createHTTPServer(middleware)
	const wsServer = new WebSocketServer<IServerPayload, IClientPayload>(
		httpServer
	)
	const discordClient = new discord.Client(config.discord.token)

	// Client manager
	// Manages clients
	// While handling websocket and discord client communication
	const clientManager = new ClientManager(wsServer, discordClient)

	// Error handlers
	httpServer.on('error', handleError)
	wsServer.on('error', handleError)
	discordClient.on('error', handleError)

	// Start only once discord client is ready
	discordClient.on('ready', () => {
		mainLogger.log(
			`Connected as ${discordClient.user.username} on ${discordClient.guilds.size} servers`
		)
		// If this is discord reconnecting, do not listen & init again
		if (!httpServer.listening) {
			httpServer.listen(config.port)
			mainLogger.log(`Listening on ${config.port}`)

			clientManager.init()
		}
	})

	// Start discord client
	// Once it is connected it starts server too
	await discordClient.connect()
}
