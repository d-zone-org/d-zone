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
