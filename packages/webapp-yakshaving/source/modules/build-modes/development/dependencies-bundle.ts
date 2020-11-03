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

const getRelativePath = (from: string, to: string) =>
	'./' + path.relative(from, to).replace(/\\/g, '/')

/*
 * Create bundle of dependencies
 * @param options - Options
 * @param options.dependencies - Array of tuple of users dependency id and descriptor
 * @param options.userRequire - User's require method
 * @param options.plugins - Tuple of commonjs, node-resolve and replace plugin
 * @param options.outputDirectory - Output directory
 * @param options.rollup - Rollup method
 * @returns Dependencies and their paths
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
	const dependenciesOuputDirectory = path.join(outputDirectory, 'dependencies')

	// Caching
	const cache = new DependenciesCache()
	await cache.init(dependenciesOuputDirectory)

	// Dependencies to bundled entry points
	const entryPoints: Record<string, string> = {}
	// Dependency Ids
	const dependenciesId: string[] = []
	// Dependencies map
	const dependencyAbsolutePathsMap: Record<string, string> = {}

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
		dependencyAbsolutePathsMap[name] = path.resolve(
			dependenciesOuputDirectory,
			`./${name}.js`
		)
	}

	// Write updated cache
	await cache.write()

	const dependenciesMapRelativeToOutputDirectory = Object.fromEntries(
		Object.entries(dependencyAbsolutePathsMap).map(([id, path]) => [
			id,
			getRelativePath(outputDirectory, path),
		])
	)
	// If all dependencies are cached return
	if (Object.keys(entryPoints).length === 0)
		return dependenciesMapRelativeToOutputDirectory

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

	const dependenciesMapRelativeToDependenciesOutputDirectory = Object.fromEntries(
		Object.entries(dependencyAbsolutePathsMap).map(([id, path]) => [
			id,
			getRelativePath(dependenciesOuputDirectory, path),
		])
	)
	// Rollup output options
	const outputOptions: RollupOutputOptions = {
		dir: dependenciesOuputDirectory,
		format: 'es',
		entryFileNames: '[name].js',
		sourcemap: true,
		paths: dependenciesMapRelativeToDependenciesOutputDirectory,
	}

	// Generate bundle
	const bundle = await rollup(inputOptions)
	await bundle.write(outputOptions)

	return dependenciesMapRelativeToOutputDirectory
}
