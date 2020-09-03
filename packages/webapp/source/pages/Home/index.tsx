import React from 'react'

export default () => {
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
