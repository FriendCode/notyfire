var Notyfire = require('./lib/notyfire');

// Utility function
function createServer(port, server, channel) {
    // Simply proxy arguments to constructor ...
    return new Notyfire(port, server, channel);
}

// Exports
exports.createServer = createServer;
