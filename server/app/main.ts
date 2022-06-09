import 'dotenv/config'
import { Logger } from 'tslog'

import { getPrisma } from './database'
import { startServers } from './server'
import { startBot } from './discord/client'

const logger = new Logger({ name: 'root' })

async function main() {
	const prisma = getPrisma()
	const client = await startBot(prisma)
	startServers(prisma, client)
}

main().catch((error) => {
	logger.error(error)
	process.exit(1)
})
