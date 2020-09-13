import path from 'path'
import module from 'module'

export function extractUserInformation(projectRoot: string) {
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
