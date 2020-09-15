import 'source-map-support/register'

import yargsParser from 'yargs-parser'

import { parseConfiguration } from './modules/configuration'
import { Configuration } from './modules/configuration/schema-types'
import { getRequiredModules } from './modules/utilities/get-module'

/**
 * Configure bundler. Import this function in your configuration file
 * and call it with your configuration factory. Run your configuration file
 * like any other node application. Add `--dev` flag for development mode.
 * Check out `Configuration` interface for description of the properties.
 *
 * @param configurationFactory - Factory for configuration.
 */
export async function configure(
	configurationFactory: (
		devMode: boolean
	) => Configuration | Promise<Configuration>
) {
	const { dev } = yargsParser(process.argv.slice(2), {
		alias: { dev: ['d', 'w'] },
		boolean: ['dev'],
		default: { dev: false },
	})

	const { configuration, user } = parseConfiguration(
		await configurationFactory(dev)
	)

	const modules = getRequiredModules(user.require, require)

	console.log({ configuration, user, modules })

	if (dev) {
		console.log('Starting development mode')
	} else {
		console.log('Starting production mode')
	}
}
