import { randomString, randomColor, randomCoord } from './Benchmark'

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
