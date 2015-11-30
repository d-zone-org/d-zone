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
    this.text = text;
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
    this.textMetrics = TextBlotter.calculateMetrics({ text: this.text, maxWidth: 96 });
    if(this.text.trim() == '' || this.textMetrics.lines.length == 0 
        || this.textMetrics.lines[0].chars.length == 0) { // No message to show
        complete();
        return;
    }
    var lineNumber = 0;
    var lineChar = 0;
    var lineChars = self.textMetrics.lines[lineNumber].chars.length;
    var nextLine = self.textMetrics.lines[lineNumber + 1];
    if(nextLine) lineChars += nextLine.chars.length;
    console.log('Saying:',this.text);
    var addLetter = function() {
        lineChar++;
        self.blotText({ 
            text: self.text, maxWidth: 96, metrics: self.textMetrics,
            maxChars: lineChar, lineStart: lineNumber, lineCount: 2 
        });
        if(lineChar == lineChars) { // Line pair finished?
            lineNumber += 2; // 2 lines at a time
            if(lineNumber + 1 > self.textMetrics.lines.length) {
                self.tickDelay(function() {
                    self.tickRepeat(function(progress) {
                        self.canvas = TextBlotter.transition({
                            bg: bg, metrics: self.textMetrics, progress: 1 - progress.percent, 
                            lineCount : Math.min(self.textMetrics.lines.length, 2)
                        });
                        if(progress.percent == 1) complete();
                    }, 16);
                }, 70); // Last line complete
            } else {
                lineChar = 0;
                lineChars = self.textMetrics.lines[lineNumber].chars.length;
                nextLine = self.textMetrics.lines[lineNumber + 1];
                if(nextLine) lineChars += nextLine.chars.length;
                self.tickDelay(addLetter, speed * 5); // Begin next line
            }
        } else { // Line not finished, continue
            self.tickDelay(addLetter, speed);
        }
    };
    this.tickRepeat(function(progress) {
        self.canvas = TextBlotter.transition({
            bg: bg, metrics: self.textMetrics, progress: progress.percent,
            lineCount : Math.min(self.textMetrics.lines.length, 2)
        });
        if(progress.percent == 1) self.tickDelay(addLetter, speed);
    }, 20);
};