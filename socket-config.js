const convict = require('convict');
const path = require('path');

// Define a schema
const config = convict({
    address: {
        doc: 'The address/URL of your websocket server.',
        format: String,
        default: '192.168.0.1'
    },
    port: {
        doc: 'The port for your websocket server address.',
        format: 'port',
        default: '3000'
    },
    secure: {
        doc: 'Set to true to use wss:// protocol instead of ws://',
        format: Boolean,
        default: false
    }
});

// Load configuration
config.loadFile(path.resolve(__dirname,'socket-config.json'));

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;
