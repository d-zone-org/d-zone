var convict = require('convict');
var path = require('path');

// Define a schema
var config = module.exports = convict({
    email: {
        doc: "The email for your Discord account. Ignored if token provided.",
        format: "email"
    },
    password: {
        doc: "The password for your Discord account. Ignored if token provided.",
        format: String
    },
    token: {
        doc: "The token for your Discord account. Only required for bot accounts.",
        format: String
    },
    servers: [
        {
            id: {
                doc: "The Discord server ID you want to attach to",
                format: String,
                default: "123456789"
            },
            default: {
                doc: "Indicates whether clients connect to this server by default. One server should have this set to true.",
                format: Boolean
            },
            password: {
                doc: "Optional, clients will be required to enter this password to connect to this server.",
                format: String
            },
            ignoreChannels: {
                doc: "Optional, list of text channel names you want to be ignored (cannot be used with listenChannels, case-sensitive).",
                format: Array
            },
            listenChannels: {
                doc: "Optional, list of text channel names you do not want to ignore (cannot be used with ignoreChannels, case-sensitive).",
                format: Array
            }
        }
    ]
});

// Load configuration
config.loadFile(path.resolve(__dirname,'discord-config.json'));

// Perform validation
config.validate();