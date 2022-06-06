import { objectType } from 'nexus'
import { User } from 'server/.gen/nexus'

export const UserObject = objectType({
	name: User.$name,
	description: User.$description,

	definition(t) {
		t.field(User.id)
		t.field(User.username)
		t.field(User.discriminator)
		t.field(User.avatar)
		t.field(User.accentColor)

		t.nonNull.list.field('servers', {
			type: 'Server',

			resolve({ id }, _args, context) {
				return context.prisma.server.findMany({
					where: { members: { some: { id } } },
				})
			},
		})

		t.boolean('registered')
	},
})

export * from './queries'
export * from './mutations'
