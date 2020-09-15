import {
	any,
	array,
	object,
	optional,
	record,
	string,
	struct,
	union,
	Struct,
} from 'superstruct'

import type {
	InputOption,
	Plugin,
	RollupOptions as RollupInputOptions,
	OutputOptions as RollupOutputOptions,
} from 'rollup'

import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { RollupTypescriptOptions } from '@rollup/plugin-typescript'
import type RollupPluginSucrase from '@rollup/plugin-sucrase'
type RollupSucraseOptions = Parameters<typeof RollupPluginSucrase>[0]
import type { Options as TerserOptions } from 'rollup-plugin-terser'

// Handy custom type for validation
const isObject = (val: unknown) =>
	val !== null && typeof val === 'object' && !Array.isArray(val)
const interfaceObject = <T extends unknown>(name: string): Struct<T, null> =>
	struct<T>(name, isObject)

/**
 * Represents configuration options
 *
 * @property projectRoot - Your applications root directory's absolute path
 * @property entryPoint - Entry-point(s) to your application
 * @property outputDirectory - Output directory
 * @property additionalPlugins - Additional plugins to be used
 * @property advanced - Advanced options
 * @property advanced.ignoredDependencies - Dependencies to be ignored for dev deps bundle
 * @property advanced.rollupOptions - Override rollup options
 * @property advanced.rollupOptions.input - Rollup input options
 * @property advanced.rollupOptions.output - Rollup output options
 * @property pluginOptions - Override default plugin options for app bundle
 * @property pluginOptions.commonJs - CommonJs plugin options
 * @property pluginOptions.nodeResolve - NodeResolve plugin options
 * @property pluginOptions.typescript - Typescript plugin options
 * @property pluginOptions.sucrase - Sucrase plugin options
 * @property pluginOptions.terser - Terser plugin options
 * @property pluginOptions.replace - Values to replaced in bundle
 */
export interface Configuration {
	projectRoot: string
	entryPoint: InputOption
	outputDirectory: string
	additionalPlugins: Plugin[]

	advanced?: {
		ignoredDependencies?: string[]

		rollupOptions: {
			input?: RollupInputOptions
			output?: RollupOutputOptions
		}

		pluginOptions?: {
			commonJs?: RollupCommonJSOptions
			nodeResolve?: RollupNodeResolveOptions
			typescript?: RollupTypescriptOptions
			sucrase?: RollupSucraseOptions
			terser?: TerserOptions
			replace?: Record<string, string>
		}
	}
}

// User configuration schema
export const userConfigurationSchema: Struct<Configuration> = object({
	projectRoot: string(),
	entryPoint: union([string(), array(string()), record(string(), string())]),
	outputDirectory: string(),
	additionalPlugins: array(any()),

	advanced: optional(
		object({
			ignoredDependencies: optional(array(string())),

			rollupOptions: optional(
				object({
					input: optional(
						interfaceObject<RollupInputOptions>('RollupInputOptions')
					),
					output: optional(
						interfaceObject<RollupOutputOptions>('RollupOutputOptions')
					),
				})
			),

			pluginOptions: optional(
				object({
					commonJs: optional(
						interfaceObject<RollupCommonJSOptions>('CommonJSPluginOptions')
					),
					nodeResolve: optional(
						interfaceObject<RollupNodeResolveOptions>(
							'NodeResolvePluginOptions'
						)
					),
					typescript: optional(
						interfaceObject<RollupTypescriptOptions>('TypescriptPluginOptions')
					),
					sucrase: optional(
						interfaceObject<RollupSucraseOptions>('SucrasePluginOptions')
					),
					terser: optional(
						interfaceObject<TerserOptions>('TerserPluginOptions')
					),
					replace: optional(record(string(), string())),
				})
			),
		})
	),
})
