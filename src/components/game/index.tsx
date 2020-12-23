import React, { useEffect, useRef } from 'react'
import Game from '../../modules/game'
import { Client } from '../../modules/websocket/index.worker'

export const GameComponent = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const game = new Game()
	const client = new Client()

	useEffect(() => {
		client.init()
		if (canvasRef.current) game.init(canvasRef.current).catch(console.error)

		return () => {
			game.exit()
		}
	}, [canvasRef])

	return <canvas ref={canvasRef} />
}

export default GameComponent
