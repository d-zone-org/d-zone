import ws, { Server as WSServer } from 'ws'
import { Server as HTTPServer } from 'http'
import { EventEmitter } from 'eventemitter3'
import { AppError } from './utils/error'

export interface WebSocketServerEvents<ClientPayload> {
	connectionOpen: [ws]
	connectionClose: [ws, number, string]
	error: [AppError]
	message: [ws, ClientPayload]
}

/**
 * Thin wrapper around ws for better API.
 *
 * Emits error event with AppError Handles parsing of messages from and to
 * server Should handle heart-beating in next versions
 */
export class WebSocketServer<
	ServerPayload extends unknown,
	ClientPayload extends unknown
> extends EventEmitter<WebSocketServerEvents<ClientPayload>> {
	constructor(httpServer: HTTPServer) {
		super()

		const webSocketServer = new WSServer({ server: httpServer })

		webSocketServer.on('connection', (client) => {
			if (client.readyState === client.OPEN) this.emit('connectionOpen', client)
			else client.on('open', () => this.emit('connectionOpen', client))

			client.on('close', (...args) =>
				this.emit('connectionClose', client, ...args)
			)

			client.on('message', (data) =>
				this.emit('message', client, JSON.parse(data.toString()))
			)

			client.on('error', (error) =>
				client.emit(
					'error',
					new AppError('CLIENT_WS_ERROR', 'WS connection errored', true, error)
				)
			)
		})

		webSocketServer.on('error', (error) =>
			this.emit(
				'error',
				new AppError(
					'WS_SERVER_ERROR',
					'Websocket server errored',
					false,
					error
				)
			)
		)
	}

	sendMessage(client: ws, message: ServerPayload) {
		return new Promise<void>((resolve, reject) => {
			if (client.readyState === client.OPEN)
				client.send(JSON.stringify(message), (error) => {
					if (error)
						reject(
							new AppError(
								'WS_UNABLE_TO_SEND_MESSAGE',
								'Unable to send message',
								true,
								error
							)
						)
					else resolve()
				})
			else
				reject(
					new AppError(
						'WS_CLIENT_NOT_OPEN',
						'Client connection was not yet opened.',
						false
					)
				)
		})
	}
}
