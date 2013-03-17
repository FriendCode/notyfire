var NotyfireServer = require('./lib/server').NotyfireServer;
var NotyfireClient = require('./lib/client').NotyfireClient;

// Utility function
function createServer(port, server, channel, url) {
    // Simply proxy arguments to constructor ...
    return new NotyfireServer(port, server, channel, url);
}

function createClient(channel, port, server, redisOptions) {
    return new NotyfireClient(channel, port, server, redisOptions);
}

// Exports
exports.createServer = createServer;
exports.createClient = createClient;

exports.NotyfireClient = NotyfireClient;
exports.NotyfireServer = NotyfireServer;