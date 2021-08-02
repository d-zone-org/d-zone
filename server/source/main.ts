import 'dotenv/config'
import { configuration } from './utils/config'
import { handleError } from './utils/error'
import { startAPI } from './api'
import { Logger } from 'tslog'

const main = async () => {
	const logger = new Logger()

	const PORT = configuration.get('port')
	await startAPI(PORT)
	logger.info(`Started API on ${PORT}`)
}

main().catch(handleError)
