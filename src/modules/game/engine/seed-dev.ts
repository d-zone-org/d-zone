import { Entity, IEntityConfig, World } from 'ape-ecs'
import Map3D from '../common/map-3d'
import { Cell3D } from '../common/cell-3d'
import Transform from './components/transform'
import Sprite from './components/sprite'
import Actor from './components/actor'
import Hop from './components/hop'
import MapCell from './components/map-cell'
import Engine from '.'
import { DIRECTIONS } from '../constants'
import { Direction, Grid, GridDirection } from '../typings'

export function createActor(world: World, grid: Grid, map: Map3D): Entity {
	return world.createEntity({
		c: {
			[Transform.key]: {
				type: Transform.typeName,
				...grid,
			},
			[Sprite.key]: {
				type: Sprite.typeName,
				texture: 'cube:0',
			},
			[Actor.key]: {
				type: Actor.typeName,
				userID: randomString([48, 57], 18),
				username: randomString([32, 126], Math.floor(Math.random() * 12) + 3),
				color: randomColor(),
			},
			[MapCell.key]: {
				type: MapCell.typeName,
				cell: new Cell3D({
					map,
					...grid,
					properties: { solid: true, platform: true },
				}),
			},
		},
	} as IEntityConfig)
}

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

const COLORS: number[] = [
	0x119922,
	0x99ff22,
	0x00ff22,
	0xffff33,
	0x992222,
	0x44ff99,
]

export function randomColor(): number {
	return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function createGridPool(
	xSize: number,
	ySize: number,
	zSize: number
): Grid[] {
	const pool: Grid[] = []
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

export function hopActor(actor: Entity, direction?: GridDirection) {
	if (actor.has(Hop.typeName)) return // Already hopping
	actor.addComponent({
		type: Hop.typeName,
		key: Hop.key,
		...(direction || randomHop()),
	})
}

export function randomHop(): GridDirection {
	const direction = Object.keys(DIRECTIONS)[
		Math.floor(Math.random() * 4)
	] as Direction
	return DIRECTIONS[direction]
}

export function hopTest(world: World, map: Map3D) {
	createActor(world, { x: 1, y: 0, z: 0 }, map)
	const hop2 = createActor(world, { x: 1, y: 0, z: 1 }, map)
	setTimeout(() => {
		hopActor(hop2, DIRECTIONS.west)
	}, 1700)
	createActor(world, { x: 0, y: 0, z: 0 }, map)
	createActor(world, { x: 0, y: -1, z: 0 }, map)
	createActor(world, { x: 0, y: -1, z: 1 }, map)
	hopActor(createActor(world, { x: 0, y: -1, z: 2 }, map), DIRECTIONS.south)

	createActor(world, { x: -1, y: 4, z: 0 }, map)
	createActor(world, { x: 0, y: 4, z: 0 }, map)
	createActor(world, { x: 0, y: 4, z: 1 }, map)
	hopActor(createActor(world, { x: 0, y: 4, z: 2 }, map), DIRECTIONS.west)

	for (let i = 0; i < 4; i++) {
		const hopper = createActor(world, { x: 4, y: i, z: 0 }, map)
		setTimeout(() => {
			setInterval(() => {
				hopActor(hopper, DIRECTIONS.south)
			}, 1500)
		}, i * 300)
	}
}

export function seedGame(engine: Engine, map: Map3D) {
	const actors = addActors(engine.world, map, 100)
	setInterval(() => {
		hopActor(actors[Math.floor(Math.random() * actors.length)])
	}, 250)
}
