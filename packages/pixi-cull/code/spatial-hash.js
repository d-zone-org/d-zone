// Copyright 2018 YOPEY YOPEY LLC
// David Figatner
// MIT License

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
	constructor(options) {
		options = options || {}
		this.xSize = options.xSize || options.size || 1000
		this.ySize = options.ySize || options.size || 1000
		this.AABB = options.type || 'AABB'
		this.spatial = options.spatial || 'spatial'
		this.calculatePIXI =
			typeof options.calculatePIXI !== 'undefined'
				? options.calculatePIXI
				: true
		this.visibleText =
			typeof options.visibleTest !== 'undefined' ? options.visibleTest : true
		this.simpleTest =
			typeof options.simpleTest !== 'undefined' ? options.simpleTest : true
		this.dirtyTest =
			typeof options.dirtyTest !== 'undefined' ? options.dirtyTest : true
		this.visible = options.visible || 'visible'
		this.dirty = options.dirty || 'dirty'
		this.width = this.height = 0
		this.hash = {}
		this.objects = []
		this.containers = []
	}

	/**
	 * Add an object to be culled side effect: adds object.spatialHashes to track
	 * existing hashes
	 *
	 * @param {any} object
	 * @param {boolean} [staticObject] Set to true if the object's position/size
	 *     does not change
	 * @returns {any} Object
	 */
	add(object, staticObject) {
		object[this.spatial] = { hashes: [] }
		if (this.calculatePIXI && this.dirtyTest) {
			object[this.dirty] = true
		}
		if (staticObject) {
			object.staticObject = true
		}
		this.updateObject(object)
		this.containers[0].push(object)
	}

	/**
	 * Remove an object added by add()
	 *
	 * @param {any} object
	 * @returns {any} Object
	 */
	remove(object) {
		this.containers[0].splice(this.list[0].indexOf(object), 1)
		this.removeFromHash(object)
		return object
	}

	/**
	 * Add an array of objects to be culled
	 *
	 * @param {PIXI.Container} container
	 * @param {boolean} [staticObject] Set to true if the objects in the
	 *     container's position/size do not change note: this only works with pixi
	 *     v5.0.0rc2+ because it relies on the new container events childAdded and
	 *     childRemoved
	 */
	addContainer(container, staticObject) {
		const added = function (object) {
			object[this.spatial] = { hashes: [] }
			this.updateObject(object)
		}.bind(this)

		const removed = function (object) {
			this.removeFromHash(object)
		}.bind(this)

		for (let object of container.children) {
			object[this.spatial] = { hashes: [] }
			this.updateObject(object)
		}
		container.cull = {}
		this.containers.push(container)
		container.on('childAdded', added)
		container.on('childRemoved', removed)
		container.cull.added = added
		container.cull.removed = removed
		if (staticObject) {
			container.cull.static = true
		}
	}

	/**
	 * Remove an array added by addContainer()
	 *
	 * @param {PIXI.Container} container
	 * @returns {PIXI.Container} Container
	 */
	removeContainer(container) {
		this.containers.splice(this.containers.indexOf(container), 1)
		container.children.forEach((object) => this.removeFromHash(object))
		container.off('added', container.cull.added)
		container.off('removed', container.cull.removed)
		delete container.cull
		return container
	}

	/**
	 * Update the hashes and cull the items in the list
	 *
	 * @param {AABB} AABB
	 * @param {boolean} [skipUpdate] Skip updating the hashes of all objects
	 * @returns {number} Number of buckets in results
	 */
	cull(AABB, skipUpdate) {
		if (!skipUpdate) {
			this.updateObjects()
		}
		this.invisible()
		const objects = this.query(AABB, this.simpleTest)
		objects.forEach((object) => (object[this.visible] = true))
		return this.lastBuckets
	}

	/** Set all objects in hash to visible=false */
	invisible() {
		for (let container of this.containers) {
			container.children.forEach((object) => (object[this.visible] = false))
		}
	}

	/**
	 * Update the hashes for all objects automatically called from update() when
	 * skipUpdate=false
	 */
	updateObjects() {
		if (this.dirtyTest) {
			for (let object of this.objects) {
				if (object[this.dirty]) {
					this.updateObject(object)
					object[this.dirty] = false
				}
			}
			for (let container of this.containers) {
				for (let object of container.children) {
					if (object[this.dirty]) {
						this.updateObject(object)
						object[this.dirty] = false
					}
				}
			}
		} else {
			for (let container of this.containers) {
				if (!container.cull.static) {
					container.children.forEach((object) => this.updateObject(object))
				}
			}
		}
	}

	/**
	 * Update the has of an object automatically called from updateObjects()
	 *
	 * @param {any} object
	 * @param {boolean} [force] Force update for calculatePIXI
	 */
	updateObject(object) {
		let AABB
		if (this.calculatePIXI) {
			const box = object.getLocalBounds()
			AABB = object[this.AABB] = {
				x: object.x + (box.x - object.pivot.x) * object.scale.x,
				y: object.y + (box.y - object.pivot.y) * object.scale.y,
				width: box.width * object.scale.x,
				height: box.height * object.scale.y,
			}
		} else {
			AABB = object[this.AABB]
		}

		let spatial = object[this.spatial]
		if (!spatial) {
			spatial = object[this.spatial] = { hashes: [] }
		}
		const { xStart, yStart, xEnd, yEnd } = this.getBounds(AABB)

		// only remove and insert if mapping has changed
		if (
			spatial.xStart !== xStart ||
			spatial.yStart !== yStart ||
			spatial.xEnd !== xEnd ||
			spatial.yEnd !== yEnd
		) {
			if (spatial.hashes.length) {
				this.removeFromHash(object)
			}
			for (let y = yStart; y <= yEnd; y++) {
				for (let x = xStart; x <= xEnd; x++) {
					const key = x + ',' + y
					this.insert(object, key)
					spatial.hashes.push(key)
				}
			}
			spatial.xStart = xStart
			spatial.yStart = yStart
			spatial.xEnd = xEnd
			spatial.yEnd = yEnd
		}
	}

	/**
	 * Returns an array of buckets with >= minimum of objects in each bucket
	 *
	 * @param {number} [minimum] Default is `1`
	 * @returns {array} Array of buckets
	 */
	getBuckets(minimum = 1) {
		const hashes = []
		for (let key in this.hash) {
			const hash = this.hash[key]
			if (hash.length >= minimum) {
				hashes.push(hash)
			}
		}
		return hashes
	}

	/**
	 * Gets hash bounds
	 *
	 * @private
	 *
	 * @param {AABB} AABB
	 * @returns {Bounds}
	 */
	getBounds(AABB) {
		let xStart = Math.floor(AABB.x / this.xSize)
		let yStart = Math.floor(AABB.y / this.ySize)
		let xEnd = Math.floor((AABB.x + AABB.width) / this.xSize)
		let yEnd = Math.floor((AABB.y + AABB.height) / this.ySize)
		return { xStart, yStart, xEnd, yEnd }
	}

	/**
	 * Insert object into the spatial hash automatically called from updateObject()
	 *
	 * @param {any} object
	 * @param {string} key
	 */
	insert(object, key) {
		if (!this.hash[key]) {
			this.hash[key] = [object]
		} else {
			this.hash[key].push(object)
		}
	}

	/**
	 * Removes object from the hash table should be called when removing an object
	 * automatically called from updateObject()
	 *
	 * @param {object} object
	 */
	removeFromHash(object) {
		const spatial = object[this.spatial]
		while (spatial.hashes.length) {
			const key = spatial.hashes.pop()
			const list = this.hash[key]
			list.splice(list.indexOf(object), 1)
		}
	}

	/**
	 * Get all neighbors that share the same hash as object
	 *
	 * @param {any} object In the spatial hash
	 * @returns {Array} Of objects that are in the same hash as object
	 */
	neighbors(object) {
		let results = []
		object[this.spatial].hashes.forEach(
			(key) => (results = results.concat(this.hash[key]))
		)
		return results
	}

	/**
	 * Returns an array of objects contained within bounding box
	 *
	 * @param {AABB} AABB Bounding box to search
	 * @param {boolean} [simpleTest] Perform a simple bounds check of all items in
	 *     the buckets Default is `true`
	 * @returns {object[]} Search results
	 */
	query(AABB, simpleTest) {
		simpleTest = typeof simpleTest !== 'undefined' ? simpleTest : true
		let buckets = 0
		let results = []
		const { xStart, yStart, xEnd, yEnd } = this.getBounds(AABB)
		for (let y = yStart; y <= yEnd; y++) {
			for (let x = xStart; x <= xEnd; x++) {
				const entry = this.hash[x + ',' + y]
				if (entry) {
					if (simpleTest) {
						for (let object of entry) {
							const box = object[this.AABB]
							if (
								box.x + box.width > AABB.x &&
								box.x < AABB.x + AABB.width &&
								box.y + box.height > AABB.y &&
								box.y < AABB.y + AABB.height
							) {
								results.push(object)
							}
						}
					} else {
						results = results.concat(entry)
					}
					buckets++
				}
			}
		}
		this.lastBuckets = buckets
		return results
	}

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
	queryCallback(AABB, callback, simpleTest) {
		simpleTest = typeof simpleTest !== 'undefined' ? simpleTest : true
		const { xStart, yStart, xEnd, yEnd } = this.getBounds(AABB)
		for (let y = yStart; y <= yEnd; y++) {
			for (let x = xStart; x <= xEnd; x++) {
				const entry = this.hash[x + ',' + y]
				if (entry) {
					for (let i = 0; i < entry.length; i++) {
						const object = entry[i]
						if (simpleTest) {
							const AABB = object.AABB
							if (
								AABB.x + AABB.width > AABB.x &&
								AABB.x < AABB.x + AABB.width &&
								AABB.y + AABB.height > AABB.y &&
								AABB.y < AABB.y + AABB.height
							) {
								if (callback(object)) {
									return true
								}
							}
						} else {
							if (callback(object)) {
								return true
							}
						}
					}
				}
			}
		}
		return false
	}

	/**
	 * Get stats
	 *
	 * @returns {Stats}
	 */
	stats() {
		let visible = 0,
			count = 0
		for (let list of this.containers) {
			for (let i = 0; i < list.children.length; i++) {
				const object = list.children[i]
				visible += object.visible ? 1 : 0
				count++
			}
		}
		return {
			total: count,
			visible,
			culled: count - visible,
		}
	}

	/**
	 * Helper function to evaluate hash table
	 *
	 * @returns {number} The number of buckets in the hash table
	 */
	getNumberOfBuckets() {
		return Object.keys(this.hash).length
	}

	/**
	 * Helper function to evaluate hash table
	 *
	 * @returns {number} The average number of entries in each bucket
	 */
	getAverageSize() {
		let total = 0
		for (let key in this.hash) {
			total += this.hash[key].length
		}
		return total / this.getBuckets().length
	}

	/**
	 * Helper function to evaluate the hash table
	 *
	 * @returns {number} The largest sized bucket
	 */
	getLargest() {
		let largest = 0
		for (let key in this.hash) {
			if (this.hash[key].length > largest) {
				largest = this.hash[key].length
			}
		}
		return largest
	}

	/**
	 * Gets quadrant bounds
	 *
	 * @returns {Bounds}
	 */
	getWorldBounds() {
		let xStart = Infinity,
			yStart = Infinity,
			xEnd = 0,
			yEnd = 0
		for (let key in this.hash) {
			const split = key.split(',')
			let x = parseInt(split[0])
			let y = parseInt(split[1])
			xStart = x < xStart ? x : xStart
			yStart = y < yStart ? y : yStart
			xEnd = x > xEnd ? x : xEnd
			yEnd = y > yEnd ? y : yEnd
		}
		return { xStart, yStart, xEnd, yEnd }
	}

	/**
	 * Helper function to evalute the hash table
	 *
	 * @param {AABB} [AABB] Bounding box to search or entire world
	 * @returns {number} Sparseness percentage (i.e., buckets with at least 1
	 *     element divided by total possible buckets)
	 */
	getSparseness(AABB) {
		let count = 0,
			total = 0
		const { xStart, yStart, xEnd, yEnd } = AABB
			? this.getBounds(AABB)
			: this.getWorldBounds()
		for (let y = yStart; y < yEnd; y++) {
			for (let x = xStart; x < xEnd; x++) {
				count += this.hash[x + ',' + y] ? 1 : 0
				total++
			}
		}
		return count / total
	}
}

/**
 * @typedef {object} Stats
 * @property {number} total
 * @property {number} visible
 * @property {number} culled
 */

/**
 * @typedef {object} Bounds
 * @property {number} xStart
 * @property {number} yStart
 * @property {number} xEnd
 * @property {number} xEnd
 */

/**
 * @typedef {object} AABB
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */
