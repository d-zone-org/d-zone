import Eris from 'eris'
import _ from 'lodash'
import { Logger } from 'tslog'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import { PrismaClient } from '$/database'
import { Option, Options, Channel, OptionsValues, Permission } from './types'

type If<Condition, A, B> = Condition extends true
	? A
	: Condition extends false
	? B
	: A | B

interface CommandContext<O extends Options, OnlyDirectMessages = boolean> {
	/** Eris client instance */
	client: Eris.Client
	/** Prisma */
	prisma: PrismaClient
	/** Values of options */
	options: OptionsValues<O>
	/** Command author */
	author: If<OnlyDirectMessages, Eris.User, Eris.Member>
	/** Channel command was triggered in */
	channel: If<
		OnlyDirectMessages,
		Eris.PrivateChannel,
		Eris.GuildTextableChannel | Eris.AnyThreadChannel
	>
	/** Eris interaction instance */
	interaction: Eris.CommandInteraction
	/** Reply */
	reply(embed: Eris.EmbedOptions): Promise<void>
}

type Command<
	CommandOptions extends Options = Options,
	Context extends {} = {},
	DirectMessagesOnly extends boolean = boolean
> = {
	/** Name of the command */
	name: string
	/** Description of the command */
	description: string
	/** Permissions required for author */
	permission?: bigint[]
	/** Command allowed in direct messages */
	directMessage?: DirectMessagesOnly
	/** Command options */
	options?: CommandOptions
	/** Command handler */
	execute(
		this: Command<CommandOptions, Context, DirectMessagesOnly>,
		context: CommandContext<CommandOptions, DirectMessagesOnly>
	): Promise<void>
} & Context

interface CommandsOptions {
	/** Eris client instance */
	client: Eris.Client
	/** Prisma */
	prisma: PrismaClient
	/** Logger */
	logger: Logger
	/** Default embed options */
	embed?: Eris.EmbedOptions
}

export class Commands {
	/** Command option types */
	static Option = Option
	/** Channel types */
	static Channel = Channel
	/** Permission types */
	static Permission = Permission

	/** Declare a command */
	static declare<
		CommandsOptions extends Options,
		This extends {},
		DirectMessagesOnly extends boolean
	>(options: Narrow<Command<CommandsOptions, This, DirectMessagesOnly>>) {
		return options as Command
	}

	#client: Eris.Client
	#prisma: PrismaClient
	#logger: Logger
	#defaultEmbed?: Eris.EmbedOptions
	#commands: Map<string, Command>

	/** Create new commands handler instance */
	constructor(options: CommandsOptions) {
		this.#client = options.client
		this.#prisma = options.prisma
		this.#logger = options.logger
		this.#defaultEmbed = options.embed
		this.#commands = new Map()
	}

	/** Register a command */
	public register(command: Command) {
		this.#commands.set(command.name, command)
	}

	/** Sync commands and attach interaction listener */
	public async initialize() {
		await this.#syncCommands()

		this.#client.on('interactionCreate', (i) => {
			if (i.type === Eris.Constants.InteractionTypes.APPLICATION_COMMAND)
				return this.#handleInteraction(i)
		})
	}

	async #syncCommands() {
		const commands = await this.#client.getCommands()
		const added: string[] = []

		// Update and remove already live commands
		for (const command of commands) {
			if (command.type !== Eris.Constants.ApplicationCommandTypes.CHAT_INPUT)
				continue

			const localCommand = this.#commands.get(command.name)

			// Command exists locally
			if (localCommand) {
				added.push(command.name)

				const structure = this.#getCommandStructure(localCommand)
				const isSame = this.#isSameCommand(structure, command)

				if (isSame) {
					this.#logger.info(`Command ${command.name} skipped`)
					continue
				} else {
					await command.edit(structure)
					this.#logger.info(`Command ${command.name} updated`)
				}
			}

			// Unknown command
			else {
				await command.delete()
				this.#logger.info(`Command ${command.name} deleted`)
			}
		}

		// Add new commands
		for (const command of this.#commands.values()) {
			if (added.includes(command.name)) continue
			else {
				this.#client.createCommand(this.#getCommandStructure(command))
				this.#logger.info(`Command ${command.name} created`)
			}
		}
	}

	#getCommandStructure(c: Command): Eris.ApplicationCommandStructure {
		return {
			type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,

			name: c.name,
			description: c.description,
			options: c.options,

			dmPermission: c.directMessage,
			defaultMemberPermissions: c.permission
				?.reduce((a, c) => a + c, 0n)
				.toString(),
		}
	}

	#isSameCommand(
		existingCommand: Eris.ApplicationCommandStructure,
		command: Eris.ApplicationCommand
	) {
		const commandStructure = _.mapValues(
			{
				type: command.type,
				name: command.name,
				description: command.description,
				options: command.options,
				dmPermission: command.dmPermission,
				defaultMemberPermissions: command.defaultMemberPermissions,
			},
			(value) => (value === null ? undefined : value)
		)

		return _.isEqual(commandStructure, existingCommand)
	}

	async #handleInteraction(interaction: Eris.CommandInteraction) {
		const options = await this.#recursivelyParseOptions(
			interaction.data.resolved,
			interaction.data.options
		)

		const context: CommandContext<Options, boolean> = {
			options,
			channel: interaction.channel,
			author: interaction.member || interaction.user!,

			interaction,

			client: this.#client,
			prisma: this.#prisma,

			reply: async (embed) => {
				await interaction.createMessage({
					embeds: [_.defaultsDeep(embed, this.#defaultEmbed)],
				})
			},
		}

		const command = this.#commands.get(interaction.data.name)

		// Found command
		if (command) {
			this.#logger.info(`Command ${command.name} triggered`)
			await command.execute(context)
		}

		// Invalid trigger due to client
		else {
			this.#logger.info(`Command ${interaction.data.name} not found`)
			await interaction.createMessage('Command not found, refresh your client')
		}
	}

	async #recursivelyParseOptions(
		resolved: Eris.CommandInteractionResolvedData = {},
		options: Eris.InteractionDataOptions[] = []
	): Promise<Record<string, unknown>> {
		return Object.fromEntries(
			await Promise.all(
				options.map(async (option) => [
					option.name,
					'options' in option
						? await this.#recursivelyParseOptions(
								resolved,
								option.options || []
						  )
						: await this.#parseOption(resolved, option),
				])
			)
		)
	}

	async #parseOption(
		resolved: Eris.CommandInteractionResolvedData,
		option: Eris.InteractionDataOptions
	) {
		if (option.type === Option.STRING) return option.value
		if (option.type === Option.INTEGER) return option.value
		if (option.type === Option.NUMBER) return option.value
		if (option.type === Option.BOOLEAN) return option.value

		if (option.type === Option.USER)
			return (
				resolved.users?.get(option.value) || resolved.members?.get(option.value)
			)

		if (option.type === Option.CHANNEL) {
			const channelId = resolved.channels?.get(option.value)?.id!

			return (
				this.#client.getChannel(channelId) ||
				this.#client.getRESTChannel(channelId)
			)
		}

		if (option.type === Option.ROLE) return resolved.roles?.get(option.value)

		if (option.type === Option.MENTIONABLE)
			return (
				resolved.users?.get(option.value) ||
				resolved.members?.get(option.value) ||
				resolved.roles?.get(option.value)
			)

		throw new Error('Invalid type')
	}
}
