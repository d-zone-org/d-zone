'use strict';
module.exports = {
    randomIntRange: function(min,max) {
        return Math.floor(Math.random() * (+max - +min + 1)) + +min ;
    },
    pickInArray: function(arr) {
        return arr[this.randomIntRange(0,arr.length-1)];
    },
    pickInObject: function(obj) { // Return random property name from object
        return this.pickInArray(Object.keys(obj));
    },
    findAndRemove: function(elem,arr) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === elem) { 
                arr.splice(i, 1);
                i--;
            }
        }
    },
    right: function(text, length) { return text.substring(text.length-length,text.length); },
    clamp: function(val, min, max) { return Math.min(max,Math.max(min,val)); },
    clampWrap: function(val, min, max) { // Clamp to range by wrapping value
        var wrap = (val-min) % (max+1-min);
        return wrap >= 0 ? min + wrap : max + 1 + wrap;
    },
    fractionalArrayIndex: function(arr, index) {
        var floorX = Math.floor(index);
        var lower = arr[floorX];
        if(floorX == index) return lower;
        var upper = arr[Math.ceil(index)];
        var fraction = index - Math.floor(index);
        return (lower + ((upper - lower) * fraction)); 
    },
    getURLParameter: function(name) {
        return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
                    .exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null
    },
    abbreviate: function(text,blacklist) {
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
        if(result.trim() == '') result = '1';
        if(blacklist && blacklist.indexOf(result) >= 0) {
            var variation = 0;
            result += variation;
            do {
                variation++;
                result = result.substring(0,result.length-1) + variation;
            } while (blacklist.indexOf(result) >= 0)
        }
        return result;
    },
    alphabet: ['a','b','c','d','e','f','g','h','i','j','k','l','m',
        'n','o','p','q','r','s','t','u','v','w','x','y','z'],
    vowels: ['a','e','i','o','u'],
    consonants: ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'],
    hex: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
};