export interface User {
	id: string
	username: string
	servers: string[]
}

export interface Server {
	id: string
	name: string
	members: User[]
}
