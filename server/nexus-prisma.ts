import { settings } from 'nexus-prisma/generator'

settings({
	output: './.gen/nexus',
	prismaClientImportId: '@d-zone/server/.gen/prisma/index.js',
})
