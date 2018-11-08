'use strict';

const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const compression = require('compression');
const stratManager = require('./strat-manager');
const path = require('path');


const mapLimit = require('promise-map-limit');
const { lookupTickers } = require('../app-actions/record-strat-perfs');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const jsonMgr = require('../utils/json-mgr');

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};

// console.log(__dirname, 'dirname');

app.use(compression({}));


const prependFolder = folder => path.join(__dirname, `../${folder}`);
app.use('/client', express['static'](prependFolder('client/build')));
app.use('/user-strategies', express['static'](prependFolder('user-strategies/build')));

io.on('connection', (socket) => {

    socket.emit('server:welcome', stratManager.getWelcomeData());

    socket.on('get-current-prices', async tickers => {
        const response = await lookupTickers(Robinhood, tickers, true);
        console.log('got current pricessss', response);
        socket.emit('server:current-prices', response);
    });

    socket.on('getRecentTrends', async (cb) => {
        const mostPopularFiles = await getFilesSortedByDate('100-most-popular');
        console.log({ mostPopularFiles })
        const withJSON = await mapLimit(mostPopularFiles, 1, async file => ({
            file,
            json: await jsonMgr.get(`./json/100-most-popular/${file}.json`)
        }));
        console.log({ withJSON})
        const obj = withJSON.reduce((acc, { file, json }) => ({
            ...acc,
            [file]: json
        }), {});
        console.log(obj);
        return cb(obj);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnect');
    });

});

server.listen(port, async () => {
    stratManager.init(io);
    console.log('[INFO] Listening on *:' + port);
});
