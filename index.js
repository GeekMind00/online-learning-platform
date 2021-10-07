const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
});

const port = process.env.PORT || 3000;


io.on('connection', (socket) => {
    // console.log('a user connected');


    socket.on('error', function () {
        console.log('Connection Failed');
    });
    socket.on('connect', function () {
        console.log('Connected');
    });
    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected!');
    });
    socket.on('reconnect_attempt', () => {
        console.log('trying to reconnect');
    });
    socket.on('reconnecting', () => {
        console.log('reconnecting');
    });
    socket.on('reconnect_failed', () => {
        console.log('failed');
    });
    socket.on('reconnect_error', () => {
        console.log('error');
    });
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));