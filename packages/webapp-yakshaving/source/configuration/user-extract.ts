import path from 'path'
import module from 'module'

/**
 * Extracts user information from `package.json` 
 * and creates helper methods
 *
 * @param projectRoot - Users root directory
 * @param ignoredDependencies - Ignored dependencies
 */
export function extractUserInformation(
	projectRoot: string,
	ignoredDependencies: string[]
) {
	const root = (...args: string[]) => path.resolve(projectRoot, ...args)

	// User information
	const manifestPath = root('package.json')
	const manifest: {
		dependencies: Record<string, string>
	} = require(manifestPath)

	return {
		root,
		manifest,

		require: module.createRequire(manifestPath),
		dependencies: Object.entries(manifest.dependencies).filter(
			([dependencyId]) => !ignoredDependencies.includes(dependencyId)
		),
	}
}
