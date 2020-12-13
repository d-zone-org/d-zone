// pixi-cull.SpatialHash
// Copyright 2018 YOPEY YOPEY LLC
// David Figatner
// MIT License

class Simple
{
    /**
     * creates a simple cull
     * @param {object} [options]
     * @param {boolean} [options.visible=visible] parameter of the object to set (usually visible or renderable)
     * @param {boolean} [options.calculatePIXI=true] calculate pixi.js bounding box automatically; if this is set to false then it uses object[options.AABB] for bounding box
     * @param {string} [options.dirtyTest=true] only update spatial hash for objects with object[options.dirtyTest]=true; this has a HUGE impact on performance
     * @param {string} [options.AABB=AABB] object property that holds bounding box so that object[type] = { x: number, y: number, width: number, height: number }; not needed if options.calculatePIXI=true
     */
    constructor(options)
    {
        options = options || {}
        this.visible = options.visible || 'visible'
        this.calculatePIXI = typeof options.calculatePIXI !== 'undefined' ? options.calculatePIXI : true
        this.dirtyTest = typeof options.dirtyTest !== 'undefined' ? options.dirtyTest : true
        this.AABB = options.AABB || 'AABB'
        this.lists = [[]]
    }

    /**
     * add an array of objects to be culled
     * @param {Array} array
     * @param {boolean} [staticObject] set to true if the object's position/size does not change
     * @return {Array} array
     */
    addList(array, staticObject)
    {
        this.lists.push(array)
        if (staticObject)
        {
            array.staticObject = true
        }
        if (this.calculatePIXI && this.dirtyTest)
        {
            for (let object of array)
            {
                this.updateObject(object)
            }
        }
        return array
    }

    /**
     * remove an array added by addList()
     * @param {Array} array
     * @return {Array} array
     */
    removeList(array)
    {
        this.lists.splice(this.lists.indexOf(array), 1)
        return array
    }

    /**
     * add an object to be culled
     * @param {*} object
     * @param {boolean} [staticObject] set to true if the object's position/size does not change
     * @return {*} object
     */
    add(object, staticObject)
    {
        if (staticObject)
        {
            object.staticObject = true
        }
        if (this.calculatePIXI && (this.dirtyTest || staticObject))
        {
            this.updateObject(object)
        }
        this.lists[0].push(object)
        return object
    }

    /**
     * remove an object added by add()
     * @param {*} object
     * @return {*} object
     */
    remove(object)
    {
        this.lists[0].splice(this.lists[0].indexOf(object), 1)
        return object
    }

    /**
     * cull the items in the list by setting visible parameter
     * @param {object} bounds
     * @param {number} bounds.x
     * @param {number} bounds.y
     * @param {number} bounds.width
     * @param {number} bounds.height
     * @param {boolean} [skipUpdate] skip updating the AABB bounding box of all objects
     */
    cull(bounds, skipUpdate)
    {
        if (this.calculatePIXI && !skipUpdate)
        {
            this.updateObjects()
        }
        for (let list of this.lists)
        {
            for (let object of list)
            {
                const box = object[this.AABB]
                object[this.visible] =
                    box.x + box.width > bounds.x && box.x < bounds.x + bounds.width &&
                    box.y + box.height > bounds.y && box.y < bounds.y + bounds.height
            }
        }
    }

    /**
     * update the AABB for all objects
     * automatically called from update() when calculatePIXI=true and skipUpdate=false
     */
    updateObjects()
    {
        if (this.dirtyTest)
        {
            for (let list of this.lists)
            {
                if (!list.staticObject)
                {
                    for (let object of list)
                    {
                        if (!object.staticObject && object[this.dirty])
                        {
                            this.updateObject(object)
                            object[this.dirty] = false
                        }
                    }
                }
            }
        }
        else
        {
            for (let list of this.lists)
            {
                if (!list.staticObject)
                {
                    for (let object of list)
                    {
                        if (!object.staticObject)
                        {
                            this.updateObject(object)
                        }
                    }
                }
            }
        }
    }

    /**
     * update the has of an object
     * automatically called from updateObjects()
     * @param {*} object
     */
    updateObject(object)
    {
        const box = object.getLocalBounds()
        object[this.AABB] = object[this.AABB] || {}
        object[this.AABB].x = object.x + (box.x - object.pivot.x) * object.scale.x
        object[this.AABB].y = object.y + (box.y - object.pivot.y) * object.scale.y
        object[this.AABB].width = box.width * object.scale.x
        object[this.AABB].height = box.height * object.scale.y
    }

    /**
     * returns an array of objects contained within bounding box
     * @param {object} boudns bounding box to search
     * @param {number} bounds.x
     * @param {number} bounds.y
     * @param {number} bounds.width
     * @param {number} bounds.height
     * @return {object[]} search results
     */
    query(bounds)
    {
        let results = []
        for (let list of this.lists)
        {
            for (let object of list)
            {
                const box = object[this.AABB]
                if (box.x + box.width > bounds.x && box.x - box.width < bounds.x + bounds.width &&
                    box.y + box.height > bounds.y && box.y - box.height < bounds.y + bounds.height)
                {
                    results.push(object)
                }
            }
        }
        return results
    }

    /**
     * iterates through objects contained within bounding box
     * stops iterating if the callback returns true
     * @param {object} bounds bounding box to search
     * @param {number} bounds.x
     * @param {number} bounds.y
     * @param {number} bounds.width
     * @param {number} bounds.height
     * @param {function} callback
     * @return {boolean} true if callback returned early
     */
    queryCallback(bounds, callback)
    {
        for (let list of this.lists)
        {
            for (let object of list)
            {
                const box = object[this.AABB]
                if (box.x + box.width > bounds.x && box.x - box.width < bounds.x + bounds.width &&
                    box.y + box.height > bounds.y && box.y - box.height < bounds.y + bounds.height)
                {
                    if (callback(object))
                    {
                        return true
                    }
                }
            }
        }
        return false
    }

    /**
     * get stats (only updated after update() is called)
     * @return {SimpleStats}
     */
    stats()
    {
        let visible = 0, count = 0
        for (let list of this.lists)
        {
            list.forEach(object =>
            {
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

module.exports = Simple