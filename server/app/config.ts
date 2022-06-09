import { K } from 'kanaphig'
import { zod } from 'kanaphig/dist/plugins/zod'
import { z } from 'zod'

export const configuration = new K({
	files: ['.env'],

	definition: {
		discord: {
			token: zod(z.string()),
			id: zod(z.string()),
			secret: zod(z.string()),
			publicKey: zod(z.string()),
			redirectPath: zod(z.string().url()),
		},
	},
})
