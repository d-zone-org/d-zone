import { Server, User } from '@d-zone/server'

export interface StoreState {
	user?: User

	server?: {
		details: Server
		messages: { id: string; message: string; username: string }[]
	}
}

export const defaultState: StoreState = {}
