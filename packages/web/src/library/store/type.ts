export interface StoreState {
	user?: { username: string }

	server?: {
		details: unknown
		messages: { id: string; message: string; username: string }[]
	}
}

export const defaultState: StoreState = {}
