import { sayHelloFromServer } from './index'

test('says Hello to world', () => {
	expect(sayHelloFromServer('World')).toBe('Hello World')
})
