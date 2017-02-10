/*

    D-Zone Configuration Updater
    Made by JacobGunther12 (@JacobGunther12#1281)

    Automatically changes the discord-config.json file to match
    the servers that the bot is in.

*/

var bot_token = ""; // Insert your bot token inside this string.

/* Do not touch anything below this line.
   Do not touch anything below this line.
   Do not touch anything below this line. */

if (bot_token !== "") {
    var Discord = require("discord.io");
    var fs = require("fs");
    var config = {
        "token": "",
        "servers": []
    };
    config.token = bot_token;
    var bot = new Discord.Client({
        token: bot_token,
        autorun: true
    });
    bot.on("ready", function() {
        console.log("Successfully connected to bot account.");
        if (Object.keys(bot.servers).length > 0) {
            console.log("Found " + Object.keys(bot.servers).length + " server" + ((Object.keys(bot.servers).length > 1) ? "s" : "") + "...");
            Object.keys(bot.servers).forEach(function(index, value) {
                console.log("  -  " + bot.servers[index].name);
                config.servers[config.servers.length] = {
                    "id": null,
                    "default": null,
                    "ignoreChannels": []
                };
                config.servers[config.servers.length - 1].id = bot.servers[index].id;
                config.servers[config.servers.length - 1].default = (value === 0) ? true : false;
            });
            try {
                fs.writeFileSync(__dirname + "/discord-config.json", JSON.stringify(config));
                console.log("Successfully wrote to file \"discord-config.json\".");
            } catch(e) {
                console.log("Failed to write to file \"discord-config.json\"!");
            }
            bot.disconnect();
        } else {
            console.log(bot.username + " is not in any Discord servers.");
            bot.disconnect();
        }
    });
    bot.on("disconnect", function() {
        console.log("Exiting application...");
    })
} else {
    console.error("The bot token must be changed in order for this script to successfully run. To change the bot token, please view line 10 of update-config.js.");
}