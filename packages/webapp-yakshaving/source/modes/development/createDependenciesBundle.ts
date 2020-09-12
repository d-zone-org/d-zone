import path from 'path'
import fs from 'fs'

import type {
	rollup as RollupFn,
	RollupOptions as RollupInputOptions,
	OutputOptions as RollupOutputOptions,
} from 'rollup'
import type PluginCommonJs from '@rollup/plugin-commonjs'
import type { nodeResolve as PluginNodeResolve } from '@rollup/plugin-node-resolve'
import type PluginReplace from '@rollup/plugin-replace'

/**
 * Create bundle of dependencies
 * @param options - Options
 * @param options.dependencies - Dependencies field from user's manifest
 * @param options.userRequire - User's require method
 * @param options.plugins - Tuple of commonjs, node-resolve and replace plugin
 * @param options.outputDirectory - Output directory for dependencies
 * @param options.rollup - Rollup method
 */
export async function createDependenciesBundle({
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
		: // In case file doesn't exist create the output directory
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
