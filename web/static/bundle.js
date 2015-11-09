(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],4:[function(require,module,exports){
var now = require('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(global, fn)
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":5}],5:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require('_process'))

},{"_process":2}],6:[function(require,module,exports){
'use strict';
var Game = require('./script/engine/game.js');
var Renderer = require('./script/engine/renderer.js');
var Canvas = require('./script/engine/canvas.js');

var gridSize = 16;
var game = new Game({ step: 1000 / 60 });
game.renderer = new Renderer({ game: game });
var canvas = new Canvas({
    id: 'main', game: game, scale: 3, backgroundColor: '#181213'
});
game.renderer.addCanvas(canvas);
game.bindCanvas(canvas);

var Tile = require('./script/environment/tile.js');
var Block = require('./script/environment/block.js');
var HalfBlock = require('./script/environment/halfblock.js');
var Actor = require('./script/actors/actor.js');
//var centerBlock = new HalfBlock(0,0,0);
//centerBlock.addToGame(game);
//var mouseBlock = new HalfBlock(0,0,0);
//mouseBlock.addToGame(game);
//game.on('mousemove',function(mouseEvent) {
//    var iso = (function(x,y) { 
//        return { x: x/2 + y, y: y - x/2 };
//    })(mouseEvent.centerMouseX,mouseEvent.centerMouseY);
//    mouseBlock.position.x = iso.x;
//    mouseBlock.position.y = iso.y;
//});
var worldSize = 17;
for(var tx = 0; tx < worldSize; tx++) for(var ty = 0; ty < worldSize; ty++) {
    var x = tx-(worldSize-1)/2, y = ty-(worldSize-1)/2;
    var radius = x*x+y*y;
    if(radius > 97) continue;
    var grid;
    if(radius < 64 && Math.random() < (80 - radius)/70) {
        grid = new Tile(x*gridSize,y*gridSize,0);
        if(Math.random() < 0.1) {
            var actor = new Actor(x*gridSize,y*gridSize,grid.size.z);
            actor.addToGame(game);
            //actor.emit('impulse');
        }
    } else {
        grid = Math.random() < (radius - 64) / 15 ? 
            new Block(x*gridSize,y*gridSize,0) : new HalfBlock(x*gridSize,y*gridSize,0);
    }
    grid.addToGame(game);
}

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});

window.pause = function() { game.paused = true; };
window.unpause = function() { game.paused = false; };
},{"./script/actors/actor.js":7,"./script/engine/canvas.js":12,"./script/engine/game.js":14,"./script/engine/renderer.js":16,"./script/environment/block.js":19,"./script/environment/halfblock.js":20,"./script/environment/tile.js":22}],7:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var Geometry = require('./../common/geometry.js');
var util = require('./../common/util.js');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');
var Wander = require('./behaviors/wander.js');

module.exports = Actor;
inherits(Actor, WorldObject);

function Actor(x,y,z) {
    var actor = new WorldObject({position:{x:x,y:y,z:z},size:{x:7,y:7,z:8}});
    this.object = actor;
    actor.sheet = new Sheet('actor');
    actor.getSprite = function() {
        return actor.sheet.map[actor.facing];
    };
    actor.on('draw',function(canvas) {
        canvas.drawImageIso(actor);
    });
    actor.facing = util.pickInObject(Geometry.DIRECTIONS);
    actor.behaviors = [new Wander(actor)];
    function newImpulse() {
        if(actor.stopped()) actor.emit('impulse');
        setTimeout(newImpulse,Math.random() * 3000);
    }
    setTimeout(newImpulse,Math.random() * 3000);
    return actor;
}
},{"./../common/geometry.js":10,"./../common/util.js":11,"./../engine/worldobject.js":18,"./behaviors/wander.js":8,"./sheet.js":9,"inherits":3}],8:[function(require,module,exports){
'use strict';
var Geometry = require('./../../common/geometry.js');
var util = require('./../../common/util.js');

module.exports = Wander;

function Wander(actor) {
    this.actor = actor;
    this.state = 'idle';
    
    var self = this;
    this.actor.on('impulse', function() {
        if(self.state != 'idle') return;
        if(!self.heading) {
            self.heading = util.pickInObject(Geometry.DIRECTIONS);
        }
        self.actor.velocity = {
            x: Geometry.DIRECTIONS[self.heading].x, y: Geometry.DIRECTIONS[self.heading].y, z: 0
        };
        self.actor.facing = self.heading;
        self.state = 'moving';
    });
    this.actor.on('collision', function() {
        if(self.state == 'moving') {
            self.state = 'idle';
            self.heading = false;
        }
    });
}
},{"./../../common/geometry.js":10,"./../../common/util.js":11}],9:[function(require,module,exports){
'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {
    actor: {
        north: { x: 28, y: 0, width: 14, height: 14 },
        south: { x: 0, y: 0, width: 14, height: 14 },
        east: { x: 14, y: 0, width: 14, height: 14 },
        west: { x: 28, y: 0, width: 14, height: 14 }
    }
};
var image = new SpriteSheet('actors.png',map);

module.exports = Sheet;

function Sheet(sprite) {
    this.image = image;
    this.map = map[sprite];
}
},{"./../engine/spritesheet.js":17}],10:[function(require,module,exports){
'use strict';
var util = require('./util.js');
module.exports = {
    DIRECTIONS: {
        north: { x: 0, y: -1 },
        east: { x: 1, y: 0 },
        south: { x: 0, y: 1 },
        west: { x: -1, y: 0 }
    },
    randomDirection: function() {
        return this.DIRECTIONS[util.pickInObject(this.DIRECTIONS)];
    },
    intervalOverlaps: function(a1,a2,b1,b2) {
        return a1 >= b1 && a1 < b2 || b1 >= a1 && b1 < a2;
    }
};
},{"./util.js":11}],11:[function(require,module,exports){
'use strict';
module.exports = {
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
},{}],12:[function(require,module,exports){
'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Canvas;
inherits(Canvas, EventEmitter);

function Canvas(options) {
    this.id = options.id;
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.scale = options.scale || 1;
    this.autosize = !options.hasOwnProperty('width');
    if(this.autosize) {
        this.left = 0; this.right = 0; this.top = 0; this.bottom = 0;
        this.onResize();
        window.addEventListener('resize',this.onResize.bind(this));
    } else {
        this.width = this.canvas.width = options.width;
        this.height = this.canvas.height = options.height;
        if(options.hasOwnProperty('left')) {
            this.canvas.style.left = options.left + 'px';
        } else if(options.hasOwnProperty('right')) {
            this.canvas.style.right = (options.right + options.width) + 'px';
        }
        if(options.hasOwnProperty('top')) {
            this.canvas.style.top = options.top + 'px';
        } else if(options.hasOwnProperty('bottom')) {
            this.canvas.style.bottom = (options.bottom + options.height) + 'px';
        }
    }
    if(this.scale > 1) {
        this.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    }
    this.context.mozImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
    this.backgroundColor = options.backgroundColor;
    this.canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });
}

Canvas.prototype.onResize = function() {
    // TODO: Scale based on world size
    if(window.innerWidth < 910 || window.innerHeight < 490) {
        this.scale = 1;
    } else if(window.innerWidth < 1355 || window.innerHeight < 740) {
        this.scale = 2;
    } else {
        this.scale = 3;
    }
    this.canvas.style.transform = 'scale(' + this.scale + ', ' + this.scale + ')';
    this.width = this.canvas.width = Math.ceil(window.innerWidth / this.scale);
    this.height = this.canvas.height = Math.ceil(window.innerHeight / this.scale);
    this.emit('resize',{ width: this.width, height: this.height })
};

Canvas.prototype.draw = function() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.width, this.height);
};

Canvas.prototype.drawImageIso = function(obj) {
    if(!obj.sheet || !obj.sheet.image.loaded) return;
    var screen = obj.toScreen(), sprite = obj.getSprite();
    if(this.autosize) {
        screen.x += this.width/2;
        screen.y += this.height/2;
    }
    if(sprite.offset) {
        screen.x += sprite.offset.x;
        screen.y += sprite.offset.y;
    }
    // TODO: Lock all sprites to 2:1 grid to prevent jittery movement?
    this.context.drawImage(obj.sheet.image.img,sprite.x,sprite.y,sprite.width,sprite.height,
        Math.round(screen.x),Math.round(screen.y),sprite.width,sprite.height);
};
},{"events":1,"inherits":3}],13:[function(require,module,exports){
'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity() {
    
}

Entity.prototype.addToGame = function(game) {
    this.game = game;
    this.game.entities.push(this);
    if(!this.game.findEntity) this.game.findEntity = this.findEntity;
    var self = this;
    this.game.on('update', function(interval) {
        self.emit('update', interval);
    });
    this.game.renderer.zBuffer.push(this);
    this.exists = true;
};

Entity.prototype.remove = function(){
    this.exists = false;

    this.removeAllListeners('update');
    this.removeAllListeners('draw');

    this.findEntity(this, function(exists, entities, index) {
        if(exists) {
            entities.splice(index, 1);
        }
    });
};

Entity.prototype.findEntity = function(entity, callback){
    for(var i = 0; i < this.game.entities.length; i++) {
        if(this.game.entities[i] === entity) {
            callback(true, this.game.entities, i);
        }
    }
};
},{"events":1,"inherits":3}],14:[function(require,module,exports){
(function (global){
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var Input = require('./input.js');
var now = global.performance && global.performance.now ? function() {
    return performance.now()
} : Date.now || function () {
    return +new Date()
};

module.exports = Game;
inherits(Game, EventEmitter);

function Game(options) {
    this.setMaxListeners(0);
    console.log('Initializing game loop');
    this.step = options.step || 1000/60;
    this.lastUpdate = 0;
    this.dt = 0;
    this.ticks = 0;
    
    this.input = new Input();
    this.input.on('keydown',this.keydown.bind(this));
    this.input.on('keyup',this.keyup.bind(this));
    this.centerMouseX = 0;
    this.centerMouseY = 0;
    this.entities = [];

    var self = this;
    this.interval = setInterval(function(){
        if(self.crashed) return;
        self.dt += now() - self.lastUpdate;
        if(self.lastUpdate > 0 && self.dt > 60000) {
            console.log('too many updates missed! game crash...');
            self.crashed = true; self.paused = true;
        }
        if(self.dt > self.step) {
            while(self.dt >= self.step) {
                self.dt -= self.step; if(self.paused) { continue; } else { self.rendered = false; }
                self.ticks++; self.update();
            }
        }
        self.lastUpdate = now();
    },this.step);
}

Game.prototype.update = function() {
    this.emit('update',this.dt);
};

Game.prototype.bindCanvas = function(canvas) {
    this.input.bindCanvas(canvas);
    this.viewWidth = canvas.width;
    this.viewHeight = canvas.height;
    this.input.on('mousemove',this.mousemove.bind(this));
    this.input.on('mousedown',this.mousedown.bind(this));
    this.input.on('mouseup',this.mouseup.bind(this));
    canvas.on('resize',this.viewResize.bind(this));
};

Game.prototype.viewResize = function(resize) {
    this.viewWidth = resize.width;
    this.viewHeight = resize.height;
};

Game.prototype.mousemove = function(mouseEvent) {
    this.centerMouseX = Math.floor(mouseEvent.x - this.viewWidth / 2);
    this.centerMouseY = Math.floor(mouseEvent.y - this.viewHeight / 2);
    mouseEvent.centerMouseX = this.centerMouseX;
    mouseEvent.centerMouseY = this.centerMouseY;
    this.emit('mousemove',mouseEvent);
};

Game.prototype.mousedown = function(mouseEvent) {
    this.emit('mousedown',mouseEvent);
};

Game.prototype.mouseup = function(mouseEvent) {
    this.emit('mouseup',mouseEvent);
};

Game.prototype.keydown = function(keyEvent) {
    this.emit('keydown',keyEvent);
};

Game.prototype.keyup = function(keyEvent) {
    this.emit('keyup',keyEvent);
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./input.js":15,"events":1,"inherits":3}],15:[function(require,module,exports){
'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Input;
inherits(Input, EventEmitter);

function Input() {
    console.log('Initializing input');
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseLeft = false;
    this.mouseRight = false;
    this.keys = {};
    document.addEventListener('keydown', this.keydown.bind(this));
    document.addEventListener('keyup', this.keyup.bind(this));
}

Input.prototype.bindCanvas = function(canvas) {
    this.canvas = canvas.canvas; // Canvas element
    this.mouseScale = canvas.scale;
    this.canvas.addEventListener("mousemove", this.mousemove.bind(this));
    this.canvas.addEventListener("mousedown", this.mousedown.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseup.bind(this));
};

Input.prototype.mousemove = function(e) {
    this.mouseX = Math.floor(e.pageX / this.mouseScale);
    this.mouseY = Math.floor(e.pageY / this.mouseScale);
    this.emit('mousemove', { x: this.mouseX, y: this.mouseY });
};

var buttons = ['left','middle','right'];

Input.prototype.mousedown = function(e) {
    var button = buttons[e.button];
    switch(button) {
        case 'left': this.mouseLeft = true; break;
        case 'right': this.mouseRight = true; break;
    }
    this.emit('mousedown', { button: button, x: this.mouseX, y: this.mouseY });
};

Input.prototype.mouseup = function(e) {
    var button = buttons[e.button];
    switch(button) {
        case 'left': this.mouseLeft = false; break;
        case 'right': this.mouseRight = false; break;
    }
    this.emit('mouseup', { button: button, x: this.mouseX, y: this.mouseY });
};

Input.prototype.keydown = function(e) {
    var key = e.which >= 48 && e.which <= 90 ? 
        String.fromCharCode(parseInt(e.which)).toLowerCase() : keyCodes[e.which];
    if(this.keys[key]) return; // Ignore if key already held
    this.keys[key] = true;
    this.emit('keydown', { key: key });
};

Input.prototype.keyup = function(e) {
    var key = e.which >= 48 && e.which <= 90 ?
        String.fromCharCode(parseInt(e.which)).toLowerCase() : keyCodes[e.which];
    if(!this.keys[key]) return; // Ignore if key already up
    this.keys[key] = false;
    this.emit('keyup', { key: key });
};

var keyCodes = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "insert",
    46: "delete",
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "capslock",
    27: "escape",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    144: "numlock",
    145: "scrolllock",
    186: "semicolon",
    187: "equal",
    188: "comma",
    189: "dash",
    190: "period",
    191: "slash",
    192: "graveaccent",
    219: "openbracket",
    220: "backslash",
    221: "closebraket",
    222: "singlequote"
};
},{"events":1,"inherits":3}],16:[function(require,module,exports){
'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    console.log('Initializing renderer');
    this.game = options.game;
    this.updateDrawn = false;
    this.zBuffer = [];
    
    var self = this;
    this.game.on('update', function (interval) {
        self.updateDrawn = false;
        self.interval = interval;
    });
    
    var draw = function() {
        if(self.updateDrawn == false) {
            if(self.canvases) {
                for(var pivot = 0; pivot < self.zBuffer.length;) {
                    var new_pivot = false;
                    for(var i = pivot; i < self.zBuffer.length; ++i) {
                        var obj = self.zBuffer[i];
                        var parent = true;
                        for(var j = pivot; j < self.zBuffer.length; ++j) {
                            if(j == i) continue;
                            var obj2 = self.zBuffer[j];
                            if(obj2.isBehind(obj)) {
                                parent = false;
                                break;
                            }
                        }
                        if(parent) {
                            self.zBuffer[i] = self.zBuffer[pivot];
                            self.zBuffer[pivot] = obj;
                            ++pivot;
                            new_pivot = true;
                        }
                    }
                    if(!new_pivot) ++pivot;
                }
                for(var c = 0; c < self.canvases.length; c++) {
                    self.canvases[c].draw();
                    self.emit('draw', self.canvases[c]);
                    for(var z = 0; z < self.zBuffer.length; z++) {
                        self.zBuffer[z].emit('draw',self.canvases[c])
                    }
                }
            }
            self.updateDrawn = true;
        }
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
}

Renderer.prototype.addCanvas = function(canvas) {
    canvas.renderer = this;
    if(!this.canvases) this.canvases = [];
    this.canvases.push(canvas);
};
},{"events":1,"inherits":3,"raf":4}],17:[function(require,module,exports){
'use strict';

module.exports = SpriteSheet;

function SpriteSheet(imgPath,map) {
    this.map = map;
    this.img = new Image;
    var self = this;
    this.img.addEventListener('load', function() {
        self.loaded = true;
    });
    this.img.src = './img/'+imgPath;
}
},{}],18:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var Entity = require('./entity.js');
var Geometry = require('./../common/geometry.js');

module.exports = WorldObject;
inherits(WorldObject, Entity);

function WorldObject(options) {
    this.position = {
        x: options.position.x,
        y: options.position.y,
        z: options.position.z
    };
    this.size = {
        x: options.size.x,
        y: options.size.y,
        z: options.size.z
    };
    if(!options.velocity) options.velocity = { x: 0, y: 0, z: 0 };
    this.velocity = {
        x: options.velocity.x,
        y: options.velocity.y,
        z: options.velocity.z
    };
    this.on('update',function(interval) {
        this.move(this.velocity);
    });
}

WorldObject.prototype.stopped = function() {
    return this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0;
};

WorldObject.prototype.move = function(velocity) {
    if(velocity.x == 0 && velocity.y == 0 && velocity.z == 0) return;
    this.position.x += velocity.x;
    this.position.y += velocity.y;
    this.position.z += velocity.z;
    var blocked = false, objs = this.game.entities;
    for(var i = 0; i < objs.length; i++) {
        if(this === objs[i]) continue;
        if(this.overlaps(objs[i])) {
            this.position.x -= velocity.x;
            this.position.y -= velocity.y;
            this.position.z -= velocity.z;
            this.emit('collision');
            blocked = true;
            break;
        }
    }
    if(blocked) this.velocity = { x: 0, y: 0, z: 0 };
};

WorldObject.prototype.toScreen = function() {
    return {
        x: this.position.x - this.size.x / 2 - this.position.y - this.size.y / 2,
        y: (this.position.x - this.size.x / 2 + this.position.y - this.size.y / 2) / 2 - this.position.z - this.size.z
    };
};

WorldObject.prototype.overlaps = function(obj) {
    return Geometry.intervalOverlaps(
            this.position.x - this.size.x/2, this.position.x + this.size.x/2, 
            obj.position.x - obj.size.x/2, obj.position.x + obj.size.x/2
        ) && Geometry.intervalOverlaps(
            this.position.y - this.size.y/2, this.position.y + this.size.y/2, 
            obj.position.y - obj.size.y/2, obj.position.y + obj.size.y/2
        ) && Geometry.intervalOverlaps(
            this.position.z, this.position.z + this.size.z, 
            obj.position.z, obj.position.z + obj.size.z
        );
};

WorldObject.prototype.projectionOverlaps = function(obj) {
    var xa = this.position.x - this.size.x/2, ya = this.position.y - this.size.y/2, za = this.position.z, 
        xxa = xa + this.size.x, yya = ya + this.size.y, zza = za + this.size.z, 
        xb = obj.position.x - obj.size.x/2, yb = obj.position.y - obj.size.y/2, zb = obj.position.z, 
        xxb = xb + obj.size.x, yyb = yb + obj.size.y, zzb = zb + obj.size.z;
    return Geometry.intervalOverlaps(xa-yya, xxa-ya, xb-yyb, xxb-yb) 
        && Geometry.intervalOverlaps(xa-zza, xxa-za, xb-zzb, xxb-zb) 
        && Geometry.intervalOverlaps(-yya+za, -ya+zza, -yyb+zb, -yb+zzb);
};

WorldObject.prototype.isBehind = function(obj) {
    return this.projectionOverlaps(obj) && (
        this.position.x + this.size.x/2 <= obj.position.x - obj.size.x/2 || 
        this.position.y + this.size.y/2 <= obj.position.y - obj.size.y/2 || 
        this.position.z + this.size.z <= obj.position.z
        );
};

WorldObject.prototype.supports = function(obj) {
    return this.position.z + this.size.z == obj.position.z &&
        Geometry.intervalOverlaps(
            this.position.x - this.size.x/2, this.position.x + this.size.x/2, 
            obj.position.x - obj.size.x/2, obj.position.x + obj.size.x/2
        ) && Geometry.intervalOverlaps(
            this.position.y - this.size.y/2, this.position.y + this.size.y/2, 
            obj.position.y - obj.size.y/2, obj.position.y + obj.size.y/2
        );
};
},{"./../common/geometry.js":10,"./entity.js":13,"inherits":3}],19:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Block;
inherits(Block, WorldObject);

function Block(x,y,z) {
    var block = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:17}});
    this.object = block;
    block.sheet = new Sheet('block');
    block.getSprite = function() {
        return block.sheet.map;
    };
    block.on('draw',function(canvas) {
        canvas.drawImageIso(block);
    });
    return block;
}
},{"./../engine/worldobject.js":18,"./sheet.js":21,"inherits":3}],20:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = HalfBlock;
inherits(HalfBlock, WorldObject);

function HalfBlock(x,y,z) {
    var halfBlock = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:9}});
    this.object = halfBlock;
    halfBlock.sheet = new Sheet('halfBlock');
    halfBlock.getSprite = function() {
        return halfBlock.sheet.map;
    };
    halfBlock.on('draw',function(canvas) {
        canvas.drawImageIso(halfBlock);
    });
    return halfBlock;
}
},{"./../engine/worldobject.js":18,"./sheet.js":21,"inherits":3}],21:[function(require,module,exports){
'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {
    block: {
        x: 66, y: 0, width: 33, height: 34, offset: { x: -1, y: 0 }
    },
    halfBlock: {
        x: 33, y: 0, width: 33, height: 26, offset: { x: -1, y: 0 }
    },
    tile: {
        x: 0, y: 0, width: 33, height: 18, offset: { x: -1, y: 0 }
    }
};
var image = new SpriteSheet('environment.png',map);

module.exports = Sheet;

function Sheet(sprite) {
    this.image = image;
    this.map = map[sprite];
}
},{"./../engine/spritesheet.js":17}],22:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(x,y,z) {
    var tile = new WorldObject({position:{x:x,y:y,z:z},size:{x:16,y:16,z:1}});
    this.object = tile;
    tile.sheet = new Sheet('tile');
    tile.getSprite = function() {
        return tile.sheet.map;
    };
    tile.on('draw',function(canvas) {
        canvas.drawImageIso(tile);
    });
    return tile;
}
},{"./../engine/worldobject.js":18,"./sheet.js":21,"inherits":3}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1VzZXJzL0RldmluL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9Vc2Vycy9EZXZpbi9BcHBEYXRhL1JvYW1pbmcvbnBtL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi4uLy4uLy4uL1VzZXJzL0RldmluL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9yYWYvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmFmL25vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIndlYi9tYWluLmpzIiwid2ViL3NjcmlwdC9hY3RvcnMvYWN0b3IuanMiLCJ3ZWIvc2NyaXB0L2FjdG9ycy9iZWhhdmlvcnMvd2FuZGVyLmpzIiwid2ViL3NjcmlwdC9hY3RvcnMvc2hlZXQuanMiLCJ3ZWIvc2NyaXB0L2NvbW1vbi9nZW9tZXRyeS5qcyIsIndlYi9zY3JpcHQvY29tbW9uL3V0aWwuanMiLCJ3ZWIvc2NyaXB0L2VuZ2luZS9jYW52YXMuanMiLCJ3ZWIvc2NyaXB0L2VuZ2luZS9lbnRpdHkuanMiLCJ3ZWIvc2NyaXB0L2VuZ2luZS9nYW1lLmpzIiwid2ViL3NjcmlwdC9lbmdpbmUvaW5wdXQuanMiLCJ3ZWIvc2NyaXB0L2VuZ2luZS9yZW5kZXJlci5qcyIsIndlYi9zY3JpcHQvZW5naW5lL3Nwcml0ZXNoZWV0LmpzIiwid2ViL3NjcmlwdC9lbmdpbmUvd29ybGRvYmplY3QuanMiLCJ3ZWIvc2NyaXB0L2Vudmlyb25tZW50L2Jsb2NrLmpzIiwid2ViL3NjcmlwdC9lbnZpcm9ubWVudC9oYWxmYmxvY2suanMiLCJ3ZWIvc2NyaXB0L2Vudmlyb25tZW50L3NoZWV0LmpzIiwid2ViL3NjcmlwdC9lbnZpcm9ubWVudC90aWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsInZhciBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKVxuICAsIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8ge30gOiB3aW5kb3dcbiAgLCB2ZW5kb3JzID0gWydtb3onLCAnd2Via2l0J11cbiAgLCBzdWZmaXggPSAnQW5pbWF0aW9uRnJhbWUnXG4gICwgcmFmID0gZ2xvYmFsWydyZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBjYWYgPSBnbG9iYWxbJ2NhbmNlbCcgKyBzdWZmaXhdIHx8IGdsb2JhbFsnY2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG5cbmZvcih2YXIgaSA9IDA7IGkgPCB2ZW5kb3JzLmxlbmd0aCAmJiAhcmFmOyBpKyspIHtcbiAgcmFmID0gZ2xvYmFsW3ZlbmRvcnNbaV0gKyAnUmVxdWVzdCcgKyBzdWZmaXhdXG4gIGNhZiA9IGdsb2JhbFt2ZW5kb3JzW2ldICsgJ0NhbmNlbCcgKyBzdWZmaXhdXG4gICAgICB8fCBnbG9iYWxbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cbn1cblxuLy8gU29tZSB2ZXJzaW9ucyBvZiBGRiBoYXZlIHJBRiBidXQgbm90IGNBRlxuaWYoIXJhZiB8fCAhY2FmKSB7XG4gIHZhciBsYXN0ID0gMFxuICAgICwgaWQgPSAwXG4gICAgLCBxdWV1ZSA9IFtdXG4gICAgLCBmcmFtZUR1cmF0aW9uID0gMTAwMCAvIDYwXG5cbiAgcmFmID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZihxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBfbm93ID0gbm93KClcbiAgICAgICAgLCBuZXh0ID0gTWF0aC5tYXgoMCwgZnJhbWVEdXJhdGlvbiAtIChfbm93IC0gbGFzdCkpXG4gICAgICBsYXN0ID0gbmV4dCArIF9ub3dcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjcCA9IHF1ZXVlLnNsaWNlKDApXG4gICAgICAgIC8vIENsZWFyIHF1ZXVlIGhlcmUgdG8gcHJldmVudFxuICAgICAgICAvLyBjYWxsYmFja3MgZnJvbSBhcHBlbmRpbmcgbGlzdGVuZXJzXG4gICAgICAgIC8vIHRvIHRoZSBjdXJyZW50IGZyYW1lJ3MgcXVldWVcbiAgICAgICAgcXVldWUubGVuZ3RoID0gMFxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZighY3BbaV0uY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgIGNwW2ldLmNhbGxiYWNrKGxhc3QpXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZSB9LCAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgTWF0aC5yb3VuZChuZXh0KSlcbiAgICB9XG4gICAgcXVldWUucHVzaCh7XG4gICAgICBoYW5kbGU6ICsraWQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICBjYW5jZWxsZWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gaWRcbiAgfVxuXG4gIGNhZiA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYocXVldWVbaV0uaGFuZGxlID09PSBoYW5kbGUpIHtcbiAgICAgICAgcXVldWVbaV0uY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuKSB7XG4gIC8vIFdyYXAgaW4gYSBuZXcgZnVuY3Rpb24gdG8gcHJldmVudFxuICAvLyBgY2FuY2VsYCBwb3RlbnRpYWxseSBiZWluZyBhc3NpZ25lZFxuICAvLyB0byB0aGUgbmF0aXZlIHJBRiBmdW5jdGlvblxuICByZXR1cm4gcmFmLmNhbGwoZ2xvYmFsLCBmbilcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkoZ2xvYmFsLCBhcmd1bWVudHMpXG59XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNy4xXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXROYW5vU2Vjb25kcywgaHJ0aW1lLCBsb2FkVGltZTtcblxuICBpZiAoKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCkgJiYgcGVyZm9ybWFuY2Uubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICE9PSBudWxsKSAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKGdldE5hbm9TZWNvbmRzKCkgLSBsb2FkVGltZSkgLyAxZTY7XG4gICAgfTtcbiAgICBocnRpbWUgPSBwcm9jZXNzLmhydGltZTtcbiAgICBnZXROYW5vU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhyO1xuICAgICAgaHIgPSBocnRpbWUoKTtcbiAgICAgIHJldHVybiBoclswXSAqIDFlOSArIGhyWzFdO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBnZXROYW5vU2Vjb25kcygpO1xuICB9IGVsc2UgaWYgKERhdGUubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IERhdGUubm93KCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgR2FtZSA9IHJlcXVpcmUoJy4vc2NyaXB0L2VuZ2luZS9nYW1lLmpzJyk7XHJcbnZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4vc2NyaXB0L2VuZ2luZS9yZW5kZXJlci5qcycpO1xyXG52YXIgQ2FudmFzID0gcmVxdWlyZSgnLi9zY3JpcHQvZW5naW5lL2NhbnZhcy5qcycpO1xyXG5cclxudmFyIGdyaWRTaXplID0gMTY7XHJcbnZhciBnYW1lID0gbmV3IEdhbWUoeyBzdGVwOiAxMDAwIC8gNjAgfSk7XHJcbmdhbWUucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIoeyBnYW1lOiBnYW1lIH0pO1xyXG52YXIgY2FudmFzID0gbmV3IENhbnZhcyh7XHJcbiAgICBpZDogJ21haW4nLCBnYW1lOiBnYW1lLCBzY2FsZTogMywgYmFja2dyb3VuZENvbG9yOiAnIzE4MTIxMydcclxufSk7XHJcbmdhbWUucmVuZGVyZXIuYWRkQ2FudmFzKGNhbnZhcyk7XHJcbmdhbWUuYmluZENhbnZhcyhjYW52YXMpO1xyXG5cclxudmFyIFRpbGUgPSByZXF1aXJlKCcuL3NjcmlwdC9lbnZpcm9ubWVudC90aWxlLmpzJyk7XHJcbnZhciBCbG9jayA9IHJlcXVpcmUoJy4vc2NyaXB0L2Vudmlyb25tZW50L2Jsb2NrLmpzJyk7XHJcbnZhciBIYWxmQmxvY2sgPSByZXF1aXJlKCcuL3NjcmlwdC9lbnZpcm9ubWVudC9oYWxmYmxvY2suanMnKTtcclxudmFyIEFjdG9yID0gcmVxdWlyZSgnLi9zY3JpcHQvYWN0b3JzL2FjdG9yLmpzJyk7XHJcbi8vdmFyIGNlbnRlckJsb2NrID0gbmV3IEhhbGZCbG9jaygwLDAsMCk7XHJcbi8vY2VudGVyQmxvY2suYWRkVG9HYW1lKGdhbWUpO1xyXG4vL3ZhciBtb3VzZUJsb2NrID0gbmV3IEhhbGZCbG9jaygwLDAsMCk7XHJcbi8vbW91c2VCbG9jay5hZGRUb0dhbWUoZ2FtZSk7XHJcbi8vZ2FtZS5vbignbW91c2Vtb3ZlJyxmdW5jdGlvbihtb3VzZUV2ZW50KSB7XHJcbi8vICAgIHZhciBpc28gPSAoZnVuY3Rpb24oeCx5KSB7IFxyXG4vLyAgICAgICAgcmV0dXJuIHsgeDogeC8yICsgeSwgeTogeSAtIHgvMiB9O1xyXG4vLyAgICB9KShtb3VzZUV2ZW50LmNlbnRlck1vdXNlWCxtb3VzZUV2ZW50LmNlbnRlck1vdXNlWSk7XHJcbi8vICAgIG1vdXNlQmxvY2sucG9zaXRpb24ueCA9IGlzby54O1xyXG4vLyAgICBtb3VzZUJsb2NrLnBvc2l0aW9uLnkgPSBpc28ueTtcclxuLy99KTtcclxudmFyIHdvcmxkU2l6ZSA9IDE3O1xyXG5mb3IodmFyIHR4ID0gMDsgdHggPCB3b3JsZFNpemU7IHR4KyspIGZvcih2YXIgdHkgPSAwOyB0eSA8IHdvcmxkU2l6ZTsgdHkrKykge1xyXG4gICAgdmFyIHggPSB0eC0od29ybGRTaXplLTEpLzIsIHkgPSB0eS0od29ybGRTaXplLTEpLzI7XHJcbiAgICB2YXIgcmFkaXVzID0geCp4K3kqeTtcclxuICAgIGlmKHJhZGl1cyA+IDk3KSBjb250aW51ZTtcclxuICAgIHZhciBncmlkO1xyXG4gICAgaWYocmFkaXVzIDwgNjQgJiYgTWF0aC5yYW5kb20oKSA8ICg4MCAtIHJhZGl1cykvNzApIHtcclxuICAgICAgICBncmlkID0gbmV3IFRpbGUoeCpncmlkU2l6ZSx5KmdyaWRTaXplLDApO1xyXG4gICAgICAgIGlmKE1hdGgucmFuZG9tKCkgPCAwLjEpIHtcclxuICAgICAgICAgICAgdmFyIGFjdG9yID0gbmV3IEFjdG9yKHgqZ3JpZFNpemUseSpncmlkU2l6ZSxncmlkLnNpemUueik7XHJcbiAgICAgICAgICAgIGFjdG9yLmFkZFRvR2FtZShnYW1lKTtcclxuICAgICAgICAgICAgLy9hY3Rvci5lbWl0KCdpbXB1bHNlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBncmlkID0gTWF0aC5yYW5kb20oKSA8IChyYWRpdXMgLSA2NCkgLyAxNSA/IFxyXG4gICAgICAgICAgICBuZXcgQmxvY2soeCpncmlkU2l6ZSx5KmdyaWRTaXplLDApIDogbmV3IEhhbGZCbG9jayh4KmdyaWRTaXplLHkqZ3JpZFNpemUsMCk7XHJcbiAgICB9XHJcbiAgICBncmlkLmFkZFRvR2FtZShnYW1lKTtcclxufVxyXG5cclxuY29uc29sZS5sb2coJ0dhbWUgaW5pdGlhbGl6ZWQhJyk7XHJcblxyXG5nYW1lLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoaW50ZXJ2YWwpIHtcclxuICAgIC8vIFVwZGF0ZVxyXG59KTtcclxuXHJcbndpbmRvdy5wYXVzZSA9IGZ1bmN0aW9uKCkgeyBnYW1lLnBhdXNlZCA9IHRydWU7IH07XHJcbndpbmRvdy51bnBhdXNlID0gZnVuY3Rpb24oKSB7IGdhbWUucGF1c2VkID0gZmFsc2U7IH07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuLy4uL2NvbW1vbi9nZW9tZXRyeS5qcycpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vLi4vY29tbW9uL3V0aWwuanMnKTtcclxudmFyIFdvcmxkT2JqZWN0ID0gcmVxdWlyZSgnLi8uLi9lbmdpbmUvd29ybGRvYmplY3QuanMnKTtcclxudmFyIFNoZWV0ID0gcmVxdWlyZSgnLi9zaGVldC5qcycpO1xyXG52YXIgV2FuZGVyID0gcmVxdWlyZSgnLi9iZWhhdmlvcnMvd2FuZGVyLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjdG9yO1xyXG5pbmhlcml0cyhBY3RvciwgV29ybGRPYmplY3QpO1xyXG5cclxuZnVuY3Rpb24gQWN0b3IoeCx5LHopIHtcclxuICAgIHZhciBhY3RvciA9IG5ldyBXb3JsZE9iamVjdCh7cG9zaXRpb246e3g6eCx5Onksejp6fSxzaXplOnt4OjcseTo3LHo6OH19KTtcclxuICAgIHRoaXMub2JqZWN0ID0gYWN0b3I7XHJcbiAgICBhY3Rvci5zaGVldCA9IG5ldyBTaGVldCgnYWN0b3InKTtcclxuICAgIGFjdG9yLmdldFNwcml0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBhY3Rvci5zaGVldC5tYXBbYWN0b3IuZmFjaW5nXTtcclxuICAgIH07XHJcbiAgICBhY3Rvci5vbignZHJhdycsZnVuY3Rpb24oY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLmRyYXdJbWFnZUlzbyhhY3Rvcik7XHJcbiAgICB9KTtcclxuICAgIGFjdG9yLmZhY2luZyA9IHV0aWwucGlja0luT2JqZWN0KEdlb21ldHJ5LkRJUkVDVElPTlMpO1xyXG4gICAgYWN0b3IuYmVoYXZpb3JzID0gW25ldyBXYW5kZXIoYWN0b3IpXTtcclxuICAgIGZ1bmN0aW9uIG5ld0ltcHVsc2UoKSB7XHJcbiAgICAgICAgaWYoYWN0b3Iuc3RvcHBlZCgpKSBhY3Rvci5lbWl0KCdpbXB1bHNlJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChuZXdJbXB1bHNlLE1hdGgucmFuZG9tKCkgKiAzMDAwKTtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQobmV3SW1wdWxzZSxNYXRoLnJhbmRvbSgpICogMzAwMCk7XHJcbiAgICByZXR1cm4gYWN0b3I7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vLi4vLi4vY29tbW9uL2dlb21ldHJ5LmpzJyk7XHJcbnZhciB1dGlsID0gcmVxdWlyZSgnLi8uLi8uLi9jb21tb24vdXRpbC5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXYW5kZXI7XHJcblxyXG5mdW5jdGlvbiBXYW5kZXIoYWN0b3IpIHtcclxuICAgIHRoaXMuYWN0b3IgPSBhY3RvcjtcclxuICAgIHRoaXMuc3RhdGUgPSAnaWRsZSc7XHJcbiAgICBcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuYWN0b3Iub24oJ2ltcHVsc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZihzZWxmLnN0YXRlICE9ICdpZGxlJykgcmV0dXJuO1xyXG4gICAgICAgIGlmKCFzZWxmLmhlYWRpbmcpIHtcclxuICAgICAgICAgICAgc2VsZi5oZWFkaW5nID0gdXRpbC5waWNrSW5PYmplY3QoR2VvbWV0cnkuRElSRUNUSU9OUyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGYuYWN0b3IudmVsb2NpdHkgPSB7XHJcbiAgICAgICAgICAgIHg6IEdlb21ldHJ5LkRJUkVDVElPTlNbc2VsZi5oZWFkaW5nXS54LCB5OiBHZW9tZXRyeS5ESVJFQ1RJT05TW3NlbGYuaGVhZGluZ10ueSwgejogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2VsZi5hY3Rvci5mYWNpbmcgPSBzZWxmLmhlYWRpbmc7XHJcbiAgICAgICAgc2VsZi5zdGF0ZSA9ICdtb3ZpbmcnO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmFjdG9yLm9uKCdjb2xsaXNpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZihzZWxmLnN0YXRlID09ICdtb3ZpbmcnKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUgPSAnaWRsZSc7XHJcbiAgICAgICAgICAgIHNlbGYuaGVhZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgU3ByaXRlU2hlZXQgPSByZXF1aXJlKCcuLy4uL2VuZ2luZS9zcHJpdGVzaGVldC5qcycpO1xyXG5cclxudmFyIG1hcCA9IHtcclxuICAgIGFjdG9yOiB7XHJcbiAgICAgICAgbm9ydGg6IHsgeDogMjgsIHk6IDAsIHdpZHRoOiAxNCwgaGVpZ2h0OiAxNCB9LFxyXG4gICAgICAgIHNvdXRoOiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAxNCwgaGVpZ2h0OiAxNCB9LFxyXG4gICAgICAgIGVhc3Q6IHsgeDogMTQsIHk6IDAsIHdpZHRoOiAxNCwgaGVpZ2h0OiAxNCB9LFxyXG4gICAgICAgIHdlc3Q6IHsgeDogMjgsIHk6IDAsIHdpZHRoOiAxNCwgaGVpZ2h0OiAxNCB9XHJcbiAgICB9XHJcbn07XHJcbnZhciBpbWFnZSA9IG5ldyBTcHJpdGVTaGVldCgnYWN0b3JzLnBuZycsbWFwKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hlZXQ7XHJcblxyXG5mdW5jdGlvbiBTaGVldChzcHJpdGUpIHtcclxuICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcclxuICAgIHRoaXMubWFwID0gbWFwW3Nwcml0ZV07XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsLmpzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgRElSRUNUSU9OUzoge1xyXG4gICAgICAgIG5vcnRoOiB7IHg6IDAsIHk6IC0xIH0sXHJcbiAgICAgICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXHJcbiAgICAgICAgc291dGg6IHsgeDogMCwgeTogMSB9LFxyXG4gICAgICAgIHdlc3Q6IHsgeDogLTEsIHk6IDAgfVxyXG4gICAgfSxcclxuICAgIHJhbmRvbURpcmVjdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRElSRUNUSU9OU1t1dGlsLnBpY2tJbk9iamVjdCh0aGlzLkRJUkVDVElPTlMpXTtcclxuICAgIH0sXHJcbiAgICBpbnRlcnZhbE92ZXJsYXBzOiBmdW5jdGlvbihhMSxhMixiMSxiMikge1xyXG4gICAgICAgIHJldHVybiBhMSA+PSBiMSAmJiBhMSA8IGIyIHx8IGIxID49IGExICYmIGIxIDwgYTI7XHJcbiAgICB9XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJhbmRvbUludFJhbmdlOiBmdW5jdGlvbihtaW4sbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgrbWF4IC0gK21pbiArIDEpKSArICttaW4gO1xyXG4gICAgfSxcclxuICAgIHBpY2tJbkFycmF5OiBmdW5jdGlvbihhcnIpIHtcclxuICAgICAgICByZXR1cm4gYXJyW3RoaXMucmFuZG9tSW50UmFuZ2UoMCxhcnIubGVuZ3RoLTEpXTtcclxuICAgIH0sXHJcbiAgICBwaWNrSW5PYmplY3Q6IGZ1bmN0aW9uKG9iaikgeyAvLyBSZXR1cm4gcmFuZG9tIHByb3BlcnR5IG5hbWUgZnJvbSBvYmplY3RcclxuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHsgaWYob2JqLmhhc093blByb3BlcnR5KGtleSkpIGFycmF5LnB1c2goa2V5KTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tJbkFycmF5KGFycmF5KTtcclxuICAgIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcclxuaW5oZXJpdHMoQ2FudmFzLCBFdmVudEVtaXR0ZXIpO1xyXG5cclxuZnVuY3Rpb24gQ2FudmFzKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkO1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuc2NhbGUgPSBvcHRpb25zLnNjYWxlIHx8IDE7XHJcbiAgICB0aGlzLmF1dG9zaXplID0gIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dpZHRoJyk7XHJcbiAgICBpZih0aGlzLmF1dG9zaXplKSB7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gMDsgdGhpcy5yaWdodCA9IDA7IHRoaXMudG9wID0gMDsgdGhpcy5ib3R0b20gPSAwO1xyXG4gICAgICAgIHRoaXMub25SZXNpemUoKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJyx0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGggPSBvcHRpb25zLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgaWYob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmxlZnQgPSBvcHRpb25zLmxlZnQgKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSBpZihvcHRpb25zLmhhc093blByb3BlcnR5KCdyaWdodCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnJpZ2h0ID0gKG9wdGlvbnMucmlnaHQgKyBvcHRpb25zLndpZHRoKSArICdweCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3RvcCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnRvcCA9IG9wdGlvbnMudG9wICsgJ3B4JztcclxuICAgICAgICB9IGVsc2UgaWYob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnYm90dG9tJykpIHtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYm90dG9tID0gKG9wdGlvbnMuYm90dG9tICsgb3B0aW9ucy5oZWlnaHQpICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLnNjYWxlID4gMSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgdGhpcy5zY2FsZSArICcsICcgKyB0aGlzLnNjYWxlICsgJyknO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jb250ZXh0Lm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5jb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb25zLmJhY2tncm91bmRDb2xvcjtcclxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbkNhbnZhcy5wcm90b3R5cGUub25SZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIFRPRE86IFNjYWxlIGJhc2VkIG9uIHdvcmxkIHNpemVcclxuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgOTEwIHx8IHdpbmRvdy5pbm5lckhlaWdodCA8IDQ5MCkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgfSBlbHNlIGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgMTM1NSB8fCB3aW5kb3cuaW5uZXJIZWlnaHQgPCA3NDApIHtcclxuICAgICAgICB0aGlzLnNjYWxlID0gMjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IDM7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHRoaXMuc2NhbGUgKyAnLCAnICsgdGhpcy5zY2FsZSArICcpJztcclxuICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJXaWR0aCAvIHRoaXMuc2NhbGUpO1xyXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQgPSBNYXRoLmNlaWwod2luZG93LmlubmVySGVpZ2h0IC8gdGhpcy5zY2FsZSk7XHJcbiAgICB0aGlzLmVtaXQoJ3Jlc2l6ZScseyB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9KVxyXG59O1xyXG5cclxuQ2FudmFzLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG59O1xyXG5cclxuQ2FudmFzLnByb3RvdHlwZS5kcmF3SW1hZ2VJc28gPSBmdW5jdGlvbihvYmopIHtcclxuICAgIGlmKCFvYmouc2hlZXQgfHwgIW9iai5zaGVldC5pbWFnZS5sb2FkZWQpIHJldHVybjtcclxuICAgIHZhciBzY3JlZW4gPSBvYmoudG9TY3JlZW4oKSwgc3ByaXRlID0gb2JqLmdldFNwcml0ZSgpO1xyXG4gICAgaWYodGhpcy5hdXRvc2l6ZSkge1xyXG4gICAgICAgIHNjcmVlbi54ICs9IHRoaXMud2lkdGgvMjtcclxuICAgICAgICBzY3JlZW4ueSArPSB0aGlzLmhlaWdodC8yO1xyXG4gICAgfVxyXG4gICAgaWYoc3ByaXRlLm9mZnNldCkge1xyXG4gICAgICAgIHNjcmVlbi54ICs9IHNwcml0ZS5vZmZzZXQueDtcclxuICAgICAgICBzY3JlZW4ueSArPSBzcHJpdGUub2Zmc2V0Lnk7XHJcbiAgICB9XHJcbiAgICAvLyBUT0RPOiBMb2NrIGFsbCBzcHJpdGVzIHRvIDI6MSBncmlkIHRvIHByZXZlbnQgaml0dGVyeSBtb3ZlbWVudD9cclxuICAgIHRoaXMuY29udGV4dC5kcmF3SW1hZ2Uob2JqLnNoZWV0LmltYWdlLmltZyxzcHJpdGUueCxzcHJpdGUueSxzcHJpdGUud2lkdGgsc3ByaXRlLmhlaWdodCxcclxuICAgICAgICBNYXRoLnJvdW5kKHNjcmVlbi54KSxNYXRoLnJvdW5kKHNjcmVlbi55KSxzcHJpdGUud2lkdGgsc3ByaXRlLmhlaWdodCk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbmluaGVyaXRzKEVudGl0eSwgRXZlbnRFbWl0dGVyKTtcclxuXHJcbmZ1bmN0aW9uIEVudGl0eSgpIHtcclxuICAgIFxyXG59XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmFkZFRvR2FtZSA9IGZ1bmN0aW9uKGdhbWUpIHtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLmdhbWUuZW50aXRpZXMucHVzaCh0aGlzKTtcclxuICAgIGlmKCF0aGlzLmdhbWUuZmluZEVudGl0eSkgdGhpcy5nYW1lLmZpbmRFbnRpdHkgPSB0aGlzLmZpbmRFbnRpdHk7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmdhbWUub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKGludGVydmFsKSB7XHJcbiAgICAgICAgc2VsZi5lbWl0KCd1cGRhdGUnLCBpbnRlcnZhbCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZ2FtZS5yZW5kZXJlci56QnVmZmVyLnB1c2godGhpcyk7XHJcbiAgICB0aGlzLmV4aXN0cyA9IHRydWU7XHJcbn07XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmV4aXN0cyA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCd1cGRhdGUnKTtcclxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdkcmF3Jyk7XHJcblxyXG4gICAgdGhpcy5maW5kRW50aXR5KHRoaXMsIGZ1bmN0aW9uKGV4aXN0cywgZW50aXRpZXMsIGluZGV4KSB7XHJcbiAgICAgICAgaWYoZXhpc3RzKSB7XHJcbiAgICAgICAgICAgIGVudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLmZpbmRFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHksIGNhbGxiYWNrKXtcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmdhbWUuZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZih0aGlzLmdhbWUuZW50aXRpZXNbaV0gPT09IGVudGl0eSkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayh0cnVlLCB0aGlzLmdhbWUuZW50aXRpZXMsIGkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0LmpzJyk7XHJcbnZhciBub3cgPSBnbG9iYWwucGVyZm9ybWFuY2UgJiYgZ2xvYmFsLnBlcmZvcm1hbmNlLm5vdyA/IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHBlcmZvcm1hbmNlLm5vdygpXHJcbn0gOiBEYXRlLm5vdyB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gK25ldyBEYXRlKClcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuaW5oZXJpdHMoR2FtZSwgRXZlbnRFbWl0dGVyKTtcclxuXHJcbmZ1bmN0aW9uIEdhbWUob3B0aW9ucykge1xyXG4gICAgdGhpcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XHJcbiAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIGdhbWUgbG9vcCcpO1xyXG4gICAgdGhpcy5zdGVwID0gb3B0aW9ucy5zdGVwIHx8IDEwMDAvNjA7XHJcbiAgICB0aGlzLmxhc3RVcGRhdGUgPSAwO1xyXG4gICAgdGhpcy5kdCA9IDA7XHJcbiAgICB0aGlzLnRpY2tzID0gMDtcclxuICAgIFxyXG4gICAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dCgpO1xyXG4gICAgdGhpcy5pbnB1dC5vbigna2V5ZG93bicsdGhpcy5rZXlkb3duLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5pbnB1dC5vbigna2V5dXAnLHRoaXMua2V5dXAuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmNlbnRlck1vdXNlWCA9IDA7XHJcbiAgICB0aGlzLmNlbnRlck1vdXNlWSA9IDA7XHJcbiAgICB0aGlzLmVudGl0aWVzID0gW107XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoc2VsZi5jcmFzaGVkKSByZXR1cm47XHJcbiAgICAgICAgc2VsZi5kdCArPSBub3coKSAtIHNlbGYubGFzdFVwZGF0ZTtcclxuICAgICAgICBpZihzZWxmLmxhc3RVcGRhdGUgPiAwICYmIHNlbGYuZHQgPiA2MDAwMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9vIG1hbnkgdXBkYXRlcyBtaXNzZWQhIGdhbWUgY3Jhc2guLi4nKTtcclxuICAgICAgICAgICAgc2VsZi5jcmFzaGVkID0gdHJ1ZTsgc2VsZi5wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzZWxmLmR0ID4gc2VsZi5zdGVwKSB7XHJcbiAgICAgICAgICAgIHdoaWxlKHNlbGYuZHQgPj0gc2VsZi5zdGVwKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmR0IC09IHNlbGYuc3RlcDsgaWYoc2VsZi5wYXVzZWQpIHsgY29udGludWU7IH0gZWxzZSB7IHNlbGYucmVuZGVyZWQgPSBmYWxzZTsgfVxyXG4gICAgICAgICAgICAgICAgc2VsZi50aWNrcysrOyBzZWxmLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGYubGFzdFVwZGF0ZSA9IG5vdygpO1xyXG4gICAgfSx0aGlzLnN0ZXApO1xyXG59XHJcblxyXG5HYW1lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZW1pdCgndXBkYXRlJyx0aGlzLmR0KTtcclxufTtcclxuXHJcbkdhbWUucHJvdG90eXBlLmJpbmRDYW52YXMgPSBmdW5jdGlvbihjYW52YXMpIHtcclxuICAgIHRoaXMuaW5wdXQuYmluZENhbnZhcyhjYW52YXMpO1xyXG4gICAgdGhpcy52aWV3V2lkdGggPSBjYW52YXMud2lkdGg7XHJcbiAgICB0aGlzLnZpZXdIZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xyXG4gICAgdGhpcy5pbnB1dC5vbignbW91c2Vtb3ZlJyx0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuaW5wdXQub24oJ21vdXNlZG93bicsdGhpcy5tb3VzZWRvd24uYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmlucHV0Lm9uKCdtb3VzZXVwJyx0aGlzLm1vdXNldXAuYmluZCh0aGlzKSk7XHJcbiAgICBjYW52YXMub24oJ3Jlc2l6ZScsdGhpcy52aWV3UmVzaXplLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuR2FtZS5wcm90b3R5cGUudmlld1Jlc2l6ZSA9IGZ1bmN0aW9uKHJlc2l6ZSkge1xyXG4gICAgdGhpcy52aWV3V2lkdGggPSByZXNpemUud2lkdGg7XHJcbiAgICB0aGlzLnZpZXdIZWlnaHQgPSByZXNpemUuaGVpZ2h0O1xyXG59O1xyXG5cclxuR2FtZS5wcm90b3R5cGUubW91c2Vtb3ZlID0gZnVuY3Rpb24obW91c2VFdmVudCkge1xyXG4gICAgdGhpcy5jZW50ZXJNb3VzZVggPSBNYXRoLmZsb29yKG1vdXNlRXZlbnQueCAtIHRoaXMudmlld1dpZHRoIC8gMik7XHJcbiAgICB0aGlzLmNlbnRlck1vdXNlWSA9IE1hdGguZmxvb3IobW91c2VFdmVudC55IC0gdGhpcy52aWV3SGVpZ2h0IC8gMik7XHJcbiAgICBtb3VzZUV2ZW50LmNlbnRlck1vdXNlWCA9IHRoaXMuY2VudGVyTW91c2VYO1xyXG4gICAgbW91c2VFdmVudC5jZW50ZXJNb3VzZVkgPSB0aGlzLmNlbnRlck1vdXNlWTtcclxuICAgIHRoaXMuZW1pdCgnbW91c2Vtb3ZlJyxtb3VzZUV2ZW50KTtcclxufTtcclxuXHJcbkdhbWUucHJvdG90eXBlLm1vdXNlZG93biA9IGZ1bmN0aW9uKG1vdXNlRXZlbnQpIHtcclxuICAgIHRoaXMuZW1pdCgnbW91c2Vkb3duJyxtb3VzZUV2ZW50KTtcclxufTtcclxuXHJcbkdhbWUucHJvdG90eXBlLm1vdXNldXAgPSBmdW5jdGlvbihtb3VzZUV2ZW50KSB7XHJcbiAgICB0aGlzLmVtaXQoJ21vdXNldXAnLG1vdXNlRXZlbnQpO1xyXG59O1xyXG5cclxuR2FtZS5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uKGtleUV2ZW50KSB7XHJcbiAgICB0aGlzLmVtaXQoJ2tleWRvd24nLGtleUV2ZW50KTtcclxufTtcclxuXHJcbkdhbWUucHJvdG90eXBlLmtleXVwID0gZnVuY3Rpb24oa2V5RXZlbnQpIHtcclxuICAgIHRoaXMuZW1pdCgna2V5dXAnLGtleUV2ZW50KTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0O1xyXG5pbmhlcml0cyhJbnB1dCwgRXZlbnRFbWl0dGVyKTtcclxuXHJcbmZ1bmN0aW9uIElucHV0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ0luaXRpYWxpemluZyBpbnB1dCcpO1xyXG4gICAgdGhpcy5tb3VzZVggPSAwO1xyXG4gICAgdGhpcy5tb3VzZVkgPSAwO1xyXG4gICAgdGhpcy5tb3VzZUxlZnQgPSBmYWxzZTtcclxuICAgIHRoaXMubW91c2VSaWdodCA9IGZhbHNlO1xyXG4gICAgdGhpcy5rZXlzID0ge307XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5rZXlkb3duLmJpbmQodGhpcykpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleXVwLmJpbmQodGhpcykpO1xyXG59XHJcblxyXG5JbnB1dC5wcm90b3R5cGUuYmluZENhbnZhcyA9IGZ1bmN0aW9uKGNhbnZhcykge1xyXG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXMuY2FudmFzOyAvLyBDYW52YXMgZWxlbWVudFxyXG4gICAgdGhpcy5tb3VzZVNjYWxlID0gY2FudmFzLnNjYWxlO1xyXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5tb3VzZWRvd24uYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm1vdXNldXAuYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG5JbnB1dC5wcm90b3R5cGUubW91c2Vtb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5tb3VzZVggPSBNYXRoLmZsb29yKGUucGFnZVggLyB0aGlzLm1vdXNlU2NhbGUpO1xyXG4gICAgdGhpcy5tb3VzZVkgPSBNYXRoLmZsb29yKGUucGFnZVkgLyB0aGlzLm1vdXNlU2NhbGUpO1xyXG4gICAgdGhpcy5lbWl0KCdtb3VzZW1vdmUnLCB7IHg6IHRoaXMubW91c2VYLCB5OiB0aGlzLm1vdXNlWSB9KTtcclxufTtcclxuXHJcbnZhciBidXR0b25zID0gWydsZWZ0JywnbWlkZGxlJywncmlnaHQnXTtcclxuXHJcbklucHV0LnByb3RvdHlwZS5tb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgYnV0dG9uID0gYnV0dG9uc1tlLmJ1dHRvbl07XHJcbiAgICBzd2l0Y2goYnV0dG9uKSB7XHJcbiAgICAgICAgY2FzZSAnbGVmdCc6IHRoaXMubW91c2VMZWZ0ID0gdHJ1ZTsgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAncmlnaHQnOiB0aGlzLm1vdXNlUmlnaHQgPSB0cnVlOyBicmVhaztcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnbW91c2Vkb3duJywgeyBidXR0b246IGJ1dHRvbiwgeDogdGhpcy5tb3VzZVgsIHk6IHRoaXMubW91c2VZIH0pO1xyXG59O1xyXG5cclxuSW5wdXQucHJvdG90eXBlLm1vdXNldXAgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgYnV0dG9uID0gYnV0dG9uc1tlLmJ1dHRvbl07XHJcbiAgICBzd2l0Y2goYnV0dG9uKSB7XHJcbiAgICAgICAgY2FzZSAnbGVmdCc6IHRoaXMubW91c2VMZWZ0ID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3JpZ2h0JzogdGhpcy5tb3VzZVJpZ2h0ID0gZmFsc2U7IGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KCdtb3VzZXVwJywgeyBidXR0b246IGJ1dHRvbiwgeDogdGhpcy5tb3VzZVgsIHk6IHRoaXMubW91c2VZIH0pO1xyXG59O1xyXG5cclxuSW5wdXQucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIga2V5ID0gZS53aGljaCA+PSA0OCAmJiBlLndoaWNoIDw9IDkwID8gXHJcbiAgICAgICAgU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChlLndoaWNoKSkudG9Mb3dlckNhc2UoKSA6IGtleUNvZGVzW2Uud2hpY2hdO1xyXG4gICAgaWYodGhpcy5rZXlzW2tleV0pIHJldHVybjsgLy8gSWdub3JlIGlmIGtleSBhbHJlYWR5IGhlbGRcclxuICAgIHRoaXMua2V5c1trZXldID0gdHJ1ZTtcclxuICAgIHRoaXMuZW1pdCgna2V5ZG93bicsIHsga2V5OiBrZXkgfSk7XHJcbn07XHJcblxyXG5JbnB1dC5wcm90b3R5cGUua2V5dXAgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIga2V5ID0gZS53aGljaCA+PSA0OCAmJiBlLndoaWNoIDw9IDkwID9cclxuICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGUud2hpY2gpKS50b0xvd2VyQ2FzZSgpIDoga2V5Q29kZXNbZS53aGljaF07XHJcbiAgICBpZighdGhpcy5rZXlzW2tleV0pIHJldHVybjsgLy8gSWdub3JlIGlmIGtleSBhbHJlYWR5IHVwXHJcbiAgICB0aGlzLmtleXNba2V5XSA9IGZhbHNlO1xyXG4gICAgdGhpcy5lbWl0KCdrZXl1cCcsIHsga2V5OiBrZXkgfSk7XHJcbn07XHJcblxyXG52YXIga2V5Q29kZXMgPSB7XHJcbiAgICAzNzogXCJsZWZ0XCIsXHJcbiAgICAzODogXCJ1cFwiLFxyXG4gICAgMzk6IFwicmlnaHRcIixcclxuICAgIDQwOiBcImRvd25cIixcclxuICAgIDQ1OiBcImluc2VydFwiLFxyXG4gICAgNDY6IFwiZGVsZXRlXCIsXHJcbiAgICA4OiBcImJhY2tzcGFjZVwiLFxyXG4gICAgOTogXCJ0YWJcIixcclxuICAgIDEzOiBcImVudGVyXCIsXHJcbiAgICAxNjogXCJzaGlmdFwiLFxyXG4gICAgMTc6IFwiY3RybFwiLFxyXG4gICAgMTg6IFwiYWx0XCIsXHJcbiAgICAxOTogXCJwYXVzZVwiLFxyXG4gICAgMjA6IFwiY2Fwc2xvY2tcIixcclxuICAgIDI3OiBcImVzY2FwZVwiLFxyXG4gICAgMzI6IFwic3BhY2VcIixcclxuICAgIDMzOiBcInBhZ2V1cFwiLFxyXG4gICAgMzQ6IFwicGFnZWRvd25cIixcclxuICAgIDM1OiBcImVuZFwiLFxyXG4gICAgMzY6IFwiaG9tZVwiLFxyXG4gICAgMTEyOiBcImYxXCIsXHJcbiAgICAxMTM6IFwiZjJcIixcclxuICAgIDExNDogXCJmM1wiLFxyXG4gICAgMTE1OiBcImY0XCIsXHJcbiAgICAxMTY6IFwiZjVcIixcclxuICAgIDExNzogXCJmNlwiLFxyXG4gICAgMTE4OiBcImY3XCIsXHJcbiAgICAxMTk6IFwiZjhcIixcclxuICAgIDEyMDogXCJmOVwiLFxyXG4gICAgMTIxOiBcImYxMFwiLFxyXG4gICAgMTIyOiBcImYxMVwiLFxyXG4gICAgMTIzOiBcImYxMlwiLFxyXG4gICAgMTQ0OiBcIm51bWxvY2tcIixcclxuICAgIDE0NTogXCJzY3JvbGxsb2NrXCIsXHJcbiAgICAxODY6IFwic2VtaWNvbG9uXCIsXHJcbiAgICAxODc6IFwiZXF1YWxcIixcclxuICAgIDE4ODogXCJjb21tYVwiLFxyXG4gICAgMTg5OiBcImRhc2hcIixcclxuICAgIDE5MDogXCJwZXJpb2RcIixcclxuICAgIDE5MTogXCJzbGFzaFwiLFxyXG4gICAgMTkyOiBcImdyYXZlYWNjZW50XCIsXHJcbiAgICAyMTk6IFwib3BlbmJyYWNrZXRcIixcclxuICAgIDIyMDogXCJiYWNrc2xhc2hcIixcclxuICAgIDIyMTogXCJjbG9zZWJyYWtldFwiLFxyXG4gICAgMjIyOiBcInNpbmdsZXF1b3RlXCJcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XHJcbnZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1aXJlKCdyYWYnKTtcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXI7XHJcbmluaGVyaXRzKFJlbmRlcmVyLCBFdmVudEVtaXR0ZXIpO1xyXG5cclxuZnVuY3Rpb24gUmVuZGVyZXIob3B0aW9ucykge1xyXG4gICAgY29uc29sZS5sb2coJ0luaXRpYWxpemluZyByZW5kZXJlcicpO1xyXG4gICAgdGhpcy5nYW1lID0gb3B0aW9ucy5nYW1lO1xyXG4gICAgdGhpcy51cGRhdGVEcmF3biA9IGZhbHNlO1xyXG4gICAgdGhpcy56QnVmZmVyID0gW107XHJcbiAgICBcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuZ2FtZS5vbigndXBkYXRlJywgZnVuY3Rpb24gKGludGVydmFsKSB7XHJcbiAgICAgICAgc2VsZi51cGRhdGVEcmF3biA9IGZhbHNlO1xyXG4gICAgICAgIHNlbGYuaW50ZXJ2YWwgPSBpbnRlcnZhbDtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICB2YXIgZHJhdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmKHNlbGYudXBkYXRlRHJhd24gPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5jYW52YXNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBwaXZvdCA9IDA7IHBpdm90IDwgc2VsZi56QnVmZmVyLmxlbmd0aDspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3X3Bpdm90ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gcGl2b3Q7IGkgPCBzZWxmLnpCdWZmZXIubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IHNlbGYuekJ1ZmZlcltpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaiA9IHBpdm90OyBqIDwgc2VsZi56QnVmZmVyLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihqID09IGkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9iajIgPSBzZWxmLnpCdWZmZXJbal07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihvYmoyLmlzQmVoaW5kKG9iaikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuekJ1ZmZlcltpXSA9IHNlbGYuekJ1ZmZlcltwaXZvdF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnpCdWZmZXJbcGl2b3RdID0gb2JqO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKytwaXZvdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19waXZvdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIW5ld19waXZvdCkgKytwaXZvdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvcih2YXIgYyA9IDA7IGMgPCBzZWxmLmNhbnZhc2VzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYW52YXNlc1tjXS5kcmF3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbWl0KCdkcmF3Jywgc2VsZi5jYW52YXNlc1tjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciB6ID0gMDsgeiA8IHNlbGYuekJ1ZmZlci5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnpCdWZmZXJbel0uZW1pdCgnZHJhdycsc2VsZi5jYW52YXNlc1tjXSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi51cGRhdGVEcmF3biA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxuICAgIH07XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcbn1cclxuXHJcblJlbmRlcmVyLnByb3RvdHlwZS5hZGRDYW52YXMgPSBmdW5jdGlvbihjYW52YXMpIHtcclxuICAgIGNhbnZhcy5yZW5kZXJlciA9IHRoaXM7XHJcbiAgICBpZighdGhpcy5jYW52YXNlcykgdGhpcy5jYW52YXNlcyA9IFtdO1xyXG4gICAgdGhpcy5jYW52YXNlcy5wdXNoKGNhbnZhcyk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGVTaGVldDtcclxuXHJcbmZ1bmN0aW9uIFNwcml0ZVNoZWV0KGltZ1BhdGgsbWFwKSB7XHJcbiAgICB0aGlzLm1hcCA9IG1hcDtcclxuICAgIHRoaXMuaW1nID0gbmV3IEltYWdlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5pbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHNlbGYubG9hZGVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5pbWcuc3JjID0gJy4vaW1nLycraW1nUGF0aDtcclxufSIsIid1c2Ugc3RyaWN0JztcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxudmFyIEVudGl0eSA9IHJlcXVpcmUoJy4vZW50aXR5LmpzJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vLi4vY29tbW9uL2dlb21ldHJ5LmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkT2JqZWN0O1xyXG5pbmhlcml0cyhXb3JsZE9iamVjdCwgRW50aXR5KTtcclxuXHJcbmZ1bmN0aW9uIFdvcmxkT2JqZWN0KG9wdGlvbnMpIHtcclxuICAgIHRoaXMucG9zaXRpb24gPSB7XHJcbiAgICAgICAgeDogb3B0aW9ucy5wb3NpdGlvbi54LFxyXG4gICAgICAgIHk6IG9wdGlvbnMucG9zaXRpb24ueSxcclxuICAgICAgICB6OiBvcHRpb25zLnBvc2l0aW9uLnpcclxuICAgIH07XHJcbiAgICB0aGlzLnNpemUgPSB7XHJcbiAgICAgICAgeDogb3B0aW9ucy5zaXplLngsXHJcbiAgICAgICAgeTogb3B0aW9ucy5zaXplLnksXHJcbiAgICAgICAgejogb3B0aW9ucy5zaXplLnpcclxuICAgIH07XHJcbiAgICBpZighb3B0aW9ucy52ZWxvY2l0eSkgb3B0aW9ucy52ZWxvY2l0eSA9IHsgeDogMCwgeTogMCwgejogMCB9O1xyXG4gICAgdGhpcy52ZWxvY2l0eSA9IHtcclxuICAgICAgICB4OiBvcHRpb25zLnZlbG9jaXR5LngsXHJcbiAgICAgICAgeTogb3B0aW9ucy52ZWxvY2l0eS55LFxyXG4gICAgICAgIHo6IG9wdGlvbnMudmVsb2NpdHkuelxyXG4gICAgfTtcclxuICAgIHRoaXMub24oJ3VwZGF0ZScsZnVuY3Rpb24oaW50ZXJ2YWwpIHtcclxuICAgICAgICB0aGlzLm1vdmUodGhpcy52ZWxvY2l0eSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuV29ybGRPYmplY3QucHJvdG90eXBlLnN0b3BwZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnZlbG9jaXR5LnggPT0gMCAmJiB0aGlzLnZlbG9jaXR5LnkgPT0gMCAmJiB0aGlzLnZlbG9jaXR5LnogPT0gMDtcclxufTtcclxuXHJcbldvcmxkT2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24odmVsb2NpdHkpIHtcclxuICAgIGlmKHZlbG9jaXR5LnggPT0gMCAmJiB2ZWxvY2l0eS55ID09IDAgJiYgdmVsb2NpdHkueiA9PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLnBvc2l0aW9uLnggKz0gdmVsb2NpdHkueDtcclxuICAgIHRoaXMucG9zaXRpb24ueSArPSB2ZWxvY2l0eS55O1xyXG4gICAgdGhpcy5wb3NpdGlvbi56ICs9IHZlbG9jaXR5Lno7XHJcbiAgICB2YXIgYmxvY2tlZCA9IGZhbHNlLCBvYmpzID0gdGhpcy5nYW1lLmVudGl0aWVzO1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZih0aGlzID09PSBvYmpzW2ldKSBjb250aW51ZTtcclxuICAgICAgICBpZih0aGlzLm92ZXJsYXBzKG9ianNbaV0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCAtPSB2ZWxvY2l0eS54O1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgLT0gdmVsb2NpdHkueTtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi56IC09IHZlbG9jaXR5Lno7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY29sbGlzaW9uJyk7XHJcbiAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihibG9ja2VkKSB0aGlzLnZlbG9jaXR5ID0geyB4OiAwLCB5OiAwLCB6OiAwIH07XHJcbn07XHJcblxyXG5Xb3JsZE9iamVjdC5wcm90b3R5cGUudG9TY3JlZW4gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogdGhpcy5wb3NpdGlvbi54IC0gdGhpcy5zaXplLnggLyAyIC0gdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5zaXplLnkgLyAyLFxyXG4gICAgICAgIHk6ICh0aGlzLnBvc2l0aW9uLnggLSB0aGlzLnNpemUueCAvIDIgKyB0aGlzLnBvc2l0aW9uLnkgLSB0aGlzLnNpemUueSAvIDIpIC8gMiAtIHRoaXMucG9zaXRpb24ueiAtIHRoaXMuc2l6ZS56XHJcbiAgICB9O1xyXG59O1xyXG5cclxuV29ybGRPYmplY3QucHJvdG90eXBlLm92ZXJsYXBzID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICByZXR1cm4gR2VvbWV0cnkuaW50ZXJ2YWxPdmVybGFwcyhcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54IC0gdGhpcy5zaXplLngvMiwgdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5zaXplLngvMiwgXHJcbiAgICAgICAgICAgIG9iai5wb3NpdGlvbi54IC0gb2JqLnNpemUueC8yLCBvYmoucG9zaXRpb24ueCArIG9iai5zaXplLngvMlxyXG4gICAgICAgICkgJiYgR2VvbWV0cnkuaW50ZXJ2YWxPdmVybGFwcyhcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5zaXplLnkvMiwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5zaXplLnkvMiwgXHJcbiAgICAgICAgICAgIG9iai5wb3NpdGlvbi55IC0gb2JqLnNpemUueS8yLCBvYmoucG9zaXRpb24ueSArIG9iai5zaXplLnkvMlxyXG4gICAgICAgICkgJiYgR2VvbWV0cnkuaW50ZXJ2YWxPdmVybGFwcyhcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi56LCB0aGlzLnBvc2l0aW9uLnogKyB0aGlzLnNpemUueiwgXHJcbiAgICAgICAgICAgIG9iai5wb3NpdGlvbi56LCBvYmoucG9zaXRpb24ueiArIG9iai5zaXplLnpcclxuICAgICAgICApO1xyXG59O1xyXG5cclxuV29ybGRPYmplY3QucHJvdG90eXBlLnByb2plY3Rpb25PdmVybGFwcyA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgdmFyIHhhID0gdGhpcy5wb3NpdGlvbi54IC0gdGhpcy5zaXplLngvMiwgeWEgPSB0aGlzLnBvc2l0aW9uLnkgLSB0aGlzLnNpemUueS8yLCB6YSA9IHRoaXMucG9zaXRpb24ueiwgXHJcbiAgICAgICAgeHhhID0geGEgKyB0aGlzLnNpemUueCwgeXlhID0geWEgKyB0aGlzLnNpemUueSwgenphID0gemEgKyB0aGlzLnNpemUueiwgXHJcbiAgICAgICAgeGIgPSBvYmoucG9zaXRpb24ueCAtIG9iai5zaXplLngvMiwgeWIgPSBvYmoucG9zaXRpb24ueSAtIG9iai5zaXplLnkvMiwgemIgPSBvYmoucG9zaXRpb24ueiwgXHJcbiAgICAgICAgeHhiID0geGIgKyBvYmouc2l6ZS54LCB5eWIgPSB5YiArIG9iai5zaXplLnksIHp6YiA9IHpiICsgb2JqLnNpemUuejtcclxuICAgIHJldHVybiBHZW9tZXRyeS5pbnRlcnZhbE92ZXJsYXBzKHhhLXl5YSwgeHhhLXlhLCB4Yi15eWIsIHh4Yi15YikgXHJcbiAgICAgICAgJiYgR2VvbWV0cnkuaW50ZXJ2YWxPdmVybGFwcyh4YS16emEsIHh4YS16YSwgeGItenpiLCB4eGItemIpIFxyXG4gICAgICAgICYmIEdlb21ldHJ5LmludGVydmFsT3ZlcmxhcHMoLXl5YSt6YSwgLXlhK3p6YSwgLXl5Yit6YiwgLXliK3p6Yik7XHJcbn07XHJcblxyXG5Xb3JsZE9iamVjdC5wcm90b3R5cGUuaXNCZWhpbmQgPSBmdW5jdGlvbihvYmopIHtcclxuICAgIHJldHVybiB0aGlzLnByb2plY3Rpb25PdmVybGFwcyhvYmopICYmIChcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnNpemUueC8yIDw9IG9iai5wb3NpdGlvbi54IC0gb2JqLnNpemUueC8yIHx8IFxyXG4gICAgICAgIHRoaXMucG9zaXRpb24ueSArIHRoaXMuc2l6ZS55LzIgPD0gb2JqLnBvc2l0aW9uLnkgLSBvYmouc2l6ZS55LzIgfHwgXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi56ICsgdGhpcy5zaXplLnogPD0gb2JqLnBvc2l0aW9uLnpcclxuICAgICAgICApO1xyXG59O1xyXG5cclxuV29ybGRPYmplY3QucHJvdG90eXBlLnN1cHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi56ICsgdGhpcy5zaXplLnogPT0gb2JqLnBvc2l0aW9uLnogJiZcclxuICAgICAgICBHZW9tZXRyeS5pbnRlcnZhbE92ZXJsYXBzKFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnggLSB0aGlzLnNpemUueC8yLCB0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnNpemUueC8yLCBcclxuICAgICAgICAgICAgb2JqLnBvc2l0aW9uLnggLSBvYmouc2l6ZS54LzIsIG9iai5wb3NpdGlvbi54ICsgb2JqLnNpemUueC8yXHJcbiAgICAgICAgKSAmJiBHZW9tZXRyeS5pbnRlcnZhbE92ZXJsYXBzKFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgLSB0aGlzLnNpemUueS8yLCB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLnNpemUueS8yLCBcclxuICAgICAgICAgICAgb2JqLnBvc2l0aW9uLnkgLSBvYmouc2l6ZS55LzIsIG9iai5wb3NpdGlvbi55ICsgb2JqLnNpemUueS8yXHJcbiAgICAgICAgKTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcbnZhciBXb3JsZE9iamVjdCA9IHJlcXVpcmUoJy4vLi4vZW5naW5lL3dvcmxkb2JqZWN0LmpzJyk7XHJcbnZhciBTaGVldCA9IHJlcXVpcmUoJy4vc2hlZXQuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmxvY2s7XHJcbmluaGVyaXRzKEJsb2NrLCBXb3JsZE9iamVjdCk7XHJcblxyXG5mdW5jdGlvbiBCbG9jayh4LHkseikge1xyXG4gICAgdmFyIGJsb2NrID0gbmV3IFdvcmxkT2JqZWN0KHtwb3NpdGlvbjp7eDp4LHk6eSx6Onp9LHNpemU6e3g6MTYseToxNix6OjE3fX0pO1xyXG4gICAgdGhpcy5vYmplY3QgPSBibG9jaztcclxuICAgIGJsb2NrLnNoZWV0ID0gbmV3IFNoZWV0KCdibG9jaycpO1xyXG4gICAgYmxvY2suZ2V0U3ByaXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGJsb2NrLnNoZWV0Lm1hcDtcclxuICAgIH07XHJcbiAgICBibG9jay5vbignZHJhdycsZnVuY3Rpb24oY2FudmFzKSB7XHJcbiAgICAgICAgY2FudmFzLmRyYXdJbWFnZUlzbyhibG9jayk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBibG9jaztcclxufSIsIid1c2Ugc3RyaWN0JztcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxudmFyIFdvcmxkT2JqZWN0ID0gcmVxdWlyZSgnLi8uLi9lbmdpbmUvd29ybGRvYmplY3QuanMnKTtcclxudmFyIFNoZWV0ID0gcmVxdWlyZSgnLi9zaGVldC5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYWxmQmxvY2s7XHJcbmluaGVyaXRzKEhhbGZCbG9jaywgV29ybGRPYmplY3QpO1xyXG5cclxuZnVuY3Rpb24gSGFsZkJsb2NrKHgseSx6KSB7XHJcbiAgICB2YXIgaGFsZkJsb2NrID0gbmV3IFdvcmxkT2JqZWN0KHtwb3NpdGlvbjp7eDp4LHk6eSx6Onp9LHNpemU6e3g6MTYseToxNix6Ojl9fSk7XHJcbiAgICB0aGlzLm9iamVjdCA9IGhhbGZCbG9jaztcclxuICAgIGhhbGZCbG9jay5zaGVldCA9IG5ldyBTaGVldCgnaGFsZkJsb2NrJyk7XHJcbiAgICBoYWxmQmxvY2suZ2V0U3ByaXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGhhbGZCbG9jay5zaGVldC5tYXA7XHJcbiAgICB9O1xyXG4gICAgaGFsZkJsb2NrLm9uKCdkcmF3JyxmdW5jdGlvbihjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMuZHJhd0ltYWdlSXNvKGhhbGZCbG9jayk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBoYWxmQmxvY2s7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbnZhciBTcHJpdGVTaGVldCA9IHJlcXVpcmUoJy4vLi4vZW5naW5lL3Nwcml0ZXNoZWV0LmpzJyk7XHJcblxyXG52YXIgbWFwID0ge1xyXG4gICAgYmxvY2s6IHtcclxuICAgICAgICB4OiA2NiwgeTogMCwgd2lkdGg6IDMzLCBoZWlnaHQ6IDM0LCBvZmZzZXQ6IHsgeDogLTEsIHk6IDAgfVxyXG4gICAgfSxcclxuICAgIGhhbGZCbG9jazoge1xyXG4gICAgICAgIHg6IDMzLCB5OiAwLCB3aWR0aDogMzMsIGhlaWdodDogMjYsIG9mZnNldDogeyB4OiAtMSwgeTogMCB9XHJcbiAgICB9LFxyXG4gICAgdGlsZToge1xyXG4gICAgICAgIHg6IDAsIHk6IDAsIHdpZHRoOiAzMywgaGVpZ2h0OiAxOCwgb2Zmc2V0OiB7IHg6IC0xLCB5OiAwIH1cclxuICAgIH1cclxufTtcclxudmFyIGltYWdlID0gbmV3IFNwcml0ZVNoZWV0KCdlbnZpcm9ubWVudC5wbmcnLG1hcCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoZWV0O1xyXG5cclxuZnVuY3Rpb24gU2hlZXQoc3ByaXRlKSB7XHJcbiAgICB0aGlzLmltYWdlID0gaW1hZ2U7XHJcbiAgICB0aGlzLm1hcCA9IG1hcFtzcHJpdGVdO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgV29ybGRPYmplY3QgPSByZXF1aXJlKCcuLy4uL2VuZ2luZS93b3JsZG9iamVjdC5qcycpO1xyXG52YXIgU2hlZXQgPSByZXF1aXJlKCcuL3NoZWV0LmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbGU7XHJcbmluaGVyaXRzKFRpbGUsIFdvcmxkT2JqZWN0KTtcclxuXHJcbmZ1bmN0aW9uIFRpbGUoeCx5LHopIHtcclxuICAgIHZhciB0aWxlID0gbmV3IFdvcmxkT2JqZWN0KHtwb3NpdGlvbjp7eDp4LHk6eSx6Onp9LHNpemU6e3g6MTYseToxNix6OjF9fSk7XHJcbiAgICB0aGlzLm9iamVjdCA9IHRpbGU7XHJcbiAgICB0aWxlLnNoZWV0ID0gbmV3IFNoZWV0KCd0aWxlJyk7XHJcbiAgICB0aWxlLmdldFNwcml0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aWxlLnNoZWV0Lm1hcDtcclxuICAgIH07XHJcbiAgICB0aWxlLm9uKCdkcmF3JyxmdW5jdGlvbihjYW52YXMpIHtcclxuICAgICAgICBjYW52YXMuZHJhd0ltYWdlSXNvKHRpbGUpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGlsZTtcclxufSJdfQ==
