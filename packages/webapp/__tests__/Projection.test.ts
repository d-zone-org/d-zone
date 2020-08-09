import { get2dCoordsFromIso } from '../source/Game/Common/Projection'

test('returns x and y values', () => {
	expect(get2dCoordsFromIso(0, 0, 0).length).toEqual(2)
})
