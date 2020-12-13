export = Simple;
declare class Simple {
    /**
     * creates a simple cull
     * @param {object} [options]
     * @param {boolean} [options.visible=visible] parameter of the object to set (usually visible or renderable)
     * @param {boolean} [options.calculatePIXI=true] calculate pixi.js bounding box automatically; if this is set to false then it uses object[options.AABB] for bounding box
     * @param {string} [options.dirtyTest=true] only update spatial hash for objects with object[options.dirtyTest]=true; this has a HUGE impact on performance
     * @param {string} [options.AABB=AABB] object property that holds bounding box so that object[type] = { x: number, y: number, width: number, height: number }; not needed if options.calculatePIXI=true
     */
    constructor(options?: {
        visible: boolean;
        calculatePIXI: boolean;
        dirtyTest: string;
        AABB: string;
    });
    visible: string | true;
    calculatePIXI: boolean;
    dirtyTest: string | boolean;
    AABB: string;
    lists: any[][];
    /**
     * add an array of objects to be culled
     * @param {Array} array
     * @param {boolean} [staticObject] set to true if the object's position/size does not change
     * @return {Array} array
     */
    addList(array: any[], staticObject?: boolean): any[];
    /**
     * remove an array added by addList()
     * @param {Array} array
     * @return {Array} array
     */
    removeList(array: any[]): any[];
    /**
     * add an object to be culled
     * @param {*} object
     * @param {boolean} [staticObject] set to true if the object's position/size does not change
     * @return {*} object
     */
    add(object: any, staticObject?: boolean): any;
    /**
     * remove an object added by add()
     * @param {*} object
     * @return {*} object
     */
    remove(object: any): any;
    /**
     * cull the items in the list by setting visible parameter
     * @param {object} bounds
     * @param {number} bounds.x
     * @param {number} bounds.y
     * @param {number} bounds.width
     * @param {number} bounds.height
     * @param {boolean} [skipUpdate] skip updating the AABB bounding box of all objects
     */
    cull(bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, skipUpdate?: boolean): void;
    /**
     * update the AABB for all objects
     * automatically called from update() when calculatePIXI=true and skipUpdate=false
     */
    updateObjects(): void;
    /**
     * update the has of an object
     * automatically called from updateObjects()
     * @param {*} object
     */
    updateObject(object: any): void;
    /**
     * returns an array of objects contained within bounding box
     * @param {object} boudns bounding box to search
     * @param {number} bounds.x
     * @param {number} bounds.y
     * @param {number} bounds.width
     * @param {number} bounds.height
     * @return {object[]} search results
     */
    query(bounds: any): object[];
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
    queryCallback(bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, callback: Function): boolean;
    /**
     * get stats (only updated after update() is called)
     * @return {SimpleStats}
     */
    stats(): SimpleStats;
}
declare namespace Simple {
    export { SimpleStats };
}
type SimpleStats = {
    total: number;
    visible: number;
    culled: number;
};
