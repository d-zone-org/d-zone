import { YakError } from './error'

import type pluginCommonJs from '@rollup/plugin-commonjs'
import type pluginReplace from '@rollup/plugin-replace'
import type pluginTypescript from '@rollup/plugin-typescript'
import type pluginSucrase from '@rollup/plugin-sucrase'

/**
 * Get required modules using the requires provided
 * @param requires - NodeRequires to use to get the module
 */
export function getRequiredModules(...requires: NodeRequire[]) {
	function getModule<T>(moduleName: string): T {
		for (const require of requires) {
			try {
				const path = require.resolve(moduleName)
				console.log(`Using ${moduleName} from ${path}`)
				return require(path)
			} catch {}
		}

		throw new YakError('MODULE_NOT_FOUND', `Could not find ${moduleName}`, {
			internal: true,
			isOperational: false,
		})
	}

	return {
		rollup: getModule<typeof import('rollup')>('rollup'),
		pluginCommonJs: getModule<typeof pluginCommonJs>('@rollup/plugin-commonjs'),
		pluginNodeResolve: getModule<typeof import('@rollup/plugin-node-resolve')>(
			'@rollup/plugin-node-resolve'
		).nodeResolve,
		pluginReplace: getModule<typeof pluginReplace>('@rollup/plugin-replace'),
		pluginTypescript: getModule<typeof pluginTypescript>(
			'@rollup/plugin-typescript'
		),
		pluginSucrase: getModule<typeof pluginSucrase>('@rollup/plugin-sucrase'),
		pluginTerser: getModule<typeof import('rollup-plugin-terser')>(
			'rollup-plugin-terser'
		).terser,
	}
}
