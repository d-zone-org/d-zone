import { randomString, randomColor, randomCoord, addActors } from './Benchmark'

describe('Engine benchmark functions', () => {
	test('returns string with correct length', () => {
		expect(randomString([48, 57], 10)).toHaveLength(10)
	})

	test('returns valid color value', () => {
		expect(randomColor()).toBeGreaterThanOrEqual(0)
		expect(randomColor()).toBeLessThanOrEqual(0xffffff)
	})

	test('returns integer', () => {
		let coord: number = randomCoord()
		expect(coord).toEqual(Math.round(coord))
	})
	test('adds actors to world', async () => {
		let world = {
			addEntity: jest.fn(() => {}),
		}
		const actorCount: number = 1
		// @ts-ignore
		let entities = addActors(world, actorCount)
		expect(world.addEntity).toHaveBeenCalledTimes(actorCount)
		expect(entities).toHaveLength(actorCount)
	})
})
