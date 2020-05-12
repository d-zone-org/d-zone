import ECS, { Entity } from 'ecs-lib'
import ActorEntity from './entities/ActorEntity'

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
	return Math.round(Math.random() * 600)
}

export function addActors(world: ECS, count: number): Entity[] {
	let entities: Entity[] = []
	for (let i = 0; i < count; i++) {
		let actorEntity: Entity = new ActorEntity(
			{
				userID: randomString([48, 57], 18),
				username: randomString([32, 126], Math.floor(Math.random() * 12) + 3),
				color: randomColor(),
			},
			{
				x: randomCoord(),
				y: randomCoord(),
				z: 0,
			}
		)
		entities.push(actorEntity)
		world.addEntity(actorEntity)
	}
	return entities
}
