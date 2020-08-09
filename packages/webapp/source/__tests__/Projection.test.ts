import { get2dCoordsFromIso, getZIndex } from '../Game/Common/Projection'

describe(get2dCoordsFromIso, () => {
	test('returns x and y values', () => {
		let coords = get2dCoordsFromIso(0, 0, 0)
		expect(coords.length).toEqual(2)
		expect(coords[0]).toEqual(0)
		expect(coords[1]).toEqual(0)
	})
})

describe(getZIndex, () => {
	test('returns number', () => {
		let zIndex = getZIndex(0, 0, 0)
		expect(zIndex).toEqual(0)
		expect(zIndex).not.toBeNaN()
	})
})
