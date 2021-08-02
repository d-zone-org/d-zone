import { z } from 'zod'
import { Configuration } from 'kanaphig'

export const configuration = new Configuration(
	z.object({
		port: z.number(),
		discord: z.object({ token: z.string() }),
	})
)
	.env({
		port: {
			$env: 'PORT',
			// TODO: Make a fix on kanaphig to allow undefined values here
			$transformer: (value) => (isNaN(+value) ? 8080 : +value),
		},

		discord: { token: { $env: 'DISCORD_TOKEN' } },
	})
	.validate()
