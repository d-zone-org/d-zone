import Discord from 'discord.js'
import Koa from 'koa'
import body from 'koa-body'
import session from 'koa-session'
import { Logger } from 'tslog'
import { StatusCodes } from 'http-status-codes'

import { handleError } from './library/utils/error'
import { config } from './library/utils/config'
import { Server } from './library/types/api'
import { initialiseOAuthRouter } from './library/api/routers/oauth'
import { initialiseUserRouter } from './library/api/routers/user'

async function main() {
	const client = new Discord.Client()
	const logger = new Logger()
	const server = new Koa() as Server

	server.keys = [
		'A random key that I should have put in env, but I am very lazy',
	]

	server.use(body())
	// @ts-expect-error Expects koa server with defaults
	server.use(session({ maxAge: 1000 * 60 * 15, rolling: true }, server))

	await initialiseOAuthRouter(server, {
		clientSecret: config.discordClient.secret,
		clientId: config.discordClient.id,
		baseUrl: 'http://localhost:4000/api/oauth',
		router: { prefix: '/api/oauth' },
	})

	await initialiseUserRouter(server, {
		router: { prefix: '/api/user' },
	})

	server.on('error', (error, context) => {
		handleError(error)
		context.status = error.status || StatusCodes.INTERNAL_SERVER_ERROR
	})

	await client.login(config.discordClient.token)

	await server.listen(4000)
	logger.info('Listening on localhost:4000')
}

main().catch(handleError)
