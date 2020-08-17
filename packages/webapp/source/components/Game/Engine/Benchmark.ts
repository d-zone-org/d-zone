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
			.addComponent(Sprite, { width: 14, height: 14, texture: 'cube:0' })
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

export function randomCoord(): number {
	return Math.round(Math.random() * 40 - 20)
}

const directions = {
	east: { x: 1, direction: 'east' },
	west: { x: -1, direction: 'west' },
	south: { y: 1, direction: 'south' },
	north: { y: -1, direction: 'north' },
}

export function hopActor(actor: Entity, direction?: keyof typeof directions) {
	if (!actor.hasComponent(Hop))
		actor.addComponent(
			Hop,
			directions[direction as keyof typeof directions] || randomHop()
		)
}

export function randomHop(): object {
	let direction = Object.keys(directions)[Math.floor(Math.random() * 4)]
	return directions[direction as keyof typeof directions]
}
