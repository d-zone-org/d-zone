import path from 'path'
import fs, { promises as fsAsync } from 'fs'

import { YakError } from '../../utils/error'

interface CacheDependencyData {}

/**
 * Small wrapper around dependencies cache
 */
export class DependenciesCache {
	#prevCache: Record<string, CacheDependencyData> = {}
	#newCache: Record<string, CacheDependencyData> = {}

	#cacheFilePath?: string

	/**
	 * Initialize cache, extend previous cache if exists
	 * @param rootDirectory - Directory to initialize cache in
	 */
	async init(rootDirectory: string) {
		const cacheFilePath = path.resolve(rootDirectory, '.cache.json')
		this.#cacheFilePath = cacheFilePath

		if (fs.existsSync(cacheFilePath))
			this.#prevCache = JSON.parse(
				(await fsAsync.readFile(cacheFilePath)).toString()
			)
		else await fsAsync.mkdir(rootDirectory, { recursive: true })
	}

	/**
	 * Check if dependency is cached
	 * @param dependencyId - Dependency id
	 * @param descriptor - Dependency descriptor
	 */
	dependencyIsCached(dependencyId: string, descriptor: string) {
		const id = dependencyId + descriptor
		const isCached = !!this.#prevCache[id]
		if (isCached) this.#newCache[id] = this.#prevCache[id]
		return isCached
	}

	/**
	 * Mark the dependency as cached
	 * @param dependencyId - Dependency id
	 * @param descriptor - Dependency descriptor
	 */
	cacheDependency(dependencyId: string, descriptor: string) {
		const id = dependencyId + descriptor
		this.#newCache[id] = {}
	}

	/**
	 * Write the cache file to disk
	 */
	async write() {
		if (!this.#cacheFilePath)
			throw new YakError(
				'CACHE_NOT_INITIALIZED',
				'Someone forgot to initialize the internal cache. Create an issue.',
				{ internal: true, isOperational: false }
			)
		else fsAsync.writeFile(this.#cacheFilePath, JSON.stringify(this.#newCache))
	}
}
