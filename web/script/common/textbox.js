'use strict';
var inherits = require('inherits');
var Entity = require('./../engine/entity.js');
var TextBlotter = require('./../common/textblotter.js');

var bg = 'rgba(0,0,0,0.7)';

module.exports = TextBox;
inherits(TextBox, Entity);

function cleanString(text) {
    if(!text) return text;
    for(var i = 0; i < text.length; i++) {
        if(!TextBlotter.fontMap[text[i]]) {
            var charArray = text.split('');
            charArray.splice(i,1);
            text = charArray.join('');
            i--;
        }
    }
    return text;
}

function TextBox(parent, text) {
    this.parent = parent;
    this.text = cleanString(text);
    this.keepOnScreen = true;
    var self = this;
    this.on('draw',function(canvas) {
        canvas.drawEntity(self);
    });
}

TextBox.prototype.getSprite = function() {
    if(!this.canvas) return;
    this.screen = this.toScreen();
    return {
        metrics: { x: 0, y: 0, w: this.canvas.width, h: this.canvas.height },
        image: this.canvas
    };
};

TextBox.prototype.toScreen = function() {
    var parent = this.parent.preciseScreen;
    return {
        x: parent.x - this.canvas.width/2 + this.parent.pixelSize.x,
        y: parent.y - this.canvas.height + 2
    }
};

TextBox.prototype.blotText = function(options) {
    if(!options) options = {};
    options.bg = options.bg || bg;
    options.text = options.text || this.text;
    if(!options.text) return;
    this.canvas = TextBlotter.blot(options);
};

TextBox.prototype.scrollMessage = function(speed,cb) {
    var self = this;
    function complete() {
        self.remove();
        cb();
    }
    console.log('Saying:',this.text);
    this.textMetrics = TextBlotter.calculateMetrics({ text: this.text, maxWidth: 96 });
    if(this.text.trim() == '' || this.textMetrics.charMap.length == 0) { // No message to show
        complete();
        return;
    }
    var lineNumber = 1;
    var lineChar = 0;
    var addLetter = function() {
        lineChar++;
        self.blotText({ 
            text: self.text, charCount: lineChar, maxWidth: 96, lineNumber: lineNumber, maxLines: 2 
        });
        var totalChars = self.textMetrics.lines[lineNumber-1].length 
            + (self.textMetrics.lines[lineNumber] ? self.textMetrics.lines[lineNumber].length : 0);
        if(lineChar == totalChars) { // Line finished?
            lineNumber += 2; // 2 lines at a time
            if(lineNumber > self.textMetrics.lines.length) {
                self.tickDelay(function() {
                    self.tickRepeat(function(progress) {
                        self.canvas = TextBlotter.transition({
                            bg: bg, text: self.text, progress: 1 - progress,
                            lineNumber: lineNumber-2, maxLines: 2, maxWidth: 96
                        });
                        if(progress == 1) complete();
                    }, 16);
                }, 70); // Last line complete
            } else {
                lineChar = 0;
                self.tickDelay(addLetter, speed * 6); // Begin next line
            }
        } else { // Line not finished, continue
            self.tickDelay(addLetter, speed);
        }
    };
    this.tickRepeat(function(progress) {
        self.canvas = TextBlotter.transition({
            bg: bg, text: self.text, progress: progress, 
            lineNumber: lineNumber, maxLines: 2, maxWidth: 96
        });
        if(progress == 1) self.tickDelay(addLetter, speed);
    }, 20);
};