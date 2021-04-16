import http from 'http'

import { Server } from 'socket.io'
import { Logger } from 'tslog'

export const createSocketServer = (httpServer: http.Server, logger: Logger) => {
	const server = new Server(httpServer, { serveClient: false })

	server.on('connection', (socket) => {
		logger.info('New client', socket)
	})
}
