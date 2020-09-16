import path from 'path'

import { DependenciesCache } from './dependencies-bundle-cache'

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
 * @param options.dependencies - Array of tuple of users dependency id and descriptor
 * @param options.userRequire - User's require method
 * @param options.plugins - Tuple of commonjs, node-resolve and replace plugin
 * @param options.outputDirectory - Output directory for dependencies
 * @param options.rollup - Rollup method
 */
export async function createDependenciesBundle({
	dependencies,
	userRequire,
	plugins: { pluginCommonJs, pluginNodeResolve, pluginReplace },

	outputDirectory,

	rollup,
}: {
	dependencies: [string, string][]
	userRequire: NodeRequire
	plugins: {
		pluginCommonJs: typeof PluginCommonJs
		pluginNodeResolve: typeof PluginNodeResolve
		pluginReplace: typeof PluginReplace
	}

	outputDirectory: string

	rollup: typeof RollupFn
}) {
	// Caching
	const cache = new DependenciesCache()
	await cache.init(outputDirectory)

	// Dependencies entry points
	const entryPoints: Record<string, string> = {}

	// Add dependencies which are not cached
	for (const [name, descriptor] of dependencies) {
		if (!cache.dependencyIsCached(name, descriptor)) {
			const root = (...args: string[]) => path.join(name, ...args)
			const { main, module, type } = userRequire(root('package.json'))

			const modulePath = root(type === 'module' ? main : module || main)
			entryPoints[name] = userRequire.resolve(modulePath)

			cache.cacheDependency(name, descriptor)
		}
	}

	// Write updated cache
	await cache.write()

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
		entryFileNames: '[name]/index.js',
		sourcemap: true,
		exports: 'named',
	}

	// Generate bundle
	const bundle = await rollup(inputOptions)
	await bundle.write(outputOptions)
}
