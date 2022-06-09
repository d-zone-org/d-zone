import os from 'os'

import dedent from 'dedent'
import prettyBytes from 'pretty-bytes'
import { formatDistance } from 'date-fns'
import { enUS } from 'date-fns/locale'

import { Commands } from '$/discord'
import { version } from '@d-zone/server/package.json'

export default Commands.declare({
	name: 'status',
	description: "Get d-zone bot's status",

	async execute(context) {
		const duration = formatDistance(0, process.uptime() * 1000, {
			locale: enUS,
			includeSeconds: true,
		})

		const totalMemory = prettyBytes(os.totalmem())
		const usedMemory = prettyBytes(process.memoryUsage().rss)

		context.reply({
			title: `d-zone ${version}`,
			description: dedent`
					Running on node ${process.versions.node}
					Been running since ${duration}
					Using ${usedMemory} out of ${totalMemory}
				`,
		})
	},
})
