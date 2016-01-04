var convict = require('convict');
var path = require('path');

// Define a schema
var config = module.exports = convict({
    email: {
        doc: "The email for your Discord login.",
        format: "email",
        default: "test@example.com"
    },
    password: {
        doc: "The password for your Discord login.",
        format: String,
        default: "password"
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
                doc: "Optional, list of text channel names you want to be ignored (case-sensitive).",
                format: Array
            }
        }
    ]
});

// Load configuration
config.loadFile(path.resolve(__dirname,'discord-config.json'));

// Perform validation
config.validate({strict: true});