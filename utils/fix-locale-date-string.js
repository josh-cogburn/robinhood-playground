// fix because new server formats like - year-month-day
// we want month-day-year
const oldLocaleDateString = Date.prototype.toLocaleDateString;
Date.prototype.toLocaleDateString = function() {
    console.log('ouch baby.', this.getTime());
    const prevOutput = oldLocaleDateString.apply(this);
    const [year, month, day] = prevOutput.split('-');
    if (year.length !== 4) return prevOutput;
    return [month, day, year].join('-');
};

global.log = console.log;
global.str = obj => log(JSON.stringify(obj, null, 2));
global.mapLimit = require('promise-map-limit');
global.flatten = arr => [].concat(...arr);