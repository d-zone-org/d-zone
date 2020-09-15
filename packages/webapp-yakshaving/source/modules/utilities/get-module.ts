import { YakError } from './error'

/**
 * Get required modules using the requires provided
 * @param requires - NodeRequires to use to get the module
 */
export function getRequiredModules(...requires: NodeRequire[]) {
	function getModule<T>(moduleName: string): T {
		for (const require of requires) {
			try {
				return require(moduleName)
			} catch {}
		}

		throw new YakError('MODULE_NOT_FOUND', `Could not find ${moduleName}`, {
			internal: true,
			isOperational: false,
		})
	}

	return {
		rollup: getModule<typeof import('rollup')>('rollup'),
		pluginCommonJs: getModule<typeof import('@rollup/plugin-commonjs')>(
			'@rollup/plugin-commonjs'
		),
		pluginNodeResolve: getModule<typeof import('@rollup/plugin-node-resolve')>(
			'@rollup/plugin-node-resolve'
		).nodeResolve,
		pluginReplace: getModule<typeof import('@rollup/plugin-replace')>(
			'@rollup/plugin-replace'
		),
		pluginTypescript: getModule<typeof import('@rollup/plugin-typescript')>(
			'@rollup/plugin-typescript'
		),
		pluginSucrase: getModule<typeof import('@rollup/plugin-sucrase')>(
			'@rollup/plugin-sucrase'
		),
		pluginTerser: getModule<typeof import('rollup-plugin-terser')>(
			'rollup-plugin-terser'
		).terser,
	}
}
