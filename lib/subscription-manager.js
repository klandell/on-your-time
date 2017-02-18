const redis = require('redis');

class SubscriptionManager {

    constructor() {
        this._sub = redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });
    }

    set io(io) {
        this._io = io;
    }

    subscribe(io) {
        this.io = io;
        this.doSubscription();
        this._sub.on('pmessage', this.onPMessage.bind(this));
    }

    doSubscription() {
        this._sub.psubscribe('realtime-*');
        this._sub.psubscribe('static-*');
    }

    onPMessage(pattern, channel, message) {
        // check pattern here, any of our psubscribes will hit this listener
        if (pattern === 'realtime-*') {
            this.publishRealtime(channel, message);
        } else if (pattern === 'static-*') {
            this.publishStatic(channel);
        }
    }

    extractAgency(channel) {
        const match = channel.match(/-(\w*)/);
        return match && match[1];
    }

    publishRealtime(channel, message) {
        const agency = this.extractAgency(channel);

        // emit the message to the interested parties
        if (agency) {
            this._io.to(agency).emit('realtime-data', message);
        }
    }

    publishStatic(channel, message) {
        const agency = this.extractAgency(channel);

        // tell interested parties that there is new static data to download
        // the data will actually be downloaded via an ajax request
        if (agency) {
            this._io.to(agency).emit('static-data', message);
        }
    }
}

// exporting subscription manager instance,
// this class should act as a singleton
module.exports = new SubscriptionManager();
