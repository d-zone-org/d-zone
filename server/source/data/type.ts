import EventEmitter from 'eventemitter3'

export interface Entity {
	id: string
	provider: string
}

export interface User {
	name: string
}

export interface Message {
	id: string
	timestamp: Date
	content: string
	user: User
	provider: string
}

export interface Channel {
	id: string
	activeUsers: Map<string, User>
	events: EventEmitter<ChannelEvents>
	provider: string
}

export interface ChannelEvents {
	message: [Message]
	join: [User]
	leave: [User]
}
