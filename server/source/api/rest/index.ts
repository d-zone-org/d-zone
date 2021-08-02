import Koa from 'koa'

/**
 * Creates a REST Server
 *
 * @returns Request handler callback
 */
export function createRestServer() {
	const server = new Koa()

	return server.callback()
}
