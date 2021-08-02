import http from 'http'

import { createRestServer } from './rest'
import { attachSocketServer } from './socket'

export function startAPI(port: number) {
	const server = http.createServer(createRestServer())
	attachSocketServer(server)

	return new Promise<void>((resolve) => server.listen(port, () => resolve()))
}
