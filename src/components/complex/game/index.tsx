import React from 'react'
import { initGame } from './game'

export type GameType = React.FC

export const Game: GameType = () => {
	return (
		<canvas ref={(elem: HTMLCanvasElement) => elem && initGame(elem)}></canvas>
	)
}

export default Game
