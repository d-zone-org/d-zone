import type {
	watch as WatchFn,
	RollupOptions as RollupInputOptions,
	OutputOptions as RollupOutputOptions,
	Plugin,
	RollupWatcher,
	InputOption,
} from 'rollup'
import type PluginCommonJs from '@rollup/plugin-commonjs'
import type { nodeResolve as PluginNodeResolve } from '@rollup/plugin-node-resolve'
import type PluginTypescript from '@rollup/plugin-typescript'
import type PluginSucrase from '@rollup/plugin-sucrase'

/**
 * Start watch mode for application
 * @param options - Options
 * @param options.entryPoint - Entry point(s) for application
 * @param options.dependencyMap - Map of dependency and their relative location
 * @param options.requiredPlugins - Object of required plugins and their configuration
 * @param options.extraPlugins - Additional plugins
 * @param options.outputDirectory - Output directory for bundle
 * @param options.watch - Rollup watch method
 * @param options.additionalRollupSettings - Additional rollup settings
 */
export async function startWatchMode({
	entryPoint,
	dependencyMap,

	requiredPlugins,
	extraPlugins,

	outputDirectory,
	watch,

	additionalRollupSettings,
}: {
	entryPoint: InputOption
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
	const {
		commonJs: [pluginCommonJs, commonJsUserOpts],
		nodeResolve: [pluginNodeResolve, nodeResolveUserOpts],
		sucrase: [pluginSucrase, sucraseUserOpts],
		typescript: [pluginTypescript, typescriptUserOpts],
	} = requiredPlugins

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
	listenToWatcher(watcher)
}

function listenToWatcher(watcher: RollupWatcher) {
	watcher.on('event', (event) => {
		console.log(event)
	})
}
