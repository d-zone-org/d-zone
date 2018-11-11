const convict = require('convict');
const path = require('path');

// Define a schema
const config = convict({
    url: {
        doc: "The site URL where the simulation can be viewed.",
        format: "url",
        default: ""
    },
    infoCommand: {
        doc: "The command which the bot will respond to with the site URL.",
        format: String,
        default: "!d-zone"
    },
    autoPopulate: {
        doc: "Whether to create a d-zone for each Discord server the bot is in.",
        format: Boolean,
        default: true
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
                format: Boolean,
                default: false
            },
            alias: {
                doc: "Optional, server selection box will show this instead of the actual server name.",
                format: String,
                default: ''
            },
            password: {
                doc: "Optional, clients will be required to enter this password to connect to this server.",
                format: String,
                default: ''
            },
            ignoreChannels: {
                doc: "Optional, list of text channel names or IDs you want to be ignored (cannot be used with listenChannels, case-sensitive).",
                format: Array,
                default: []
            },
            ignoreUsers: {
                doc: "Optional, list of user IDs you want to be ignored (user ID means the long string of numbers, not username@1234).",
                format: Array,
                default: []
            },
            listenChannels: {
                doc: "Optional, list of text channel names or IDs you do not want to ignore (cannot be used with ignoreChannels, case-sensitive).",
                format: Array,
                default: []
            }
        }
    ]
});

// Load configuration
config.loadFile(path.resolve(__dirname, 'discord-config.json'));

// Perform validation
config.validate();

module.exports = config;
