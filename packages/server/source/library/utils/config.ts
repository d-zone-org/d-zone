import 'dotenv/config'
import { z } from 'zod'

export const config = z
	.object({
		discordClient: z.object({
			id: z.string(),
			token: z.string(),
			secret: z.string(),
		}),
	})
	.parse({
		discordClient: {
			id: process.env['DISCORD_CLIENT_ID'],
			token: process.env['DISCORD_CLIENT_TOKEN'],
			secret: process.env['DISCORD_CLIENT_SECRET'],
		},
	})
