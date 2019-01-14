// fix because new server formats like - year-month-day
// we want month-day-year
const oldLocaleDateString = Date.prototype.toLocaleDateString;
Date.prototype.toLocaleDateString = function() {
    console.log('ouch baby.', this.getTime());
    const prevOutput = oldLocaleDateString.apply(this);
    const [year, month, day] = prevOutput.split('-');
    return [month, day, year].join('-');
};

global.log = console.log;
global.str = obj => log(JSON.stringify(obj, null, 2));