var Notyfire = require('./lib/server');
var NotyfireClient = require('./lib/client');

// Utility function
function createServer(port, server, channel, url) {
    // Simply proxy arguments to constructor ...
    return new Notyfire(port, server, channel, url);
}

function createClient(channel, port, server, redisOptions) {
    return new NotyfireClient(channel, port, server, redisOptions);
}

// Exports
exports.createServer = createServer;
exports.createClient = createClient;
