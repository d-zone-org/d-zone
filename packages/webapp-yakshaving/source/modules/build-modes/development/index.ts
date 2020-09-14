import { createDependenciesBundle } from './dependencies-bundle'
import { startWatchMode } from './watch-mode'

/**
 * Start development mode
 * @param options - Options
 * @param options.dependenciesBundleOptions - Options for dependency bundle generation
 * @param options.watchModeOptions - Options for watch mode
 */
export async function developmentMode({
	dependenciesBundleOptions,
	watchModeOptions,
}: {
	dependenciesBundleOptions: Parameters<typeof createDependenciesBundle>[0]
	watchModeOptions: Parameters<typeof startWatchMode>[0]
}) {
	// Create dependencies bundle
	await createDependenciesBundle(dependenciesBundleOptions)
	// Start watch mode
	await startWatchMode(watchModeOptions)
}
