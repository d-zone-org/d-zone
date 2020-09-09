import { object, string, func, optional, array } from 'superstruct'

const requiredPluginSchema = object({
	plugin: func(),
	devConfig: object(),
	prodConfig: object(),
})

export default object({
	projectRoot: string(),
	entryPoint: string(),
	outputDirectory: string(),

	rollup: func(),
	watch: func(),

	requiredPlugins: object({
		commonJs: requiredPluginSchema,
		nodeResolve: requiredPluginSchema,
		replace: object({ plugin: func() }),
		sucrase: requiredPluginSchema,
		typescript: requiredPluginSchema,
		terser: requiredPluginSchema,
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
