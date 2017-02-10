'use strict';

module.exports = {
    random(min, max) {
        if(isNaN(max)) {
            max = min < 0 ? 0 : min;
            min = min < 0 ? min : 0;
        }
        return Math.floor(Math.random() * (+max - +min + 1)) + +min ;
    },
    pickInArray(arr) {
        return arr[this.random(arr.length-1)];
    },
    pickInObject(obj) { // Return random property name from object
        return this.pickInArray(Object.keys(obj));
    },
    removeFromArray(elem, arr, full) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === elem) { 
                arr.splice(i, 1);
                if(!full) return;
                i--;
            }
        }
    },
    removeEmptyIndexes(arr) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === undefined) {
                arr.splice(i, 1);
                i--;
            }
        }
    },
    mergeObjects(a, b, newObject) { // Merge/overwrite object B into object A
        var returnObj = newObject ? {} : a;
        if(newObject) {
            for(var aKey in a) { // Apply custom data
                if(!a.hasOwnProperty(aKey)) continue;
                returnObj[aKey] = a[aKey];
            }
        }
        for(var bKey in b) { // Apply custom data
            if(!b.hasOwnProperty(bKey)) continue;
            returnObj[bKey] = b[bKey];
        }
        return returnObj;
    },
    right(text, length) { return text.substring(text.length-length,text.length); },
    clamp(val, min, max) { return Math.min(max,Math.max(min,val)); },
    clampWrap(val, min, max) { // Clamp to range by wrapping value
        var wrap = (val-min) % (max-min);
        return wrap >= 0 ? min + wrap : max + wrap;
    },
    fractionalArrayIndex(arr, index) {
        var floorX = Math.floor(index);
        var lower = arr[floorX];
        if(floorX == index) return lower;
        var upper = arr[Math.ceil(index)];
        var fraction = index - Math.floor(index);
        return (lower + ((upper - lower) * fraction)); 
    },
    getURLParameter(name) {
        return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
                    .exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null
    },
    abbreviate(text, blacklist) {
        var split = text.split(' ');
        var alpha = /[a-z0-9]/i;
        var result = '';
        for(var w = 0; w < split.length; w++) {
            for(var l = 0; l < split[w].length; l++) {
                if(alpha.test(split[w][l])) {
                    result += split[w][l];
                    break;
                }
            }
        }
        if(blacklist && blacklist.includes(result)) {
            var variation = 1;
            result += variation;
            do {
                variation++;
                result = result.substring(0, result.length - 1) + variation;
            } while (blacklist.includes(result))
        }
        return result;
    },
    shuffleArray(arr) {
        var currentIndex = arr.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }
        return arr;
    },
    alphabet: ['a','b','c','d','e','f','g','h','i','j','k','l','m',
        'n','o','p','q','r','s','t','u','v','w','x','y','z'],
    vowels: ['a','e','i','o','u'],
    consonants: ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'],
    hex: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
};

if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/) {
        'use strict';
        if (this == null) throw new TypeError('Array.prototype.includes called on null or undefined');
        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) return false;
        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}