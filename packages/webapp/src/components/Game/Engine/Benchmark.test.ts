import { randomString, randomColor, randomCoord, addActors } from './Benchmark'
import Engine from './Engine'

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
	// test('adds actors to world', async () => {
	// 	const engine: Engine = new Engine()
	// 	engine.init({ pushSpritesToRenderer: mockPushSprites })
	// 	const actorCount: number = 1
	// 	addActors(engine.world, actorCount)
	// 	expect(engine.world.addEntity).toHaveBeenCalledTimes(actorCount)
	// })
})
