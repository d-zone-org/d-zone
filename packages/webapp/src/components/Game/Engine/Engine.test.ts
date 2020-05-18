import Engine from './Engine'

describe('Engine', () => {
	test('starts update interval', (done) => {
		let engine = new Engine()
		jest.spyOn(engine, 'update')
		engine.start(100)
		setTimeout(() => {
			engine.stop()
			expect(engine.update).toHaveBeenCalledTimes(1)
			done()
		}, 15)
	})
})
