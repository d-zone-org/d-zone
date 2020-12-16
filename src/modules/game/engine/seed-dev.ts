import type { Entity, World } from 'ape-ecs'
import type { Direction, IGrid, IGridDirection } from '../typings'
import Map3D from '../common/map-3d'
import { createActor, hopActor } from './archetypes/actor'

export function addActors(world: World, map: Map3D, count: number): Entity[] {
	const entities: Entity[] = []
	const gridPool = createGridPool(20, 20, 1)
	for (let i = 0; i < count; i++) {
		const grid = gridPool.splice(
			Math.floor(Math.random() * gridPool.length),
			1
		)[0]
		entities.push(createActor(world, grid, map))
	}
	return entities
}

export function randomString(
	[charMin, charMax]: [number, number],
	length: number
): string {
	let value = ''
	for (let i = 0; i < length; i++) {
		value += String.fromCharCode(Math.random() * (charMax - charMin) + charMin)
	}
	return value
}

const ACTOR_COLORS: number[] = [
	0x119922,
	0x99ff22,
	0x00ff22,
	0xffff33,
	0x992222,
	0x44ff99,
]

export function randomColor(): number {
	return ACTOR_COLORS[Math.floor(Math.random() * ACTOR_COLORS.length)]
}

export function createGridPool(
	xSize: number,
	ySize: number,
	zSize: number
): IGrid[] {
	const pool: IGrid[] = []
	for (let x = 0; x < xSize; x++) {
		for (let y = 0; y < ySize; y++) {
			for (let z = 0; z < zSize; z++) {
				pool.push({
					x: x - Math.floor(xSize / 2),
					y: y - Math.floor(ySize / 2),
					z: z - Math.floor(zSize / 2),
				})
			}
		}
	}
	return pool
}

export function randomHop(): IGridDirection {
	const direction = Object.keys(Map3D.Directions)[
		Math.floor(Math.random() * 4)
	] as Direction
	return Map3D.Directions[direction]
}

export function hopTest(world: World, map: Map3D) {
	createActor(world, { x: 1, y: 0, z: 0 }, map)
	const hop2 = createActor(world, { x: 1, y: 0, z: 1 }, map)
	setTimeout(() => {
		hopActor(hop2, Map3D.Directions.west)
	}, 1700)
	createActor(world, { x: 0, y: 0, z: 0 }, map)
	createActor(world, { x: 0, y: -1, z: 0 }, map)
	createActor(world, { x: 0, y: -1, z: 1 }, map)
	hopActor(
		createActor(world, { x: 0, y: -1, z: 2 }, map),
		Map3D.Directions.south
	)

	createActor(world, { x: -1, y: 4, z: 0 }, map)
	createActor(world, { x: 0, y: 4, z: 0 }, map)
	createActor(world, { x: 0, y: 4, z: 1 }, map)
	hopActor(createActor(world, { x: 0, y: 4, z: 2 }, map), Map3D.Directions.west)

	for (let i = 0; i < 4; i++) {
		const hopper = createActor(world, { x: 4, y: i, z: 0 }, map)
		setTimeout(() => {
			setInterval(() => {
				hopActor(hopper, Map3D.Directions.south)
			}, 1500)
		}, i * 300)
	}
}

export function seedGame(world: World, map: Map3D) {
	const actors = addActors(world, map, 100)
	setInterval(() => {
		hopActor(actors[Math.floor(Math.random() * actors.length)])
	}, 250)
}
