const { CronJob } = require('cron');

let allCrons = [];

const regCronIncAfterSixThirty = (Robinhood, { name, run, fn }) => {
    const d = new Date();
    d.setHours(9, 30);
    run.forEach((min, index) => {
        const newDateObj = new Date(d.getTime() + min * 60000);
        newDateObj.setSeconds(0);
        const cronStr = `${newDateObj.getMinutes()} ${newDateObj.getHours()} * * 1-5`;

        allCrons.push({
            date: newDateObj,
            cronStr,
            name
        });
        // console.log('push all', allCrons);
        new CronJob(cronStr, () => {
            console.log('starting cron: ', name);
            const callFn = () => fn(Robinhood, min, index);
            if (min === 0) {
                setTimeout(callFn, 5000);
            } else {
                callFn();
            }
        }, null, true);
    });
};

regCronIncAfterSixThirty.display = function() {
    allCrons = allCrons.sort((b, a) => b.date - a.date);
    allCrons.forEach(({cronStr, date, name}) => {
        date.setHours(date.getHours() + 3); // west coast best coast 
        console.log(date.toLocaleTimeString(), cronStr, name, ' - ', );
    });
};

module.exports = regCronIncAfterSixThirty;
