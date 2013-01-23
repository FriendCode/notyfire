// Global requires
var socketio = require('socket.io'),
    redis = require('redis');

// Constants
var DEFAULT_CHANNEL = 'default';
var REDIS_PUBSUB_CHANNEL = 'notyfire';


var NotyfireServer = function(port, redis_url, redis_channel, url_base) {
    // Config
    this.port = port;

    // Redis
    this.redis_client = null;
    this.redis_url = redis_url || '';
    this.redis_channel = redis_channel || REDIS_PUBSUB_CHANNEL;

    // Socketio
    this.url_base = url_base;

    // Socket io
    this.io = null;
};


NotyfireServer.prototype.onConnect = function(socket) {
    socket.join(DEFAULT_CHANNEL);
    this.setupSocketCallbacks(socket);
    };


NotyfireServer.prototype.onDisconnect = function(socket) {

};


NotyfireServer.prototype.onNotify = function(socket, channel_id, message) {
    console.log('message :' + message);
    socket.json.broadcast.to(channel_id).send(message);
};


NotyfireServer.prototype.onSubscribe = function(socket, channel_id) {
    socket.join(channel_id);
};


NotyfireServer.prototype.onUnsubscribe = function(socket, channel_id) {
    socket.leave(channel_id);
};


NotyfireServer.prototype.setupSocketCallbacks = function(socket) {
    var that = this;

    socket.on('notify', function(data) {
        var channel_id = data.channel_id;
        var message = data.message;
        that.onNotify(socket, channel_id, message);
    });

    socket.on('subscribe', function(data) {
        var channel_id = data;
        that.onSubscribe(socket, channel_id);
    });

    socket.on('unsubscribe', function(data) {
        var channel_id = data;
        that.onUnsubscribe(socket, channel_id);
    });

    socket.on('message', function(data) {
        // Nothing yet, communication are one way
    });
};


NotyfireServer.prototype.setupCallbacks = function() {
    var that = this;

    // Connection
    this.io.sockets.on('connection', function(socket) {
        that.onConnect(socket);
    });
};

NotyfireServer.prototype.onMQMessage = function(channel, data) {
    var message = null;
    try { message = JSON.parse(data); }
    catch (SyntaxError) { return false; }

    // Dispatch data
    for(var key in message) {
        this.dispatch(key, message[key]);
    }

    return true;
};


NotyfireServer.prototype.subscribeToMQ = function() {
    var that = this;

    // Start redis
    this.redis_client = redis.createClient(this.redis_url);
    // Subscribe to channel
    this.redis_client.subscribe(this.redis_channel);

    // Handle messages from channel
    this.redis_client.on('message', function(channel, message, pattern) {
        that.onMQMessage(channel, message);
    });
};


NotyfireServer.prototype.dispatch = function(channel_id, data) {
    this.io.sockets.json.in(channel_id).emit(channel_id, data);
};


NotyfireServer.prototype.run = function() {
    // Start socket.io
    this.io = socketio.listen(this.port, {
        resource: this.url_base
    });

    // Setup callbacks
    this.setupCallbacks();

    // Subscribe to MQ (redis)
    this.subscribeToMQ();
};


// Export server
module.exports = NotyfireServer;

/**
 * Example :
 *
 *  var NotyfireServer = require('./notyfire/server');
 *  var notyfire_port = 1234;
 *  var notyfire_server = new NotyfireServer(notyfire_port);
 *  notyfire_server.run();
 */