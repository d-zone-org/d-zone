import Router, { IRouterOptions } from 'koa-router'

import { DZoneContext, Server } from '../../types/api'

/**
 * Initialise user router
 *
 * @param application - Koa application
 * @param options - User router options
 */
export async function initialiseUserRouter(
	application: Server,
	options: { router: IRouterOptions }
) {
	const router = new Router<any, DZoneContext>(options.router)

	router.get('/', (context) => {
		context.body = JSON.stringify(context.session.user)
		context.set('Conent-Type', 'application/json')
	})

	application.use(router.routes())
	application.use(router.allowedMethods())
}
