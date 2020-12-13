'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// pixi-cull.SpatialHash
// Copyright 2018 YOPEY YOPEY LLC
// David Figatner
// MIT License

var Simple = function () {
    /**
     * creates a simple cull
     * @param {object} [options]
     * @param {boolean} [options.visible=visible] parameter of the object to set (usually visible or renderable)
     * @param {boolean} [options.calculatePIXI=true] calculate pixi.js bounding box automatically; if this is set to false then it uses object[options.AABB] for bounding box
     * @param {string} [options.dirtyTest=true] only update spatial hash for objects with object[options.dirtyTest]=true; this has a HUGE impact on performance
     * @param {string} [options.AABB=AABB] object property that holds bounding box so that object[type] = { x: number, y: number, width: number, height: number }; not needed if options.calculatePIXI=true
     */
    function Simple(options) {
        _classCallCheck(this, Simple);

        options = options || {};
        this.visible = options.visible || 'visible';
        this.calculatePIXI = typeof options.calculatePIXI !== 'undefined' ? options.calculatePIXI : true;
        this.dirtyTest = typeof options.dirtyTest !== 'undefined' ? options.dirtyTest : true;
        this.AABB = options.AABB || 'AABB';
        this.lists = [[]];
    }

    /**
     * add an array of objects to be culled
     * @param {Array} array
     * @param {boolean} [staticObject] set to true if the object's position/size does not change
     * @return {Array} array
     */


    _createClass(Simple, [{
        key: 'addList',
        value: function addList(array, staticObject) {
            this.lists.push(array);
            if (staticObject) {
                array.staticObject = true;
            }
            if (this.calculatePIXI && this.dirtyTest) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var object = _step.value;

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
            }
            return array;
        }

        /**
         * remove an array added by addList()
         * @param {Array} array
         * @return {Array} array
         */

    }, {
        key: 'removeList',
        value: function removeList(array) {
            this.lists.splice(this.lists.indexOf(array), 1);
            return array;
        }

        /**
         * add an object to be culled
         * @param {*} object
         * @param {boolean} [staticObject] set to true if the object's position/size does not change
         * @return {*} object
         */

    }, {
        key: 'add',
        value: function add(object, staticObject) {
            if (staticObject) {
                object.staticObject = true;
            }
            if (this.calculatePIXI && (this.dirtyTest || staticObject)) {
                this.updateObject(object);
            }
            this.lists[0].push(object);
            return object;
        }

        /**
         * remove an object added by add()
         * @param {*} object
         * @return {*} object
         */

    }, {
        key: 'remove',
        value: function remove(object) {
            this.lists[0].splice(this.lists[0].indexOf(object), 1);
            return object;
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

    }, {
        key: 'cull',
        value: function cull(bounds, skipUpdate) {
            if (this.calculatePIXI && !skipUpdate) {
                this.updateObjects();
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var list = _step2.value;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var object = _step3.value;

                            var box = object[this.AABB];
                            object[this.visible] = box.x + box.width > bounds.x && box.x < bounds.x + bounds.width && box.y + box.height > bounds.y && box.y < bounds.y + bounds.height;
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
         * update the AABB for all objects
         * automatically called from update() when calculatePIXI=true and skipUpdate=false
         */

    }, {
        key: 'updateObjects',
        value: function updateObjects() {
            if (this.dirtyTest) {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this.lists[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var list = _step4.value;

                        if (!list.staticObject) {
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = list[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var object = _step5.value;

                                    if (!object.staticObject && object[this.dirty]) {
                                        this.updateObject(object);
                                        object[this.dirty] = false;
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
                    for (var _iterator6 = this.lists[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _list = _step6.value;

                        if (!_list.staticObject) {
                            var _iteratorNormalCompletion7 = true;
                            var _didIteratorError7 = false;
                            var _iteratorError7 = undefined;

                            try {
                                for (var _iterator7 = _list[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                    var _object = _step7.value;

                                    if (!_object.staticObject) {
                                        this.updateObject(_object);
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
         */

    }, {
        key: 'updateObject',
        value: function updateObject(object) {
            var box = object.getLocalBounds();
            object[this.AABB] = object[this.AABB] || {};
            object[this.AABB].x = object.x + (box.x - object.pivot.x) * object.scale.x;
            object[this.AABB].y = object.y + (box.y - object.pivot.y) * object.scale.y;
            object[this.AABB].width = box.width * object.scale.x;
            object[this.AABB].height = box.height * object.scale.y;
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

    }, {
        key: 'query',
        value: function query(bounds) {
            var results = [];
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.lists[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var list = _step8.value;
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = list[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var object = _step9.value;

                            var box = object[this.AABB];
                            if (box.x + box.width > bounds.x && box.x - box.width < bounds.x + bounds.width && box.y + box.height > bounds.y && box.y - box.height < bounds.y + bounds.height) {
                                results.push(object);
                            }
                        }
                    } catch (err) {
                        _didIteratorError9 = true;
                        _iteratorError9 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }
                        } finally {
                            if (_didIteratorError9) {
                                throw _iteratorError9;
                            }
                        }
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

            return results;
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

    }, {
        key: 'queryCallback',
        value: function queryCallback(bounds, callback) {
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this.lists[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var list = _step10.value;
                    var _iteratorNormalCompletion11 = true;
                    var _didIteratorError11 = false;
                    var _iteratorError11 = undefined;

                    try {
                        for (var _iterator11 = list[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                            var object = _step11.value;

                            var box = object[this.AABB];
                            if (box.x + box.width > bounds.x && box.x - box.width < bounds.x + bounds.width && box.y + box.height > bounds.y && box.y - box.height < bounds.y + bounds.height) {
                                if (callback(object)) {
                                    return true;
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError11 = true;
                        _iteratorError11 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                _iterator11.return();
                            }
                        } finally {
                            if (_didIteratorError11) {
                                throw _iteratorError11;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            return false;
        }

        /**
         * get stats (only updated after update() is called)
         * @return {SimpleStats}
         */

    }, {
        key: 'stats',
        value: function stats() {
            var visible = 0,
                count = 0;
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = this.lists[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var list = _step12.value;

                    list.forEach(function (object) {
                        visible += object.visible ? 1 : 0;
                        count++;
                    });
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            return { total: count, visible: visible, culled: count - visible };
        }
    }]);

    return Simple;
}();

/**
 * @typedef {object} SimpleStats
 * @property {number} total
 * @property {number} visible
 * @property {number} culled
 */

module.exports = Simple;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NvZGUvc2ltcGxlLmpzIl0sIm5hbWVzIjpbIlNpbXBsZSIsIm9wdGlvbnMiLCJ2aXNpYmxlIiwiY2FsY3VsYXRlUElYSSIsImRpcnR5VGVzdCIsIkFBQkIiLCJsaXN0cyIsImFycmF5Iiwic3RhdGljT2JqZWN0IiwicHVzaCIsIm9iamVjdCIsInVwZGF0ZU9iamVjdCIsInNwbGljZSIsImluZGV4T2YiLCJib3VuZHMiLCJza2lwVXBkYXRlIiwidXBkYXRlT2JqZWN0cyIsImxpc3QiLCJib3giLCJ4Iiwid2lkdGgiLCJ5IiwiaGVpZ2h0IiwiZGlydHkiLCJnZXRMb2NhbEJvdW5kcyIsInBpdm90Iiwic2NhbGUiLCJyZXN1bHRzIiwiY2FsbGJhY2siLCJjb3VudCIsImZvckVhY2giLCJ0b3RhbCIsImN1bGxlZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOztJQUVNQSxNO0FBRUY7Ozs7Ozs7O0FBUUEsb0JBQVlDLE9BQVosRUFDQTtBQUFBOztBQUNJQSxrQkFBVUEsV0FBVyxFQUFyQjtBQUNBLGFBQUtDLE9BQUwsR0FBZUQsUUFBUUMsT0FBUixJQUFtQixTQUFsQztBQUNBLGFBQUtDLGFBQUwsR0FBcUIsT0FBT0YsUUFBUUUsYUFBZixLQUFpQyxXQUFqQyxHQUErQ0YsUUFBUUUsYUFBdkQsR0FBdUUsSUFBNUY7QUFDQSxhQUFLQyxTQUFMLEdBQWlCLE9BQU9ILFFBQVFHLFNBQWYsS0FBNkIsV0FBN0IsR0FBMkNILFFBQVFHLFNBQW5ELEdBQStELElBQWhGO0FBQ0EsYUFBS0MsSUFBTCxHQUFZSixRQUFRSSxJQUFSLElBQWdCLE1BQTVCO0FBQ0EsYUFBS0MsS0FBTCxHQUFhLENBQUMsRUFBRCxDQUFiO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Z0NBTVFDLEssRUFBT0MsWSxFQUNmO0FBQ0ksaUJBQUtGLEtBQUwsQ0FBV0csSUFBWCxDQUFnQkYsS0FBaEI7QUFDQSxnQkFBSUMsWUFBSixFQUNBO0FB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d0JBRFNXLElBQ1Q7O0FBQ0lBLHlCQUFLYSxPQUFMLENBQWEsa0JBQ2I7QUFDSTVCLG1DQUFXUSxPQUFPUixPQUFQLEdBQWlCLENBQWpCLEdBQXFCLENBQWhDO0FBQ0EyQjtBQUNILHFCQUpEO0FBS0g7QUFUTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVVJLG1CQUFPLEVBQUVFLE9BQU9GLEtBQVQsRUFBZ0IzQixnQkFBaEIsRUFBeUI4QixRQUFRSCxRQUFRM0IsT0FBekMsRUFBUDtBQUNIOzs7Ozs7QUFHTDs7Ozs7OztBQU9BK0IsT0FBT0MsT0FBUCxHQUFpQmxDLE1BQWpCIiwiZmlsZSI6InNpbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHBpeGktY3VsbC5TcGF0aWFsSGFzaFxuLy8gQ29weXJpZ2h0IDIwMTggWU9QRVkgWU9QRVkgTExDXG4vLyBEYXZpZCBGaWdhdG5lclxuLy8gTUlUIExpY2Vuc2VcblxuY2xhc3MgU2ltcGxlXG57XG4gICAgLyoqXG4gICAgICogY3JlYXRlcyBhIHNpbXBsZSBjdWxsXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudmlzaWJsZT12aXNpYmxlXSBwYXJhbWV0ZXIgb2YgdGhlIG9iamVjdCB0byBzZXQgKHVzdWFsbHkgdmlzaWJsZSBvciByZW5kZXJhYmxlKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY2FsY3VsYXRlUElYST10cnVlXSBjYWxjdWxhdGUgcGl4aS5qcyBib3VuZGluZyBib3ggYXV0b21hdGljYWxseTsgaWYgdGhpcyBpcyBzZXQgdG8gZmFsc2UgdGhlbiBpdCB1c2VzIG9iamVjdFtvcHRpb25zLkFBQkJdIGZvciBib3VuZGluZyBib3hcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGlydHlUZXN0PXRydWVdIG9ubHkgdXBkYXRlIHNwYXRpYWwgaGFzaCBmb3Igb2JqZWN0cyB3aXRoIG9iamVjdFtvcHRpb25zLmRpcnR5VGVzdF09dHJ1ZTsgdGhpcyBoYXMgYSBIVUdFIGltcGFjdCBvbiBwZXJmb3JtYW5jZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5BQUJCPUFBQkJdIG9iamVjdCBwcm9wZXJ0eSB0aGF0IGhvbGRzIGJvdW5kaW5nIGJveCBzbyB0aGF0IG9iamVjdFt0eXBlXSA9IHsgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIH07IG5vdCBuZWVkZWQgaWYgb3B0aW9ucy5jYWxjdWxhdGVQSVhJPXRydWVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxuICAgIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgICAgdGhpcy52aXNpYmxlID0gb3B0aW9ucy52aXNpYmxlIHx8ICd2aXNpYmxlJ1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVBJWEkgPSB0eXBlb2Ygb3B0aW9ucy5jYWxjdWxhdGVQSVhJICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuY2FsY3VsYXRlUElYSSA6IHRydWVcbiAgICAgICAgdGhpcy5kaXJ0eVRlc3QgPSB0eXBlb2Ygb3B0aW9ucy5kaXJ0eVRlc3QgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5kaXJ0eVRlc3QgOiB0cnVlXG4gICAgICAgIHRoaXMuQUFCQiA9IG9wdGlvbnMuQUFCQiB8fCAnQUFCQidcbiAgICAgICAgdGhpcy5saXN0cyA9IFtbXV1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgYW4gYXJyYXkgb2Ygb2JqZWN0cyB0byBiZSBjdWxsZWRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3N0YXRpY09iamVjdF0gc2V0IHRvIHRydWUgaWYgdGhlIG9iamVjdCdzIHBvc2l0aW9uL3NpemUgZG9lcyBub3QgY2hhbmdlXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFycmF5XG4gICAgICovXG4gICAgYWRkTGlzdChhcnJheSwgc3RhdGljT2JqZWN0KVxuICAgIHtcbiAgICAgICAgdGhpcy5saXN0cy5wdXNoKGFycmF5KVxuICAgICAgICBpZiAoc3RhdGljT2JqZWN0KVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnJheS5zdGF0aWNPYmplY3QgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlUElYSSAmJiB0aGlzLmRpcnR5VGVzdClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIGFycmF5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT2JqZWN0KG9iamVjdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYW4gYXJyYXkgYWRkZWQgYnkgYWRkTGlzdCgpXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYXJyYXlcbiAgICAgKi9cbiAgICByZW1vdmVMaXN0KGFycmF5KVxuICAgIHtcbiAgICAgICAgdGhpcy5saXN0cy5zcGxpY2UodGhpcy5saXN0cy5pbmRleE9mKGFycmF5KSwgMSlcbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIGFuIG9iamVjdCB0byBiZSBjdWxsZWRcbiAgICAgKiBAcGFyYW0geyp9IG9iamVjdFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3N0YXRpY09iamVjdF0gc2V0IHRvIHRydWUgaWYgdGhlIG9iamVjdCdzIHBvc2l0aW9uL3NpemUgZG9lcyBub3QgY2hhbmdlXG4gICAgICogQHJldHVybiB7Kn0gb2JqZWN0XG4gICAgICovXG4gICAgYWRkKG9iamVjdCwgc3RhdGljT2JqZWN0KVxuICAgIHtcbiAgICAgICAgaWYgKHN0YXRpY09iamVjdClcbiAgICAgICAge1xuICAgICAgICAgICAgb2JqZWN0LnN0YXRpY09iamVjdCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVQSVhJICYmICh0aGlzLmRpcnR5VGVzdCB8fCBzdGF0aWNPYmplY3QpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU9iamVjdChvYmplY3QpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saXN0c1swXS5wdXNoKG9iamVjdClcbiAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhbiBvYmplY3QgYWRkZWQgYnkgYWRkKClcbiAgICAgKiBAcGFyYW0geyp9IG9iamVjdFxuICAgICAqIEByZXR1cm4geyp9IG9iamVjdFxuICAgICAqL1xuICAgIHJlbW92ZShvYmplY3QpXG4gICAge1xuICAgICAgICB0aGlzLmxpc3RzWzBdLnNwbGljZSh0aGlzLmxpc3RzWzBdLmluZGV4T2Yob2JqZWN0KSwgMSlcbiAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGN1bGwgdGhlIGl0ZW1zIGluIHRoZSBsaXN0IGJ5IHNldHRpbmcgdmlzaWJsZSBwYXJhbWV0ZXJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYm91bmRzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJvdW5kcy54XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJvdW5kcy55XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJvdW5kcy53aWR0aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZHMuaGVpZ2h0XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbc2tpcFVwZGF0ZV0gc2tpcCB1cGRhdGluZyB0aGUgQUFCQiBib3VuZGluZyBib3ggb2YgYWxsIG9iamVjdHNcbiAgICAgKi9cbiAgICBjdWxsKGJvdW5kcywgc2tpcFVwZGF0ZSlcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZVBJWEkgJiYgIXNraXBVcGRhdGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlT2JqZWN0cygpXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgbGlzdCBvZiB0aGlzLmxpc3RzKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCBvYmplY3Qgb2YgbGlzdClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBvYmplY3RbdGhpcy5BQUJCXVxuICAgICAgICAgICAgICAgIG9iamVjdFt0aGlzLnZpc2libGVdID1cbiAgICAgICAgICAgICAgICAgICAgYm94LnggKyBib3gud2lkdGggPiBib3VuZHMueCAmJiBib3gueCA8IGJvdW5kcy54ICsgYm91bmRzLndpZHRoICYmXG4gICAgICAgICAgICAgICAgICAgIGJveC55ICsgYm94LmhlaWdodCA+IGJvdW5kcy55ICYmIGJveC55IDwgYm91bmRzLnkgKyBib3VuZHMuaGVpZ2h0XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgdGhlIEFBQkIgZm9yIGFsbCBvYmplY3RzXG4gICAgICogYXV0b21hdGljYWxseSBjYWxsZWQgZnJvbSB1cGRhdGUoKSB3aGVuIGNhbGN1bGF0ZVBJWEk9dHJ1ZSBhbmQgc2tpcFVwZGF0ZT1mYWxzZVxuICAgICAqL1xuICAgIHVwZGF0ZU9iamVjdHMoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuZGlydHlUZXN0KVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIHRoaXMubGlzdHMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0LnN0YXRpY09iamVjdClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBsaXN0KVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9iamVjdC5zdGF0aWNPYmplY3QgJiYgb2JqZWN0W3RoaXMuZGlydHldKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT2JqZWN0KG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbdGhpcy5kaXJ0eV0gPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiB0aGlzLmxpc3RzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICghbGlzdC5zdGF0aWNPYmplY3QpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBvYmplY3Qgb2YgbGlzdClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvYmplY3Quc3RhdGljT2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT2JqZWN0KG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSB0aGUgaGFzIG9mIGFuIG9iamVjdFxuICAgICAqIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGZyb20gdXBkYXRlT2JqZWN0cygpXG4gICAgICogQHBhcmFtIHsqfSBvYmplY3RcbiAgICAgKi9cbiAgICB1cGRhdGVPYmplY3Qob2JqZWN0KVxuICAgIHtcbiAgICAgICAgY29uc3QgYm94ID0gb2JqZWN0LmdldExvY2FsQm91bmRzKClcbiAgICAgICAgb2JqZWN0W3RoaXMuQUFCQl0gPSBvYmplY3RbdGhpcy5BQUJCXSB8fCB7fVxuICAgICAgICBvYmplY3RbdGhpcy5BQUJCXS54ID0gb2JqZWN0LnggKyAoYm94LnggLSBvYmplY3QucGl2b3QueCkgKiBvYmplY3Quc2NhbGUueFxuICAgICAgICBvYmplY3RbdGhpcy5BQUJCXS55ID0gb2JqZWN0LnkgKyAoYm94LnkgLSBvYmplY3QucGl2b3QueSkgKiBvYmplY3Quc2NhbGUueVxuICAgICAgICBvYmplY3RbdGhpcy5BQUJCXS53aWR0aCA9IGJveC53aWR0aCAqIG9iamVjdC5zY2FsZS54XG4gICAgICAgIG9iamVjdFt0aGlzLkFBQkJdLmhlaWdodCA9IGJveC5oZWlnaHQgKiBvYmplY3Quc2NhbGUueVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBjb250YWluZWQgd2l0aGluIGJvdW5kaW5nIGJveFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBib3VkbnMgYm91bmRpbmcgYm94IHRvIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZHMueFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZHMueVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZHMud2lkdGhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYm91bmRzLmhlaWdodFxuICAgICAqIEByZXR1cm4ge29iamVjdFtdfSBzZWFyY2ggcmVzdWx0c1xuICAgICAqL1xuICAgIHF1ZXJ5KGJvdW5kcylcbiAgICB7XG4gICAgICAgIGxldCByZXN1bHRzID0gW11cbiAgICAgICAgZm9yIChsZXQgbGlzdCBvZiB0aGlzLmxpc3RzKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGxldCBvYmplY3Qgb2YgbGlzdClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBib3ggPSBvYmplY3RbdGhpcy5BQUJCXVxuICAgICAgICAgICAgICAgIGlmIChib3gueCArIGJveC53aWR0aCA+IGJvdW5kcy54ICYmIGJveC54IC0gYm94LndpZHRoIDwgYm91bmRzLnggKyBib3VuZHMud2lkdGggJiZcbiAgICAgICAgICAgICAgICAgICAgYm94LnkgKyBib3guaGVpZ2h0ID4gYm91bmRzLnkgJiYgYm94LnkgLSBib3guaGVpZ2h0IDwgYm91bmRzLnkgKyBib3VuZHMuaGVpZ2h0KVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG9iamVjdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpdGVyYXRlcyB0aHJvdWdoIG9iamVjdHMgY29udGFpbmVkIHdpdGhpbiBib3VuZGluZyBib3hcbiAgICAgKiBzdG9wcyBpdGVyYXRpbmcgaWYgdGhlIGNhbGxiYWNrIHJldHVybnMgdHJ1ZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBib3VuZHMgYm91bmRpbmcgYm94IHRvIHNlYXJjaFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZHMueFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZHMueVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZHMud2lkdGhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYm91bmRzLmhlaWdodFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBjYWxsYmFjayByZXR1cm5lZCBlYXJseVxuICAgICAqL1xuICAgIHF1ZXJ5Q2FsbGJhY2soYm91bmRzLCBjYWxsYmFjaylcbiAgICB7XG4gICAgICAgIGZvciAobGV0IGxpc3Qgb2YgdGhpcy5saXN0cylcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIGxpc3QpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgYm94ID0gb2JqZWN0W3RoaXMuQUFCQl1cbiAgICAgICAgICAgICAgICBpZiAoYm94LnggKyBib3gud2lkdGggPiBib3VuZHMueCAmJiBib3gueCAtIGJveC53aWR0aCA8IGJvdW5kcy54ICsgYm91bmRzLndpZHRoICYmXG4gICAgICAgICAgICAgICAgICAgIGJveC55ICsgYm94LmhlaWdodCA+IGJvdW5kcy55ICYmIGJveC55IC0gYm94LmhlaWdodCA8IGJvdW5kcy55ICsgYm91bmRzLmhlaWdodClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayhvYmplY3QpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBzdGF0cyAob25seSB1cGRhdGVkIGFmdGVyIHVwZGF0ZSgpIGlzIGNhbGxlZClcbiAgICAgKiBAcmV0dXJuIHtTaW1wbGVTdGF0c31cbiAgICAgKi9cbiAgICBzdGF0cygpXG4gICAge1xuICAgICAgICBsZXQgdmlzaWJsZSA9IDAsIGNvdW50ID0gMFxuICAgICAgICBmb3IgKGxldCBsaXN0IG9mIHRoaXMubGlzdHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChvYmplY3QgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2aXNpYmxlICs9IG9iamVjdC52aXNpYmxlID8gMSA6IDBcbiAgICAgICAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHRvdGFsOiBjb3VudCwgdmlzaWJsZSwgY3VsbGVkOiBjb3VudCAtIHZpc2libGUgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBTaW1wbGVTdGF0c1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHRvdGFsXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmlzaWJsZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGN1bGxlZFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gU2ltcGxlIl19