import path from 'path'
import { makeSchema } from 'nexus'

import * as scalars from 'nexus-prisma/scalars'
import * as types from './types'

const root = (...args: string[]) =>
	path.join(__dirname, '..', '..', '..', ...args)

export const schema = makeSchema({
	types: { scalars, types },

	contextType: {
		module: root('app/server/graphql/context.ts'),
		export: 'Context',
	},

	outputs: {
		schema: root('.gen/schema.graphql'),
		typegen: root('app/server/graphql/typegen.ts'),
	},
})
