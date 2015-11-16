'use strict';
var inherits = require('inherits');
var Entity = require('./../engine/entity.js');
var TextBlotter = require('./../common/textblotter.js');

var bg = 'rgba(0,0,0,0.7)';

module.exports = TextBox;
inherits(TextBox, Entity);

function TextBox(parent, text) {
    this.parent = parent;
    this.text = text;
    this.keepOnScreen = true;
    this.blotter = new TextBlotter();
    var self = this;
    this.on('draw',function(canvas) {
        canvas.drawImageIso(self);
    });
}

TextBox.prototype.getSprite = function() {
    if(!this.canvas) return;
    return {
        metrics: { x: 0, y: 0, w: this.canvas.width, h: this.canvas.height },
        image: this.canvas
    };
};

TextBox.prototype.toScreen = function() {
    var parent = this.parent.toScreen();
    return {
        x: parent.x - this.canvas.width/2 + this.parent.pixelSize.x,
        y: parent.y - 18
    }
};

TextBox.prototype.blotText = function(text, fullWidth) {
    text = text || this.text;
    if(!text) return;
    // TODO: Move this ready check into the blotter
    if(this.blotter.ready()) {
        this.canvas = this.blotter.blot(text,null,0,0,'left',bg, fullWidth);
    } else {
        var self = this;
        this.blotter.onLoad(function() {
            self.canvas = self.blotter.blot(text,null,0,0,'left',bg, fullWidth);
        });
    }
};

TextBox.prototype.scrollMessage = function(speed,cb) {
    this.messageChunks = [];
    var chunked = this.text.split(' ');
    var currentChunk = '';
    for(var i = 0; i < chunked.length; i++) {
        if(this.blotter.calculateWidth(chunked[i]) > 96) continue; // Ignore long unbroken strings
        if(this.blotter.calculateWidth(currentChunk+chunked[i]) > 96) {
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
        self.blotText(typingMessage,self.blotter.calculateWidth(self.messageChunks[chunkIndex]));
        if(typingMessage.length == self.messageChunks[chunkIndex].length) { // Chunk finished?
            chunkIndex++;
            if(chunkIndex > self.messageChunks.length - 1) {
                self.tickDelay(function() {
                    self.tickRepeat(function(progress) {
                        self.canvas = self.blotter.transition(
                            null, bg, self.blotter.calculateWidth(typingMessage), 1-progress
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
        self.canvas = self.blotter.transition(
            null, bg, self.blotter.calculateWidth(self.messageChunks[chunkIndex]), progress
        );
        if(progress == 1) self.tickDelay(addLetter, speed);
    }, 20);
};