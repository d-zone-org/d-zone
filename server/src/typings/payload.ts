export interface IUser {
	id: string
	username: string
}

export interface IServer {
	id: string
}

export interface IServerJoinSuccess {
	name: 'JOIN_SUCCESS'
	event: {
		users: IUser[]
		server: IServer
	}
}

export interface IServerJoinError {
	name: 'JOIN_ERROR'
	event: {
		error: 'SERVER_NOT_FOUND' | 'UNAUTHORISED'
	}
}

export interface IServerUserModify {
	name: 'USER_MODIFY'
	event: {
		user: Partial<IUser>
		action: 'LEAVE' | 'JOIN' | 'UPDATE'
	}
}

export interface IServerMessage {
	name: 'MESSAGE'
	event: {
		message: string
		user: IUser
	}
}

export type IServerPayload =
	| IServerJoinSuccess
	| IServerJoinError
	| IServerUserModify
	| IServerMessage

export interface IClientJoin {
	name: 'JOIN'
	event: {
		guildId: string
	}
}

export type IClientPayload = IClientJoin
