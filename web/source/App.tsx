import { hot } from 'react-hot-loader/root'
import React from 'react'
import Game from './components/game'

const App = () => {
	return (
		<div className="flex flex-col items-center">
			<h1 className="m-2 font-bold text-4xl">D Zone</h1>

			<Game />
		</div>
	)
}

export default hot(App)
