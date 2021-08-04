import Discord from 'discord.js'
import Koa from 'koa'
import session from 'koa-session'
import body from 'koa-body'
import { Logger } from 'tslog'

import { handleError } from './library/utils/error'
import { config } from './library/utils/config'
import { createOAuthRouter } from './library/routers/oauth'

async function main() {
	const client = new Discord.Client()
	const server = new Koa()
	const logger = new Logger()

	server.use(session({ maxAge: 1000 * 60 * 15, rolling: true }, server))
	server.use(body())

	const oAuth = createOAuthRouter({
		logger: logger.getChildLogger({ name: 'oauthRouter' }),
		routerOptions: { prefix: '/api/oauth' },
		options: {
			clientSecret: config.discordClient.secret,
			clientId: config.discordClient.id,
			baseUrl: 'http://localhost:4000/api/oauth',
		},
	})

	server.use(oAuth.routes())
	server.use(oAuth.allowedMethods())

	await client.login(config.discordClient.token)
	await server.listen(4000)
	logger.info('Listening on localhost:4000')
}

main().catch(handleError)
