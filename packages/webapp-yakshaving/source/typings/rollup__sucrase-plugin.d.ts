declare module '@rollup/plugin-sucrase' {
	import { PluginImpl } from 'rollup'
	import { Options } from 'sucrase'

	const plugin: PluginImpl<Options>
	export default plugin
}
