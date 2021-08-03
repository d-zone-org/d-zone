declare module 'pixi-cull' {
	export class Simple {
		/**
		 * Creates a simple cull
		 *
		 * @param {object} [options]
		 * @param {boolean} [options.visible] Parameter of the object to set (usually
		 *     visible or renderable) Default is `visible`
		 * @param {boolean} [options.calculatePIXI] Calculate pixi.js bounding box
		 *     automatically; if this is set to false then it uses
		 *     object[options.AABB] for bounding box Default is `true`
		 * @param {string} [options.dirtyTest] Only update spatial hash for objects
		 *     with object[options.dirtyTest]=true; this has a HUGE impact on
		 *     performance Default is `true`
		 * @param {string} [options.AABB] Object property that holds bounding box so
		 *     that object[type] = { x: number, y: number, width: number, height:
		 *     number }; not needed if options.calculatePIXI=true Default is `AABB`
		 */
		constructor(options?: {
			visible: boolean
			calculatePIXI: boolean
			dirtyTest: string
			AABB: string
		})
		visible: string | true
		calculatePIXI: boolean
		dirtyTest: string | boolean
		AABB: string
		lists: any[][]
		/**
		 * Add an array of objects to be culled
		 *
		 * @param {Array} array
		 * @param {boolean} [staticObject] Set to true if the object's position/size
		 *     does not change
		 * @returns {Array} Array
		 */
		addList(array: any[], staticObject?: boolean): any[]
		/**
		 * Remove an array added by addList()
		 *
		 * @param {Array} array
		 * @returns {Array} Array
		 */
		removeList(array: any[]): any[]
		/**
		 * Add an object to be culled
		 *
		 * @param {any} object
		 * @param {boolean} [staticObject] Set to true if the object's position/size
		 *     does not change
		 * @returns {any} Object
		 */
		add(object: any, staticObject?: boolean): any
		/**
		 * Remove an object added by add()
		 *
		 * @param {any} object
		 * @returns {any} Object
		 */
		remove(object: any): any
		/**
		 * Cull the items in the list by setting visible parameter
		 *
		 * @param {object} bounds
		 * @param {number} bounds.x
		 * @param {number} bounds.y
		 * @param {number} bounds.width
		 * @param {number} bounds.height
		 * @param {boolean} [skipUpdate] Skip updating the AABB bounding box of all objects
		 */
		cull(
			bounds: {
				x: number
				y: number
				width: number
				height: number
			},
			skipUpdate?: boolean
		): void
		/**
		 * Update the AABB for all objects automatically called from update() when
		 * calculatePIXI=true and skipUpdate=false
		 */
		updateObjects(): void
		/**
		 * Update the has of an object automatically called from updateObjects()
		 *
		 * @param {any} object
		 */
		updateObject(object: any): void
		/**
		 * Returns an array of objects contained within bounding box
		 *
		 * @param {object} boudns Bounding box to search
		 * @param {number} bounds.x
		 * @param {number} bounds.y
		 * @param {number} bounds.width
		 * @param {number} bounds.height
		 * @returns {object[]} Search results
		 */
		query(bounds: any): object[]
		/**
		 * Iterates through objects contained within bounding box stops iterating if
		 * the callback returns true
		 *
		 * @param {object} bounds Bounding box to search
		 * @param {number} bounds.x
		 * @param {number} bounds.y
		 * @param {number} bounds.width
		 * @param {number} bounds.height
		 * @param {function} callback
		 * @returns {boolean} True if callback returned early
		 */
		queryCallback(
			bounds: {
				x: number
				y: number
				width: number
				height: number
			},
			callback: Function
		): boolean
		/**
		 * Get stats (only updated after update() is called)
		 *
		 * @returns {SimpleStats}
		 */
		stats(): SimpleStats
	}
	export type SimpleStats = {
		total: number
		visible: number
		culled: number
	}
	export class SpatialHash {
		/**
		 * Creates a spatial-hash cull
		 *
		 * @param {object} [options]
		 * @param {number} [options.size] Cell size used to create hash (xSize = ySize)
		 *     Default is `1000`
		 * @param {number} [options.xSize] Horizontal cell size
		 * @param {number} [options.ySize] Vertical cell size
		 * @param {boolean} [options.calculatePIXI] Calculate bounding box
		 *     automatically; if this is set to false then it uses
		 *     object[options.AABB] for bounding box Default is `true`
		 * @param {boolean} [options.visible] Parameter of the object to set (usually
		 *     visible or renderable) Default is `visible`
		 * @param {boolean} [options.simpleTest] Iterate through visible buckets to
		 *     check for bounds Default is `true`
		 * @param {string} [options.dirtyTest] Only update spatial hash for objects
		 *     with object[options.dirtyTest]=true; this has a HUGE impact on
		 *     performance Default is `true`
		 * @param {string} [options.AABB] Object property that holds bounding box so
		 *     that object[type] = { x: number, y: number, width: number, height:
		 *     number } Default is `AABB`
		 * @param {string} [options.spatial] Object property that holds object's hash
		 *     list Default is `spatial`
		 * @param {string} [options.dirty] Object property for dirtyTest Default is `dirty`
		 */
		constructor(options?: {
			size: number
			xSize: number
			ySize: number
			calculatePIXI: boolean
			visible: boolean
			simpleTest: boolean
			dirtyTest: string
			AABB: string
			spatial: string
			dirty: string
		})
		xSize: number
		ySize: number
		AABB: any
		spatial: string
		calculatePIXI: boolean
		visibleText: any
		simpleTest: boolean
		dirtyTest: string | boolean
		visible: string | true
		dirty: string
		width: number
		height: number
		hash: {}
		objects: any[]
		containers: any[]
		/**
		 * Add an object to be culled side effect: adds object.spatialHashes to track
		 * existing hashes
		 *
		 * @param {any} object
		 * @param {boolean} [staticObject] Set to true if the object's position/size
		 *     does not change
		 * @returns {any} Object
		 */
		add(object: any, staticObject?: boolean): any
		/**
		 * Remove an object added by add()
		 *
		 * @param {any} object
		 * @returns {any} Object
		 */
		remove(object: any): any
		/**
		 * Add an array of objects to be culled
		 *
		 * @param {PIXI.Container} container
		 * @param {boolean} [staticObject] Set to true if the objects in the
		 *     container's position/size do not change note: this only works with pixi
		 *     v5.0.0rc2+ because it relies on the new container events childAdded and
		 *     childRemoved
		 */
		addContainer(container: any, staticObject?: boolean): void
		/**
		 * Remove an array added by addContainer()
		 *
		 * @param {PIXI.Container} container
		 * @returns {PIXI.Container} Container
		 */
		removeContainer(container: any): any
		/**
		 * Update the hashes and cull the items in the list
		 *
		 * @param {AABB} AABB
		 * @param {boolean} [skipUpdate] Skip updating the hashes of all objects
		 * @returns {number} Number of buckets in results
		 */
		cull(AABB: AABB, skipUpdate?: boolean): number
		/** Set all objects in hash to visible=false */
		invisible(): void
		/**
		 * Update the hashes for all objects automatically called from update() when
		 * skipUpdate=false
		 */
		updateObjects(): void
		/**
		 * Update the has of an object automatically called from updateObjects()
		 *
		 * @param {any} object
		 * @param {boolean} [force] Force update for calculatePIXI
		 */
		updateObject(object: any): void
		/**
		 * Returns an array of buckets with >= minimum of objects in each bucket
		 *
		 * @param {number} [minimum] Default is `1`
		 * @returns {array} Array of buckets
		 */
		getBuckets(minimum?: number): any[]
		/**
		 * Gets hash bounds
		 *
		 * @private
		 *
		 * @param {AABB} AABB
		 * @returns {Bounds}
		 */
		private getBounds
		/**
		 * Insert object into the spatial hash automatically called from updateObject()
		 *
		 * @param {any} object
		 * @param {string} key
		 */
		insert(object: any, key: string): void
		/**
		 * Removes object from the hash table should be called when removing an object
		 * automatically called from updateObject()
		 *
		 * @param {object} object
		 */
		removeFromHash(object: object): void
		/**
		 * Get all neighbors that share the same hash as object
		 *
		 * @param {any} object In the spatial hash
		 * @returns {Array} Of objects that are in the same hash as object
		 */
		neighbors(object: any): any[]
		/**
		 * Returns an array of objects contained within bounding box
		 *
		 * @param {AABB} AABB Bounding box to search
		 * @param {boolean} [simpleTest] Perform a simple bounds check of all items in
		 *     the buckets Default is `true`
		 * @returns {object[]} Search results
		 */
		query(AABB: AABB, simpleTest?: boolean): object[]
		lastBuckets: number
		/**
		 * Iterates through objects contained within bounding box stops iterating if
		 * the callback returns true
		 *
		 * @param {AABB} AABB Bounding box to search
		 * @param {function} callback
		 * @param {boolean} [simpleTest] Perform a simple bounds check of all items in
		 *     the buckets Default is `true`
		 * @returns {boolean} True if callback returned early
		 */
		queryCallback(AABB: AABB, callback: Function, simpleTest?: boolean): boolean
		/**
		 * Get stats
		 *
		 * @returns {Stats}
		 */
		stats(): Stats
		/**
		 * Helper function to evaluate hash table
		 *
		 * @returns {number} The number of buckets in the hash table
		 */
		getNumberOfBuckets(): number
		/**
		 * Helper function to evaluate hash table
		 *
		 * @returns {number} The average number of entries in each bucket
		 */
		getAverageSize(): number
		/**
		 * Helper function to evaluate the hash table
		 *
		 * @returns {number} The largest sized bucket
		 */
		getLargest(): number
		/**
		 * Gets quadrant bounds
		 *
		 * @returns {Bounds}
		 */
		getWorldBounds(): Bounds
		/**
		 * Helper function to evalute the hash table
		 *
		 * @param {AABB} [AABB] Bounding box to search or entire world
		 * @returns {number} Sparseness percentage (i.e., buckets with at least 1
		 *     element divided by total possible buckets)
		 */
		getSparseness(AABB?: AABB): number
	}
	export type Stats = {
		total: number
		visible: number
		culled: number
	}
	export type Bounds = {
		xStart: number
		yStart: number
		xEnd: number
	}
	export type AABB = {
		x: number
		y: number
		width: number
		height: number
	}
}
