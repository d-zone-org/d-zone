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
        y: parent.y - 18
    }
};

TextBox.prototype.blotText = function(text, fullWidth) {
    text = text || this.text;
    if(!text) return;
    this.canvas = TextBlotter.blot(text,null,0,0,'left',bg, fullWidth);
};

TextBox.prototype.scrollMessage = function(speed,cb) {
    this.messageChunks = [];
    var chunked = this.text.split(' ');
    var currentChunk = '';
    for(var i = 0; i < chunked.length; i++) {
        if(TextBlotter.calculateWidth(chunked[i]) > 96) continue; // Ignore long unbroken strings
        if(TextBlotter.calculateWidth(currentChunk+chunked[i]) > 96) {
            this.messageChunks.push(currentChunk.trim());
            currentChunk = '';
        }
        currentChunk += chunked[i] + ' ';
    }
    this.messageChunks.push(currentChunk.trim());
    var self = this;
    function complete() {
        self.remove();
        cb();
    }
    // TODO: Normalize chunk lengths so there are no single-word remainders
    if(this.messageChunks[0] == '') { // No message to show
        complete();
        return;
    }
    console.log('Saying:',this.messageChunks);
    var typingMessage = '';
    var chunkIndex = 0;
    var addLetter = function() {
        typingMessage += self.messageChunks[chunkIndex].substr(typingMessage.length,1);
        self.blotText(typingMessage,TextBlotter.calculateWidth(self.messageChunks[chunkIndex]));
        if(typingMessage.length == self.messageChunks[chunkIndex].length) { // Chunk finished?
            chunkIndex++;
            if(chunkIndex > self.messageChunks.length - 1) {
                self.tickDelay(function() {
                    self.tickRepeat(function(progress) {
                        self.canvas = TextBlotter.transition(
                            null, bg, TextBlotter.calculateWidth(typingMessage), 1-progress
                        );
                        if(progress == 1) complete();
                    }, 16);
                }, 70); // Last chunk complete
            } else {
                typingMessage = '';
                self.tickDelay(addLetter, speed * 6); // Begin next chunk
            }
        } else { // Chunk not finished, continue
            self.tickDelay(addLetter, speed);
        }
    };
    this.tickRepeat(function(progress) {
        self.canvas = TextBlotter.transition(
            null, bg, TextBlotter.calculateWidth(self.messageChunks[chunkIndex]), progress
        );
        if(progress == 1) self.tickDelay(addLetter, speed);
    }, 20);
};