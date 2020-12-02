export interface ClientRequestServer {
	type: 'REQUEST_SERVER'
	data: { id: string }
}

export type ClientMessage = ClientRequestServer
