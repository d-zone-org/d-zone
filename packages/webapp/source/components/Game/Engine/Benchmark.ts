import { Entity, World } from 'ecsy'
import Transform from './components/Transform'
import Sprite from './components/Sprite'
import Actor from './components/Actor'
import Hop from './components/Hop'
import MapCell from './components/MapCell'

interface Grid {
	x: number
	y: number
	z: number
}

export function addActors(world: World, count: number): Entity[] {
	let entities: Entity[] = []
	let gridPool = createGridPool(30, 30, 1)
	for (let i = 0; i < count; i++) {
		let grid = gridPool.splice(
			Math.floor(Math.random() * gridPool.length),
			1
		)[0]
		let actorEntity = world
			.createEntity()
			.addComponent(Transform, grid)
			.addComponent(Sprite, { texture: 'cube:0' })
			.addComponent(Actor, {
				userID: randomString([48, 57], 18),
				username: randomString([32, 126], Math.floor(Math.random() * 12) + 3),
				color: randomColor(),
			})
		entities.push(actorEntity)
	}
	return entities
}

export function randomString(
	[charMin, charMax]: [number, number],
	length: number
): string {
	let value: string = ''
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
	let pool: Grid[] = []
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

const directions = {
	east: { x: 1, y: 0, direction: 'east' },
	west: { x: -1, y: 0, direction: 'west' },
	south: { y: 1, x: 0, direction: 'south' },
	north: { y: -1, x: 0, direction: 'north' },
}

export function hopActor(actor: Entity, direction?: keyof typeof directions) {
	if (actor.hasComponent(Hop)) return
	let hop = directions[direction as keyof typeof directions] || randomHop()
	let { value: mapCell } = actor.getComponent(MapCell)!
	if (!mapCell.getNeighbor(hop.x || 0, hop.y || 0, 0)) {
		mapCell.spread(hop.x || 0, hop.y || 0, 0)
		actor.addComponent(Hop, hop)
	}
}

export function randomHop(): object {
	let direction = Object.keys(directions)[Math.floor(Math.random() * 4)]
	return directions[direction as keyof typeof directions]
}
