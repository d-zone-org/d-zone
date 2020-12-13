'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copyright 2018 YOPEY YOPEY LLC
// David Figatner
// MIT License

var SpatialHash = function () {
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
    function SpatialHash(options) {
        _classCallCheck(this, SpatialHash);

        options = options || {};
        this.xSize = options.xSize || options.size || 1000;
        this.ySize = options.ySize || options.size || 1000;
        this.AABB = options.type || 'AABB';
        this.spatial = options.spatial || 'spatial';
        this.calculatePIXI = typeof options.calculatePIXI !== 'undefined' ? options.calculatePIXI : true;
        this.visibleText = typeof options.visibleTest !== 'undefined' ? options.visibleTest : true;
        this.simpleTest = typeof options.simpleTest !== 'undefined' ? options.simpleTest : true;
        this.dirtyTest = typeof options.dirtyTest !== 'undefined' ? options.dirtyTest : true;
        this.visible = options.visible || 'visible';
        this.dirty = options.dirty || 'dirty';
        this.width = this.height = 0;
        this.hash = {};
        this.objects = [];
        this.containers = [];
    }

    /**
     * add an object to be culled
     * side effect: adds object.spatialHashes to track existing hashes
     * @param {*} object
     * @param {boolean} [staticObject] set to true if the object's position/size does not change
     * @return {*} object
     */


    _createClass(SpatialHash, [{
        key: 'add',
        value: function add(object, staticObject) {
            object[this.spatial] = { hashes: [] };
            if (this.calculatePIXI && this.dirtyTest) {
                object[this.dirty] = true;
            }
            if (staticObject) {
                object.staticObject = true;
            }
            this.updateObject(object);
            this.containers[0].push(object);
        }

        /**
         * remove an object added by add()
         * @param {*} object
         * @return {*} object
         */

    }, {
        key: 'remove',
        value: function remove(object) {
            this.containers[0].splice(this.list[0].indexOf(object), 1);
            this.removeFromHash(object);
            return object;
        }

        /**
         * add an array of objects to be culled
         * @param {PIXI.Container} container
         * @param {boolean} [staticObject] set to true if the objects in the container's position/size do not change
         * note: this only works with pixi v5.0.0rc2+ because it relies on the new container events childAdded and childRemoved
         */

    }, {
        key: 'addContainer',
        value: function addContainer(container, staticObject) {
            var added = function (object) {
                object[this.spatial] = { hashes: [] };
                this.updateObject(object);
            }.bind(this);

            var removed = function (object) {
                this.removeFromHash(object);
            }.bind(this);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = container.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var object = _step.value;

                    object[this.spatial] = { hashes: [] };
                    this.updateObject(object);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            container.cull = {};
            this.containers.push(container);
            container.on('childAdded', added);
            container.on('childRemoved', removed);
            container.cull.added = added;
            container.cull.removed = removed;
            if (staticObject) {
                container.cull.static = true;
            }
        }

        /**
         * remove an array added by addContainer()
         * @param {PIXI.Container} container
         * @return {PIXI.Container} container
         */

    }, {
        key: 'removeContainer',
        value: function removeContainer(container) {
            var _this = this;

            this.containers.splice(this.containers.indexOf(container), 1);
            container.children.forEach(function (object) {
                return _this.removeFromHash(object);
            });
            container.off('added', container.cull.added);
            container.off('removed', container.cull.removed);
            delete container.cull;
            return container;
        }

        /**
         * update the hashes and cull the items in the list
         * @param {AABB} AABB
         * @param {boolean} [skipUpdate] skip updating the hashes of all objects
         * @return {number} number of buckets in results
         */

    }, {
        key: 'cull',
        value: function cull(AABB, skipUpdate) {
            var _this2 = this;

            if (!skipUpdate) {
                this.updateObjects();
            }
            this.invisible();
            var objects = this.query(AABB, this.simpleTest);
            objects.forEach(function (object) {
                return object[_this2.visible] = true;
            });
            return this.lastBuckets;
        }

        /**
         * set all objects in hash to visible=false
         */

    }, {
        key: 'invisible',
        value: function invisible() {
            var _this3 = this;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.containers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var container = _step2.value;

                    container.children.forEach(function (object) {
                        return object[_this3.visible] = false;
                    });
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /**
         * update the hashes for all objects
         * automatically called from update() when skipUpdate=false
         */

    }, {
        key: 'updateObjects',
        value: function updateObjects() {
            var _this4 = this;

            if (this.dirtyTest) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var object = _step3.value;

                        if (object[this.dirty]) {
                            this.updateObject(object);
                            object[this.dirty] = false;
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this.containers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var container = _step4.value;
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = container.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _object = _step5.value;

                                if (_object[this.dirty]) {
                                    this.updateObject(_object);
                                    _object[this.dirty] = false;
                                }
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            } else {
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this.containers[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _container = _step6.value;

                        if (!_container.cull.static) {
                            _container.children.forEach(function (object) {
                                return _this4.updateObject(object);
                            });
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            }
        }

        /**
         * update the has of an object
         * automatically called from updateObjects()
         * @param {*} object
         * @param {boolean} [force] force update for calculatePIXI
         */

    }, {
        key: 'updateObject',
        value: function updateObject(object) {
            var AABB = void 0;
            if (this.calculatePIXI) {
                var box = object.getLocalBounds();
                AABB = object[this.AABB] = {
                    x: object.x + (box.x - object.pivot.x) * object.scale.x,
                    y: object.y + (box.y - object.pivot.y) * object.scale.y,
                    width: box.width * object.scale.x,
                    height: box.height * object.scale.y
                };
            } else {
                AABB = object[this.AABB];
            }

            var spatial = object[this.spatial];
            if (!spatial) {
                spatial = object[this.spatial] = { hashes: [] };
            }

            var _getBounds = this.getBounds(AABB),
                xStart = _getBounds.xStart,
                yStart = _getBounds.yStart,
                xEnd = _getBounds.xEnd,
                yEnd = _getBounds.yEnd;

            // only remove and insert if mapping has changed


            if (spatial.xStart !== xStart || spatial.yStart !== yStart || spatial.xEnd !== xEnd || spatial.yEnd !== yEnd) {
                if (spatial.hashes.length) {
                    this.removeFromHash(object);
                }
                for (var y = yStart; y <= yEnd; y++) {
                    for (var x = xStart; x <= xEnd; x++) {
                        var key = x + ',' + y;
                        this.insert(object, key);
                        spatial.hashes.push(key);
                    }
                }
                spatial.xStart = xStart;
                spatial.yStart = yStart;
                spatial.xEnd = xEnd;
                spatial.yEnd = yEnd;
            }
        }

        /**
         * returns an array of buckets with >= minimum of objects in each bucket
         * @param {number} [minimum=1]
         * @return {array} array of buckets
         */

    }, {
        key: 'getBuckets',
        value: function getBuckets() {
            var minimum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            var hashes = [];
            for (var key in this.hash) {
                var hash = this.hash[key];
                if (hash.length >= minimum) {
                    hashes.push(hash);
                }
            }
            return hashes;
        }

        /**
         * gets hash bounds
         * @param {AABB} AABB
         * @return {Bounds}
         * @private
         */

    }, {
        key: 'getBounds',
        value: function getBounds(AABB) {
            var xStart = Math.floor(AABB.x / this.xSize);
            var yStart = Math.floor(AABB.y / this.ySize);
            var xEnd = Math.floor((AABB.x + AABB.width) / this.xSize);
            var yEnd = Math.floor((AABB.y + AABB.height) / this.ySize);
            return { xStart: xStart, yStart: yStart, xEnd: xEnd, yEnd: yEnd };
        }

        /**
         * insert object into the spatial hash
         * automatically called from updateObject()
         * @param {*} object
         * @param {string} key
         */

    }, {
        key: 'insert',
        value: function insert(object, key) {
            if (!this.hash[key]) {
                this.hash[key] = [object];
            } else {
                this.hash[key].push(object);
            }
        }

        /**
         * removes object from the hash table
         * should be called when removing an object
         * automatically called from updateObject()
         * @param {object} object
         */

    }, {
        key: 'removeFromHash',
        value: function removeFromHash(object) {
            var spatial = object[this.spatial];
            while (spatial.hashes.length) {
                var key = spatial.hashes.pop();
                var list = this.hash[key];
                list.splice(list.indexOf(object), 1);
            }
        }

        /**
         * get all neighbors that share the same hash as object
         * @param {*} object in the spatial hash
         * @return {Array} of objects that are in the same hash as object
         */

    }, {
        key: 'neighbors',
        value: function neighbors(object) {
            var _this5 = this;

            var results = [];
            object[this.spatial].hashes.forEach(function (key) {
                return results = results.concat(_this5.hash[key]);
            });
            return results;
        }

        /**
         * returns an array of objects contained within bounding box
         * @param {AABB} AABB bounding box to search
         * @param {boolean} [simpleTest=true] perform a simple bounds check of all items in the buckets
         * @return {object[]} search results
         */

    }, {
        key: 'query',
        value: function query(AABB, simpleTest) {
            simpleTest = typeof simpleTest !== 'undefined' ? simpleTest : true;
            var buckets = 0;
            var results = [];

            var _getBounds2 = this.getBounds(AABB),
                xStart = _getBounds2.xStart,
                yStart = _getBounds2.yStart,
                xEnd = _getBounds2.xEnd,
                yEnd = _getBounds2.yEnd;

            for (var y = yStart; y <= yEnd; y++) {
                for (var x = xStart; x <= xEnd; x++) {
                    var entry = this.hash[x + ',' + y];
                    if (entry) {
                        if (simpleTest) {
                            var _iteratorNormalCompletion7 = true;
                            var _didIteratorError7 = false;
                            var _iteratorError7 = undefined;

                            try {
                                for (var _iterator7 = entry[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                    var object = _step7.value;

                                    var box = object[this.AABB];
                                    if (box.x + box.width > AABB.x && box.x < AABB.x + AABB.width && box.y + box.height > AABB.y && box.y < AABB.y + AABB.height) {
                                        results.push(object);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError7 = true;
                                _iteratorError7 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                        _iterator7.return();
                                    }
                                } finally {
                                    if (_didIteratorError7) {
                                        throw _iteratorError7;
                                    }
                                }
                            }
                        } else {
                            results = results.concat(entry);
                        }
                        buckets++;
                    }
                }
            }
            this.lastBuckets = buckets;
            return results;
        }

        /**
         * iterates through objects contained within bounding box
         * stops iterating if the callback returns true
         * @param {AABB} AABB bounding box to search
         * @param {function} callback
         * @param {boolean} [simpleTest=true] perform a simple bounds check of all items in the buckets
         * @return {boolean} true if callback returned early
         */

    }, {
        key: 'queryCallback',
        value: function queryCallback(AABB, callback, simpleTest) {
            simpleTest = typeof simpleTest !== 'undefined' ? simpleTest : true;

            var _getBounds3 = this.getBounds(AABB),
                xStart = _getBounds3.xStart,
                yStart = _getBounds3.yStart,
                xEnd = _getBounds3.xEnd,
                yEnd = _getBounds3.yEnd;

            for (var y = yStart; y <= yEnd; y++) {
                for (var x = xStart; x <= xEnd; x++) {
                    var entry = this.hash[x + ',' + y];
                    if (entry) {
                        for (var i = 0; i < entry.length; i++) {
                            var object = entry[i];
                            if (simpleTest) {
                                var _AABB = object.AABB;
                                if (_AABB.x + _AABB.width > _AABB.x && _AABB.x < _AABB.x + _AABB.width && _AABB.y + _AABB.height > _AABB.y && _AABB.y < _AABB.y + _AABB.height) {
                                    if (callback(object)) {
                                        return true;
                                    }
                                }
                            } else {
                                if (callback(object)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }

        /**
         * get stats
         * @return {Stats}
         */

    }, {
        key: 'stats',
        value: function stats() {
            var visible = 0,
                count = 0;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.containers[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var list = _step8.value;

                    for (var i = 0; i < list.children.length; i++) {
                        var object = list.children[i];
                        visible += object.visible ? 1 : 0;
                        count++;
                    }
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            return {
                total: count,
                visible: visible,
                culled: count - visible
            };
        }

        /**
         * helper function to evaluate hash table
         * @return {number} the number of buckets in the hash table
         * */

    }, {
        key: 'getNumberOfBuckets',
        value: function getNumberOfBuckets() {
            return Object.keys(this.hash).length;
        }

        /**
         * helper function to evaluate hash table
         * @return {number} the average number of entries in each bucket
         */

    }, {
        key: 'getAverageSize',
        value: function getAverageSize() {
            var total = 0;
            for (var key in this.hash) {
                total += this.hash[key].length;
            }
            return total / this.getBuckets().length;
        }

        /**
         * helper function to evaluate the hash table
         * @return {number} the largest sized bucket
         */

    }, {
        key: 'getLargest',
        value: function getLargest() {
            var largest = 0;
            for (var key in this.hash) {
                if (this.hash[key].length > largest) {
                    largest = this.hash[key].length;
                }
            }
            return largest;
        }

        /**
         * gets quadrant bounds
         * @return {Bounds}
         */

    }, {
        key: 'getWorldBounds',
        value: function getWorldBounds() {
            var xStart = Infinity,
                yStart = Infinity,
                xEnd = 0,
                yEnd = 0;
            for (var key in this.hash) {
                var split = key.split(',');
                var x = parseInt(split[0]);
                var y = parseInt(split[1]);
                xStart = x < xStart ? x : xStart;
                yStart = y < yStart ? y : yStart;
                xEnd = x > xEnd ? x : xEnd;
                yEnd = y > yEnd ? y : yEnd;
            }
            return { xStart: xStart, yStart: yStart, xEnd: xEnd, yEnd: yEnd };
        }

        /**
         * helper function to evalute the hash table
         * @param {AABB} [AABB] bounding box to search or entire world
         * @return {number} sparseness percentage (i.e., buckets with at least 1 element divided by total possible buckets)
         */

    }, {
        key: 'getSparseness',
        value: function getSparseness(AABB) {
            var count = 0,
                total = 0;

            var _ref = AABB ? this.getBounds(AABB) : this.getWorldBounds(),
                xStart = _ref.xStart,
                yStart = _ref.yStart,
                xEnd = _ref.xEnd,
                yEnd = _ref.yEnd;

            for (var y = yStart; y < yEnd; y++) {
                for (var x = xStart; x < xEnd; x++) {
                    count += this.hash[x + ',' + y] ? 1 : 0;
                    total++;
                }
            }
            return count / total;
        }
    }]);

    return SpatialHash;
}();

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

module.exports = SpatialHash;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NvZGUvc3BhdGlhbC1oYXNoLmpzIl0sIm5hbWVzIjpbIlNwYXRpYWxIYXNoIiwib3B0aW9ucyIsInhTaXplIiwic2l6ZSIsInlTaXplIiwiQUFCQiIsInR5cGUiLCJzcGF0aWFsIiwiY2FsY3VsYXRlUElYSSIsInZpc2libGVUZXh0IiwidmlzaWJsZVRlc3QiLCJzaW1wbGVUZXN0IiwiZGlydHlUZXN0IiwidmlzaWJsZSIsImRpcnR5Iiwid2lkdGgiLCJoZWlnaHQiLCJoYXNoIiwib2JqZWN0cyIsImNvbnRhaW5lcnMiLCJvYmplY3QiLCJzdGF0aWNPYmplY3QiLCJoYXNoZXMiLCJ1cGRhdGVPYmplY3QiLCJwdXNoIiwic3BsaWNlIiwibGlzdCIsImluZGV4T2YiLCJyZW1vdmVGcm9tSGFzaCIsImNvbnRhaW5lciIsImFkZGVkIiwiYmluZCIsInJlbW92ZWQiLCJjaGlsZHJlbiIsImN1bGwiLCJvbiIsInN0YXRpYyIsImZvckVhY2giLCJvZmYiLCJza2lwVXBkYXRlIiwidXBkYXRlT2JqZWN0cyIsImludmlzaWJsZSIsInF1ZXJ5IiwibGFzdEJ1Y2tldHMiLCJib3giLCJnZXRMb2NhbEJvdW5kcyIsIngiLCJwaXZvdCIsInNjYWxlIiwieSIsImdldEJvdW5kcyIsInhTdGFydCIsInlTdGFydCIsInhFbmQiLCJ5RW5kIiwibGVuZ3RoIiwia2V5IiwiaW5zZXJ0IiwibWluaW11bSIsIk1hdGgiLCJmbG9vciIsInBvcCIsInJlc3VsdHMiLCJjb25jYXQiLCJidWNrZXRzIiwiZW50cnkiLCJjYWxsYmFjayIsImkiLCJjb3VudCIsInRvdGFsIiwiY3VsbGVkIiwiT2JqZWN0Iiwia2V5cyIsImdldEJ1Y2tldHMiLCJsYXJnZXN0IiwiSW5maW5pdHkiLCJzcGxpdCIsInBhcnNlSW50IiwiZ2V0V29ybGRCb3VuZHMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0lBRU1BLFc7QUFFRjs7Ozs7Ozs7Ozs7Ozs7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SStELFFBQVEsQ0FBWjtBQUFBLGdCQUFlQyxRQUFRLENBQXZCOztBQURKLHVCQUUyQ2hFLE9BQU8sS0FBSzZDLFNBQUwsQ0FBZTdDLElBQWYsQ0FBUCxHQUE4QixLQUFLeUUsY0FBTCxFQUZ6RTtBQUFBLGdCQUVZM0IsTUFGWixRQUVZQSxNQUZaO0FBQUEsZ0JBRW9CQyxNQUZwQixRQUVvQkEsTUFGcEI7QUFBQSxnQkFFNEJDLElBRjVCLFFBRTRCQSxJQUY1QjtBQUFBLGdCQUVrQ0MsSUFGbEMsUUFFa0NBLElBRmxDOztBQUdJLGlCQUFLLElBQUlMLElBQUlHLE1BQWIsRUFBcUJILElBQUlLLElBQXpCLEVBQStCTCxHQUEvQixFQUNBO0FBQ0kscUJBQUssSUFBSUgsSUFBSUssTUFBYixFQUFxQkwsSUFBSU8sSUFBekIsRUFBK0JQLEdBQS9CLEVBQ0E7QUFDSXNCLDZCQUFVLEtBQUtuRCxJQUFMLENBQVU2QixJQUFJLEdBQUosR0FBVUcsQ0FBcEIsSUFBeUIsQ0FBekIsR0FBNkIsQ0FBdkM7QUFDQW9CO0FBQ0g7QUFDSjtBQUNELG1CQUFPRCxRQUFRQyxLQUFmO0FBQ0g7Ozs7OztBQUdMOzs7Ozs7O0FBT0E7Ozs7Ozs7O0FBUUE7Ozs7Ozs7O0FBUUFVLE9BQU9DLE9BQVAsR0FBaUJoRixXQUFqQiIsImZpbGUiOiJzcGF0aWFsLWhhc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOCBZT1BFWSBZT1BFWSBMTENcbi8vIERhdmlkIEZpZ2F0bmVyXG4vLyBNSVQgTGljZW5zZVxuXG5jbGFzcyBTcGF0aWFsSGFzaFxue1xuICAgIC8qKlxuICAgICAqIGNyZWF0ZXMgYSBzcGF0aWFsLWhhc2ggY3VsbFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuc2l6ZT0xMDAwXSBjZWxsIHNpemUgdXNlZCB0byBjcmVhdGUgaGFzaCAoeFNpemUgPSB5U2l6ZSlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMueFNpemVdIGhvcml6b250YWwgY2VsbCBzaXplXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLnlTaXplXSB2ZXJ0aWNhbCBjZWxsIHNpemVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmNhbGN1bGF0ZVBJWEk9dHJ1ZV0gY2FsY3VsYXRlIGJvdW5kaW5nIGJveCBhdXRvbWF0aWNhbGx5OyBpZiB0aGlzIGlzIHNldCB0byBmYWxzZSB0aGVuIGl0IHVzZXMgb2JqZWN0W29wdGlvbnMuQUFCQl0gZm9yIGJvdW5kaW5nIGJveFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudmlzaWJsZT12aXNpYmxlXSBwYXJhbWV0ZXIgb2YgdGhlIG9iamVjdCB0byBzZXQgKHVzdWFsbHkgdmlzaWJsZSBvciByZW5kZXJhYmxlKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuc2ltcGxlVGVzdD10cnVlXSBpdGVyYXRlIHRocm91Z2ggdmlzaWJsZSBidWNrZXRzIHRvIGNoZWNrIGZvciBib3VuZHNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGlydHlUZXN0PXRydWVdIG9ubHkgdXBkYXRlIHNwYXRpYWwgaGFzaCBmb3Igb2JqZWN0cyB3aXRoIG9iamVjdFtvcHRpb25zLmRpcnR5VGVzdF09dHJ1ZTsgdGhpcyBoYXMgYSBIVUdFIGltcGFjdCBvbiBwZXJmb3JtYW5jZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5BQUJCPUFBQkJdIG9iamVjdCBwcm9wZXJ0eSB0aGF0IGhvbGRzIGJvdW5kaW5nIGJveCBzbyB0aGF0IG9iamVjdFt0eXBlXSA9IHsgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIH1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuc3BhdGlhbD1zcGF0aWFsXSBvYmplY3QgcHJvcGVydHkgdGhhdCBob2xkcyBvYmplY3QncyBoYXNoIGxpc3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGlydHk9ZGlydHldIG9iamVjdCBwcm9wZXJ0eSBmb3IgZGlydHlUZXN0XG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcbiAgICB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICAgIHRoaXMueFNpemUgPSBvcHRpb25zLnhTaXplIHx8IG9wdGlvbnMuc2l6ZSB8fCAxMDAwXG4gICAgICAgIHRoaXMueVNpemUgPSBvcHRpb25zLnlTaXplIHx8IG9wdGlvbnMuc2l6ZSB8fCAxMDAwXG4gICAgICAgIHRoaXMuQUFCQiA9IG9wdGlvbnMudHlwZSB8fCAnQUFCQidcbiAgICAgICAgdGhpcy5zcGF0aWFsID0gb3B0aW9ucy5zcGF0aWFsIHx8ICdzcGF0aWFsJ1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBJWEkgPSB0eXBlb2Ygb3B0aW9ucy5jYWxjdWxhdGVQSVhJICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuY2FsY3VsYXRlUElYSSA6IHRydWVcbiAgICAgICAgdGhpcy52aXNpYmxlVGV4dCA9IHR5cGVvZiBvcHRpb25zLnZpc2libGVUZXN0ICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMudmlzaWJsZVRlc3QgOiB0cnVlXG4gICAgICAgIHRoaXMuc2ltcGxlVGVzdCA9IHR5cGVvZiBvcHRpb25zLnNpbXBsZVRlc3QgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zaW1wbGVUZXN0IDogdHJ1ZVxuICAgICAgICB0aGlzLmRpcnR5VGVzdCA9IHR5cGVvZiBvcHRpb25zLmRpcnR5VGVzdCAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmRpcnR5VGVzdCA6IHRydWVcbiAgICAgICAgdGhpcy52aXNpYmxlID0gb3B0aW9ucy52aXNpYmxlIHx8ICd2aXNpYmxlJ1xuICAgICAgICB0aGlzLmRpcnR5ID0gb3B0aW9ucy5kaXJ0eSB8fCAnZGlydHknXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmhlaWdodCA9IDBcbiAgICAgICAgdGhpcy5oYXNoID0ge31cbiAgICAgICAgdGhpcy5vYmplY3RzID0gW11cbiAgICAgICAgdGhpcy5jb250YWluZXJzID0gW11cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgYW4gb2JqZWN0IHRvIGJlIGN1bGxlZFxuICAgICAqIHNpZGUgZWZmZWN0OiBhZGRzIG9iamVjdC5zcGF0aWFsSGFzaGVzIHRvIHRyYWNrIGV4aXN0aW5nIGhhc2hlc1xuICAgICAqIEBwYXJhbSB7Kn0gb2JqZWN0XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbc3RhdGljT2JqZWN0XSBzZXQgdG8gdHJ1ZSBpZiB0aGUgb2JqZWN0J3MgcG9zaXRpb24vc2l6ZSBkb2VzIG5vdCBjaGFuZ2VcbiAgICAgKiBAcmV0dXJuIHsqfSBvYmplY3RcbiAgICAgKi9cbiAgICBhZGQob2JqZWN0LCBzdGF0aWNPYmplY3QpXG4gICAge1xuICAgICAgICBvYmplY3RbdGhpcy5zcGF0aWFsXSA9IHsgaGFzaGVzOiBbXSB9XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZVBJWEkgJiYgdGhpcy5kaXJ0eVRlc3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9iamVjdFt0aGlzLmRpcnR5XSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdGljT2JqZWN0KVxuICAgICAgICB7XG4gICAgICAgICAgICBvYmplY3Quc3RhdGljT2JqZWN0ID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlT2JqZWN0KG9iamVjdClcbiAgICAgICAgdGhpcy5jb250YWluZXJzWzBdLnB1c2gob2JqZWN0KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhbiBvYmplY3QgYWRkZWQgYnkgYWRkKClcbiAgICAgKiBAcGFyYW0geyp9IG9iamVjdFxuICAgICAqIEByZXR1cm4geyp9IG9iamVjdFxuICAgICAqL1xuICAgIHJlbW92ZShvYmplY3QpXG4gICAge1xuICAgICAgICB0aGlzLmNvbnRhaW5lcnNbMF0uc3BsaWNlKHRoaXMubGlzdFswXS5pbmRleE9mKG9iamVjdCksIDEpXG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbUhhc2gob2JqZWN0KVxuICAgICAgICByZXR1cm4gb2JqZWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIGFuIGFycmF5IG9mIG9iamVjdHMgdG8gYmUgY3VsbGVkXG4gICAgICogQHBhcmFtIHtQSVhJLkNvbnRhaW5lcn0gY29udGFpbmVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbc3RhdGljT2JqZWN0XSBzZXQgdG8gdHJ1ZSBpZiB0aGUgb2JqZWN0cyBpbiB0aGUgY29udGFpbmVyJ3MgcG9zaXRpb24vc2l6ZSBkbyBub3QgY2hhbmdlXG4gICAgICogbm90ZTogdGhpcyBvbmx5IHdvcmtzIHdpdGggcGl4aSB2NS4wLjByYzIrIGJlY2F1c2UgaXQgcmVsaWVzIG9uIHRoZSBuZXcgY29udGFpbmVyIGV2ZW50cyBjaGlsZEFkZGVkIGFuZCBjaGlsZFJlbW92ZWRcbiAgICAgKi9cbiAgICBhZGRDb250YWluZXIoY29udGFpbmVyLCBzdGF0aWNPYmplY3QpXG4gICAge1xuICAgICAgICBjb25zdCBhZGRlZCA9IGZ1bmN0aW9uKG9iamVjdClcbiAgICAgICAge1xuICAgICAgICAgICAgb2JqZWN0W3RoaXMuc3BhdGlhbF0gPSB7IGhhc2hlczogW10gfVxuICAgICAgICAgICAgdGhpcy51cGRhdGVPYmplY3Qob2JqZWN0KVxuICAgICAgICB9LmJpbmQodGhpcylcblxuICAgICAgICBjb25zdCByZW1vdmVkID0gZnVuY3Rpb24gKG9iamVjdClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tSGFzaChvYmplY3QpXG4gICAgICAgIH0uYmluZCh0aGlzKVxuXG4gICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBjb250YWluZXIuY2hpbGRyZW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9iamVjdFt0aGlzLnNwYXRpYWxdID0geyBoYXNoZXM6IFtdIH1cbiAgICAgICAgICAgIHRoaXMudXBkYXRlT2JqZWN0KG9iamVjdClcbiAgICAgICAgfVxuICAgICAgICBjb250YWluZXIuY3VsbCA9IHt9XG4gICAgICAgIHRoaXMuY29udGFpbmVycy5wdXNoKGNvbnRhaW5lcilcbiAgICAgICAgY29udGFpbmVyLm9uKCdjaGlsZEFkZGVkJywgYWRkZWQpXG4gICAgICAgIGNvbnRhaW5lci5vbignY2hpbGRSZW1vdmVkJywgcmVtb3ZlZClcbiAgICAgICAgY29udGFpbmVyLmN1bGwuYWRkZWQgPSBhZGRlZFxuICAgICAgICBjb250YWluZXIuY3VsbC5yZW1vdmVkID0gcmVtb3ZlZFxuICAgICAgICBpZiAoc3RhdGljT2JqZWN0KVxuICAgICAgICB7XG4gICAgICAgICAgICBjb250YWluZXIuY3VsbC5zdGF0aWMgPSB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYW4gYXJyYXkgYWRkZWQgYnkgYWRkQ29udGFpbmVyKClcbiAgICAgKiBAcGFyYW0ge1BJWEkuQ29udGFpbmVyfSBjb250YWluZXJcbiAgICAgKiBAcmV0dXJuIHtQSVhJLkNvbnRhaW5lcn0gY29udGFpbmVyXG4gICAgICovXG4gICAgcmVtb3ZlQ29udGFpbmVyKGNvbnRhaW5lcilcbiAgICB7XG4gICAgICAgIHRoaXMuY29udGFpbmVycy5zcGxpY2UodGhpcy5jb250YWluZXJzLmluZGV4T2YoY29udGFpbmVyKSwgMSlcbiAgICAgICAgY29udGFpbmVyLmNoaWxkcmVuLmZvckVhY2gob2JqZWN0ID0+IHRoaXMucmVtb3ZlRnJvbUhhc2gob2JqZWN0KSlcbiAgICAgICAgY29udGFpbmVyLm9mZignYWRkZWQnLCBjb250YWluZXIuY3VsbC5hZGRlZClcbiAgICAgICAgY29udGFpbmVyLm9mZigncmVtb3ZlZCcsIGNvbnRhaW5lci5jdWxsLnJlbW92ZWQpXG4gICAgICAgIGRlbGV0ZSBjb250YWluZXIuY3VsbFxuICAgICAgICByZXR1cm4gY29udGFpbmVyXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIHRoZSBoYXNoZXMgYW5kIGN1bGwgdGhlIGl0ZW1zIGluIHRoZSBsaXN0XG4gICAgICogQHBhcmFtIHtBQUJCfSBBQUJCXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbc2tpcFVwZGF0ZV0gc2tpcCB1cGRhdGluZyB0aGUgaGFzaGVzIG9mIGFsbCBvYmplY3RzXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBudW1iZXIgb2YgYnVja2V0cyBpbiByZXN1bHRzXG4gICAgICovXG4gICAgY3VsbChBQUJCLCBza2lwVXBkYXRlKVxuICAgIHtcbiAgICAgICAgaWYgKCFza2lwVXBkYXRlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU9iamVjdHMoKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW52aXNpYmxlKClcbiAgICAgICAgY29uc3Qgb2JqZWN0cyA9IHRoaXMucXVlcnkoQUFCQiwgdGhpcy5zaW1wbGVUZXN0KVxuICAgICAgICBvYmplY3RzLmZvckVhY2gob2JqZWN0ID0+IG9iamVjdFt0aGlzLnZpc2libGVdID0gdHJ1ZSlcbiAgICAgICAgcmV0dXJuIHRoaXMubGFzdEJ1Y2tldHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgYWxsIG9iamVjdHMgaW4gaGFzaCB0byB2aXNpYmxlPWZhbHNlXG4gICAgICovXG4gICAgaW52aXNpYmxlKClcbiAgICB7XG4gICAgICAgIGZvciAobGV0IGNvbnRhaW5lciBvZiB0aGlzLmNvbnRhaW5lcnMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKG9iamVjdCA9PiBvYmplY3RbdGhpcy52aXNpYmxlXSA9IGZhbHNlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIHRoZSBoYXNoZXMgZm9yIGFsbCBvYmplY3RzXG4gICAgICogYXV0b21hdGljYWxseSBjYWxsZWQgZnJvbSB1cGRhdGUoKSB3aGVuIHNraXBVcGRhdGU9ZmFsc2VcbiAgICAgKi9cbiAgICB1cGRhdGVPYmplY3RzKClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmRpcnR5VGVzdClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIHRoaXMub2JqZWN0cylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0W3RoaXMuZGlydHldKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPYmplY3Qob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICBvYmplY3RbdGhpcy5kaXJ0eV0gPSBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGNvbnRhaW5lciBvZiB0aGlzLmNvbnRhaW5lcnMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIGNvbnRhaW5lci5jaGlsZHJlbilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RbdGhpcy5kaXJ0eV0pXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT2JqZWN0KG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFt0aGlzLmRpcnR5XSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb250YWluZXIgb2YgdGhpcy5jb250YWluZXJzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICghY29udGFpbmVyLmN1bGwuc3RhdGljKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmNoaWxkcmVuLmZvckVhY2gob2JqZWN0ID0+IHRoaXMudXBkYXRlT2JqZWN0KG9iamVjdCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIHRoZSBoYXMgb2YgYW4gb2JqZWN0XG4gICAgICogYXV0b21hdGljYWxseSBjYWxsZWQgZnJvbSB1cGRhdGVPYmplY3RzKClcbiAgICAgKiBAcGFyYW0geyp9IG9iamVjdFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZvcmNlXSBmb3JjZSB1cGRhdGUgZm9yIGNhbGN1bGF0ZVBJWElcbiAgICAgKi9cbiAgICB1cGRhdGVPYmplY3Qob2JqZWN0KVxuICAgIHtcbiAgICAgICAgbGV0IEFBQkJcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlUElYSSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgYm94ID0gb2JqZWN0LmdldExvY2FsQm91bmRzKClcbiAgICAgICAgICAgIEFBQkIgPSBvYmplY3RbdGhpcy5BQUJCXSA9IHtcbiAgICAgICAgICAgICAgICB4OiBvYmplY3QueCArIChib3gueCAtIG9iamVjdC5waXZvdC54KSAqIG9iamVjdC5zY2FsZS54LFxuICAgICAgICAgICAgICAgIHk6IG9iamVjdC55ICsgKGJveC55IC0gb2JqZWN0LnBpdm90LnkpICogb2JqZWN0LnNjYWxlLnksXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJveC53aWR0aCAqIG9iamVjdC5zY2FsZS54LFxuICAgICAgICAgICAgICAgIGhlaWdodDogYm94LmhlaWdodCAqIG9iamVjdC5zY2FsZS55XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBBQUJCID0gb2JqZWN0W3RoaXMuQUFCQl1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGF0aWFsID0gb2JqZWN0W3RoaXMuc3BhdGlhbF1cbiAgICAgICAgaWYgKCFzcGF0aWFsKVxuICAgICAgICB7XG4gICAgICAgICAgICBzcGF0aWFsID0gb2JqZWN0W3RoaXMuc3BhdGlhbF0gPSB7IGhhc2hlczogW10gfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgeFN0YXJ0LCB5U3RhcnQsIHhFbmQsIHlFbmQgfSA9IHRoaXMuZ2V0Qm91bmRzKEFBQkIpXG5cbiAgICAgICAgLy8gb25seSByZW1vdmUgYW5kIGluc2VydCBpZiBtYXBwaW5nIGhhcyBjaGFuZ2VkXG4gICAgICAgIGlmIChzcGF0aWFsLnhTdGFydCAhPT0geFN0YXJ0IHx8IHNwYXRpYWwueVN0YXJ0ICE9PSB5U3RhcnQgfHwgc3BhdGlhbC54RW5kICE9PSB4RW5kIHx8IHNwYXRpYWwueUVuZCAhPT0geUVuZClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHNwYXRpYWwuaGFzaGVzLmxlbmd0aClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21IYXNoKG9iamVjdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IHkgPSB5U3RhcnQ7IHkgPD0geUVuZDsgeSsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0geCArICcsJyArIHlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnQob2JqZWN0LCBrZXkpXG4gICAgICAgICAgICAgICAgICAgIHNwYXRpYWwuaGFzaGVzLnB1c2goa2V5KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwYXRpYWwueFN0YXJ0ID0geFN0YXJ0XG4gICAgICAgICAgICBzcGF0aWFsLnlTdGFydCA9IHlTdGFydFxuICAgICAgICAgICAgc3BhdGlhbC54RW5kID0geEVuZFxuICAgICAgICAgICAgc3BhdGlhbC55RW5kID0geUVuZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhbiBhcnJheSBvZiBidWNrZXRzIHdpdGggPj0gbWluaW11bSBvZiBvYmplY3RzIGluIGVhY2ggYnVja2V0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttaW5pbXVtPTFdXG4gICAgICogQHJldHVybiB7YXJyYXl9IGFycmF5IG9mIGJ1Y2tldHNcbiAgICAgKi9cbiAgICBnZXRCdWNrZXRzKG1pbmltdW09MSlcbiAgICB7XG4gICAgICAgIGNvbnN0IGhhc2hlcyA9IFtdXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmhhc2gpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc2ggPSB0aGlzLmhhc2hba2V5XVxuICAgICAgICAgICAgaWYgKGhhc2gubGVuZ3RoID49IG1pbmltdW0pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaGFzaGVzLnB1c2goaGFzaClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaGVzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0cyBoYXNoIGJvdW5kc1xuICAgICAqIEBwYXJhbSB7QUFCQn0gQUFCQlxuICAgICAqIEByZXR1cm4ge0JvdW5kc31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEJvdW5kcyhBQUJCKVxuICAgIHtcbiAgICAgICAgbGV0IHhTdGFydCA9IE1hdGguZmxvb3IoQUFCQi54IC8gdGhpcy54U2l6ZSlcbiAgICAgICAgbGV0IHlTdGFydCA9IE1hdGguZmxvb3IoQUFCQi55IC8gdGhpcy55U2l6ZSlcbiAgICAgICAgbGV0IHhFbmQgPSBNYXRoLmZsb29yKChBQUJCLnggKyBBQUJCLndpZHRoKSAvIHRoaXMueFNpemUpXG4gICAgICAgIGxldCB5RW5kID0gTWF0aC5mbG9vcigoQUFCQi55ICsgQUFCQi5oZWlnaHQpIC8gdGhpcy55U2l6ZSlcbiAgICAgICAgcmV0dXJuIHsgeFN0YXJ0LCB5U3RhcnQsIHhFbmQsIHlFbmQgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGluc2VydCBvYmplY3QgaW50byB0aGUgc3BhdGlhbCBoYXNoXG4gICAgICogYXV0b21hdGljYWxseSBjYWxsZWQgZnJvbSB1cGRhdGVPYmplY3QoKVxuICAgICAqIEBwYXJhbSB7Kn0gb2JqZWN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqL1xuICAgIGluc2VydChvYmplY3QsIGtleSlcbiAgICB7XG4gICAgICAgIGlmICghdGhpcy5oYXNoW2tleV0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaGFzaFtrZXldID0gW29iamVjdF1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuaGFzaFtrZXldLnB1c2gob2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVtb3ZlcyBvYmplY3QgZnJvbSB0aGUgaGFzaCB0YWJsZVxuICAgICAqIHNob3VsZCBiZSBjYWxsZWQgd2hlbiByZW1vdmluZyBhbiBvYmplY3RcbiAgICAgKiBhdXRvbWF0aWNhbGx5IGNhbGxlZCBmcm9tIHVwZGF0ZU9iamVjdCgpXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICAgICAqL1xuICAgIHJlbW92ZUZyb21IYXNoKG9iamVjdClcbiAgICB7XG4gICAgICAgIGNvbnN0IHNwYXRpYWwgPSBvYmplY3RbdGhpcy5zcGF0aWFsXVxuICAgICAgICB3aGlsZSAoc3BhdGlhbC5oYXNoZXMubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBzcGF0aWFsLmhhc2hlcy5wb3AoKVxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuaGFzaFtrZXldXG4gICAgICAgICAgICBsaXN0LnNwbGljZShsaXN0LmluZGV4T2Yob2JqZWN0KSwgMSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBhbGwgbmVpZ2hib3JzIHRoYXQgc2hhcmUgdGhlIHNhbWUgaGFzaCBhcyBvYmplY3RcbiAgICAgKiBAcGFyYW0geyp9IG9iamVjdCBpbiB0aGUgc3BhdGlhbCBoYXNoXG4gICAgICogQHJldHVybiB7QXJyYXl9IG9mIG9iamVjdHMgdGhhdCBhcmUgaW4gdGhlIHNhbWUgaGFzaCBhcyBvYmplY3RcbiAgICAgKi9cbiAgICBuZWlnaGJvcnMob2JqZWN0KVxuICAgIHtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXVxuICAgICAgICBvYmplY3RbdGhpcy5zcGF0aWFsXS5oYXNoZXMuZm9yRWFjaChrZXkgPT4gcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0KHRoaXMuaGFzaFtrZXldKSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdHMgY29udGFpbmVkIHdpdGhpbiBib3VuZGluZyBib3hcbiAgICAgKiBAcGFyYW0ge0FBQkJ9IEFBQkIgYm91bmRpbmcgYm94IHRvIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NpbXBsZVRlc3Q9dHJ1ZV0gcGVyZm9ybSBhIHNpbXBsZSBib3VuZHMgY2hlY2sgb2YgYWxsIGl0ZW1zIGluIHRoZSBidWNrZXRzXG4gICAgICogQHJldHVybiB7b2JqZWN0W119IHNlYXJjaCByZXN1bHRzXG4gICAgICovXG4gICAgcXVlcnkoQUFCQiwgc2ltcGxlVGVzdClcbiAgICB7XG4gICAgICAgIHNpbXBsZVRlc3QgPSB0eXBlb2Ygc2ltcGxlVGVzdCAhPT0gJ3VuZGVmaW5lZCcgPyBzaW1wbGVUZXN0IDogdHJ1ZVxuICAgICAgICBsZXQgYnVja2V0cyA9IDBcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXVxuICAgICAgICBjb25zdCB7IHhTdGFydCwgeVN0YXJ0LCB4RW5kLCB5RW5kIH0gPSB0aGlzLmdldEJvdW5kcyhBQUJCKVxuICAgICAgICBmb3IgKGxldCB5ID0geVN0YXJ0OyB5IDw9IHlFbmQ7IHkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHhTdGFydDsgeCA8PSB4RW5kOyB4KyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLmhhc2hbeCArICcsJyArIHldXG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbXBsZVRlc3QpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBlbnRyeSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBvYmplY3RbdGhpcy5BQUJCXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChib3gueCArIGJveC53aWR0aCA+IEFBQkIueCAmJiBib3gueCA8IEFBQkIueCArIEFBQkIud2lkdGggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3gueSArIGJveC5oZWlnaHQgPiBBQUJCLnkgJiYgYm94LnkgPCBBQUJCLnkgKyBBQUJCLmhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0KGVudHJ5KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldHMrK1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3RCdWNrZXRzID0gYnVja2V0c1xuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGl0ZXJhdGVzIHRocm91Z2ggb2JqZWN0cyBjb250YWluZWQgd2l0aGluIGJvdW5kaW5nIGJveFxuICAgICAqIHN0b3BzIGl0ZXJhdGluZyBpZiB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVlXG4gICAgICogQHBhcmFtIHtBQUJCfSBBQUJCIGJvdW5kaW5nIGJveCB0byBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NpbXBsZVRlc3Q9dHJ1ZV0gcGVyZm9ybSBhIHNpbXBsZSBib3VuZHMgY2hlY2sgb2YgYWxsIGl0ZW1zIGluIHRoZSBidWNrZXRzXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBjYWxsYmFjayByZXR1cm5lZCBlYXJseVxuICAgICAqL1xuICAgIHF1ZXJ5Q2FsbGJhY2soQUFCQiwgY2FsbGJhY2ssIHNpbXBsZVRlc3QpXG4gICAge1xuICAgICAgICBzaW1wbGVUZXN0ID0gdHlwZW9mIHNpbXBsZVRlc3QgIT09ICd1bmRlZmluZWQnID8gc2ltcGxlVGVzdCA6IHRydWVcbiAgICAgICAgY29uc3QgeyB4U3RhcnQsIHlTdGFydCwgeEVuZCwgeUVuZCB9ID0gdGhpcy5nZXRCb3VuZHMoQUFCQilcbiAgICAgICAgZm9yIChsZXQgeSA9IHlTdGFydDsgeSA8PSB5RW5kOyB5KyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4U3RhcnQ7IHggPD0geEVuZDsgeCsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5oYXNoW3ggKyAnLCcgKyB5XVxuICAgICAgICAgICAgICAgIGlmIChlbnRyeSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cnkubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IGVudHJ5W2ldXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2ltcGxlVGVzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBBQUJCID0gb2JqZWN0LkFBQkJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQUFCQi54ICsgQUFCQi53aWR0aCA+IEFBQkIueCAmJiBBQUJCLnggPCBBQUJCLnggKyBBQUJCLndpZHRoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQUFCQi55ICsgQUFCQi5oZWlnaHQgPiBBQUJCLnkgJiYgQUFCQi55IDwgQUFCQi55ICsgQUFCQi5oZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sob2JqZWN0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sob2JqZWN0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBzdGF0c1xuICAgICAqIEByZXR1cm4ge1N0YXRzfVxuICAgICAqL1xuICAgIHN0YXRzKClcbiAgICB7XG4gICAgICAgIGxldCB2aXNpYmxlID0gMCwgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGxpc3Qgb2YgdGhpcy5jb250YWluZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QuY2hpbGRyZW4ubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0gbGlzdC5jaGlsZHJlbltpXVxuICAgICAgICAgICAgICAgIHZpc2libGUgKz0gb2JqZWN0LnZpc2libGUgPyAxIDogMFxuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG90YWw6IGNvdW50LFxuICAgICAgICAgICAgdmlzaWJsZSxcbiAgICAgICAgICAgIGN1bGxlZDogY291bnQgLSB2aXNpYmxlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBoZWxwZXIgZnVuY3Rpb24gdG8gZXZhbHVhdGUgaGFzaCB0YWJsZVxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBidWNrZXRzIGluIHRoZSBoYXNoIHRhYmxlXG4gICAgICogKi9cbiAgICBnZXROdW1iZXJPZkJ1Y2tldHMoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaGFzaCkubGVuZ3RoXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaGVscGVyIGZ1bmN0aW9uIHRvIGV2YWx1YXRlIGhhc2ggdGFibGVcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBhdmVyYWdlIG51bWJlciBvZiBlbnRyaWVzIGluIGVhY2ggYnVja2V0XG4gICAgICovXG4gICAgZ2V0QXZlcmFnZVNpemUoKVxuICAgIHtcbiAgICAgICAgbGV0IHRvdGFsID0gMFxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5oYXNoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0b3RhbCArPSB0aGlzLmhhc2hba2V5XS5sZW5ndGhcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG90YWwgLyB0aGlzLmdldEJ1Y2tldHMoKS5sZW5ndGhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBoZWxwZXIgZnVuY3Rpb24gdG8gZXZhbHVhdGUgdGhlIGhhc2ggdGFibGVcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBsYXJnZXN0IHNpemVkIGJ1Y2tldFxuICAgICAqL1xuICAgIGdldExhcmdlc3QoKVxuICAgIHtcbiAgICAgICAgbGV0IGxhcmdlc3QgPSAwXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmhhc2gpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc2hba2V5XS5sZW5ndGggPiBsYXJnZXN0KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhcmdlc3QgPSB0aGlzLmhhc2hba2V5XS5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFyZ2VzdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldHMgcXVhZHJhbnQgYm91bmRzXG4gICAgICogQHJldHVybiB7Qm91bmRzfVxuICAgICAqL1xuICAgIGdldFdvcmxkQm91bmRzKClcbiAgICB7XG4gICAgICAgIGxldCB4U3RhcnQgPSBJbmZpbml0eSwgeVN0YXJ0ID0gSW5maW5pdHksIHhFbmQgPSAwLCB5RW5kID0gMFxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5oYXNoKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBzcGxpdCA9IGtleS5zcGxpdCgnLCcpXG4gICAgICAgICAgICBsZXQgeCA9IHBhcnNlSW50KHNwbGl0WzBdKVxuICAgICAgICAgICAgbGV0IHkgPSBwYXJzZUludChzcGxpdFsxXSlcbiAgICAgICAgICAgIHhTdGFydCA9IHggPCB4U3RhcnQgPyB4IDogeFN0YXJ0XG4gICAgICAgICAgICB5U3RhcnQgPSB5IDwgeVN0YXJ0ID8geSA6IHlTdGFydFxuICAgICAgICAgICAgeEVuZCA9IHggPiB4RW5kID8geCA6IHhFbmRcbiAgICAgICAgICAgIHlFbmQgPSB5ID4geUVuZCA/IHkgOiB5RW5kXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgeFN0YXJ0LCB5U3RhcnQsIHhFbmQsIHlFbmQgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGhlbHBlciBmdW5jdGlvbiB0byBldmFsdXRlIHRoZSBoYXNoIHRhYmxlXG4gICAgICogQHBhcmFtIHtBQUJCfSBbQUFCQl0gYm91bmRpbmcgYm94IHRvIHNlYXJjaCBvciBlbnRpcmUgd29ybGRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHNwYXJzZW5lc3MgcGVyY2VudGFnZSAoaS5lLiwgYnVja2V0cyB3aXRoIGF0IGxlYXN0IDEgZWxlbWVudCBkaXZpZGVkIGJ5IHRvdGFsIHBvc3NpYmxlIGJ1Y2tldHMpXG4gICAgICovXG4gICAgZ2V0U3BhcnNlbmVzcyhBQUJCKVxuICAgIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMCwgdG90YWwgPSAwXG4gICAgICAgIGNvbnN0IHsgeFN0YXJ0LCB5U3RhcnQsIHhFbmQsIHlFbmQgfSA9IEFBQkIgPyB0aGlzLmdldEJvdW5kcyhBQUJCKSA6IHRoaXMuZ2V0V29ybGRCb3VuZHMoKVxuICAgICAgICBmb3IgKGxldCB5ID0geVN0YXJ0OyB5IDwgeUVuZDsgeSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geFN0YXJ0OyB4IDwgeEVuZDsgeCsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvdW50ICs9ICh0aGlzLmhhc2hbeCArICcsJyArIHldID8gMSA6IDApXG4gICAgICAgICAgICAgICAgdG90YWwrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudCAvIHRvdGFsXG4gICAgfVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFN0YXRzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdG90YWxcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB2aXNpYmxlXG4gKiBAcHJvcGVydHkge251bWJlcn0gY3VsbGVkXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBCb3VuZHNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB4U3RhcnRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5U3RhcnRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB4RW5kXG4gKiBAcHJvcGVydHkge251bWJlcn0geEVuZFxuICovXG5cbi8qKlxuICAqIEB0eXBlZGVmIHtvYmplY3R9IEFBQkJcbiAgKiBAcHJvcGVydHkge251bWJlcn0geFxuICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5XG4gICogQHByb3BlcnR5IHtudW1iZXJ9IHdpZHRoXG4gICogQHByb3BlcnR5IHtudW1iZXJ9IGhlaWdodFxuICAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwYXRpYWxIYXNoIl19