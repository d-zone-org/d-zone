import path from 'path'
import module from 'module'

import { ConfigurationOptions } from './utils/configuration'

/**
 * Configure bundler. Import this function in your configuration file
 * and call it with your configuration. Run your configuration file
 * like any other node application. Add `--dev` flag for development mode.
 * Check out `ConfigurationOptions` interface for description of the properties.
 * The function might emit error, please handle it properly.
 *
 * @param options - Configuration Options
 */
export async function configure(options: ConfigurationOptions) {}

function createUser(projectRoot: string) {
	const root = (...args: string[]) => path.resolve(projectRoot, ...args)

	// User information
	const manifestPath = root('package.json')
	const manifest: {
		dependencies: Record<string, string>
	} = require(manifestPath)

	// Users node require
	const userRequire = module.createRequire(manifestPath)

	return { root, manifest, require: userRequire }
}
