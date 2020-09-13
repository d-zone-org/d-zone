import defaultsMerge from 'defaults-deep-ts'

import { YakError } from '../utils/error'
import {
	UserConfigurationOptions,
	userConfigurationOptionsSchema,
} from './user-schema-types'

// Default basic configuration
const defaultConfiguration: Partial<UserConfigurationOptions> = {
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
 * @param value - Configuration
 */
export function parseUserConfiguration(value: UserConfigurationOptions) {
	const parsedData = userConfigurationOptionsSchema.safeParse(value)

	if (parsedData.success) {
		return defaultsMerge<unknown, Partial<UserConfigurationOptions>>(
			parsedData.data,
			defaultConfiguration
		) as Required<UserConfigurationOptions>
	} else {
		throw new YakError('INVALID_CONFIGURATION', 'Invalid Configuration', {
			internal: false,
			isOperational: false,
			errors: parsedData.error.errors,
		})
	}
}
