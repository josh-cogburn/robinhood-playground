'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const compression = require('compression');
const stratManager = require('./strat-manager');
const path = require('path');
const DayReport = require('../models/DayReport');
const Pick = require('../models/Pick');

const mapLimit = require('promise-map-limit');
const lookupMultiple = require('../utils/lookup-multiple');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const jsonMgr = require('../utils/json-mgr');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const restartProcess = require('../app-actions/restart-process');
const pmPerf = require('../analysis/pm-perf-for-real');

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};

// console.log(__dirname, 'dirname');

app.use(compression({}));


const prependFolder = folder => path.join(__dirname, `../${folder}`);
app.use('/', express['static'](prependFolder('client/build')));
app.use('/user-strategies', express['static'](prependFolder('user-strategies/build')));

io.on('connection', async socket => {

    socket.emit('server:welcome', await stratManager.getWelcomeData());

    socket.on('get-current-prices', async tickers => {
        const response = await lookupMultiple(tickers, true);
        console.log('got current pricessss', response);
        socket.emit('server:current-prices', response);
    });

    socket.on('getRecentTrends', async (cb) => {
        const mostPopularFiles = (await getFilesSortedByDate('100-most-popular')).slice(-3);
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

        for (let userStrat of withJSON) {
            socket.emit('server:user-strat', userStrat);
        }

        return cb(obj);
    });

    socket.on('getDayReports', async cb => {
        console.log('getting day reports');
        cb({ dayReports: await DayReport.find() });
    });

    socket.on('getPickData', async (id, cb) => {
        const pickData = await Pick.findById(id, { data: 1 });
        if (pickData) {
            console.log('sending ', pickData.data);
            cb(pickData.data);
        }
        cb(pickData);
    });

    socket.on('getStScore', async (ticker, cb) => {
        console.log(`getting st sent for ${ticker}`);
        cb(
            await getStSentiment(ticker)
        );
    });


    socket.on('pullGit', async cb => {
        console.log('pulling git')
        await exec('git pull origin master');
        cb && cb('DONE PULLING');
    });

    socket.on('restartProcess', async cb => {
        console.log('restarting process')
        await restartProcess();
        cb && cb('DONE RESTARTING');
    });

    socket.on('client:get-pm-analysis', async cb => {
        console.log('get pm analysis');
        const data = await pmPerf()
        console.log('got pm perf')
        socket.emit('server:pm-analysis', data);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnect');
    });

});

server.listen(port, async () => {
    stratManager.init({ io });
    console.log('[INFO] Listening on *:' + port);
});
