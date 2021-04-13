import 'dotenv/config'
import * as z from 'zod'
import { OnlyKeys } from '../typings/util'

const schema = z.object({
	discord: z.object({
		token: z.string(),
	}),
	port: z.number(),
	dev: z.boolean(),
})

/** Parsed configuration */
export type Config = z.infer<typeof schema>

/**
 * Parse configuration
 *
 * @param config - Configuration to be parsed
 * @returns Parsed configuration
 */
export function parseConfig(config: OnlyKeys<Config>): Config {
	return schema.parse(config)
}

// {
// 	discordClientToken: process.env.DISCORD_CLIENT_TOKEN,
// 	port: parseInt(process.env.PORT || '3000', 10),
// 	dev: process.env.NODE_ENV !== 'production',
// }
