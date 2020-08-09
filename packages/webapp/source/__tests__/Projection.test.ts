import { get2dCoordsFromIso, getZIndex, SCALE } from '../Components/Game/Common/Projection'

describe(get2dCoordsFromIso, () => {
	test('returns x and y values', () => {
		let coords = get2dCoordsFromIso(1, 2, 3)
		expect(coords[0]).toEqual(-2 * SCALE)
		expect(coords[1]).toEqual(0)
	})
})

describe(getZIndex, () => {
	test('returns z-index', () => {
		let zIndex = getZIndex(1, 2, 3)
		expect(zIndex).toEqual(3.03)
	})
})
