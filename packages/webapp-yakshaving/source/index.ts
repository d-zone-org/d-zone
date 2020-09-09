import yargs from 'yargs-parser'
import path from 'path'
import module from 'module'
import fs from 'fs'

import type {
	rollup as RollupFn,
	watch as WatchFn,
	RollupOptions as RollupInputOptions,
	OutputOptions as RollupOutputOptions,
	Plugin,
	RollupWatcher,
	PluginImpl,
} from 'rollup'

import type PluginCommonJs from '@rollup/plugin-commonjs'
import type { nodeResolve as PluginNodeResolve } from '@rollup/plugin-node-resolve'
import type PluginReplace from '@rollup/plugin-replace'
import type PluginTypescript from '@rollup/plugin-typescript'
import type PluginSucrase from '@rollup/plugin-sucrase'
import type { terser as PluginTerser } from 'rollup-plugin-terser'

/**
 * Congfiguration Options
 * @property options.projectRoot - Your projects root directory
 * @property options.entryPoint - Entry files path, relative to `projectRoot`
 * @property options.outputDirectory - Output directory, relative to `projectRoot`
 * @property options.rollup - `rollup` method from rollup
 * @property options.watch - `watch` method from rollup
 * @property options.requiredPlugins - Required plugins
 * @property options.development - Development mode settings
 * @property options.development.ignoredDependencies - Dependencies to be not bundled seperately
 * @property options.development.additionalPlugins - Additonal plugins to be used in dev mode
 * @property options.development.additionalRollupSettings - Add development mode specific rollup settings
 * @property options.production - Production mode settings
 * @property options.production.additionalPlugins - Additional plugins to be used in prod mode
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
		additionalPlugins?: Plugin[]
		additionalRollupSettings?: {
			input?: RollupInputOptions
			output?: RollupOutputOptions
		}
	}

	production?: {
		additionalPlugins?: Plugin[]
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
 * 
 * @param options - Configuration Options
 */
export async function configure({
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
}: ConfigurationOptions) {
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
		// Dependencies to be bundled
		const dependencies = Object.entries(userManifest.dependencies).filter(
			([dependencyId]) =>
				!development?.ignoredDependencies?.includes(dependencyId)
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
				extraPlugins: development?.additionalPlugins || [],
				additionalRollupSettings: development?.additionalRollupSettings,
			},
		})
	} else {
		await productionMode({
			entryPoint: userRoot(entryPoint),
			requiredPlugins: {
				commonJs: [commonJs.plugin, commonJs.prodConfig],
				nodeResolve: [nodeResolve.plugin, nodeResolve.prodConfig],
				typescript: [typescript.plugin, typescript.prodConfig],
				terser: [terser.plugin, terser.prodConfig],
				replace: [replace.plugin],
			},
			extraPlugins: production?.additionalPlugins || [],
			additionalRollupSettings: production?.additionalRollupSettings,
			outputDirectory: userRoot(outputDirectory),
			rollup,
		})
		process.exit()
	}
}

/**
 * Start development mode
 * @param options - Options
 * @param options.dependenciesBundleOptions - Options for dependency bundle generation
 * @param options.watchModeOptions - Options for watch mode
 */
async function developmentMode({
	dependenciesBundleOptions,
	watchModeOptions,
}: {
	dependenciesBundleOptions: Parameters<typeof createDependenciesBundle>[0]
	watchModeOptions: Parameters<typeof startWatchMode>[0]
}) {
	// Create dependencies bundle
	await createDependenciesBundle(dependenciesBundleOptions)
	// Start watch mode
	await startWatchMode(watchModeOptions)
}

/**
 * Create bundle of dependencies
 * @param options - Options
 * @param options.dependencies - Dependencies field from user's manifest
 * @param options.userRequire - User's require method
 * @param options.plugins - Tuple of commonjs, node-resolve and replace plugin
 * @param options.outputDirectory - Output directory for dependencies
 * @param options.rollup - Rollup method
 */
async function createDependenciesBundle({
	dependencies,
	userRequire,
	plugins: [pluginCommonJs, pluginNodeResolve, pluginReplace],

	outputDirectory,

	rollup,
}: {
	dependencies: Record<string, string>
	userRequire: NodeRequire
	plugins: [
		typeof PluginCommonJs,
		typeof PluginNodeResolve,
		typeof PluginReplace
	]

	outputDirectory: string

	rollup: typeof RollupFn
}) {
	// Caching
	const cacheFilePath = path.join(outputDirectory, 'cache.json')
	const cache: string[] = fs.existsSync(cacheFilePath)
		? require(cacheFilePath)
		: // In case file doesnt exist create the output directory
		  (await fs.promises.mkdir(outputDirectory, { recursive: true }), [])
	const updatedCache: string[] = []

	// Dependencies entry points
	const entryPoints: Record<string, string> = {}

	for (const [name, descriptor] of Object.entries(dependencies)) {
		// If dependency isn't already cached
		// Resolve its esm entry and add to entryPoints
		if (!cache.includes(name + descriptor)) {
			const root = (...args: string[]) => path.join(name, ...args)
			const { main, module, type } = userRequire(root('package.json'))

			const modulePath = root(type === 'module' ? main : module || main)
			entryPoints[name] = userRequire.resolve(modulePath)
		}

		// Update Cache
		updatedCache.push(name + descriptor)
	}

	// Write updated cache
	await fs.promises.writeFile(cacheFilePath, JSON.stringify(updatedCache))

	// If all dependencies are cached return
	if (Object.keys(entryPoints).length === 0) return

	// Rollup input options
	const inputOptions: RollupInputOptions = {
		input: entryPoints,
		context: 'window',
		plugins: [
			pluginCommonJs(),
			pluginNodeResolve({ preferBuiltins: false }),
			pluginReplace({
				values: {
					'process.env.NODE_ENV': '"development"',
				},
			}),
		],
	}

	// Rollup output options
	const outputOptions: RollupOutputOptions = {
		dir: outputDirectory,
		format: 'es',
		entryFileNames: '[name].js',
		sourcemap: true,
		exports: 'named',
	}

	// Generate bundle
	const bundle = await rollup(inputOptions)
	await bundle.write(outputOptions)
}

/**
 * Start watch mode for application
 * @param options - Options
 * @param options.entryPoint - Entry point for application
 * @param options.dependencyMap - Map of dependency and their relative location
 * @param options.requiredPlugins - Object of required plugins and their configuration
 * @param options.extraPlugins - Additional plugins
 * @param options.outputDirectory - Output directory for bundle
 * @param options.watch - Rollup watch method
 * @param options.additionalRollupSettings - Additional rollup settings
 */
async function startWatchMode({
	entryPoint,
	dependencyMap,

	requiredPlugins: {
		commonJs: [pluginCommonJs, commonJsUserOpts],
		nodeResolve: [pluginNodeResolve, nodeResolveUserOpts],
		sucrase: [pluginSucrase, sucraseUserOpts],
		typescript: [pluginTypescript, typescriptUserOpts],
	},
	extraPlugins,

	outputDirectory,
	watch,

	additionalRollupSettings,
}: {
	entryPoint: string
	dependencyMap: Record<string, string>

	requiredPlugins: {
		commonJs: [typeof PluginCommonJs, Parameters<typeof PluginCommonJs>[0]?]
		nodeResolve: [
			typeof PluginNodeResolve,
			Parameters<typeof PluginNodeResolve>[0]?
		]
		sucrase: [typeof PluginSucrase, Parameters<typeof PluginSucrase>[0]?]
		typescript: [
			typeof PluginTypescript,
			Parameters<typeof PluginTypescript>[0]?
		]
	}
	extraPlugins: Plugin[]

	outputDirectory: string
	watch: typeof WatchFn

	additionalRollupSettings?: {
		input?: RollupInputOptions
		output?: RollupOutputOptions
	}
}) {
	// Input options
	const inputOptions: RollupInputOptions = {
		input: entryPoint,
		context: 'window',
		plugins: [
			pluginCommonJs(commonJsUserOpts),
			pluginNodeResolve({
				extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
				preferBuiltins: false,
				...nodeResolveUserOpts,
			}),

			...extraPlugins,

			pluginSucrase({
				transforms: ['typescript', 'jsx'],
				...sucraseUserOpts,
			}),
			pluginTypescript({
				noEmit: true,
				...typescriptUserOpts,
			} as Parameters<typeof PluginTypescript>[0]),
		],
		external: Object.keys(dependencyMap),
		...additionalRollupSettings?.input,
	}

	// Output options
	const outputOptions: RollupOutputOptions = {
		dir: outputDirectory,
		format: 'es',
		entryFileNames: '[name].bundle.js',
		sourcemap: true,
		paths: dependencyMap,
		...additionalRollupSettings?.output,
	}

	const watchOptions = { clearScreen: false }

	// Watcher
	const watcher = watch({
		...inputOptions,
		output: [outputOptions],
		watch: watchOptions,
	})

	// Listener for watcher :P
	listenTheWatcher(watcher)
}

function listenTheWatcher(watcher: RollupWatcher) {
	watcher.on('event', (event) => {
		console.log(event)
	})
}

/**
 * Start production mode
 * @param options - Options
 * @param options.entryPoint - Entry point for application
 * @param options.requiredPlugins - Object of required plugins and their configuration
 * @param options.extraPlugins - Additional Plugins
 * @param options.outputDirectory - Output directory for bundle
 * @param options.rollup - Rollup method
 * @param options.additionalRollupSettings - Additional rollup settings
 */
async function productionMode({
	entryPoint,

	requiredPlugins: {
		commonJs: [pluginCommonJs, commonJsUserOpts],
		nodeResolve: [pluginNodeResolve, nodeResolveUserOpts],
		typescript: [pluginTypescript, typescriptUserOpts],
		terser: [pluginTerser, terserUserOpts],
		replace: [pluginReplace],
	},
	extraPlugins,

	outputDirectory,
	rollup,

	additionalRollupSettings,
}: {
	entryPoint: string

	requiredPlugins: {
		commonJs: [typeof PluginCommonJs, Parameters<typeof PluginCommonJs>[0]?]
		nodeResolve: [
			typeof PluginNodeResolve,
			Parameters<typeof PluginNodeResolve>[0]?
		]
		typescript: [
			typeof PluginTypescript,
			Parameters<typeof PluginTypescript>[0]?
		]
		terser: [typeof PluginTerser, Parameters<typeof PluginTerser>[0]?]
		replace: [typeof PluginReplace, Parameters<typeof PluginReplace>[0]?]
	}
	extraPlugins: Plugin[]

	outputDirectory: string
	rollup: typeof RollupFn

	additionalRollupSettings?: {
		input?: RollupInputOptions
		output?: RollupOutputOptions
	}
}) {
	const plugins = [
		pluginCommonJs(commonJsUserOpts),
		pluginNodeResolve({
			extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
			preferBuiltins: false,
			...nodeResolveUserOpts,
		}),
		pluginTypescript(typescriptUserOpts),
		pluginReplace({
			values: {
				'process.env.NODE_ENV': '"production"',
			},
		}),
		pluginTerser(terserUserOpts),
		...extraPlugins,
	]

	const inputOptions: RollupInputOptions = {
		input: entryPoint,
		context: 'window',
		plugins,
		...additionalRollupSettings?.input,
	}

	const outputOptions: RollupOutputOptions = {
		dir: outputDirectory,
		format: 'es',
		entryFileNames: '[name].bundle.js',
		sourcemap: true,
		...additionalRollupSettings?.output,
	}

	const bundle = await rollup(inputOptions)
	await bundle.write(outputOptions)
}
