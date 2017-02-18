const socketio = require('socket.io');

class SocketManager {

    set app(app) {
        this._app = app;
        this._io = socketio.listen(app);
    }

    get io() {
        return this._io;
    }

    listen(app) {
        this.app = app;
        this._io.on('connection', this.onConnection.bind(this));
        return this._io;
    }

    onConnection(socket) {
        socket.on('join', this.onJoin.bind(this, socket));
    }

    onJoin(socket, room) {
        this.leaveRooms(socket);
        socket.join(room);
    }

    leaveRooms(socket) {
        Object.keys(socket.rooms).forEach((room) => {
            if (room !== socket.id) {
                socket.leave(room);
            }
        });
    }
}

// exporting socket manager instance,
// this class should act as a singleton
module.exports = new SocketManager();
