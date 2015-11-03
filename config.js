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
        }
    }
});

// Load configuration
config.loadFile('./config.json');

// Perform validation
config.validate({strict: true});