const socketio = require('socket.io');

module.exports = {
    activeRooms: {},

    listen(server) {
        const io = socketio.listen(server);
        io.on('connection', (socket) => {
            socket.on('disconnecting', () => this.leaveRooms(socket));
            socket.on('join', this.onJoin);
        });
        io.socketManager = this;
        return io;
    },


    onJoin(room) {
        const socketManager = this.server.socketManager;
        socketManager.leaveRooms(this);
        socketManager.activeRooms[room] = ++socketManager.activeRooms[room] || 1;
        this.join(room);
    },

    leaveRooms(socket) {
        Object.keys(socket.rooms).forEach((r) => {
            if (r !== socket.id) {
                socket.leave(r);

                if (!--this.activeRooms[r]) {
                    delete this.activeRooms[r];
                }
            }
        });
    },
};
