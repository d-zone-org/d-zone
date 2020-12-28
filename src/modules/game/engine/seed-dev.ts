import type { Entity, World } from 'ape-ecs'
import type { Direction, IGrid, IGridDirection } from '../typings'
import Map3D from '../common/map-3d'
import { createActor, addHopComponent } from './archetypes/actor'

/**
 * Adds random actors to the world.
 *
 * @param world - The world instance to add actors to.
 * @param map - The map instance to use for creating [[Map]] components.
 * @param count - The number of actors to add.
 * @returns - An array of the actor entities that were added.
 */
export function addActors(
	world: World,
	map: Map3D<Entity>,
	count: number
): Entity[] {
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

/**
 * Generates a random string of specified length and character code space.
 *
 * @param __namedParameters - The range of character codes to use in the generated string.
 * @param length - The length of the string to generate.
 * @returns - A random string.
 */
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

/**
 * Picks a random color from a predefined list of actor colors.
 *
 * @returns - A 24-bit color value.
 */
export function randomColor(): number {
	return ACTOR_COLORS[Math.floor(Math.random() * ACTOR_COLORS.length)]
}

/**
 * Creates a list of grid coordinates for an area of a specified size.
 *
 * @param xSize - The width of the grid pool to create.
 * @param ySize - The length of the grid pool to create.
 * @param zSize - The height of the grid pool to create.
 * @returns - An array of grid coordinates.
 */
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

/**
 * Picks a random direction to use for hopping.
 *
 * @returns - A random direction.
 */
export function randomHop(): IGridDirection {
	const direction = Object.keys(Map3D.Directions)[
		Math.floor(Math.random() * 4)
	] as Direction
	return Map3D.Directions[direction]
}

/**
 * Debug function used to create actors in specific locations and hop them in
 * specific directions at specific times.
 *
 * @param world - The game world instance.
 * @param map - The map instance to create actors in.
 */
export function hopTest(world: World, map: Map3D<Entity>) {
	const hop1 = createActor(world, { x: -1, y: 0, z: 0 }, map)
	const hop2 = createActor(world, { x: 0, y: 0, z: 0 }, map)
	setTimeout(() => {
		addHopComponent(hop1, Map3D.Directions.east)
	}, 1000)
	setTimeout(() => {
		addHopComponent(hop2, Map3D.Directions.north)
	}, 1430)
	// createActor(world, { x: 0, y: 0, z: 0 }, map)
	// createActor(world, { x: 0, y: -1, z: 0 }, map)
	// createActor(world, { x: 0, y: -1, z: 1 }, map)
	// addHopComponent(
	// 	createActor(world, { x: 0, y: -1, z: 2 }, map),
	// 	Map3D.Directions.south
	// )

	// createActor(world, { x: -1, y: 4, z: 0 }, map)
	// createActor(world, { x: 0, y: 4, z: 0 }, map)
	// createActor(world, { x: 0, y: 4, z: 1 }, map)
	// addHopComponent(createActor(world, { x: 0, y: 4, z: 2 }, map), Map3D.Directions.west)
	//
	// for (let i = 0; i < 4; i++) {
	// 	const hopper = createActor(world, { x: 4, y: i, z: 0 }, map)
	// 	setTimeout(() => {
	// 		setInterval(() => {
	// 			addHopComponent(hopper, Map3D.Directions.south)
	// 		}, 1500)
	// 	}, i * 300)
	// }
}

/**
 * Populates the game with actors for demonstration purposes.
 *
 * @param world - The game world instance.
 * @param map - The map instance to create actors in.
 */
export function seedGame(world: World, map: Map3D<Entity>) {
	const actors = addActors(world, map, 100)
	setInterval(() => {
		addHopComponent(actors[Math.floor(Math.random() * actors.length)])
	}, 250)
	// hopTest(world, map)
}
