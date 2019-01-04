// fix because new server formats like - year-month-day
// we want month-day-year
const oldLocaleDateString = global.Date.toLocaleDateString;
global.Date.prototype.toLocaleDateString = function() {
    console.log('ouch baby.', this.getTime());
    const prevOutput = toLocaleDateString.apply(this);
    const [year, month, day] = prevOutput.split('-');
    return [month, day, year].join('-');
};