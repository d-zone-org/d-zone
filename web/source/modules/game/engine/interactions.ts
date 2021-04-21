import Transform from './components/transform'
import Actor from './components/actor'
import Draw from './components/draw'
import Texture from './components/texture'
import Map from './components/map'
import Hop from './components/hop'
import { addHopComponent, createActor } from './archetypes/actor'
import { Entity, Query, World } from 'ape-ecs'
import Map3D from 'root/modules/game/common/map-3d'
import { createGridPool } from 'root/modules/game/engine/seed-dev'

export default class Interactions {
	private world!: World
	private map!: Map3D<Entity>
	private actorQuery!: Query

	init(world: World, map: Map3D<Entity>) {
		this.world = world
		this.map = map
		this.actorQuery = world.createQuery({
			all: [Actor, Transform, Draw, Texture, Map],
			not: [Hop],
		})
	}

	hopActor() {
		const actors = [...this.actorQuery.refresh().execute()]
		if (actors.length === 0) return
		addHopComponent(actors[Math.floor(Math.random() * actors.length)])
	}

	hopAllActors() {
		this.actorQuery
			.refresh()
			.execute()
			.forEach((entity) => addHopComponent(entity))
	}

	addActor() {
		const gridPool = createGridPool(10, 10, 1)
		for (let i = 0; i < gridPool.length; i++) {
			const grid = gridPool.splice(
				Math.floor(Math.random() * gridPool.length),
				1
			)[0]
			if (this.map.getCellsAtGrid(grid).size === 0) {
				createActor(this.world, grid, this.map)
				break
			}
		}
	}

	removeActor() {
		const actors = [...this.actorQuery.refresh().execute()]
		if (actors.length === 0) return
		actors[Math.floor(Math.random() * actors.length)].destroy()
	}
}
