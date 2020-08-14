import { Entity, World } from 'ecsy'
import Transform from './components/Transform'
import Sprite from './components/Sprite'
import Actor from './components/Actor'
import Hop from './components/Hop'

export function addActors(world: World, count: number): Entity[] {
	let entities: Entity[] = []
	for (let i = 0; i < count; i++) {
		let actorEntity = world
			.createEntity()
			.addComponent(Transform, { x: randomCoord(), y: randomCoord(), z: 0 })
			.addComponent(Sprite, { width: 14, height: 14, sheet: 'cube' })
			.addComponent(Actor, {
				userID: randomString([48, 57], 18),
				username: randomString([32, 126], Math.floor(Math.random() * 12) + 3),
				color: randomColor(),
			})

		entities.push(actorEntity)
	}
	return entities
}

export function hopActor(actor: Entity, direction?: { x: number; y: number }) {
	if (!actor.hasComponent(Hop))
		actor.addComponent(Hop, direction || randomHop())
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

export function randomCoord(): number {
	return Math.round(Math.random() * 80 - 40)
}

export function randomHop(): object {
	let axis = Math.random() > 0.5 ? 'x' : 'y'
	let magnitude = Math.random() > 0.5 ? 1 : -1
	let hop: any = {}
	hop[axis] = magnitude
	return hop
}
