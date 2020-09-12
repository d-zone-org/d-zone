import React from 'react'

export const Home: React.FC = () => {
	const Game = React.lazy(() => import('../../components/Game'))

	return (
		<div>
			<div id="game-wrapper">
				<React.Suspense fallback={<p>Loading</p>}>
					<Game />
				</React.Suspense>
			</div>
		</div>
	)
}
