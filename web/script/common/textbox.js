'use strict';
var inherits = require('inherits');
var Entity = require('./../engine/entity.js');
var TextBlotter = require('./../common/textblotter.js');
var miscConfig = JSON.parse(require('fs').readFileSync('./misc-config.json')) || {};

var textboxConfig = miscConfig.textbox || {};
var TEXTBOX_MAX_WIDTH = textboxConfig.maxWidth || 96;
var TEXTBOX_LINES_PER_PAGE = textboxConfig.linesPerPage || 4;
var TEXTBOX_SCROLL_SPEEDS = textboxConfig.scrollSpeeds || [ [0, 3], [75, 2], [150, 1] ];
var TEXTBOX_PAGE_DELAY = textboxConfig.pageDelay || 5;
var TEXTBOX_FINAL_DELAY = textboxConfig.finalDelay || 60;
var TEXTBOX_OPEN_TIME = textboxConfig.openTime || 10;
var TEXTBOX_CLOSE_TIME = textboxConfig.closeTime || 8;
var TEXTBOX_BG_COLOR = textboxConfig.bgColor || 'rgba(0, 0, 0, 0.7)';

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

function calcScrollSpeed(text) {
    var speed = 1;
    for(var i = 0; i < TEXTBOX_SCROLL_SPEEDS.length; i++) {
        if(text.length >= TEXTBOX_SCROLL_SPEEDS[i][0]) speed = TEXTBOX_SCROLL_SPEEDS[i][1];
        else if(text.length < TEXTBOX_SCROLL_SPEEDS[i][0]) break;
    }
    return speed;
}

function TextBox(parent, text, stay) {
    this.parent = parent;
    this.text = text;
    this.screen = { x: 0, y: 0 };
    this.sprite = { 
        keepOnScreen: true,
        screen: this.screen, parent: this.parent, stay: stay, metrics: { x: 0, y: 0, w: 0, h: 0 }
    };
}

TextBox.prototype.updateScreen = function() {
    if(!this.canvas) return;
    this.screen.x = this.parent.preciseScreen.x - this.canvas.width/2 + this.parent.pixelSize.x;
    this.screen.y = this.parent.preciseScreen.y - this.canvas.height + 2;
};

TextBox.prototype.updateSprite = function() {
    this.sprite.image = this.canvas;
    this.sprite.metrics.w = this.sprite.image.width;
    this.sprite.metrics.h = this.sprite.image.height;
};

TextBox.prototype.blotText = function(options) {
    if(!options) options = {};
    options.bg = options.bg || TEXTBOX_BG_COLOR;
    options.text = options.text || this.text;
    if(!options.text) return;
    this.canvas = TextBlotter.blot(options);
    this.updateScreen();
    this.updateSprite();
};

TextBox.prototype.scrollMessage = function(cb) {
    var self = this;
    function complete() {
        self.remove();
        cb();
    }
    this.textMetrics = TextBlotter.calculateMetrics({ text: this.text, maxWidth: TEXTBOX_MAX_WIDTH });
    if(this.text.trim() === '' || this.textMetrics.lines.length === 0 
        || this.textMetrics.lines[0].chars.length === 0) { // No message to show
        complete();
        return;
    }
    var scrollSpeed = calcScrollSpeed(this.text);
    var lineNumber = 0;
    var lineChar = 0;
    var lineChars = self.textMetrics.lines[lineNumber].chars.length;
    for(var nl = 1; nl < TEXTBOX_LINES_PER_PAGE; nl++) {
        var nextLine = self.textMetrics.lines[lineNumber + nl];
        if(nextLine) lineChars += nextLine.chars.length; else break;
    }
    //console.log(this.parent.username,'says:',this.text);
    var addLetter = function() {
        lineChar++;
        self.blotText({ 
            text: self.text, metrics: self.textMetrics, maxChars: lineChar,
            lineStart: lineNumber, lineCount: TEXTBOX_LINES_PER_PAGE
        });
        if(lineChar === lineChars) { // Line set finished?
            lineNumber += TEXTBOX_LINES_PER_PAGE;
            if(lineNumber >= self.textMetrics.lines.length) { // Last line complete?
                self.tickDelay(function() {
                    self.tickRepeat(function(progress) {
                        self.canvas = TextBlotter.transition({
                            bg: TEXTBOX_BG_COLOR, metrics: self.textMetrics, progress: 1 - progress.percent, 
                            lineCount : Math.min(self.textMetrics.lines.length, TEXTBOX_LINES_PER_PAGE)
                        });
                        self.updateScreen();
                        self.updateSprite();
                    }, TEXTBOX_CLOSE_TIME, complete);
                }, scrollSpeed * TEXTBOX_FINAL_DELAY);
            } else { // Still more lines
                lineChar = 0;
                lineChars = self.textMetrics.lines[lineNumber].chars.length;
                for(var nl = 1; nl < TEXTBOX_LINES_PER_PAGE; nl++) {
                    nextLine = self.textMetrics.lines[lineNumber + nl];
                    if(nextLine) lineChars += nextLine.chars.length; else break;
                }
                self.tickDelay(addLetter, scrollSpeed * TEXTBOX_PAGE_DELAY); // Begin next line
            }
        } else { // Line not finished, continue
            self.tickDelay(addLetter, scrollSpeed);
        }
    };
    this.tickRepeat(function(progress) {
        self.canvas = TextBlotter.transition({
            bg: TEXTBOX_BG_COLOR, metrics: self.textMetrics, progress: progress.percent,
            lineCount : Math.min(self.textMetrics.lines.length, TEXTBOX_LINES_PER_PAGE)
        });
        self.updateScreen();
        self.updateSprite();
    }, TEXTBOX_OPEN_TIME, function() {
        self.tickDelay(addLetter, scrollSpeed)
    });
};