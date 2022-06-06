import 'dotenv/config'
import { startBot } from './discord'
import { getPrisma } from './database'
import { Logger } from 'tslog'
import { startServers } from './server'

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
