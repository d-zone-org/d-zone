'use strict';
var Discord = require("discord.io");
var config = require('./config');
var bot = new Discord({
    email: config.get('discord.email'),
    password: config.get('discord.password'),
    autorun: true
});

bot.on("ready", function(rawEvent) {
    console.log(new Date(),"Logged in as: "+bot.username + " - (" + bot.id + ")");
    setTimeout(function() {
        require('fs').writeFileSync('./bot.json', JSON.stringify(bot, null, '\t'));
    }, 2000);
});


// Helper functions

var msgQueue = [], // Message buffer
    sending; // Busy sending a message

function sendMessages(ID, messageArr, callback) {
    for(var i = 0; i < messageArr.length; i++) { // Add messages to buffer
        msgQueue.push({
            ID: ID,
            msg: messageArr[i],
            callback: i == messageArr.length-1 ? callback : false // If callback specified, only add to last message
        })
    }

    function _sendMessage() {
        sending = true; // We're busy
        bot.sendMessage({
            to: msgQueue[0].ID,
            message: msgQueue[0].msg
        }, function(res) {
            var sent = msgQueue.shift(); // Remove message from buffer
            if(sent.callback) sent.callback(); // Activate callback if exists
            if(msgQueue.length < 1) { // Stop when message buffer is empty
                sending = false; // We're free
            } else {
                _sendMessage();
            }
        })
    }
    if(!sending) _sendMessage(); // If not busy with a message, send now
}