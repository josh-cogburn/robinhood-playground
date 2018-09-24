'use strict';

const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const compression = require('compression');
const stratManager = require('./strat-manager');
const path = require('path');


const { lookupTickers } = require('../app-actions/record-strat-perfs');

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};

// console.log(__dirname, 'dirname');

app.use(compression({}));


const buildDir = path.join(__dirname, '../client/build');
console.log('build dir', buildDir);
app.use(express['static'](buildDir));

io.on('connection', (socket) => {

    socket.emit('server:welcome', stratManager.getWelcomeData());

    socket.on('get-current-prices', async tickers => {
        const response = await lookupTickers(Robinhood, tickers, true);
        console.log('got current pricessss', response);
        socket.emit('server:current-prices', response);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnect');
    });

});

server.listen(port, async () => {
    await stratManager.init(io);
    console.log('[INFO] Listening on *:' + port);
});
