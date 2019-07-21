// fix because new server formats like - year-month-day
// we want month-day-year

const oldLocaleDateString = Date.prototype.toLocaleDateString;
Date.prototype.toLocaleDateString = function() {
    // console.log('ouch baby.', this.getTime());
    const prevOutput = oldLocaleDateString.apply(this);
    const [year, month, day] = prevOutput.split('-');
    if (year.length !== 4) return prevOutput;
    return [month, day, year].join('-');
};

global.log = console.log;
global.str = global.strlog = obj => log(JSON.stringify(obj, null, 2));
global.mapLimit = require('promise-map-limit');

Array.prototype.flatten = function() {
    return [].concat(...this);
};

Array.prototype.uniq = function() {
    return [...new Set(this)];
};

const roundTo = numDec => num => Math.round(num * Math.pow(10, numDec)) / Math.pow(10, numDec);
const oneDec = roundTo(1);
const twoDec = roundTo(2);

global.twoDec = twoDec;


const cTable = require('console.table');

const _ = require('underscore');
_.mixin({
    get: function(obj, path) {
        if (!obj) return null;
        return obj[path];
    }
});