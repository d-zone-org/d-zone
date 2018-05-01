var convict = require('convict');
var path = require('path');

// Define a schema
var config = module.exports = convict({
    token: {
        doc: "The login token for your Discord bot.",
        format: String
    },
    url: {
        doc: "The site URL where the simulation can be viewed.",
        format: "url"
    },
    infoCommand: {
        doc: "The command which the bot will respond to with the site URL.",
        format: String
    },
    servers: [
        {
            id: {
                doc: "The Discord server ID you want to simulate.",
                format: String,
                default: "123456789"
            },
            default: {
                doc: "Indicates whether clients connect to this server by default. One server should have this set to true.",
                format: Boolean
            },
            alias: {
                doc: "Optional, server selection box will show this instead of the actual server name.",
                format: String
            },
            password: {
                doc: "Optional, clients will be required to enter this password to connect to this server.",
                format: String
            },
            ignoreChannels: {
                doc: "Optional, list of text channel names or IDs you want to be ignored (cannot be used with listenChannels, case-sensitive).",
                format: Array
            },
            ignoreUsers: {
                doc: "Optional, list of user IDs you want to be ignored (user ID means the long string of numbers, not username@1234).",
                format: Array
            },
            listenChannels: {
                doc: "Optional, list of text channel names or IDs you do not want to ignore (cannot be used with ignoreChannels, case-sensitive).",
                format: Array
            }
        }
    ]
});

// Load configuration
config.loadFile(path.resolve(__dirname,'discord-config.json'));

// Perform validation
config.validate();
