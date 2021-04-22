import React from 'react'
import Game from './components/game'

export const App = () => {
	return (
		<div className="flex flex-col items-center">
			<h1 className="m-2 font-bold text-4xl">D Zone</h1>

			<Game />
		</div>
	)
}
