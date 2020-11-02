import 'source-map-support/register'

import yargsParser from 'yargs-parser'

import { parseConfiguration } from './modules/configuration'
import { Configuration } from './modules/configuration/schema-types'
import { getRequiredModules } from './modules/utilities/get-module'
import { developmentMode } from './modules/build-modes/development'
import { productionMode } from './modules/build-modes/production'

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
	try {
		// Parse command line arguments
		const { dev } = yargsParser(process.argv.slice(2), {
			alias: { dev: ['d', 'w'] },
			boolean: ['dev'],
			default: { dev: false },
		})

		// Validates user configuration and gets extra information
		const {
			configuration: {
				outputDirectory,
				entryPoint,
				additionalPlugins,
				advanced,
			},
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
			pluginTerser,
		} = getRequiredModules(user.require, require)

		if (dev) {
			console.log('Starting development mode')

			if (pluginOptions?.replace)
				additionalPlugins.push(
					pluginReplace({
						values: pluginOptions.replace,
					})
				)

			await developmentMode({
				outputDirectory,
				dependenciesBundleOptions: {
					dependencies: user.dependencies,
					plugins: { pluginCommonJs, pluginNodeResolve, pluginReplace },
					rollup: rollup,
					userRequire: user.require,
				},

				watchModeOptions: {
					entryPoint,
					extraPlugins: additionalPlugins,
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

			await productionMode({
				entryPoint,
				extraPlugins: additionalPlugins,
				outputDirectory,
				requiredPlugins: {
					commonJs: [pluginCommonJs, pluginOptions?.commonJs],
					nodeResolve: [pluginNodeResolve, pluginOptions?.nodeResolve],
					typescript: [pluginTypescript, pluginOptions?.typescript],
					replace: [pluginReplace, pluginOptions?.replace],
					terser: [pluginTerser, pluginOptions?.terser],
				},
				rollup,
				additionalRollupSettings: rollupOptions,
			})
		}
	} catch (err) {
		console.dir(err, { depth: 10 })
		process.exit(1)
	}
}
