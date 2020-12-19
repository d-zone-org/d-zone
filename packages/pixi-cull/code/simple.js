// pixi-cull.SpatialHash
// Copyright 2018 YOPEY YOPEY LLC
// David Figatner
// MIT License

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
	constructor(options) {
		options = options || {}
		this.visible = options.visible || 'visible'
		this.calculatePIXI =
			typeof options.calculatePIXI !== 'undefined'
				? options.calculatePIXI
				: true
		this.dirtyTest =
			typeof options.dirtyTest !== 'undefined' ? options.dirtyTest : true
		this.AABB = options.AABB || 'AABB'
		this.lists = [[]]
	}

	/**
	 * Add an array of objects to be culled
	 *
	 * @param {Array} array
	 * @param {boolean} [staticObject] Set to true if the object's position/size
	 *     does not change
	 * @returns {Array} Array
	 */
	addList(array, staticObject) {
		this.lists.push(array)
		if (staticObject) {
			array.staticObject = true
		}
		if (this.calculatePIXI && this.dirtyTest) {
			for (let object of array) {
				this.updateObject(object)
			}
		}
		return array
	}

	/**
	 * Remove an array added by addList()
	 *
	 * @param {Array} array
	 * @returns {Array} Array
	 */
	removeList(array) {
		this.lists.splice(this.lists.indexOf(array), 1)
		return array
	}

	/**
	 * Add an object to be culled
	 *
	 * @param {any} object
	 * @param {boolean} [staticObject] Set to true if the object's position/size
	 *     does not change
	 * @returns {any} Object
	 */
	add(object, staticObject) {
		if (staticObject) {
			object.staticObject = true
		}
		if (this.calculatePIXI && (this.dirtyTest || staticObject)) {
			this.updateObject(object)
		}
		this.lists[0].push(object)
		return object
	}

	/**
	 * Remove an object added by add()
	 *
	 * @param {any} object
	 * @returns {any} Object
	 */
	remove(object) {
		this.lists[0].splice(this.lists[0].indexOf(object), 1)
		return object
	}

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
	cull(bounds, skipUpdate) {
		if (this.calculatePIXI && !skipUpdate) {
			this.updateObjects()
		}
		for (let list of this.lists) {
			for (let object of list) {
				const box = object[this.AABB]
				object[this.visible] =
					box.x + box.width > bounds.x &&
					box.x < bounds.x + bounds.width &&
					box.y + box.height > bounds.y &&
					box.y < bounds.y + bounds.height
			}
		}
	}

	/**
	 * Update the AABB for all objects automatically called from update() when
	 * calculatePIXI=true and skipUpdate=false
	 */
	updateObjects() {
		if (this.dirtyTest) {
			for (let list of this.lists) {
				if (!list.staticObject) {
					for (let object of list) {
						if (!object.staticObject && object[this.dirty]) {
							this.updateObject(object)
							object[this.dirty] = false
						}
					}
				}
			}
		} else {
			for (let list of this.lists) {
				if (!list.staticObject) {
					for (let object of list) {
						if (!object.staticObject) {
							this.updateObject(object)
						}
					}
				}
			}
		}
	}

	/**
	 * Update the has of an object automatically called from updateObjects()
	 *
	 * @param {any} object
	 */
	updateObject(object) {
		const box = object.getLocalBounds()
		object[this.AABB] = object[this.AABB] || {}
		object[this.AABB].x = object.x + (box.x - object.pivot.x) * object.scale.x
		object[this.AABB].y = object.y + (box.y - object.pivot.y) * object.scale.y
		object[this.AABB].width = box.width * object.scale.x
		object[this.AABB].height = box.height * object.scale.y
	}

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
	query(bounds) {
		let results = []
		for (let list of this.lists) {
			for (let object of list) {
				const box = object[this.AABB]
				if (
					box.x + box.width > bounds.x &&
					box.x - box.width < bounds.x + bounds.width &&
					box.y + box.height > bounds.y &&
					box.y - box.height < bounds.y + bounds.height
				) {
					results.push(object)
				}
			}
		}
		return results
	}

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
	queryCallback(bounds, callback) {
		for (let list of this.lists) {
			for (let object of list) {
				const box = object[this.AABB]
				if (
					box.x + box.width > bounds.x &&
					box.x - box.width < bounds.x + bounds.width &&
					box.y + box.height > bounds.y &&
					box.y - box.height < bounds.y + bounds.height
				) {
					if (callback(object)) {
						return true
					}
				}
			}
		}
		return false
	}

	/**
	 * Get stats (only updated after update() is called)
	 *
	 * @returns {SimpleStats}
	 */
	stats() {
		let visible = 0,
			count = 0
		for (let list of this.lists) {
			list.forEach((object) => {
				visible += object.visible ? 1 : 0
				count++
			})
		}
		return { total: count, visible, culled: count - visible }
	}
}

/**
 * @typedef {object} SimpleStats
 * @property {number} total
 * @property {number} visible
 * @property {number} culled
 */
