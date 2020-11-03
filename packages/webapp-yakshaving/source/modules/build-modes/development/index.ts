import { createDependenciesBundle } from './dependencies-bundle'
import { startWatchMode } from './watch-mode'

type DependenciesBundleOptions = Parameters<typeof createDependenciesBundle>[0]
type WatchModeOptions = Parameters<typeof startWatchMode>[0]

/**
 * Start development mode
 * @param options - Options
 * @param options.outputDirectory - Output directory
 * @param options.dependenciesBundleOptions - Options for dependency bundle generation
 * @param options.watchModeOptions - Options for watch mode
 */
export async function developmentMode({
	outputDirectory,
	dependenciesBundleOptions,
	watchModeOptions,
}: {
	outputDirectory: string
	dependenciesBundleOptions: Omit<DependenciesBundleOptions, 'outputDirectory'>
	watchModeOptions: Omit<
		WatchModeOptions,
		'outputDirectory' | 'dependenciesMap'
	>
}) {
	// Create dependencies bundle
	const dependenciesMap = await createDependenciesBundle({
		...dependenciesBundleOptions,
		outputDirectory,
	})

	// Start watch mode
	await startWatchMode({
		...watchModeOptions,
		outputDirectory,
		dependenciesMap,
	})
}
