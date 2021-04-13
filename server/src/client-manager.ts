import ws from 'ws'
import discord from 'eris'
import { IClientPayload, IServerPayload } from './typings/payload'
import { WebSocketServer } from './websocket-server'
import { handleErrorProneFn } from './utils/error'

interface Client {
	guild?: discord.Guild
}

export class ClientManager {
	private clients: Map<ws, Client> = new Map()

	constructor(
		private readonly websocketServer: WebSocketServer<
			IServerPayload,
			IClientPayload
		>,
		private readonly discordClient: discord.Client
	) {}

	public init() {
		this.websocketServer.on('connectionOpen', (client) =>
			this.websocketOnConnectionOpen(client)
		)

		this.websocketServer.on('connectionClose', (client, _, reason) =>
			this.websocketOnConnectionClose(client, reason)
		)

		this.websocketServer.on(
			'message',
			handleErrorProneFn((client, message) =>
				this.websocketOnClientMessage(client, message)
			)
		)

		this.discordClient.on(
			'messageCreate',
			handleErrorProneFn((message) =>
				this.discordClientOnMessageCreate(message)
			)
		)
	}

	private websocketOnConnectionOpen(client: ws) {
		console.log(`😺 New websocket connection - ${new Date().toLocaleString()}`)
		this.clients.set(client, {})
	}

	private websocketOnConnectionClose(client: ws, reason: string) {
		console.log(`🙀 Websocket connection closed - Reason: ${reason}`)
		this.clients.delete(client)
	}

	private async websocketOnClientMessage(
		client: ws,
		{ name, event }: IClientPayload
	) {
		if (name === 'JOIN') await this.handleServerJoin(event.guildId, client)
	}

	private async discordClientOnMessageCreate({
		content,
		guildID,
		author,
	}: discord.Message) {
		for (const [client, { guild }] of this.clients) {
			if (guild && guildID === guild.id)
				await this.websocketServer.sendMessage(client, {
					name: 'MESSAGE',
					event: {
						message: content,
						user: { username: author.username, id: author.id },
					},
				})
		}
	}

	private async handleServerJoin(id: string, client: ws) {
		const guild = this.discordClient.guilds.get(id)

		if (guild) {
			this.clients.set(client, { guild })

			await this.websocketServer.sendMessage(client, {
				name: 'JOIN_SUCCESS',
				event: {
					users: guild.members.map(({ id, username }) => ({ id, username })),
					server: { id },
				},
			})
		} else
			await this.websocketServer.sendMessage(client, {
				name: 'JOIN_ERROR',
				event: { error: 'SERVER_NOT_FOUND' },
			})
	}
}
