import Eris from 'eris'

type If<Condition, Value> = Condition extends true ? Value : Value | undefined

export const Option = Eris.Constants.ApplicationCommandOptionTypes
export const Channel = Eris.Constants.ChannelTypes
export const Permission = Eris.Constants.Permissions

type APIOption = APIBasicOption | APINestedOption
type APIBasicOption = Eris.ApplicationCommandOptionsWithValue
type APINestedOption = Eris.ApplicationCommandOptionsWithOptions

type APIChoice = Eris.ApplicationCommandOptionsChoice
type APIBasicChoicesOption<C extends APIChoice[]> = APIBasicOption & {
	choices: C[]
}

type APIBasicChannelsOption<C extends keyof Channels> = APIBasicOption & {
	channel_types: C[]
}

interface OptionValues {
	[Option.STRING]: string
	[Option.INTEGER]: number
	[Option.NUMBER]: number
	[Option.BOOLEAN]: boolean
	[Option.USER]: Eris.User
	[Option.ROLE]: Eris.Role
	[Option.CHANNEL]: Eris.Channel
	[Option.MENTIONABLE]: Eris.User | Eris.Role
	// [Option.ATTACHMENT]: Eris.Attachment
}

interface Channels {
	[Channel.GUILD_TEXT]: Eris.TextChannel
	[Channel.DM]: Eris.PrivateChannel
	[Channel.GUILD_VOICE]: Eris.VoiceChannel
	[Channel.GROUP_DM]: Eris.GroupChannel
	[Channel.GUILD_CATEGORY]: Eris.CategoryChannel
	[Channel.GUILD_NEWS]: Eris.NewsChannel
	[Channel.GUILD_NEWS_THREAD]: Eris.NewsThreadChannel
	[Channel.GUILD_PUBLIC_THREAD]: Eris.PublicThreadChannel
	[Channel.GUILD_PRIVATE_THREAD]: Eris.PrivateThreadChannel
	[Channel.GUILD_STAGE_VOICE]: Eris.StageChannel
}

export type Options = APIOption[] | [APIOption]

export type OptionsValues<O> = O extends [infer Option]
	? Option extends APIOption
		? {
				[name in Option['name']]: If<Option['required'], OptionValue<Option>>
		  }
		: {}
	: O extends [infer Option, ...infer Rest]
	? Option extends APIOption
		? Rest extends APIOption[]
			? {
					[name in Option['name'] | keyof OptionsValues<Rest>]: If<
						Option['required'],
						name extends keyof OptionsValues<Rest>
							? OptionsValues<Rest>[name]
							: OptionValue<Option>
					>
			  }
			: {}
		: {}
	: {}

type OptionValue<O> = O extends APIBasicOption
	? O extends APIBasicChoicesOption<infer Choices>
		? Choices
		: O extends APIBasicChannelsOption<infer Channel>
		? Channels[Channel]
		: OptionValues[O['type']]
	: O extends APINestedOption
	? O['options'] extends APIOption[]
		? OptionsValues<O['options']>
		: {}
	: never
