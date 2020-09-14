import "source-map-support/register"

import yargsParser from 'yargs-parser'
import path from 'path'

import {
	UserConfigurationOptions,
	parseConfiguration,
} from './modules/configuration'
import { developmentMode } from './modules/build-modes/development'

/**
 * Configure bundler. Import this function in your configuration file
 * and call it with your configuration. Run your configuration file
 * like any other node application. Add `--dev` flag for development mode.
 * Check out `ConfigurationOptions` interface for description of the properties.
 * The function might emit error, please handle it properly.
 *
 * @param userConfigurationOptions - User configuration Options
 */
export async function configure(
	userConfigurationOptions: UserConfigurationOptions
) {
	const cliArguments = yargsParser(process.argv.slice(2), {
		alias: { dev: ['d', 'w'] },
		boolean: ['dev'],
		default: { dev: false },
	})

	const {
		configuration: { additionalPlugins, advanced, outputDirectory, entryPoint },
		user,
	} = parseConfiguration(userConfigurationOptions)

	if (cliArguments.dev) {
		console.log('Starting development mode')

		const {
			commonJs,
			nodeResolve,
			replace,
			typescript,
			sucrase,
		} = advanced.corePluginsAndOptions

		await developmentMode({
			dependenciesBundleOptions: {
				dependencies: user.dependencies,
				userRequire: user.require,
				outputDirectory: path.join(outputDirectory, 'dependencies'),
				plugins: [commonJs.plugin, nodeResolve.plugin, replace.plugin],
				rollup: advanced.rollup[1],
			},
			watchModeOptions: {
				dependencyMap: Object.fromEntries(
					user.dependencies.map(([k]) => [k, `./dependencies/${k}/index.js`])
				),
				entryPoint: entryPoint,
				extraPlugins: await additionalPlugins(true),
				outputDirectory: outputDirectory,
				requiredPlugins: Object.fromEntries(
					[
						commonJs,
						nodeResolve,
						typescript,
						sucrase,
					].map(({ plugin, config }) => [
						plugin,
						{ ...config?.common, ...config?.development },
					])
				),
				watch: advanced.watch[1],
				additionalRollupSettings: advanced.watch[0],
			},
		})
	} else {
		console.log('Starting production mode')
	}
}

export {
	UserConfigurationOptions,
	ConfigurationOptions,
} from './modules/configuration'
