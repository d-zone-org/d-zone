import Koa from 'koa'
import { Logger } from 'tslog'

export const createHTTPServer = async (dev: boolean, logger: Logger) => {
	const server = new Koa()
	logger.debug('Created koa server', { dev })
	return server.callback()
}
