import { io, Socket } from 'socket.io-client'
import { useEffect, useRef } from 'react'

export const useSocket = () => {
	const socketRef = useRef<Socket>(null)

	useEffect(() => {
		const socket = (socketRef.current = io())
	}, [])
}
