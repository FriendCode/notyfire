var Notyfire = require('./lib/notyfire');

// Utility function
function createServer(port, server, channel, url) {
    // Simply proxy arguments to constructor ...
    return new Notyfire(port, server, channel, url);
}

// Exports
exports.createServer = createServer;
