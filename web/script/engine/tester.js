'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var util = require('./../common/util.js');

module.exports = TestSocket;
inherits(TestSocket, EventEmitter);

function TestSocket(userCount,updateInterval) {
    this.userCount = userCount;
    this.updateInterval = updateInterval;
    setTimeout(this.connect.bind(this),200);
}

TestSocket.prototype.connect = function() {
    this.emit('connect');
    this.users = {};
    for(var i = 0; i < this.userCount; i++) {
        var user = this.newUser();
        this.users[user.user.id] = user;
    }
    var self = this;
    setTimeout(function() { 
        self.sendData('server-join', { users: self.users, request: { server: 'test' } }); 
    },50);
    setInterval(function() {
        var uid = util.pickInObject(self.users);
        var nonsense = ['lol','omg','discord','haha','...','yeah','no','wow','indeed','right','memes'];
        function sentenceBuilder() {
            var sentence = '';
            var wordCount = util.randomIntRange(1,20);
            for(var i = 0; i < wordCount; i++) {
                sentence += (i == 0 ? '' : ' ') + util.pickInArray(nonsense);
            }
            return sentence;
        }
        if(Math.random() > 0.8) {
            var status = util.pickInArray(['online','online','online','idle','offline']);
            self.users[uid].status = status;
            self.sendData('presence', {
                uid: uid, status: status
            });
        } else {
            uid = self.randomUser({status:'online'}).user.id;
            self.sendData('message', {
                uid: uid, message: sentenceBuilder(), channel: '10000000000'
            });
        }
    },self.updateInterval)
};

TestSocket.prototype.sendData = function(type,data) {
    this.emit('data',JSON.stringify({type:type,data:data}));
};

TestSocket.prototype.newUser = function() {
    var uid = '';
    for(var i = 0; i < 17; i++) { uid += util.randomIntRange(0,9); }
    var name = '';
    var nameLength = util.randomIntRange(5,9);
    for(var j = 0; j < nameLength; j++) {
        var letter = j & 1 ? util.pickInArray(util.vowels) : util.pickInArray(util.consonants);
        if(j == 0) letter = letter.toUpperCase();
        name += letter;
    }
    var avatar = '';
    for(var k = 0; k < 32; k++) { avatar += util.pickInArray(util.hex); }
    var user = {
        user: { username: name, id: uid, discriminator: util.randomIntRange(1000,9999), avatar: avatar },
        roles: Math.random() > 0.5 ? ['86919909468049408'] : [],
        mute: Math.random() > 0.9,
        joined_at: '2015-0'+util.randomIntRange(1,9)+'-'+util.randomIntRange(10,28)+'T0'+
        util.randomIntRange(1,9)+':'+util.randomIntRange(10,59)+'.000000+00:00',
        deaf: this.mute, game_id: null
    };
    if(Math.random() > 0.2)  user.status = util.pickInArray(['online','online','online','idle','offline']);
    if(Math.random() > 0.9) user.game_id = util.randomIntRange(0,585);
    return user;
};

TestSocket.prototype.randomUser = function(options) {
    var safety = 0, validChoice = false;
    do {
        var picked = this.users[util.pickInObject(this.users)];
        validChoice = true;
        if(options.status) {
            validChoice = picked.status == options.status;
        }
        safety++;
    } while(safety < 100 && !validChoice);
    return picked;
};