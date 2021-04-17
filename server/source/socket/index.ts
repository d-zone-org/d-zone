import http from 'http'

import { Server } from 'socket.io'
import { Logger } from 'tslog'

import { ClientEvents, ServerEvents } from './type'
import { ChatModule } from '../chat/type'

export const createSocketServer = (httpServer: http.Server, logger: Logger) => {
	const server = new Server<ClientEvents, ServerEvents>(httpServer, {
		serveClient: false,
	})

	server.on('connection', (socket) => {
		logger.debug(`New user ${socket.id}`)

		socket.on('joinRequest', (channelId, callback) => {
			logger.debug(`User ${socket.id} joined ${channelId}`)
			socket.join(channelId)
			callback(true)
		})
	})

	return server
}

export function connectSocketChat(
	chatModules: ChatModule[],
	socket: Server<ClientEvents, ServerEvents>
) {
	for (const chatModule of chatModules) {
		for (const [id, channel] of chatModule.channelMap) {
			channel.events.on('message', (message) =>
				socket.to(id).emit('message', message)
			)
			channel.events.on('join', (user) => socket.to(id).emit('join', user))
			channel.events.on('leave', (user) => socket.to(id).emit('leave', user))
		}
	}
}
