import sayHi from './Hello'

test('says Hello to world', () => {
	expect(sayHi('World')).toBe('Hello World')
})
