import deepmerge from 'deepmerge'

import { YakError } from '../utils/error'
import {
	ConfigurationOptions,
	UserConfigurationOptions,
	userConfigurationOptionsSchema,
} from './user-schema-types'

// Default basic configuration
const DEFAULT_CONFIGURATION: Partial<ConfigurationOptions> = {
	advanced: {
		rollup: [{}, require('rollup').rollup],
		watch: [{}, require('rollup').watch],

		corePluginsAndOptions: {
			commonJs: { plugin: require('@rollup/plugin-commonjs') },
			nodeResolve: {
				plugin: require('@rollup/plugin-node-resolve').nodeResolve,
				config: {
					common: {
						extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
					},
				},
			},
			replace: { plugin: require('@rollup/plugin-replace') },
			sucrase: { plugin: require('@rollup/plugin-sucrase') },
			typescript: { plugin: require('@rollup/plugin-typescript') },
			terser: { plugin: require('rollup-plugin-terser').terser },
		},
	},
}

/**
 * Parse user configuration and deep merge the defaults
 * @param userConfiguration - Configuration
 */
export function parseUserConfiguration(
	userConfiguration: UserConfigurationOptions
): ConfigurationOptions {
	const parsedData = userConfigurationOptionsSchema.safeParse(userConfiguration)

	if (parsedData.success) {
		return deepmerge(DEFAULT_CONFIGURATION, parsedData.data)
	} else {
		throw new YakError('INVALID_CONFIGURATION', 'Invalid Configuration', {
			internal: false,
			isOperational: false,
			errors: parsedData.error.errors,
		})
	}
}
