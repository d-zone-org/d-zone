import Koa from 'koa'
import { Logger } from 'tslog'

import { buildMiddleware } from './web'

export const createHTTPServer = async (dev: boolean, logger: Logger) => {
	const server = new Koa()

	server.use(await buildMiddleware(dev))

	logger.debug('Created koa server')
	return server.callback()
}
