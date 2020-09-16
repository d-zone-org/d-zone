import 'source-map-support/register'

import yargsParser from 'yargs-parser'

import path from 'path'

import { parseConfiguration } from './modules/configuration'
import { Configuration } from './modules/configuration/schema-types'
import { getRequiredModules } from './modules/utilities/get-module'
import { developmentMode } from './modules/build-modes/development'

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
	// Parse command line arguments
	const { dev } = yargsParser(process.argv.slice(2), {
		alias: { dev: ['d', 'w'] },
		boolean: ['dev'],
		default: { dev: false },
	})

	// Validates user configuration and gets extra information
	const {
		configuration: { outputDirectory, entryPoint, additionalPlugins, advanced },
		user,
	} = parseConfiguration(await configurationFactory(dev))

	// Advanced settings
	const { pluginOptions, rollupOptions } = advanced || {}

	// Get required modules from user or use our dependencies
	const {
		rollup: { rollup, watch },
		pluginCommonJs,
		pluginNodeResolve,
		pluginReplace,
		pluginSucrase,
		pluginTypescript,
	} = getRequiredModules(user.require, require)

	if (dev) {
		console.log('Starting development mode')

		await developmentMode({
			dependenciesBundleOptions: {
				dependencies: user.dependencies,
				outputDirectory: path.join(outputDirectory, 'dependencies'),
				plugins: { pluginCommonJs, pluginNodeResolve, pluginReplace },
				rollup: rollup,
				userRequire: user.require,
			},

			watchModeOptions: {
				dependencyMap: Object.fromEntries(
					user.dependencies.map(([dependencyId]) => [
						dependencyId,
						`./${dependencyId}/index.js`,
					])
				),
				entryPoint,
				extraPlugins: additionalPlugins,
				outputDirectory,
				requiredPlugins: {
					commonJs: [pluginCommonJs, pluginOptions?.commonJs],
					nodeResolve: [pluginNodeResolve, pluginOptions?.nodeResolve],
					sucrase: [pluginSucrase, pluginOptions?.sucrase],
					typescript: [pluginTypescript, pluginOptions?.typescript],
				},
				watch,
				additionalRollupSettings: rollupOptions,
			},
		})
	} else {
		console.log('Starting production mode')
	}
}
