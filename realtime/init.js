const fs = require('mz/fs');
const path = require('path');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
// const executeStrategy = require('./execute-strategy');
const RealtimeRunner = require('./RealtimeRunner');

let modules = [];

module.exports = async () => {


    var normalizedPath = path.join(__dirname, './strategies');

    const files = (await fs.readdir(normalizedPath))
        .filter(fileName => !fileName.startsWith('.'))
        // .map(fileName => `${normalizedPath}/${fileName}`);

    for (let file of files) {
        // const isDir = (await fs.lstat(file)).isDirectory();
        // if (!isDir) {
        try {
            const moduleFile = require(`./strategies/${file}`);
            RealtimeRunner.addStrategy(moduleFile, file.split('.')[0]);
        } catch (e) {
            console.log('unable to init', file, e);
        }
        // }
    }


    await RealtimeRunner.init();

};
