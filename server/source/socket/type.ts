import { ChatEvents } from '../chat/type'

export interface ClientEvents {
	joinRequest: (
		channelId: string,
		callback: (connected: boolean) => void
	) => void
}

type ServerChatEvents = {
	[K in keyof ChatEvents]: (argument: ChatEvents[K][0]) => void
}

export type ServerEvents = ServerChatEvents
