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
    },
    alphabet: ['a','b','c','d','e','f','g','h','i','j','k','l','m',
        'n','o','p','q','r','s','t','u','v','w','x','y','z'],
    vowels: ['a','e','i','o','u'],
    consonants: ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y,','z'],
    hex: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
};