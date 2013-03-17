// Requires
var _ = require('underscore');

var util = require('util');

var redis = require('redis');
var stream = require('readable-stream');


function NotyfireClientStream(client, channel) {
    NotyfireClientStream.super_.call(this);

    this.client = client;
    this.channel = channel;
}
util.inherits(NotyfireClientStream, stream.Writable);


NotyfireClientStream.prototype._write = function(chunk, encoding, callback) {
    this.sendChannel(this.channel, data);
    callback();
};



function NotyfireClient(channel, port, server, redisOptions) {
    _.bindAll(this);

    this.channel = channel || 'notyfire';
    this.client = redis.createClient(port, server, redisOptions);
}

NotyfireClient.prototype.send = function() {
    var args = _.toArray(arguments);

    if(args.length == 2) {
        return this.sendChannel.apply(this, args);
    }
    return this.sendBatch.apply(this, args);
};


NotyfireClient.prototype.sendBatch = function(channelMap) {
    // Dict of data where keys are notyfire channels and
    // values are the data to be send on those channels
    var channelData = JSON.stringify(channelMap);
    return this.client.publish(this.channel, channelData);
};

NotyfireClient.prototype.sendChannel = function(channel, data) {
    var batch = _.object([
        [channel, data]
    ]);
    return this.sendBatch(batch);
};

NotyfireClient.prototype.createStream = function(channel) {
    return new NotyfireClientStream(this, channel);
};


// Exports
exports.NotyfireClient = NotyfireClient;