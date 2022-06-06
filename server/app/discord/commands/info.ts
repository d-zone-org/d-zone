import Eris from 'eris'

import dedent from 'dedent'
import prettyBytes from 'pretty-bytes'
import { formatDistance } from 'date-fns'
import { enUS } from 'date-fns/locale'

import os from 'os'
import { version } from 'server/package.json'

export function commandInfo(
	client: Eris.Client,
	message: Eris.Message<Eris.PossiblyUncachedTextableChannel>
) {
	const channel = client.getChannel(message.channel.id) as Eris.TextChannel

	const duration = formatDistance(0, process.uptime() * 1000, {
		locale: enUS,
		includeSeconds: true,
	})

	const totalMemory = prettyBytes(os.totalmem())
	const usedMemory = prettyBytes(process.memoryUsage().rss)

	return channel.createMessage({
		embed: {
			title: `d-zone ${version}`,
			color: 0x9e908f,
			description: dedent`
        Running on node ${process.versions.node}
        Been running since ${duration}
        Using ${usedMemory} out of ${totalMemory}
      `,
		},
	})
}
