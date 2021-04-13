import React from 'react'
import { useDaisy } from 'root/modules/daisy'
import { useWatch } from 'root/modules/utils/watch.hook'

export const GameComponent = () => {
	const { canvasRef, gameRef } = useDaisy()
	const entities = useWatch(() => gameRef.current?.engine.world.entities.size)

	// Development only
	const interact = (
		interaction: 'hopActor' | 'hopAllActors' | 'addActor' | 'removeActor'
	) => {
		if (gameRef.current) gameRef.current.interactions[interaction]()
	}

	return (
		<div>
			<div>Number of entities - {entities.current}</div>

			<div>
				<button onClick={() => interact('addActor')}>Add Actor</button>
				<button onClick={() => interact('removeActor')}>Remove Actor</button>
				<button onClick={() => interact('hopActor')}>Hop Actor</button>
				<button onClick={() => interact('hopAllActors')}>Hop All Actors</button>
			</div>

			<canvas ref={canvasRef} />
		</div>
	)
}

export default GameComponent
