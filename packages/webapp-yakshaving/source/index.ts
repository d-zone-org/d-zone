import { UserConfigurationOptions, parseConfiguration } from './configuration'

/**
 * Configure bundler. Import this function in your configuration file
 * and call it with your configuration. Run your configuration file
 * like any other node application. Add `--dev` flag for development mode.
 * Check out `ConfigurationOptions` interface for description of the properties.
 * The function might emit error, please handle it properly.
 *
 * @param options - Configuration Options
 */
export async function configure(options: UserConfigurationOptions) {
	console.log(parseConfiguration(options))
}
