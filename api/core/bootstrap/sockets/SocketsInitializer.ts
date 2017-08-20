var passportSocketIo = require('passport.socketio');

declare var sails: any;

export class SocketsInitializer {
    public register() {
        var io = require('socket.io')(sails.hooks.http.server);
        io.use(passportSocketIo.authorize({
            key: 'sails.sid',       // the name of the cookie where express/connect stores its session_id 
            secret: sails.config.session.secret,    // the session_secret to parse the cookie 
            store: sails.config.session.store,        // we NEED to use a sessionstore. no memorystore please 
            success: (data, accept) => {
                accept();
            },
            fail: (data, message, error, accept) => {
                console.log('failed connection to socket.io:', message);
                if (error) {
                    accept(new Error(message));
                }
            },
        }));

        io.on('connection', (socket) => {
            var hotelId = socket.conn.request.user.sessionDO.hotel.id;
            socket.join(hotelId);
        });

        // saving globally the socket.io server instance 
        sails.config.ws = io;
    }
}