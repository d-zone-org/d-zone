import EventEmitter from 'eventemitter3'

export interface ChatUser {
	id: string
	name: string
}

export interface ChatMessage {
	id: string
	timestamp: Date
	content: string
	user: ChatUser
}

export interface ChatChannel {
	id: string
	activeUsers: Map<string, ChatUser>
	events: EventEmitter<ChatEvents>
}

export interface ChatEvents {
	message: [ChatMessage]
	join: [ChatUser]
	leave: [ChatUser]
}

export interface ChatModule {
	id: string
	channelMap: Map<string, ChatChannel>
}
