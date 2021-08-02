import http from 'http'
import { Server } from 'socket.io'

/**
 * Attaches HTTP server to the socket
 *
 * @param httpServer - HTTP Server
 */
export function attachSocketServer(httpServer: http.Server) {
	handleServer(
		new Server(httpServer, {
			serveClient: false,
		})
	)
}

/**
 * Handles server events
 *
 * @param server - Socket server
 */
function handleServer(server: Server) {
	server.on('connection', (socket) => {
		console.log({ socket })
	})
}
