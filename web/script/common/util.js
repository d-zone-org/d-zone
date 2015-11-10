'use strict';
module.exports = {
    countProperties: function(obj) { // Return number of properties an object has
        if(!obj) { return 0; } var count = 0;
        for(var key in obj) { if(!obj.hasOwnProperty(key)) { continue; } count++; }
        return count;
    },
    randomIntRange: function(min,max) {
        return Math.floor(Math.random() * (+max - +min + 1)) + +min ;
    },
    pickInArray: function(arr) {
        return arr[this.randomIntRange(0,arr.length-1)];
    },
    pickInObject: function(obj) { // Return random property name from object
        var array = [];
        for(var key in obj) { if(obj.hasOwnProperty(key)) array.push(key); }
        return this.pickInArray(array);
    }
};