const redis = require('redis');

const sub = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

module.exports = {
    set io(io) {
        this._io = io;
    },
    get io() {
        return this._io;
    },
    subscribe(io) {
        this.io = io;
        sub.subscribe('realtime');
        sub.on('message', (channel, message) => this.onRealtimeMsg(channel, message));
    },
    onRealtimeMsg(channel, message) {
        if (message === 'ready') {
            const activeRooms = this.io.socketManager.activeRooms;
            this.notifySockets(Object.keys(activeRooms));
        }
    },
    notifySockets(rooms) {
        // debugger;
    },
};
/* class SubscriptionManager {


    set io(io) {
        this.io = io;
    }


    onPMessage(pattern, channel, message) {
        // check pattern here, any of our psubscribes will hit this listener
        if (pattern === 'realtime-*') {
            this.publishRealtime(channel, message);
        } else if (pattern === 'static-*') {
            this.publishStatic(channel);
        }
    }

    publishRealtime(channel, message) {
        const agency = this.extractAgency(channel);

        // emit the message to the interested parties
        if (agency) {
            this.io.to(agency).emit('realtime-data', message);
        }
    }
}*/
