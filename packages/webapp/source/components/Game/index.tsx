import React from 'react'
import { initGame } from './Game'

export type GameType = React.FC

export const Game: GameType = () => {
	return <canvas ref={(elem: HTMLCanvasElement) => initGame(elem)}></canvas>
}

export default Game
