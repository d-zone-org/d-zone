/* eslint-disable @typescript-eslint/no-var-requires */
const next = require('next')
const url = require('url')
const dzone = require('server')

/**
 * Create NEXT Request handler
 *
 * @param {boolean} dev DEV Mode
 * @returns HTTP Request handler
 */
async function createNEXTRequestHandler(dev) {
	const NEXTApp = next({ dev: dev })
	const NEXTRequestHandler = NEXTApp.getRequestHandler()

	await NEXTApp.prepare()

	return (req, res) => {
		const parsedUrl = url.parse(req.url, true)
		return NEXTRequestHandler(req, res, parsedUrl)
	}
}

dzone
	.initServer((dev) => createNEXTRequestHandler(dev))
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
