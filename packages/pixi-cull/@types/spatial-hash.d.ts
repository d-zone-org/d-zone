export class SpatialHash {
	/**
	 * creates a spatial-hash cull
	 * @param {object} [options]
	 * @param {number} [options.size=1000] cell size used to create hash (xSize = ySize)
	 * @param {number} [options.xSize] horizontal cell size
	 * @param {number} [options.ySize] vertical cell size
	 * @param {boolean} [options.calculatePIXI=true] calculate bounding box automatically; if this is set to false then it uses object[options.AABB] for bounding box
	 * @param {boolean} [options.visible=visible] parameter of the object to set (usually visible or renderable)
	 * @param {boolean} [options.simpleTest=true] iterate through visible buckets to check for bounds
	 * @param {string} [options.dirtyTest=true] only update spatial hash for objects with object[options.dirtyTest]=true; this has a HUGE impact on performance
	 * @param {string} [options.AABB=AABB] object property that holds bounding box so that object[type] = { x: number, y: number, width: number, height: number }
	 * @param {string} [options.spatial=spatial] object property that holds object's hash list
	 * @param {string} [options.dirty=dirty] object property for dirtyTest
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
	 * add an object to be culled
	 * side effect: adds object.spatialHashes to track existing hashes
	 * @param {*} object
	 * @param {boolean} [staticObject] set to true if the object's position/size does not change
	 * @return {*} object
	 */
	add(object: any, staticObject?: boolean): any
	/**
	 * remove an object added by add()
	 * @param {*} object
	 * @return {*} object
	 */
	remove(object: any): any
	/**
	 * add an array of objects to be culled
	 * @param {PIXI.Container} container
	 * @param {boolean} [staticObject] set to true if the objects in the container's position/size do not change
	 * note: this only works with pixi v5.0.0rc2+ because it relies on the new container events childAdded and childRemoved
	 */
	addContainer(container: any, staticObject?: boolean): void
	/**
	 * remove an array added by addContainer()
	 * @param {PIXI.Container} container
	 * @return {PIXI.Container} container
	 */
	removeContainer(container: any): any
	/**
	 * update the hashes and cull the items in the list
	 * @param {AABB} AABB
	 * @param {boolean} [skipUpdate] skip updating the hashes of all objects
	 * @return {number} number of buckets in results
	 */
	cull(AABB: AABB, skipUpdate?: boolean): number
	/**
	 * set all objects in hash to visible=false
	 */
	invisible(): void
	/**
	 * update the hashes for all objects
	 * automatically called from update() when skipUpdate=false
	 */
	updateObjects(): void
	/**
	 * update the has of an object
	 * automatically called from updateObjects()
	 * @param {*} object
	 * @param {boolean} [force] force update for calculatePIXI
	 */
	updateObject(object: any): void
	/**
	 * returns an array of buckets with >= minimum of objects in each bucket
	 * @param {number} [minimum=1]
	 * @return {array} array of buckets
	 */
	getBuckets(minimum?: number): any[]
	/**
	 * gets hash bounds
	 * @param {AABB} AABB
	 * @return {Bounds}
	 * @private
	 */
	private getBounds
	/**
	 * insert object into the spatial hash
	 * automatically called from updateObject()
	 * @param {*} object
	 * @param {string} key
	 */
	insert(object: any, key: string): void
	/**
	 * removes object from the hash table
	 * should be called when removing an object
	 * automatically called from updateObject()
	 * @param {object} object
	 */
	removeFromHash(object: object): void
	/**
	 * get all neighbors that share the same hash as object
	 * @param {*} object in the spatial hash
	 * @return {Array} of objects that are in the same hash as object
	 */
	neighbors(object: any): any[]
	/**
	 * returns an array of objects contained within bounding box
	 * @param {AABB} AABB bounding box to search
	 * @param {boolean} [simpleTest=true] perform a simple bounds check of all items in the buckets
	 * @return {object[]} search results
	 */
	query(AABB: AABB, simpleTest?: boolean): object[]
	lastBuckets: number
	/**
	 * iterates through objects contained within bounding box
	 * stops iterating if the callback returns true
	 * @param {AABB} AABB bounding box to search
	 * @param {function} callback
	 * @param {boolean} [simpleTest=true] perform a simple bounds check of all items in the buckets
	 * @return {boolean} true if callback returned early
	 */
	queryCallback(AABB: AABB, callback: Function, simpleTest?: boolean): boolean
	/**
	 * get stats
	 * @return {Stats}
	 */
	stats(): Stats
	/**
	 * helper function to evaluate hash table
	 * @return {number} the number of buckets in the hash table
	 * */
	getNumberOfBuckets(): number
	/**
	 * helper function to evaluate hash table
	 * @return {number} the average number of entries in each bucket
	 */
	getAverageSize(): number
	/**
	 * helper function to evaluate the hash table
	 * @return {number} the largest sized bucket
	 */
	getLargest(): number
	/**
	 * gets quadrant bounds
	 * @return {Bounds}
	 */
	getWorldBounds(): Bounds
	/**
	 * helper function to evalute the hash table
	 * @param {AABB} [AABB] bounding box to search or entire world
	 * @return {number} sparseness percentage (i.e., buckets with at least 1 element divided by total possible buckets)
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
