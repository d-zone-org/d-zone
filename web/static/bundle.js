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

var game = new Game({ step: 1000 / 60 });
game.renderer = new Renderer({ game: game, tileSize: 16 });
var canvas = new Canvas({
    id: 'main', game: game, scale: 3, backgroundColor: '#181213'
});
game.renderer.addCanvas(canvas);
game.bindCanvas(canvas);

var Tile = require('./script/environment/tile.js');
var HalfBlock = require('./script/environment/halfblock.js');
for(var tx = 0; tx < 15; tx++) for(var ty = 0; ty < 15; ty++) {
    var grid = Math.random() < 0.5 ? new Tile(tx-7,ty-7,0) : new HalfBlock(tx-7,ty-7,0);
    grid.addToGame(game);
}

console.log('Game initialized!');

game.on('update', function (interval) {
    // Update
});
},{"./script/engine/canvas.js":8,"./script/engine/game.js":10,"./script/engine/renderer.js":12,"./script/environment/halfblock.js":15,"./script/environment/tile.js":17}],7:[function(require,module,exports){
'use strict';

module.exports = Isometric;

function Isometric(size) {
    this.size = size;
    this.width = size;
    this.height = size/2;
}

Isometric.prototype.toScreen = function(coords) {
    return {
        x: (coords.x + coords.y) * this.width,
        y: (coords.y - coords.x) * this.height - coords.z
    };
};

Isometric.prototype.toIso = function(screen,height) {
    return {
        x: screen.x / this.width - (screen.y-height) / this.height,
        y: (screen.y-height) / this.height + screen.x / this.width
    };
};
},{}],8:[function(require,module,exports){
'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var Isometric = require('./../common/isometric.js');

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
    this.iso = new Isometric(options.game.renderer.tileSize);
}

Canvas.prototype.onResize = function() {
    // TODO: Scale based on world size
    if(window.innerWidth < 970 || window.innerHeight < 515) {
        this.scale = 1;
    } else if(window.innerWidth < 1450 || window.innerHeight < 770) {
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

Canvas.prototype.fillIso = function(x,y,z,w,h) {
    var screen = this.iso.toScreen({x:x,y:y,z:z});
    if(this.autosize) {
        screen.x += this.width/2;
        screen.y += this.height/2;
    }
    this.context.fillRect(Math.floor(screen.x),Math.floor(screen.y),w,h);
};

Canvas.prototype.drawImageIso = function(img,ix,iy,iw,ih,origin,dx,dy,dz) {
    var screen = this.iso.toScreen({x:dx,y:dy,z:dz});
    screen.x -= origin.x;
    screen.y -= origin.y;
    if(this.autosize) {
        screen.x += this.width/2;
        screen.y += this.height/2;
    }
    this.context.drawImage(img,ix,iy,iw,ih,Math.floor(screen.x),Math.floor(screen.y),iw,ih);
};
},{"./../common/isometric.js":7,"events":1,"inherits":3}],9:[function(require,module,exports){
'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity() {
    
}

Entity.prototype.addToGame = function(game) {
    this.game = game;
    if(!this.game.entities) {
        this.game.entities = [];
    }
    this.game.entities.push(this);
    if(!this.game.findEntity) this.game.findEntity = this.findEntity;
    var self = this;
    this.game.on('update', function(interval) {
        self.emit('update', interval);
    });
    this.game.renderer.addToZBuffer(this);
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

Entity.prototype.nearness = function() {
    return 10000;
};
},{"events":1,"inherits":3}],10:[function(require,module,exports){
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

},{"./input.js":11,"events":1,"inherits":3}],11:[function(require,module,exports){
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
},{"events":1,"inherits":3}],12:[function(require,module,exports){
'use strict';
var EventEmitter = require('events').EventEmitter;
var requestAnimationFrame = require('raf');
var inherits = require('inherits');

module.exports = Renderer;
inherits(Renderer, EventEmitter);

function Renderer(options) {
    console.log('Initializing renderer');
    this.game = options.game;
    this.tileSize = options.tileSize;
    this.updateDrawn = false;
    
    var self = this;
    this.game.on('update', function (interval) {
        self.updateDrawn = false;
        self.interval = interval;
    });
    
    this.zBuffer = [];
    
    // TODO: Implement z-buffer
    // Array sorted by nearness of WorldObject
    // Updated whenever an object's position is updated
    // Use splicing to move objects to a new position in the array rather than rebuilding the whole thing
    // Should only require one loop of the array, until 2 positions are found:
    //   1. Current position of the object
    //   2. New position based on neighboring nearness values
    
    var draw = function() {
        if(self.updateDrawn == false) {
            if(self.canvases) {
                for(var i = 0; i < self.canvases.length; i++) {
                    self.canvases[i].draw();
                    self.emit('draw', self.canvases[i]);
                    for(var j = 0; j < self.zBuffer.length; j++) {
                        self.zBuffer[j].emit('draw',self.canvases[i])
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

Renderer.prototype.addToZBuffer = function(entity) {
    var nearness = entity.nearness();
    // If zBuffer is empty or nearness matches/exceeds highest, add it to the end
    if(this.zBuffer.length == 0 || nearness >= this.zBuffer[this.zBuffer.length-1].nearness()) { 
        this.zBuffer.push(entity);
        return;
    }
    for(var i = 0; i < this.zBuffer.length; i++) {
        if(nearness <= this.zBuffer[i].nearness()) {
            this.zBuffer.splice(i,0,entity);
            return;
        }
    }
    console.error('could not find spot in zBuffer!');
};

Renderer.prototype.updateZBuffer = function(entity) {
    var oldIndex, newIndex = this.zBuffer.length-1;
    var oldIndexFound, newIndexFound;
    var nearness = entity.nearness();
    for(var i = 0; i < this.zBuffer.length; i++) {
        var thisNearness = this.zBuffer[i].nearness();
        if(!oldIndexFound && this.zBuffer[i] === entity) {
            oldIndex = i;
            oldIndexFound = true;
            if(newIndexFound) break;
        }
        if(nearness <= thisNearness) {
            newIndex = i;
            newIndexFound = true;
            if(oldIndexFound) break;
        }
    }
    
    if(oldIndexFound) {
        if(oldIndex != newIndex) this.zBuffer.splice(newIndex, 0, this.zBuffer.splice(oldIndex,1)[0]);
    } else { // If entity not in zBuffer, add it
        this.addToZBuffer(entity);
    }
};
},{"events":1,"inherits":3,"raf":4}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var Entity = require('./entity.js');

module.exports = WorldObject;
inherits(WorldObject, Entity);

function WorldObject(options) {
    this.position = {
        x: options.position.x,
        y: options.position.y,
        z: options.position.z
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

WorldObject.prototype.move = function(velocity) {
    if(velocity.x == 0 && velocity.y == 0 && velocity.z == 0) return;
    var oldNearness = this.nearness();
    this.position.x += velocity.x;
    this.position.y += velocity.y;
    this.position.z += velocity.z;
    if(oldNearness == this.nearness()) return; // Don't update zBuffer if nearness unchanged
    this.game.renderer.updateZBuffer(this);
};

WorldObject.prototype.nearness = function() {
    return this.position.y - this.position.x + this.position.z;
};
},{"./entity.js":9,"inherits":3}],15:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

var spriteX = 33;
var spriteY = 0;
var spriteWidth = 33;
var spriteHeight = 25;
var sheet = new Sheet({
    halfblock: { x: spriteX, y: spriteY, width: spriteWidth, height: spriteHeight }
});
var origin = { x: 17, y: 15 };

module.exports = HalfBlock;
inherits(HalfBlock, WorldObject);

function HalfBlock(x,y,z) {
    var tile = new WorldObject({position:{x:x,y:y,z:z}});
    tile.on('draw',function(canvas) {
        if(!sheet.sprite.loaded) return;
        canvas.drawImageIso(sheet.sprite.img,spriteX,spriteY,spriteWidth,spriteHeight,origin,
            tile.position.x,tile.position.y,tile.position.z);
    });
    return tile;
}
},{"./../engine/worldobject.js":14,"./sheet.js":16,"inherits":3}],16:[function(require,module,exports){
'use strict';
var SpriteSheet = require('./../engine/spritesheet.js');

var map = {};
var sprite = new SpriteSheet('environment.png',map);

module.exports = Sheet;

function Sheet(newMap) {
    for(var key in newMap) { if(!newMap.hasOwnProperty(key)) continue;
        map[key] = newMap[key];
    }
    this.sprite = sprite;
    this.map = map;
}
},{"./../engine/spritesheet.js":13}],17:[function(require,module,exports){
'use strict';
var inherits = require('inherits');
var WorldObject = require('./../engine/worldobject.js');
var Sheet = require('./sheet.js');

var spriteX = 0;
var spriteY = 0;
var spriteWidth = 33;
var spriteHeight = 18;
var sheet = new Sheet({
    tile: { x: spriteX, y: spriteY, width: spriteWidth, height: spriteHeight }
});
var origin = { x: 17, y: 8 };

module.exports = Tile;
inherits(Tile, WorldObject);

function Tile(x,y,z) {
    var tile = new WorldObject({position:{x:x,y:y,z:z}});
    tile.on('draw',function(canvas) {
        if(!sheet.sprite.loaded) return;
        canvas.drawImageIso(sheet.sprite.img,spriteX,spriteY,spriteWidth,spriteHeight,origin,
            tile.position.x,tile.position.y,tile.position.z);
    });
    return tile;
}
},{"./../engine/worldobject.js":14,"./sheet.js":16,"inherits":3}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1VzZXJzL0RldmluL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9Vc2Vycy9EZXZpbi9BcHBEYXRhL1JvYW1pbmcvbnBtL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIi4uLy4uLy4uL1VzZXJzL0RldmluL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9yYWYvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmFmL25vZGVfbW9kdWxlcy9wZXJmb3JtYW5jZS1ub3cvbGliL3BlcmZvcm1hbmNlLW5vdy5qcyIsIndlYi9tYWluLmpzIiwid2ViL3NjcmlwdC9jb21tb24vaXNvbWV0cmljLmpzIiwid2ViL3NjcmlwdC9lbmdpbmUvY2FudmFzLmpzIiwid2ViL3NjcmlwdC9lbmdpbmUvZW50aXR5LmpzIiwid2ViL3NjcmlwdC9lbmdpbmUvZ2FtZS5qcyIsIndlYi9zY3JpcHQvZW5naW5lL2lucHV0LmpzIiwid2ViL3NjcmlwdC9lbmdpbmUvcmVuZGVyZXIuanMiLCJ3ZWIvc2NyaXB0L2VuZ2luZS9zcHJpdGVzaGVldC5qcyIsIndlYi9zY3JpcHQvZW5naW5lL3dvcmxkb2JqZWN0LmpzIiwid2ViL3NjcmlwdC9lbnZpcm9ubWVudC9oYWxmYmxvY2suanMiLCJ3ZWIvc2NyaXB0L2Vudmlyb25tZW50L3NoZWV0LmpzIiwid2ViL3NjcmlwdC9lbnZpcm9ubWVudC90aWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsInZhciBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKVxuICAsIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8ge30gOiB3aW5kb3dcbiAgLCB2ZW5kb3JzID0gWydtb3onLCAnd2Via2l0J11cbiAgLCBzdWZmaXggPSAnQW5pbWF0aW9uRnJhbWUnXG4gICwgcmFmID0gZ2xvYmFsWydyZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBjYWYgPSBnbG9iYWxbJ2NhbmNlbCcgKyBzdWZmaXhdIHx8IGdsb2JhbFsnY2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG5cbmZvcih2YXIgaSA9IDA7IGkgPCB2ZW5kb3JzLmxlbmd0aCAmJiAhcmFmOyBpKyspIHtcbiAgcmFmID0gZ2xvYmFsW3ZlbmRvcnNbaV0gKyAnUmVxdWVzdCcgKyBzdWZmaXhdXG4gIGNhZiA9IGdsb2JhbFt2ZW5kb3JzW2ldICsgJ0NhbmNlbCcgKyBzdWZmaXhdXG4gICAgICB8fCBnbG9iYWxbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cbn1cblxuLy8gU29tZSB2ZXJzaW9ucyBvZiBGRiBoYXZlIHJBRiBidXQgbm90IGNBRlxuaWYoIXJhZiB8fCAhY2FmKSB7XG4gIHZhciBsYXN0ID0gMFxuICAgICwgaWQgPSAwXG4gICAgLCBxdWV1ZSA9IFtdXG4gICAgLCBmcmFtZUR1cmF0aW9uID0gMTAwMCAvIDYwXG5cbiAgcmFmID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZihxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBfbm93ID0gbm93KClcbiAgICAgICAgLCBuZXh0ID0gTWF0aC5tYXgoMCwgZnJhbWVEdXJhdGlvbiAtIChfbm93IC0gbGFzdCkpXG4gICAgICBsYXN0ID0gbmV4dCArIF9ub3dcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjcCA9IHF1ZXVlLnNsaWNlKDApXG4gICAgICAgIC8vIENsZWFyIHF1ZXVlIGhlcmUgdG8gcHJldmVudFxuICAgICAgICAvLyBjYWxsYmFja3MgZnJvbSBhcHBlbmRpbmcgbGlzdGVuZXJzXG4gICAgICAgIC8vIHRvIHRoZSBjdXJyZW50IGZyYW1lJ3MgcXVldWVcbiAgICAgICAgcXVldWUubGVuZ3RoID0gMFxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZighY3BbaV0uY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgIGNwW2ldLmNhbGxiYWNrKGxhc3QpXG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZSB9LCAwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgTWF0aC5yb3VuZChuZXh0KSlcbiAgICB9XG4gICAgcXVldWUucHVzaCh7XG4gICAgICBoYW5kbGU6ICsraWQsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICBjYW5jZWxsZWQ6IGZhbHNlXG4gICAgfSlcbiAgICByZXR1cm4gaWRcbiAgfVxuXG4gIGNhZiA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYocXVldWVbaV0uaGFuZGxlID09PSBoYW5kbGUpIHtcbiAgICAgICAgcXVldWVbaV0uY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuKSB7XG4gIC8vIFdyYXAgaW4gYSBuZXcgZnVuY3Rpb24gdG8gcHJldmVudFxuICAvLyBgY2FuY2VsYCBwb3RlbnRpYWxseSBiZWluZyBhc3NpZ25lZFxuICAvLyB0byB0aGUgbmF0aXZlIHJBRiBmdW5jdGlvblxuICByZXR1cm4gcmFmLmNhbGwoZ2xvYmFsLCBmbilcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkoZ2xvYmFsLCBhcmd1bWVudHMpXG59XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNy4xXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXROYW5vU2Vjb25kcywgaHJ0aW1lLCBsb2FkVGltZTtcblxuICBpZiAoKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCkgJiYgcGVyZm9ybWFuY2Uubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICE9PSBudWxsKSAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKGdldE5hbm9TZWNvbmRzKCkgLSBsb2FkVGltZSkgLyAxZTY7XG4gICAgfTtcbiAgICBocnRpbWUgPSBwcm9jZXNzLmhydGltZTtcbiAgICBnZXROYW5vU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhyO1xuICAgICAgaHIgPSBocnRpbWUoKTtcbiAgICAgIHJldHVybiBoclswXSAqIDFlOSArIGhyWzFdO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBnZXROYW5vU2Vjb25kcygpO1xuICB9IGVsc2UgaWYgKERhdGUubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IERhdGUubm93KCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgR2FtZSA9IHJlcXVpcmUoJy4vc2NyaXB0L2VuZ2luZS9nYW1lLmpzJyk7XHJcbnZhciBSZW5kZXJlciA9IHJlcXVpcmUoJy4vc2NyaXB0L2VuZ2luZS9yZW5kZXJlci5qcycpO1xyXG52YXIgQ2FudmFzID0gcmVxdWlyZSgnLi9zY3JpcHQvZW5naW5lL2NhbnZhcy5qcycpO1xyXG5cclxudmFyIGdhbWUgPSBuZXcgR2FtZSh7IHN0ZXA6IDEwMDAgLyA2MCB9KTtcclxuZ2FtZS5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih7IGdhbWU6IGdhbWUsIHRpbGVTaXplOiAxNiB9KTtcclxudmFyIGNhbnZhcyA9IG5ldyBDYW52YXMoe1xyXG4gICAgaWQ6ICdtYWluJywgZ2FtZTogZ2FtZSwgc2NhbGU6IDMsIGJhY2tncm91bmRDb2xvcjogJyMxODEyMTMnXHJcbn0pO1xyXG5nYW1lLnJlbmRlcmVyLmFkZENhbnZhcyhjYW52YXMpO1xyXG5nYW1lLmJpbmRDYW52YXMoY2FudmFzKTtcclxuXHJcbnZhciBUaWxlID0gcmVxdWlyZSgnLi9zY3JpcHQvZW52aXJvbm1lbnQvdGlsZS5qcycpO1xyXG52YXIgSGFsZkJsb2NrID0gcmVxdWlyZSgnLi9zY3JpcHQvZW52aXJvbm1lbnQvaGFsZmJsb2NrLmpzJyk7XHJcbmZvcih2YXIgdHggPSAwOyB0eCA8IDE1OyB0eCsrKSBmb3IodmFyIHR5ID0gMDsgdHkgPCAxNTsgdHkrKykge1xyXG4gICAgdmFyIGdyaWQgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gbmV3IFRpbGUodHgtNyx0eS03LDApIDogbmV3IEhhbGZCbG9jayh0eC03LHR5LTcsMCk7XHJcbiAgICBncmlkLmFkZFRvR2FtZShnYW1lKTtcclxufVxyXG5cclxuY29uc29sZS5sb2coJ0dhbWUgaW5pdGlhbGl6ZWQhJyk7XHJcblxyXG5nYW1lLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoaW50ZXJ2YWwpIHtcclxuICAgIC8vIFVwZGF0ZVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElzb21ldHJpYztcclxuXHJcbmZ1bmN0aW9uIElzb21ldHJpYyhzaXplKSB7XHJcbiAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgdGhpcy53aWR0aCA9IHNpemU7XHJcbiAgICB0aGlzLmhlaWdodCA9IHNpemUvMjtcclxufVxyXG5cclxuSXNvbWV0cmljLnByb3RvdHlwZS50b1NjcmVlbiA9IGZ1bmN0aW9uKGNvb3Jkcykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiAoY29vcmRzLnggKyBjb29yZHMueSkgKiB0aGlzLndpZHRoLFxyXG4gICAgICAgIHk6IChjb29yZHMueSAtIGNvb3Jkcy54KSAqIHRoaXMuaGVpZ2h0IC0gY29vcmRzLnpcclxuICAgIH07XHJcbn07XHJcblxyXG5Jc29tZXRyaWMucHJvdG90eXBlLnRvSXNvID0gZnVuY3Rpb24oc2NyZWVuLGhlaWdodCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBzY3JlZW4ueCAvIHRoaXMud2lkdGggLSAoc2NyZWVuLnktaGVpZ2h0KSAvIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgIHk6IChzY3JlZW4ueS1oZWlnaHQpIC8gdGhpcy5oZWlnaHQgKyBzY3JlZW4ueCAvIHRoaXMud2lkdGhcclxuICAgIH07XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgSXNvbWV0cmljID0gcmVxdWlyZSgnLi8uLi9jb21tb24vaXNvbWV0cmljLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhcztcclxuaW5oZXJpdHMoQ2FudmFzLCBFdmVudEVtaXR0ZXIpO1xyXG5cclxuZnVuY3Rpb24gQ2FudmFzKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkO1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuc2NhbGUgPSBvcHRpb25zLnNjYWxlIHx8IDE7XHJcbiAgICB0aGlzLmF1dG9zaXplID0gIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dpZHRoJyk7XHJcbiAgICBpZih0aGlzLmF1dG9zaXplKSB7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gMDsgdGhpcy5yaWdodCA9IDA7IHRoaXMudG9wID0gMDsgdGhpcy5ib3R0b20gPSAwO1xyXG4gICAgICAgIHRoaXMub25SZXNpemUoKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJyx0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGggPSBvcHRpb25zLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XHJcbiAgICAgICAgaWYob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmxlZnQgPSBvcHRpb25zLmxlZnQgKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSBpZihvcHRpb25zLmhhc093blByb3BlcnR5KCdyaWdodCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnJpZ2h0ID0gKG9wdGlvbnMucmlnaHQgKyBvcHRpb25zLndpZHRoKSArICdweCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3RvcCcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnRvcCA9IG9wdGlvbnMudG9wICsgJ3B4JztcclxuICAgICAgICB9IGVsc2UgaWYob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnYm90dG9tJykpIHtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYm90dG9tID0gKG9wdGlvbnMuYm90dG9tICsgb3B0aW9ucy5oZWlnaHQpICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLnNjYWxlID4gMSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgdGhpcy5zY2FsZSArICcsICcgKyB0aGlzLnNjYWxlICsgJyknO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jb250ZXh0Lm1vekltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5jb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb25zLmJhY2tncm91bmRDb2xvcjtcclxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmlzbyA9IG5ldyBJc29tZXRyaWMob3B0aW9ucy5nYW1lLnJlbmRlcmVyLnRpbGVTaXplKTtcclxufVxyXG5cclxuQ2FudmFzLnByb3RvdHlwZS5vblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gVE9ETzogU2NhbGUgYmFzZWQgb24gd29ybGQgc2l6ZVxyXG4gICAgaWYod2luZG93LmlubmVyV2lkdGggPCA5NzAgfHwgd2luZG93LmlubmVySGVpZ2h0IDwgNTE1KSB7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IDE7XHJcbiAgICB9IGVsc2UgaWYod2luZG93LmlubmVyV2lkdGggPCAxNDUwIHx8IHdpbmRvdy5pbm5lckhlaWdodCA8IDc3MCkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNjYWxlID0gMztcclxuICAgIH1cclxuICAgIHRoaXMuY2FudmFzLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgdGhpcy5zY2FsZSArICcsICcgKyB0aGlzLnNjYWxlICsgJyknO1xyXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoID0gTWF0aC5jZWlsKHdpbmRvdy5pbm5lcldpZHRoIC8gdGhpcy5zY2FsZSk7XHJcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodCA9IE1hdGguY2VpbCh3aW5kb3cuaW5uZXJIZWlnaHQgLyB0aGlzLnNjYWxlKTtcclxuICAgIHRoaXMuZW1pdCgncmVzaXplJyx7IHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0IH0pXHJcbn07XHJcblxyXG5DYW52YXMucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbn07XHJcblxyXG5DYW52YXMucHJvdG90eXBlLmZpbGxJc28gPSBmdW5jdGlvbih4LHkseix3LGgpIHtcclxuICAgIHZhciBzY3JlZW4gPSB0aGlzLmlzby50b1NjcmVlbih7eDp4LHk6eSx6Onp9KTtcclxuICAgIGlmKHRoaXMuYXV0b3NpemUpIHtcclxuICAgICAgICBzY3JlZW4ueCArPSB0aGlzLndpZHRoLzI7XHJcbiAgICAgICAgc2NyZWVuLnkgKz0gdGhpcy5oZWlnaHQvMjtcclxuICAgIH1cclxuICAgIHRoaXMuY29udGV4dC5maWxsUmVjdChNYXRoLmZsb29yKHNjcmVlbi54KSxNYXRoLmZsb29yKHNjcmVlbi55KSx3LGgpO1xyXG59O1xyXG5cclxuQ2FudmFzLnByb3RvdHlwZS5kcmF3SW1hZ2VJc28gPSBmdW5jdGlvbihpbWcsaXgsaXksaXcsaWgsb3JpZ2luLGR4LGR5LGR6KSB7XHJcbiAgICB2YXIgc2NyZWVuID0gdGhpcy5pc28udG9TY3JlZW4oe3g6ZHgseTpkeSx6OmR6fSk7XHJcbiAgICBzY3JlZW4ueCAtPSBvcmlnaW4ueDtcclxuICAgIHNjcmVlbi55IC09IG9yaWdpbi55O1xyXG4gICAgaWYodGhpcy5hdXRvc2l6ZSkge1xyXG4gICAgICAgIHNjcmVlbi54ICs9IHRoaXMud2lkdGgvMjtcclxuICAgICAgICBzY3JlZW4ueSArPSB0aGlzLmhlaWdodC8yO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZShpbWcsaXgsaXksaXcsaWgsTWF0aC5mbG9vcihzY3JlZW4ueCksTWF0aC5mbG9vcihzY3JlZW4ueSksaXcsaWgpO1xyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG5pbmhlcml0cyhFbnRpdHksIEV2ZW50RW1pdHRlcik7XHJcblxyXG5mdW5jdGlvbiBFbnRpdHkoKSB7XHJcbiAgICBcclxufVxyXG5cclxuRW50aXR5LnByb3RvdHlwZS5hZGRUb0dhbWUgPSBmdW5jdGlvbihnYW1lKSB7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgaWYoIXRoaXMuZ2FtZS5lbnRpdGllcykge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5lbnRpdGllcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgdGhpcy5nYW1lLmVudGl0aWVzLnB1c2godGhpcyk7XHJcbiAgICBpZighdGhpcy5nYW1lLmZpbmRFbnRpdHkpIHRoaXMuZ2FtZS5maW5kRW50aXR5ID0gdGhpcy5maW5kRW50aXR5O1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5nYW1lLm9uKCd1cGRhdGUnLCBmdW5jdGlvbihpbnRlcnZhbCkge1xyXG4gICAgICAgIHNlbGYuZW1pdCgndXBkYXRlJywgaW50ZXJ2YWwpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmdhbWUucmVuZGVyZXIuYWRkVG9aQnVmZmVyKHRoaXMpO1xyXG4gICAgdGhpcy5leGlzdHMgPSB0cnVlO1xyXG59O1xyXG5cclxuRW50aXR5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5leGlzdHMgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygndXBkYXRlJyk7XHJcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygnZHJhdycpO1xyXG5cclxuICAgIHRoaXMuZmluZEVudGl0eSh0aGlzLCBmdW5jdGlvbihleGlzdHMsIGVudGl0aWVzLCBpbmRleCkge1xyXG4gICAgICAgIGlmKGV4aXN0cykge1xyXG4gICAgICAgICAgICBlbnRpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuRW50aXR5LnByb3RvdHlwZS5maW5kRW50aXR5ID0gZnVuY3Rpb24oZW50aXR5LCBjYWxsYmFjayl7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5nYW1lLmVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYodGhpcy5nYW1lLmVudGl0aWVzW2ldID09PSBlbnRpdHkpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSwgdGhpcy5nYW1lLmVudGl0aWVzLCBpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5FbnRpdHkucHJvdG90eXBlLm5lYXJuZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gMTAwMDA7XHJcbn07IiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcclxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dC5qcycpO1xyXG52YXIgbm93ID0gZ2xvYmFsLnBlcmZvcm1hbmNlICYmIGdsb2JhbC5wZXJmb3JtYW5jZS5ub3cgPyBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKVxyXG59IDogRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICtuZXcgRGF0ZSgpXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XHJcbmluaGVyaXRzKEdhbWUsIEV2ZW50RW1pdHRlcik7XHJcblxyXG5mdW5jdGlvbiBHYW1lKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuc2V0TWF4TGlzdGVuZXJzKDApO1xyXG4gICAgY29uc29sZS5sb2coJ0luaXRpYWxpemluZyBnYW1lIGxvb3AnKTtcclxuICAgIHRoaXMuc3RlcCA9IG9wdGlvbnMuc3RlcCB8fCAxMDAwLzYwO1xyXG4gICAgdGhpcy5sYXN0VXBkYXRlID0gMDtcclxuICAgIHRoaXMuZHQgPSAwO1xyXG4gICAgdGhpcy50aWNrcyA9IDA7XHJcbiAgICBcclxuICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXQoKTtcclxuICAgIHRoaXMuaW5wdXQub24oJ2tleWRvd24nLHRoaXMua2V5ZG93bi5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuaW5wdXQub24oJ2tleXVwJyx0aGlzLmtleXVwLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5jZW50ZXJNb3VzZVggPSAwO1xyXG4gICAgdGhpcy5jZW50ZXJNb3VzZVkgPSAwO1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKHNlbGYuY3Jhc2hlZCkgcmV0dXJuO1xyXG4gICAgICAgIHNlbGYuZHQgKz0gbm93KCkgLSBzZWxmLmxhc3RVcGRhdGU7XHJcbiAgICAgICAgaWYoc2VsZi5sYXN0VXBkYXRlID4gMCAmJiBzZWxmLmR0ID4gNjAwMDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvbyBtYW55IHVwZGF0ZXMgbWlzc2VkISBnYW1lIGNyYXNoLi4uJyk7XHJcbiAgICAgICAgICAgIHNlbGYuY3Jhc2hlZCA9IHRydWU7IHNlbGYucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2VsZi5kdCA+IHNlbGYuc3RlcCkge1xyXG4gICAgICAgICAgICB3aGlsZShzZWxmLmR0ID49IHNlbGYuc3RlcCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kdCAtPSBzZWxmLnN0ZXA7IGlmKHNlbGYucGF1c2VkKSB7IGNvbnRpbnVlOyB9IGVsc2UgeyBzZWxmLnJlbmRlcmVkID0gZmFsc2U7IH1cclxuICAgICAgICAgICAgICAgIHNlbGYudGlja3MrKzsgc2VsZi51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxmLmxhc3RVcGRhdGUgPSBub3coKTtcclxuICAgIH0sdGhpcy5zdGVwKTtcclxufVxyXG5cclxuR2FtZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsdGhpcy5kdCk7XHJcbn07XHJcblxyXG5HYW1lLnByb3RvdHlwZS5iaW5kQ2FudmFzID0gZnVuY3Rpb24oY2FudmFzKSB7XHJcbiAgICB0aGlzLmlucHV0LmJpbmRDYW52YXMoY2FudmFzKTtcclxuICAgIHRoaXMudmlld1dpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy52aWV3SGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuICAgIHRoaXMuaW5wdXQub24oJ21vdXNlbW92ZScsdGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmlucHV0Lm9uKCdtb3VzZWRvd24nLHRoaXMubW91c2Vkb3duLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5pbnB1dC5vbignbW91c2V1cCcsdGhpcy5tb3VzZXVwLmJpbmQodGhpcykpO1xyXG4gICAgY2FudmFzLm9uKCdyZXNpemUnLHRoaXMudmlld1Jlc2l6ZS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbkdhbWUucHJvdG90eXBlLnZpZXdSZXNpemUgPSBmdW5jdGlvbihyZXNpemUpIHtcclxuICAgIHRoaXMudmlld1dpZHRoID0gcmVzaXplLndpZHRoO1xyXG4gICAgdGhpcy52aWV3SGVpZ2h0ID0gcmVzaXplLmhlaWdodDtcclxufTtcclxuXHJcbkdhbWUucHJvdG90eXBlLm1vdXNlbW92ZSA9IGZ1bmN0aW9uKG1vdXNlRXZlbnQpIHtcclxuICAgIHRoaXMuY2VudGVyTW91c2VYID0gTWF0aC5mbG9vcihtb3VzZUV2ZW50LnggLSB0aGlzLnZpZXdXaWR0aCAvIDIpO1xyXG4gICAgdGhpcy5jZW50ZXJNb3VzZVkgPSBNYXRoLmZsb29yKG1vdXNlRXZlbnQueSAtIHRoaXMudmlld0hlaWdodCAvIDIpO1xyXG4gICAgbW91c2VFdmVudC5jZW50ZXJNb3VzZVggPSB0aGlzLmNlbnRlck1vdXNlWDtcclxuICAgIG1vdXNlRXZlbnQuY2VudGVyTW91c2VZID0gdGhpcy5jZW50ZXJNb3VzZVk7XHJcbiAgICB0aGlzLmVtaXQoJ21vdXNlbW92ZScsbW91c2VFdmVudCk7XHJcbn07XHJcblxyXG5HYW1lLnByb3RvdHlwZS5tb3VzZWRvd24gPSBmdW5jdGlvbihtb3VzZUV2ZW50KSB7XHJcbiAgICB0aGlzLmVtaXQoJ21vdXNlZG93bicsbW91c2VFdmVudCk7XHJcbn07XHJcblxyXG5HYW1lLnByb3RvdHlwZS5tb3VzZXVwID0gZnVuY3Rpb24obW91c2VFdmVudCkge1xyXG4gICAgdGhpcy5lbWl0KCdtb3VzZXVwJyxtb3VzZUV2ZW50KTtcclxufTtcclxuXHJcbkdhbWUucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbihrZXlFdmVudCkge1xyXG4gICAgdGhpcy5lbWl0KCdrZXlkb3duJyxrZXlFdmVudCk7XHJcbn07XHJcblxyXG5HYW1lLnByb3RvdHlwZS5rZXl1cCA9IGZ1bmN0aW9uKGtleUV2ZW50KSB7XHJcbiAgICB0aGlzLmVtaXQoJ2tleXVwJyxrZXlFdmVudCk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dDtcclxuaW5oZXJpdHMoSW5wdXQsIEV2ZW50RW1pdHRlcik7XHJcblxyXG5mdW5jdGlvbiBJbnB1dCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcgaW5wdXQnKTtcclxuICAgIHRoaXMubW91c2VYID0gMDtcclxuICAgIHRoaXMubW91c2VZID0gMDtcclxuICAgIHRoaXMubW91c2VMZWZ0ID0gZmFsc2U7XHJcbiAgICB0aGlzLm1vdXNlUmlnaHQgPSBmYWxzZTtcclxuICAgIHRoaXMua2V5cyA9IHt9O1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMua2V5ZG93bi5iaW5kKHRoaXMpKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5rZXl1cC5iaW5kKHRoaXMpKTtcclxufVxyXG5cclxuSW5wdXQucHJvdG90eXBlLmJpbmRDYW52YXMgPSBmdW5jdGlvbihjYW52YXMpIHtcclxuICAgIHRoaXMuY2FudmFzID0gY2FudmFzLmNhbnZhczsgLy8gQ2FudmFzIGVsZW1lbnRcclxuICAgIHRoaXMubW91c2VTY2FsZSA9IGNhbnZhcy5zY2FsZTtcclxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMubW91c2Vkb3duLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5tb3VzZXVwLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuSW5wdXQucHJvdG90eXBlLm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMubW91c2VYID0gTWF0aC5mbG9vcihlLnBhZ2VYIC8gdGhpcy5tb3VzZVNjYWxlKTtcclxuICAgIHRoaXMubW91c2VZID0gTWF0aC5mbG9vcihlLnBhZ2VZIC8gdGhpcy5tb3VzZVNjYWxlKTtcclxuICAgIHRoaXMuZW1pdCgnbW91c2Vtb3ZlJywgeyB4OiB0aGlzLm1vdXNlWCwgeTogdGhpcy5tb3VzZVkgfSk7XHJcbn07XHJcblxyXG52YXIgYnV0dG9ucyA9IFsnbGVmdCcsJ21pZGRsZScsJ3JpZ2h0J107XHJcblxyXG5JbnB1dC5wcm90b3R5cGUubW91c2Vkb3duID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbnNbZS5idXR0b25dO1xyXG4gICAgc3dpdGNoKGJ1dHRvbikge1xyXG4gICAgICAgIGNhc2UgJ2xlZnQnOiB0aGlzLm1vdXNlTGVmdCA9IHRydWU7IGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3JpZ2h0JzogdGhpcy5tb3VzZVJpZ2h0ID0gdHJ1ZTsgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoJ21vdXNlZG93bicsIHsgYnV0dG9uOiBidXR0b24sIHg6IHRoaXMubW91c2VYLCB5OiB0aGlzLm1vdXNlWSB9KTtcclxufTtcclxuXHJcbklucHV0LnByb3RvdHlwZS5tb3VzZXVwID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbnNbZS5idXR0b25dO1xyXG4gICAgc3dpdGNoKGJ1dHRvbikge1xyXG4gICAgICAgIGNhc2UgJ2xlZnQnOiB0aGlzLm1vdXNlTGVmdCA9IGZhbHNlOyBicmVhaztcclxuICAgICAgICBjYXNlICdyaWdodCc6IHRoaXMubW91c2VSaWdodCA9IGZhbHNlOyBicmVhaztcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdCgnbW91c2V1cCcsIHsgYnV0dG9uOiBidXR0b24sIHg6IHRoaXMubW91c2VYLCB5OiB0aGlzLm1vdXNlWSB9KTtcclxufTtcclxuXHJcbklucHV0LnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIGtleSA9IGUud2hpY2ggPj0gNDggJiYgZS53aGljaCA8PSA5MCA/IFxyXG4gICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoZS53aGljaCkpLnRvTG93ZXJDYXNlKCkgOiBrZXlDb2Rlc1tlLndoaWNoXTtcclxuICAgIGlmKHRoaXMua2V5c1trZXldKSByZXR1cm47IC8vIElnbm9yZSBpZiBrZXkgYWxyZWFkeSBoZWxkXHJcbiAgICB0aGlzLmtleXNba2V5XSA9IHRydWU7XHJcbiAgICB0aGlzLmVtaXQoJ2tleWRvd24nLCB7IGtleToga2V5IH0pO1xyXG59O1xyXG5cclxuSW5wdXQucHJvdG90eXBlLmtleXVwID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIGtleSA9IGUud2hpY2ggPj0gNDggJiYgZS53aGljaCA8PSA5MCA/XHJcbiAgICAgICAgU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChlLndoaWNoKSkudG9Mb3dlckNhc2UoKSA6IGtleUNvZGVzW2Uud2hpY2hdO1xyXG4gICAgaWYoIXRoaXMua2V5c1trZXldKSByZXR1cm47IC8vIElnbm9yZSBpZiBrZXkgYWxyZWFkeSB1cFxyXG4gICAgdGhpcy5rZXlzW2tleV0gPSBmYWxzZTtcclxuICAgIHRoaXMuZW1pdCgna2V5dXAnLCB7IGtleToga2V5IH0pO1xyXG59O1xyXG5cclxudmFyIGtleUNvZGVzID0ge1xyXG4gICAgMzc6IFwibGVmdFwiLFxyXG4gICAgMzg6IFwidXBcIixcclxuICAgIDM5OiBcInJpZ2h0XCIsXHJcbiAgICA0MDogXCJkb3duXCIsXHJcbiAgICA0NTogXCJpbnNlcnRcIixcclxuICAgIDQ2OiBcImRlbGV0ZVwiLFxyXG4gICAgODogXCJiYWNrc3BhY2VcIixcclxuICAgIDk6IFwidGFiXCIsXHJcbiAgICAxMzogXCJlbnRlclwiLFxyXG4gICAgMTY6IFwic2hpZnRcIixcclxuICAgIDE3OiBcImN0cmxcIixcclxuICAgIDE4OiBcImFsdFwiLFxyXG4gICAgMTk6IFwicGF1c2VcIixcclxuICAgIDIwOiBcImNhcHNsb2NrXCIsXHJcbiAgICAyNzogXCJlc2NhcGVcIixcclxuICAgIDMyOiBcInNwYWNlXCIsXHJcbiAgICAzMzogXCJwYWdldXBcIixcclxuICAgIDM0OiBcInBhZ2Vkb3duXCIsXHJcbiAgICAzNTogXCJlbmRcIixcclxuICAgIDM2OiBcImhvbWVcIixcclxuICAgIDExMjogXCJmMVwiLFxyXG4gICAgMTEzOiBcImYyXCIsXHJcbiAgICAxMTQ6IFwiZjNcIixcclxuICAgIDExNTogXCJmNFwiLFxyXG4gICAgMTE2OiBcImY1XCIsXHJcbiAgICAxMTc6IFwiZjZcIixcclxuICAgIDExODogXCJmN1wiLFxyXG4gICAgMTE5OiBcImY4XCIsXHJcbiAgICAxMjA6IFwiZjlcIixcclxuICAgIDEyMTogXCJmMTBcIixcclxuICAgIDEyMjogXCJmMTFcIixcclxuICAgIDEyMzogXCJmMTJcIixcclxuICAgIDE0NDogXCJudW1sb2NrXCIsXHJcbiAgICAxNDU6IFwic2Nyb2xsbG9ja1wiLFxyXG4gICAgMTg2OiBcInNlbWljb2xvblwiLFxyXG4gICAgMTg3OiBcImVxdWFsXCIsXHJcbiAgICAxODg6IFwiY29tbWFcIixcclxuICAgIDE4OTogXCJkYXNoXCIsXHJcbiAgICAxOTA6IFwicGVyaW9kXCIsXHJcbiAgICAxOTE6IFwic2xhc2hcIixcclxuICAgIDE5MjogXCJncmF2ZWFjY2VudFwiLFxyXG4gICAgMjE5OiBcIm9wZW5icmFja2V0XCIsXHJcbiAgICAyMjA6IFwiYmFja3NsYXNoXCIsXHJcbiAgICAyMjE6IFwiY2xvc2VicmFrZXRcIixcclxuICAgIDIyMjogXCJzaW5nbGVxdW90ZVwiXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xyXG52YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmVxdWlyZSgncmFmJyk7XHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlcmVyO1xyXG5pbmhlcml0cyhSZW5kZXJlciwgRXZlbnRFbWl0dGVyKTtcclxuXHJcbmZ1bmN0aW9uIFJlbmRlcmVyKG9wdGlvbnMpIHtcclxuICAgIGNvbnNvbGUubG9nKCdJbml0aWFsaXppbmcgcmVuZGVyZXInKTtcclxuICAgIHRoaXMuZ2FtZSA9IG9wdGlvbnMuZ2FtZTtcclxuICAgIHRoaXMudGlsZVNpemUgPSBvcHRpb25zLnRpbGVTaXplO1xyXG4gICAgdGhpcy51cGRhdGVEcmF3biA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmdhbWUub24oJ3VwZGF0ZScsIGZ1bmN0aW9uIChpbnRlcnZhbCkge1xyXG4gICAgICAgIHNlbGYudXBkYXRlRHJhd24gPSBmYWxzZTtcclxuICAgICAgICBzZWxmLmludGVydmFsID0gaW50ZXJ2YWw7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgdGhpcy56QnVmZmVyID0gW107XHJcbiAgICBcclxuICAgIC8vIFRPRE86IEltcGxlbWVudCB6LWJ1ZmZlclxyXG4gICAgLy8gQXJyYXkgc29ydGVkIGJ5IG5lYXJuZXNzIG9mIFdvcmxkT2JqZWN0XHJcbiAgICAvLyBVcGRhdGVkIHdoZW5ldmVyIGFuIG9iamVjdCdzIHBvc2l0aW9uIGlzIHVwZGF0ZWRcclxuICAgIC8vIFVzZSBzcGxpY2luZyB0byBtb3ZlIG9iamVjdHMgdG8gYSBuZXcgcG9zaXRpb24gaW4gdGhlIGFycmF5IHJhdGhlciB0aGFuIHJlYnVpbGRpbmcgdGhlIHdob2xlIHRoaW5nXHJcbiAgICAvLyBTaG91bGQgb25seSByZXF1aXJlIG9uZSBsb29wIG9mIHRoZSBhcnJheSwgdW50aWwgMiBwb3NpdGlvbnMgYXJlIGZvdW5kOlxyXG4gICAgLy8gICAxLiBDdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBvYmplY3RcclxuICAgIC8vICAgMi4gTmV3IHBvc2l0aW9uIGJhc2VkIG9uIG5laWdoYm9yaW5nIG5lYXJuZXNzIHZhbHVlc1xyXG4gICAgXHJcbiAgICB2YXIgZHJhdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmKHNlbGYudXBkYXRlRHJhd24gPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYoc2VsZi5jYW52YXNlcykge1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNlbGYuY2FudmFzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNhbnZhc2VzW2ldLmRyYXcoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmVtaXQoJ2RyYXcnLCBzZWxmLmNhbnZhc2VzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgc2VsZi56QnVmZmVyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuekJ1ZmZlcltqXS5lbWl0KCdkcmF3JyxzZWxmLmNhbnZhc2VzW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLnVwZGF0ZURyYXduID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xyXG4gICAgfTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcclxufVxyXG5cclxuUmVuZGVyZXIucHJvdG90eXBlLmFkZENhbnZhcyA9IGZ1bmN0aW9uKGNhbnZhcykge1xyXG4gICAgY2FudmFzLnJlbmRlcmVyID0gdGhpcztcclxuICAgIGlmKCF0aGlzLmNhbnZhc2VzKSB0aGlzLmNhbnZhc2VzID0gW107XHJcbiAgICB0aGlzLmNhbnZhc2VzLnB1c2goY2FudmFzKTtcclxufTtcclxuXHJcblJlbmRlcmVyLnByb3RvdHlwZS5hZGRUb1pCdWZmZXIgPSBmdW5jdGlvbihlbnRpdHkpIHtcclxuICAgIHZhciBuZWFybmVzcyA9IGVudGl0eS5uZWFybmVzcygpO1xyXG4gICAgLy8gSWYgekJ1ZmZlciBpcyBlbXB0eSBvciBuZWFybmVzcyBtYXRjaGVzL2V4Y2VlZHMgaGlnaGVzdCwgYWRkIGl0IHRvIHRoZSBlbmRcclxuICAgIGlmKHRoaXMuekJ1ZmZlci5sZW5ndGggPT0gMCB8fCBuZWFybmVzcyA+PSB0aGlzLnpCdWZmZXJbdGhpcy56QnVmZmVyLmxlbmd0aC0xXS5uZWFybmVzcygpKSB7IFxyXG4gICAgICAgIHRoaXMuekJ1ZmZlci5wdXNoKGVudGl0eSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuekJ1ZmZlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmKG5lYXJuZXNzIDw9IHRoaXMuekJ1ZmZlcltpXS5uZWFybmVzcygpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuekJ1ZmZlci5zcGxpY2UoaSwwLGVudGl0eSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmVycm9yKCdjb3VsZCBub3QgZmluZCBzcG90IGluIHpCdWZmZXIhJyk7XHJcbn07XHJcblxyXG5SZW5kZXJlci5wcm90b3R5cGUudXBkYXRlWkJ1ZmZlciA9IGZ1bmN0aW9uKGVudGl0eSkge1xyXG4gICAgdmFyIG9sZEluZGV4LCBuZXdJbmRleCA9IHRoaXMuekJ1ZmZlci5sZW5ndGgtMTtcclxuICAgIHZhciBvbGRJbmRleEZvdW5kLCBuZXdJbmRleEZvdW5kO1xyXG4gICAgdmFyIG5lYXJuZXNzID0gZW50aXR5Lm5lYXJuZXNzKCk7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy56QnVmZmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHRoaXNOZWFybmVzcyA9IHRoaXMuekJ1ZmZlcltpXS5uZWFybmVzcygpO1xyXG4gICAgICAgIGlmKCFvbGRJbmRleEZvdW5kICYmIHRoaXMuekJ1ZmZlcltpXSA9PT0gZW50aXR5KSB7XHJcbiAgICAgICAgICAgIG9sZEluZGV4ID0gaTtcclxuICAgICAgICAgICAgb2xkSW5kZXhGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmKG5ld0luZGV4Rm91bmQpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihuZWFybmVzcyA8PSB0aGlzTmVhcm5lc3MpIHtcclxuICAgICAgICAgICAgbmV3SW5kZXggPSBpO1xyXG4gICAgICAgICAgICBuZXdJbmRleEZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYob2xkSW5kZXhGb3VuZCkgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihvbGRJbmRleEZvdW5kKSB7XHJcbiAgICAgICAgaWYob2xkSW5kZXggIT0gbmV3SW5kZXgpIHRoaXMuekJ1ZmZlci5zcGxpY2UobmV3SW5kZXgsIDAsIHRoaXMuekJ1ZmZlci5zcGxpY2Uob2xkSW5kZXgsMSlbMF0pO1xyXG4gICAgfSBlbHNlIHsgLy8gSWYgZW50aXR5IG5vdCBpbiB6QnVmZmVyLCBhZGQgaXRcclxuICAgICAgICB0aGlzLmFkZFRvWkJ1ZmZlcihlbnRpdHkpO1xyXG4gICAgfVxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlU2hlZXQ7XHJcblxyXG5mdW5jdGlvbiBTcHJpdGVTaGVldChpbWdQYXRoLG1hcCkge1xyXG4gICAgdGhpcy5tYXAgPSBtYXA7XHJcbiAgICB0aGlzLmltZyA9IG5ldyBJbWFnZTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBzZWxmLmxvYWRlZCA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuaW1nLnNyYyA9ICcuL2ltZy8nK2ltZ1BhdGg7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcbnZhciBFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0eS5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZE9iamVjdDtcclxuaW5oZXJpdHMoV29ybGRPYmplY3QsIEVudGl0eSk7XHJcblxyXG5mdW5jdGlvbiBXb3JsZE9iamVjdChvcHRpb25zKSB7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0ge1xyXG4gICAgICAgIHg6IG9wdGlvbnMucG9zaXRpb24ueCxcclxuICAgICAgICB5OiBvcHRpb25zLnBvc2l0aW9uLnksXHJcbiAgICAgICAgejogb3B0aW9ucy5wb3NpdGlvbi56XHJcbiAgICB9O1xyXG4gICAgaWYoIW9wdGlvbnMudmVsb2NpdHkpIG9wdGlvbnMudmVsb2NpdHkgPSB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcclxuICAgIHRoaXMudmVsb2NpdHkgPSB7XHJcbiAgICAgICAgeDogb3B0aW9ucy52ZWxvY2l0eS54LFxyXG4gICAgICAgIHk6IG9wdGlvbnMudmVsb2NpdHkueSxcclxuICAgICAgICB6OiBvcHRpb25zLnZlbG9jaXR5LnpcclxuICAgIH07XHJcbiAgICB0aGlzLm9uKCd1cGRhdGUnLGZ1bmN0aW9uKGludGVydmFsKSB7XHJcbiAgICAgICAgdGhpcy5tb3ZlKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbldvcmxkT2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24odmVsb2NpdHkpIHtcclxuICAgIGlmKHZlbG9jaXR5LnggPT0gMCAmJiB2ZWxvY2l0eS55ID09IDAgJiYgdmVsb2NpdHkueiA9PSAwKSByZXR1cm47XHJcbiAgICB2YXIgb2xkTmVhcm5lc3MgPSB0aGlzLm5lYXJuZXNzKCk7XHJcbiAgICB0aGlzLnBvc2l0aW9uLnggKz0gdmVsb2NpdHkueDtcclxuICAgIHRoaXMucG9zaXRpb24ueSArPSB2ZWxvY2l0eS55O1xyXG4gICAgdGhpcy5wb3NpdGlvbi56ICs9IHZlbG9jaXR5Lno7XHJcbiAgICBpZihvbGROZWFybmVzcyA9PSB0aGlzLm5lYXJuZXNzKCkpIHJldHVybjsgLy8gRG9uJ3QgdXBkYXRlIHpCdWZmZXIgaWYgbmVhcm5lc3MgdW5jaGFuZ2VkXHJcbiAgICB0aGlzLmdhbWUucmVuZGVyZXIudXBkYXRlWkJ1ZmZlcih0aGlzKTtcclxufTtcclxuXHJcbldvcmxkT2JqZWN0LnByb3RvdHlwZS5uZWFybmVzcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueSAtIHRoaXMucG9zaXRpb24ueCArIHRoaXMucG9zaXRpb24uejtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XHJcbnZhciBXb3JsZE9iamVjdCA9IHJlcXVpcmUoJy4vLi4vZW5naW5lL3dvcmxkb2JqZWN0LmpzJyk7XHJcbnZhciBTaGVldCA9IHJlcXVpcmUoJy4vc2hlZXQuanMnKTtcclxuXHJcbnZhciBzcHJpdGVYID0gMzM7XHJcbnZhciBzcHJpdGVZID0gMDtcclxudmFyIHNwcml0ZVdpZHRoID0gMzM7XHJcbnZhciBzcHJpdGVIZWlnaHQgPSAyNTtcclxudmFyIHNoZWV0ID0gbmV3IFNoZWV0KHtcclxuICAgIGhhbGZibG9jazogeyB4OiBzcHJpdGVYLCB5OiBzcHJpdGVZLCB3aWR0aDogc3ByaXRlV2lkdGgsIGhlaWdodDogc3ByaXRlSGVpZ2h0IH1cclxufSk7XHJcbnZhciBvcmlnaW4gPSB7IHg6IDE3LCB5OiAxNSB9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYWxmQmxvY2s7XHJcbmluaGVyaXRzKEhhbGZCbG9jaywgV29ybGRPYmplY3QpO1xyXG5cclxuZnVuY3Rpb24gSGFsZkJsb2NrKHgseSx6KSB7XHJcbiAgICB2YXIgdGlsZSA9IG5ldyBXb3JsZE9iamVjdCh7cG9zaXRpb246e3g6eCx5Onksejp6fX0pO1xyXG4gICAgdGlsZS5vbignZHJhdycsZnVuY3Rpb24oY2FudmFzKSB7XHJcbiAgICAgICAgaWYoIXNoZWV0LnNwcml0ZS5sb2FkZWQpIHJldHVybjtcclxuICAgICAgICBjYW52YXMuZHJhd0ltYWdlSXNvKHNoZWV0LnNwcml0ZS5pbWcsc3ByaXRlWCxzcHJpdGVZLHNwcml0ZVdpZHRoLHNwcml0ZUhlaWdodCxvcmlnaW4sXHJcbiAgICAgICAgICAgIHRpbGUucG9zaXRpb24ueCx0aWxlLnBvc2l0aW9uLnksdGlsZS5wb3NpdGlvbi56KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRpbGU7XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbnZhciBTcHJpdGVTaGVldCA9IHJlcXVpcmUoJy4vLi4vZW5naW5lL3Nwcml0ZXNoZWV0LmpzJyk7XHJcblxyXG52YXIgbWFwID0ge307XHJcbnZhciBzcHJpdGUgPSBuZXcgU3ByaXRlU2hlZXQoJ2Vudmlyb25tZW50LnBuZycsbWFwKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2hlZXQ7XHJcblxyXG5mdW5jdGlvbiBTaGVldChuZXdNYXApIHtcclxuICAgIGZvcih2YXIga2V5IGluIG5ld01hcCkgeyBpZighbmV3TWFwLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xyXG4gICAgICAgIG1hcFtrZXldID0gbmV3TWFwW2tleV07XHJcbiAgICB9XHJcbiAgICB0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuICAgIHRoaXMubWFwID0gbWFwO1xyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xyXG52YXIgV29ybGRPYmplY3QgPSByZXF1aXJlKCcuLy4uL2VuZ2luZS93b3JsZG9iamVjdC5qcycpO1xyXG52YXIgU2hlZXQgPSByZXF1aXJlKCcuL3NoZWV0LmpzJyk7XHJcblxyXG52YXIgc3ByaXRlWCA9IDA7XHJcbnZhciBzcHJpdGVZID0gMDtcclxudmFyIHNwcml0ZVdpZHRoID0gMzM7XHJcbnZhciBzcHJpdGVIZWlnaHQgPSAxODtcclxudmFyIHNoZWV0ID0gbmV3IFNoZWV0KHtcclxuICAgIHRpbGU6IHsgeDogc3ByaXRlWCwgeTogc3ByaXRlWSwgd2lkdGg6IHNwcml0ZVdpZHRoLCBoZWlnaHQ6IHNwcml0ZUhlaWdodCB9XHJcbn0pO1xyXG52YXIgb3JpZ2luID0geyB4OiAxNywgeTogOCB9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaWxlO1xyXG5pbmhlcml0cyhUaWxlLCBXb3JsZE9iamVjdCk7XHJcblxyXG5mdW5jdGlvbiBUaWxlKHgseSx6KSB7XHJcbiAgICB2YXIgdGlsZSA9IG5ldyBXb3JsZE9iamVjdCh7cG9zaXRpb246e3g6eCx5Onksejp6fX0pO1xyXG4gICAgdGlsZS5vbignZHJhdycsZnVuY3Rpb24oY2FudmFzKSB7XHJcbiAgICAgICAgaWYoIXNoZWV0LnNwcml0ZS5sb2FkZWQpIHJldHVybjtcclxuICAgICAgICBjYW52YXMuZHJhd0ltYWdlSXNvKHNoZWV0LnNwcml0ZS5pbWcsc3ByaXRlWCxzcHJpdGVZLHNwcml0ZVdpZHRoLHNwcml0ZUhlaWdodCxvcmlnaW4sXHJcbiAgICAgICAgICAgIHRpbGUucG9zaXRpb24ueCx0aWxlLnBvc2l0aW9uLnksdGlsZS5wb3NpdGlvbi56KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRpbGU7XHJcbn0iXX0=
