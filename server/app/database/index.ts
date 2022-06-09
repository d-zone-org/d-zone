import { PrismaClient } from '@d-zone/server/.gen/prisma'
import { Logger } from 'tslog'

export function getPrisma() {
	const prisma = new PrismaClient()
	const logger = new Logger({ name: 'database' })

	prisma.$use((params, next) => {
		logger.info(`${params.model}.${params.action} ${params.dataPath.join('.')}`)
		return next(params)
	})

	return prisma
}

export * from '@d-zone/server/.gen/prisma'
