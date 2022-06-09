import { objectType } from 'nexus'

export const MessageObject = objectType({
	name: 'Message',
	description: '',

	definition(t) {
		t.id('id')
		t.string('content')
		t.dateTime('created')
		t.field('author', { type: 'User' })
	},
})

export * from './subscriptions'
