'use strict';

var Discord = require('discord.io');
var bot;

var localforage = require('localforage');
localforage.config({
    name: 'dzone',
    driver: localforage.LOCALSTORAGE
});

var accounts;

module.exports = {
    login() {
        localforage.getItem('accounts', function(err, val) {
            accounts = val;
            login(accounts ? accounts[0].token : prompt('Please enter your token'));
        });
    }
};

function login(token) {
    bot = new Discord.Client({ token: token, autorun: true });

    bot.on('ready', function() {
        // This runs on every re-connect, so check if already initialized
        console.log(bot.username + " - (" + bot.id + ")");
        var accountInfo = {
            token,
            username: bot.username,
            discriminator: bot.discriminator,
            id: bot.id
        };
        if(accounts) { // Account data previously saved
            var accountExists = false;
            for(var i = 0; i < accounts.length; i++) {
                if(accounts[i].id = bot.id) { // Find matching account
                    accounts[i] = accountInfo;
                    accountExists = true;
                    break;
                }
            }
            if(!accountExists) accounts.push(accountInfo); // Add account if new
            localforage.setItem('accounts', accounts); // Save updated info
        } else { // Account data not previously saved
            accounts = [accountInfo];
            if(window.confirm('Do you want to save the token in your browser?')) {
                localforage.setItem('accounts', accounts);
            }
        }
        bot.once('allUsers', function() {
            // This is emitting 3 times on my account for some reason, so I use .once ; TODO: wait for izy's response
            console.log('Total users:', Object.keys(bot.users).length);
        });
        bot.getAllUsers(); // Gather all info to build server list
    });

    bot.on('message', function(user, userID, channelID, message, event) {
        //console.log(`${user}: ${message}`);
    });

    // bot.on('any', function(rawEvent) {
    //     console.log(rawEvent);
    // });

    bot.on('err', function(error) {
        console.log(error);
    });

    bot.on('disconnect', function() {
        console.log('Bot disconnected, attempting reconnect in 5 seconds...');
        setTimeout(function(){
            bot.connect(); //Auto reconnect after 5 seconds
        },5000);
    });
}