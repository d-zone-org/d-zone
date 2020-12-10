import React from 'react'
import Game from './game'

export type GameType = React.FC

export const GameComponent: GameType = () => {
	return <canvas ref={(elem: HTMLCanvasElement) => elem && new Game(elem)} />
}

export default GameComponent
