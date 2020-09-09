import {
	object,
	string,
	func,
	optional,
	array,
	validate as sValidate,
} from 'superstruct'
import { YakError } from './error'

const RequiredPlugin = object({
	plugin: func(),
	devConfig: optional(object()),
	prodConfig: optional(object()),
})

const Configuration = object({
	projectRoot: string(),
	entryPoint: string(),
	outputDirectory: string(),

	rollup: func(),
	watch: func(),

	requiredPlugins: object({
		commonJs: RequiredPlugin,
		nodeResolve: RequiredPlugin,
		replace: object({ plugin: func() }),
		sucrase: RequiredPlugin,
		typescript: RequiredPlugin,
		terser: RequiredPlugin,
	}),

	development: optional(
		object({
			ignoredDependencies: optional(array(string())),
			additionalPlugins: optional(array()),
			additionalRollupSettings: optional(
				object({
					input: optional(object()),
					output: optional(object()),
				})
			),
		})
	),

	production: optional(
		object({
			additionalPlugins: optional(array()),
			additionalRollupSettings: optional(
				object({
					input: optional(object()),
					output: optional(object()),
				})
			),
		})
	),
})

/**
 * Validate configuration
 * @param value - Configuration
 * @throws YakError
 */
export function validate(value: unknown) {
	const [error] = sValidate(value, Configuration)
	if (error === undefined) return

	const propPath = error.path.join('.')

	// Don't need the stack
	delete error.stack

	if (error.value === undefined)
		throw new YakError(
			`CONFIG_PROPERTY_REQUIRED`,
			`${propPath} is required`,
			error
		)
	else if (error.type === 'never')
		throw new YakError(
			`CONFIG_UNKNOWN_PROPERTY`,
			`${propPath} is an unknown property`,
			error
		)
	else
		throw new YakError(
			`CONFIG_PROPERTY_INVALID`,
			`${propPath} is invalid`,
			error
		)
}
