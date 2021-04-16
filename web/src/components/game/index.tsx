import React from 'react'
import { useSocket } from 'root/modules/communication/socket'

export const GameComponent = () => {
	useSocket()

	return (
		<div>
			<canvas />
		</div>
	)
}

export default GameComponent
