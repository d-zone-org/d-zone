import { io, Socket } from 'socket.io-client'
import { useEffect, useRef } from 'react'

import type { ClientEvents, ServerEvents } from 'server'

export const useSocket = () => {
	const socketRef = useRef<Socket | null>(null)

	useEffect(() => {
		const socket: Socket<
			ServerEvents,
			ClientEvents
		> = (socketRef.current = io())

		socket.once('connect', () =>
			socket.emit('joinRequest', '754236248314347530', (connected) =>
				console.log(`CONNECTED - ${connected}`)
			)
		)

		socket.on('message', console.log)

		socket.on('join', console.log)
	}, [])
}
