export class Client {
	init() {
		const path = `ws://${location.host}`

		const ws = new WebSocket(path)

		ws.addEventListener('error', (err) => console.error(err))

		ws.addEventListener('open', (ev) => console.log('Connected to server', ev))

		ws.addEventListener('message', (ev) => console.log(ev))
	}
}
