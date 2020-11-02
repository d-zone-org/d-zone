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
 * @param options.outputDirectory - Output directory
 * @param options.rollup - Rollup method
 * @returns Dependencies and their relative paths map
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
}): Promise<Record<string, string>> {
	// Write in a subdirectory rather than the same
	outputDirectory = path.join(outputDirectory, 'dependencies')

	// Caching
	const cache = new DependenciesCache()
	await cache.init(outputDirectory)

	// Dependencies to bundled entry points
	const entryPoints: Record<string, string> = {}
	// Dependency Ids
	const dependenciesId: string[] = []
	// Dependencies map
	const dependenciesMap: Record<string, string> = {}

	for (const [name, descriptor] of dependencies) {
		// Add dependencies which are not cached
		if (!cache.dependencyIsCached(name, descriptor)) {
			const root = (...args: string[]) => path.join(name, ...args)
			const { main, module, type } = userRequire(root('package.json'))

			const modulePath = root(type === 'module' ? main : module || main)
			entryPoints[name] = userRequire.resolve(modulePath)

			cache.cacheDependency(name, descriptor)
		}

		dependenciesId.push(name)
		dependenciesMap[name] = path.join(
			outputDirectory,
			`./dependencies/${name}/index.js`
		)
	}

	// Write updated cache
	await cache.write()

	// If all dependencies are cached return
	if (Object.keys(entryPoints).length === 0) return dependenciesMap

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
		external: dependenciesId,
	}

	// Rollup output options
	const outputOptions: RollupOutputOptions = {
		dir: outputDirectory,
		format: 'es',
		entryFileNames: '[name]/index.js',
		sourcemap: true,
		exports: 'named',
		// Relative to output directory
		paths: Object.fromEntries(
			Object.entries(dependenciesMap).map(([k, v]) => [
				k,
				path.relative(outputDirectory, v),
			])
		),
	}

	// Generate bundle
	const bundle = await rollup(inputOptions)
	await bundle.write(outputOptions)

	// Relative to users output directory
	return Object.fromEntries(
		Object.entries(dependenciesMap).map(([k, v]) => [
			k,
			path.relative(path.join(outputDirectory, '..'), v),
		])
	)
}
