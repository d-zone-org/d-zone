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
	WatcherOptions as RollupWatchOptions,
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
 * @property options.projectRoot - Projects root directory
 * @property options.entryPoint - Entry point(s) to your application
 * @property options.outputDirectory - Projects output directory
 *
 * @property options.ignoredDepsBundleDependencies - Dependencies to be ignored in dev dependencies bundle
 * @property options.additionalPlugins - Function (can be async) resolving additional plugins
 *
 * @property options.advanced - Advanced configuration
 *
 * @property options.advanced.rollup - Tuple with rollup config and optionally rollup method
 * @property options.advanced.watch - Tuple with watcher config and optionally watch method
 *
 * @property options.advanced.corePluginAndOptions - Core plugins and options
 * @property options.advanced.corePluginAndOptions.commonJs - CommonJs plugin and options
 * @property options.advanced.corePluginAndOptions.nodeResolve - Node resolve plugin and options
 * @property options.advanced.corePluginAndOptions.replace - Replace plugin
 * @property options.advanced.corePluginAndOptions.sucrase - Sucrase plugin and options
 * @property options.advanced.corePluginAndOptions.typescript - Typescript plugin and options
 * @property options.advanced.corePluginAndOptions.terser - Terser plugin and options
 */
export interface ConfigurationOptions {
	projectRoot: string
	entryPoint: string | Record<string, string>
	outputDirectory: string

	ignoredDepsBundleDependencies?: string[]
	additionalPlugins?: (devMode: boolean) => Promise<Plugin[]> | Plugin[]

	advanced?: {
		rollup?: [
			{ input?: RollupInputOptions; output?: RollupOutputOptions },
			typeof RollupFn?
		]
		watch?: [RollupWatchOptions, typeof WatchFn?]

		corePluginsAndOptions?: {
			commonJs?: PluginAndOptions<typeof PluginCommonJs>
			nodeResolve?: PluginAndOptions<typeof PluginNodeResolve>
			replace?: { plugin: typeof PluginReplace }
			sucrase?: PluginAndOptions<typeof PluginSucrase>
			typescript?: PluginAndOptions<typeof PluginTypescript>
			terser?: PluginAndOptions<typeof PluginTerser>
		}
	}
}

/**
 * Represents required plugins for yakshaving
 * @property plugin - Plugin factory function
 * @property devConfig - Config to be used in development mode
 * @property prodConfig - Config to be used in production mode
 */
export interface PluginAndOptions<P extends PluginImpl<any>> {
	plugin?: P

	config?: {
		common?: Parameters<P>[0]
		development?: Parameters<P>[0]
		production?: Parameters<P>[0]
	}
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

		additionalPlugins,
		ignoredDepsBundleDependencies,

		advanced,
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

	// User related information and methods
	const user = createUser(projectRoot)
	const userPlugins = additionalPlugins ? await additionalPlugins(dev) : []
	const userDependencies = user.manifest.dependencies

	// TODO: Actually execute any code
}

function createUser(projectRoot: string) {
	const root = (...args: string[]) => path.resolve(projectRoot, ...args)

	// User information
	const manifestPath = root('package.json')
	const manifest: {
		dependencies: Record<string, string>
	} = require(manifestPath)

	// Users node require
	const userRequire = module.createRequire(manifestPath)

	return { root, manifest, require: userRequire }
}
