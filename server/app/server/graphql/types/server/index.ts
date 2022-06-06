import { objectType } from 'nexus'
import { Server } from 'server/.gen/nexus'

export const ServerObject = objectType({
	name: Server.$name,
	description: Server.$description,

	definition(t) {
		t.field(Server.id)
		t.field(Server.members)
	},
})

export * from './queries'
