import path from 'path'
import module from 'module'

export interface Manifest {
	dependencies: Record<string, string>
}

export interface UserInformation {
	root: (...args: string[]) => string
	manifest: Manifest
	require: NodeRequire
	dependencies: [string, string][]
}

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
): UserInformation {
	const root = (...args: string[]) => path.resolve(projectRoot, ...args)

	// User information
	const manifestPath = root('package.json')
	const manifest: Manifest = require(manifestPath)

	return {
		root,
		manifest,

		require: module.createRequire(manifestPath),
		dependencies: Object.entries(manifest.dependencies || {}).filter(
			([dependencyId]) => !ignoredDependencies.includes(dependencyId)
		),
	}
}
