import React, { useEffect, useRef } from 'react'
import Game from '../../modules/game'

export const GameComponent = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const game = new Game()

	useEffect(() => {
		if (canvasRef.current) game.init(canvasRef.current).catch(console.error)
		return () => game.exit()
	}, [canvasRef])

	return <canvas ref={canvasRef} />
}

export default GameComponent
