import React from 'react'
import { initGame } from './Game'

export default () => (
	<canvas ref={(elem: HTMLCanvasElement) => initGame(elem)}></canvas>
)
