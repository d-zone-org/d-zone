import yargs from 'yargs-parser'

import path from 'path'
import module from 'module'

import { validate } from './utils/validator'
import { developmentMode } from './modes/development'
import { productionMode } from './modes/production'

import type {
	rollup as RollupFn,
	watch as WatchFn,
	RollupOptions as RollupInputOptions,
	OutputOptions as RollupOutputOptions,
	Plugin,
	PluginImpl,
} from 'rollup'

import type PluginCommonJs from '@rollup/plugin-commonjs'
import type { nodeResolve as PluginNodeResolve } from '@rollup/plugin-node-resolve'
import type PluginReplace from '@rollup/plugin-replace'
import type PluginTypescript from '@rollup/plugin-typescript'
import type PluginSucrase from '@rollup/plugin-sucrase'
import type { terser as PluginTerser } from 'rollup-plugin-terser'

/**
 * Configuration Options
 * @property options.projectRoot - Your project's root directory
 * @property options.entryPoint - Path to entry file, relative to `projectRoot`
 * @property options.outputDirectory - Output directory, relative to `projectRoot`
 * @property options.rollup - `rollup` method from rollup
 * @property options.watch - `watch` method from rollup
 * @property options.requiredPlugins - Required plugins
 * @property options.development - Development mode settings
 * @property options.development.ignoredDependencies - Dependencies to be not bundled separately
 * @property options.development.additionalPlugins - Additional plugins to be used in dev mode
 * @property options.development.additionalRollupSettings - Add development mode specific rollup settings
 * @property options.production - Production mode settings
 * @property options.production.additionalPlugins - Function (can be async) that returns additional plugins
 * @property options.production.additionalRollupSettings - Add production mode specific rollup settings
 */
export interface ConfigurationOptions {
	projectRoot: string
	entryPoint: string
	outputDirectory: string

	rollup: typeof RollupFn
	watch: typeof WatchFn

	requiredPlugins: {
		commonJs: RequiredPlugin<typeof PluginCommonJs>
		nodeResolve: RequiredPlugin<typeof PluginNodeResolve>
		replace: { plugin: typeof PluginReplace }
		sucrase: RequiredPlugin<typeof PluginSucrase>
		typescript: RequiredPlugin<typeof PluginTypescript>
		terser: RequiredPlugin<typeof PluginTerser>
	}

	development?: {
		ignoredDependencies?: string[]
		additionalPlugins?: () => Promise<Plugin[]> | Plugin[]
		additionalRollupSettings?: {
			input?: RollupInputOptions
			output?: RollupOutputOptions
		}
	}

	production?: {
		additionalPlugins?: () => Promise<Plugin[]> | Plugin[]
		additionalRollupSettings?: {
			input?: RollupInputOptions
			output?: RollupOutputOptions
		}
	}
}

/**
 * Represents required plugins for yakshaving
 * @property plugin - Plugin factory function
 * @property devConfig - Config to be used in development mode
 * @property prodConfig - Config to be used in production mode
 */
export interface RequiredPlugin<P extends PluginImpl<any>> {
	plugin: P
	devConfig?: Parameters<P>[0]
	prodConfig?: Parameters<P>[0]
}

/**
 * Configure bundler. Import this function in your configuration file
 * and call it with your configuration. Run your configuration file
 * like any other node application. Add `--dev` flag for development mode.
 * Check out `ConfigurationOptions` interface for description of the properties.
 * The function might emit error, please handle it properly.
 *
 * @param options - Configuration Options
 */
export async function configure(options: ConfigurationOptions) {
	// Validate options
	// This is better than unknown errors emitted by rollup
	validate(options)

	// De-structure options
	const {
		projectRoot,
		entryPoint,
		outputDirectory,

		rollup,
		watch,
		requiredPlugins: {
			commonJs,
			nodeResolve,
			replace,
			sucrase,
			typescript,
			terser,
		},

		development,
		production,
	} = options

	// Parse command line arguments
	const { dev } = yargs(process.argv.slice(2), {
		alias: { dev: ['d'] },
		boolean: ['dev'],
		default: { dev: false },

		configuration: {
			'strip-aliased': true,
		},
	})

	// Helper function
	const userRoot = (...args: string[]) => path.resolve(projectRoot, ...args)

	// User information
	const userManifestPath = userRoot('package.json')
	const userManifest: {
		dependencies: Record<string, string>
	} = require(userManifestPath)

	const userRequire = module.createRequire(userManifestPath)

	if (dev) {
		// De-structure development config if possible
		const { additionalPlugins, additionalRollupSettings, ignoredDependencies } =
			development || {}

		// Dependencies to be bundled
		const dependencies = Object.entries(userManifest.dependencies).filter(
			([dependencyId]) => !ignoredDependencies?.includes(dependencyId)
		)

		// Start development mode
		await developmentMode({
			dependenciesBundleOptions: {
				userRequire,
				dependencies: Object.fromEntries(dependencies),
				outputDirectory: userRoot(outputDirectory, 'dependencies'),
				rollup,
				plugins: [commonJs.plugin, nodeResolve.plugin, replace.plugin],
			},

			watchModeOptions: {
				dependencyMap: Object.fromEntries(
					dependencies.map(([dependencyId]) => [
						dependencyId,
						`./dependencies/${dependencyId}.js`,
					])
				),
				entryPoint: userRoot(entryPoint),
				outputDirectory: userRoot(outputDirectory),
				watch,
				requiredPlugins: {
					commonJs: [commonJs.plugin, commonJs.devConfig],
					nodeResolve: [nodeResolve.plugin, nodeResolve.devConfig],
					sucrase: [sucrase.plugin, sucrase.devConfig],
					typescript: [typescript.plugin, typescript.devConfig],
				},
				extraPlugins: additionalPlugins ? await additionalPlugins() : [],
				additionalRollupSettings: additionalRollupSettings,
			},
		})
	} else {
		// De-structure production config if possible
		const { additionalPlugins, additionalRollupSettings } = production || {}

		await productionMode({
			entryPoint: userRoot(entryPoint),
			requiredPlugins: {
				commonJs: [commonJs.plugin, commonJs.prodConfig],
				nodeResolve: [nodeResolve.plugin, nodeResolve.prodConfig],
				typescript: [typescript.plugin, typescript.prodConfig],
				terser: [terser.plugin, terser.prodConfig],
				replace: [replace.plugin],
			},
			extraPlugins: additionalPlugins ? await additionalPlugins() : [],
			additionalRollupSettings: additionalRollupSettings,
			outputDirectory: userRoot(outputDirectory),
			rollup,
		})
	}
}
