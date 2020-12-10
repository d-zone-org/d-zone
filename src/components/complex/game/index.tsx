import React, { useEffect, useRef } from 'react'
import Game from './game'

export const GameComponent = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const game = new Game()

	useEffect(() => {
		if (canvasRef.current) game.init(canvasRef.current)
	}, [canvasRef])

	return <canvas ref={canvasRef} />
}

export default GameComponent
