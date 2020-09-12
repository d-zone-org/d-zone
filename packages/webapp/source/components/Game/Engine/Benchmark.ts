import { Entity, World } from 'ecsy'
import Transform from './components/Transform'
import Sprite from './components/Sprite'
import Actor from './components/Actor'
import Hop from './components/Hop'
import { Grid } from '../Common/Map'

export function createActor(world: World, grid: Grid): Entity {
	return world
		.createEntity()
		.addComponent(Transform, grid)
		.addComponent(Sprite, { texture: 'cube:0' })
		.addComponent(Actor, {
			userID: randomString([48, 57], 18),
			username: randomString([32, 126], Math.floor(Math.random() * 12) + 3),
			color: randomColor(),
		})
}

export function addActors(world: World, count: number): Entity[] {
	const entities: Entity[] = []
	const gridPool = createGridPool(20, 20, 1)
	for (let i = 0; i < count; i++) {
		const grid = gridPool.splice(
			Math.floor(Math.random() * gridPool.length),
			1
		)[0]
		const actorEntity = createActor(world, grid)
		entities.push(actorEntity)
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

interface direction {
	x: number
	y: number
	z: number
	direction: 'east' | 'west' | 'south' | 'north'
}

const directions = {
	east: { x: 1, y: 0, z: 0, direction: 'east' },
	west: { x: -1, y: 0, z: 0, direction: 'west' },
	south: { y: 1, x: 0, z: 0, direction: 'south' },
	north: { y: -1, x: 0, z: 0, direction: 'north' },
}

export function hopActor(
	actor: Entity,
	direction?: keyof typeof directions
): void {
	if (actor.hasComponent(Hop)) return // Already hopping
	actor.addComponent(
		Hop,
		directions[direction as keyof typeof directions] || randomHop()
	)
}

export function randomHop(): direction {
	const direction = Object.keys(directions)[Math.floor(Math.random() * 4)]
	return directions[direction as keyof typeof directions] as direction
}

export function hopTest(world: World): void {
	createActor(world, { x: 1, y: 0, z: 0 })
	const hop2 = createActor(world, { x: 1, y: 0, z: 1 })
	setTimeout(() => {
		hopActor(hop2, 'west')
	}, 1700)
	createActor(world, { x: 0, y: 0, z: 0 })
	createActor(world, { x: 0, y: -1, z: 0 })
	createActor(world, { x: 0, y: -1, z: 1 })
	hopActor(createActor(world, { x: 0, y: -1, z: 2 }), 'south')

	createActor(world, { x: -1, y: 4, z: 0 })
	createActor(world, { x: 0, y: 4, z: 0 })
	createActor(world, { x: 0, y: 4, z: 1 })
	hopActor(createActor(world, { x: 0, y: 4, z: 2 }), 'west')

	for (let i = 0; i < 4; i++) {
		const hopper = createActor(world, { x: 4, y: i, z: 0 })
		setTimeout(() => {
			setInterval(() => {
				hopActor(hopper, 'south')
			}, 1500)
		}, i * 300)
	}
}
