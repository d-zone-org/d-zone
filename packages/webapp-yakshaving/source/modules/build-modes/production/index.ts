import type {
	rollup as RollupFn,
	RollupOptions as RollupInputOptions,
	OutputOptions as RollupOutputOptions,
	Plugin,
	InputOption,
} from 'rollup'
import type PluginCommonJs from '@rollup/plugin-commonjs'
import type { nodeResolve as PluginNodeResolve } from '@rollup/plugin-node-resolve'
import type PluginReplace from '@rollup/plugin-replace'
import type PluginTypescript from '@rollup/plugin-typescript'
import type { terser as PluginTerser } from 'rollup-plugin-terser'

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
export async function productionMode({
	entryPoint,

	requiredPlugins: {
		commonJs: [pluginCommonJs, commonJsUserOpts],
		nodeResolve: [pluginNodeResolve, nodeResolveUserOpts],
		typescript: [pluginTypescript, typescriptUserOpts],
		terser: [pluginTerser, terserUserOpts],
		replace: [pluginReplace, replaceValues],
	},
	extraPlugins,

	outputDirectory,
	rollup,

	additionalRollupSettings,
}: {
	entryPoint: InputOption

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
		replace: [typeof PluginReplace, Record<string, string>?]
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

		...extraPlugins,

		pluginTypescript(typescriptUserOpts),
		pluginReplace({
			values: {
				'process.env.NODE_ENV': '"production"',
				...replaceValues,
			},
		}),
		pluginTerser(terserUserOpts),
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
