import yargs from 'yargs-parser'
import path from 'path'
import module from 'module'

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

/**
 * Represents required plugins for yakshaving
 * @property plugin - Plugin factory function
 * @property devConfig - Config to be used in development mode
 * @property prodConfig - Config to be used in production mode
 */
interface RequiredPlugin<P extends PluginImpl<any>> {
	plugin: P
	devConfig?: Parameters<P>[0]
	prodConfig?: Parameters<P>[0]
}

/**
 * Configure bundler
 * @param options - Configuration
 */
export async function configure({
	projectRoot,
	entryPoint,
	outputDirectory,

	rollup,
	watch,
	requiredPlugins: { commonJs, nodeResolve, replace, sucrase, typescript },

	development,
}: {
	projectRoot: string
	entryPoint: string
	outputDirectory: string

	rollup: typeof RollupFn
	watch: typeof WatchFn

	requiredPlugins: {
		commonJs: RequiredPlugin<typeof PluginCommonJs>
		nodeResolve: RequiredPlugin<typeof PluginNodeResolve>
		replace: RequiredPlugin<typeof PluginReplace>
		sucrase: RequiredPlugin<typeof PluginSucrase>
		typescript: RequiredPlugin<typeof PluginTypescript>
	}

	development?: {
		ignoredDependencies?: string[]
		additionalPlugins?: Plugin[]
	}
}) {
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
		const dependencies = Object.keys(userManifest.dependencies).filter(
			(dependency) => !development?.ignoredDependencies?.includes(dependency)
		)

		// Start development mode
		await developmentMode({
			dependenciesBundleOptions: {
				userRequire,
				dependencies,
				outputDirectory: userRoot(outputDirectory, 'dependencies'),
				rollup,
				plugins: [commonJs.plugin, nodeResolve.plugin, replace.plugin],
			},
			watchModeOptions: {
				dependencyMap: Object.fromEntries(
					dependencies.map((dependencyId) => [
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
			},
		})
	} else productionMode()
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
 * @param options.dependencies - Array of ids of dependencies to be bundled
 * @param options.userRequire - Users require method
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
	dependencies: string[]
	userRequire: NodeRequire
	plugins: [
		typeof PluginCommonJs,
		typeof PluginNodeResolve,
		typeof PluginReplace
	]

	outputDirectory: string

	rollup: typeof RollupFn
}) {
	// Resolves es module entry points
	const getEntryPointPath = (name: string) => {
		const root = (...args: string[]) => path.join(name, ...args)
		const { main, module, type } = userRequire(root('package.json'))
		return userRequire.resolve(root(type === 'module' ? main : module || main))
	}

	// Rollup input options
	const inputOptions: RollupInputOptions = {
		input: Object.fromEntries(
			dependencies.map((name) => [name, getEntryPointPath(name)])
		),
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
 * @param options.requiredPlugins - Object of required plugins and thier configuration
 * @param options.extraPlugins - Additional plugins
 * @param options.outputDirectory - Output directory for bundle
 * @param options.watch - Rollups watch method
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
	}

	// Output options
	const outputOptions: RollupOutputOptions = {
		dir: outputDirectory,
		format: 'es',
		entryFileNames: 'bundle.js',
		sourcemap: true,
		paths: dependencyMap,
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

async function productionMode() {}
