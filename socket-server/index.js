'use strict';

const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const compression = require('compression');
const stratManager = require('./strat-manager');

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};

console.log(__dirname, 'dirname');

app.use(compression({}));
app.use(express['static'](__dirname + '/../client/build'));

io.on('connection', (socket) => {

    socket.emit('server:welcome', stratManager.getWelcomeData());

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnect');
    });

});

server.listen(port, async () => {
    await stratManager.init(io);
    console.log('[INFO] Listening on *:' + port);
});
