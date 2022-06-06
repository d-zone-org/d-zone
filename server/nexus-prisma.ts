import { settings } from 'nexus-prisma/generator'

settings({
	output: './.gen/nexus',
	prismaClientImportId: 'server/.gen/prisma/index.js',
})
