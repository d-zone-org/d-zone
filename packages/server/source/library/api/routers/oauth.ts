import Router from 'koa-router'
import { StatusCodes } from 'http-status-codes'

import { URLSearchParams } from 'url'

import {
	generateDiscordRedirectUrl,
	getUser,
	requestDiscordToken,
} from '../../utils/discord'

import { DZoneContext, Server } from '../../types/api'

/**
 * Initialises router to handle oauth and sessions.
 *
 * @param application - Koa application
 * @param options - Router options
 */
export async function initialiseOAuthRouter(
	application: Server,
	options: {
		clientId: string
		clientSecret: string
		baseUrl: string
		router: Router.IRouterOptions
	}
) {
	const router = new Router<any, DZoneContext>(options.router)

	// Redirect clients to discord oauth page
	router.redirect(
		'/discord/redirect',

		generateDiscordRedirectUrl(
			options.clientId,
			options.baseUrl + '/discord/callback'
		),

		StatusCodes.TEMPORARY_REDIRECT
	)

	// Callback handler for discord oauth page
	router.get('/discord/callback', async (context) => {
		const searchParams = new URLSearchParams(context.search)
		const code = searchParams.get('code')

		if (!code) {
			context.status = StatusCodes.BAD_REQUEST
			return
		}

		const token = await requestDiscordToken({
			code,
			clientId: options.clientId,
			clientSecret: options.clientSecret,
			redirectUri: options.baseUrl + '/discord/callback',
		})

		context.session.user = await getUser(token)
		context.status = StatusCodes.OK
	})

	application.use(router.routes())
	application.use(router.allowedMethods())
}
