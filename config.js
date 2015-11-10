var convict = require('convict');

// Define a schema
var config = module.exports = convict({
    discord: {
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
        serverID: {
            doc: "The Discord server ID you want to attach to",
            format: String,
            default: "123456789"
        }
    },
    server: {
        address: {
            doc: "The address of your websocket server.",
            format: "ipaddress",
            default: "192.168.0.1"
        },
        port: {
            doc: "The port for your websocket server address.",
            format: "port",
            default: "3000"
        }
    }
});

// Load configuration
config.loadFile('./config.json');

// Perform validation
config.validate({strict: true});