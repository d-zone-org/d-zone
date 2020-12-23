import http from 'http'
import WebSocket from 'ws'

import { ClientPayloads, ServerPayloads } from '../../interfaces/websocket'

export default async ({ server: httpServer }: { server: http.Server }) => {
	const server = new WebSocket.Server({ server: httpServer })

	server.on('connection', (websocket) => {
		websocket.on('message', (data) => {
			const message: ClientPayloads = JSON.parse(String(data))
			console.log(message)
		})
	})

	/**
	 * Send data to clients
	 *
	 * @param payload - Server payload
	 */
	function sendData(payload: ServerPayloads) {
		server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN)
				client.send(JSON.stringify(payload))
		})
	}

	return { sendData }
}
