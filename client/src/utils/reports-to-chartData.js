import getTrend from './get-trend';

const colors = ['blue', 'green', 'orange', 'yellow', 'pink', 'indigo', 'purple', 'brown', 'yellow', 'violet'];

const fields = {
    // dayReports
    'unrealized return': d => d.holdReturn.percentage,
    'realized return': d => d.sellReturn.percentage,
    'forPurchase PM avg trend %': d => d.forPurchasePM.avgTrend,
    'forPurchase PM weighted trend %': d => d.forPurchasePM.weightedTrend,
    'pick to execution %': d => d.pickToExecutionPerc,

    // balanceReports
    'account balance': (d, i, array) =>  i === 0 ? 100 : getTrend(d.accountBalance, array[0].accountBalance) + 100,
    'SP500': (d, i, array) =>  i === 0 ? 100 : getTrend(d.indexPrices.sp500, array[0].indexPrices.sp500) + 100,
    'nasdaq': (d, i, array) =>  i === 0 ? 100 : getTrend(d.indexPrices.nasdaq, array[0].indexPrices.nasdaq) + 100,
    'russell2000': (d, i, array) =>  i === 0 ? 100 : getTrend(d.indexPrices.russell2000, array[0].indexPrices.russell2000) + 100
};

const getColor = field => colors[Object.keys(fields).findIndex(f => f === field)];

const process = fieldsToInclude => dayReports => {
    const datasets = fieldsToInclude.map(key => ({
        label: key,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: getColor(key),
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: getColor(key),
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: getColor(key),
        pointHoverBorderColor: 'black',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dayReports.map(fields[key])
    }));
    console.log(datasets, Object.keys(fields))
    return {
        labels: dayReports.map(day => new Date(day.time).toLocaleString() || day.date),
        datasets
    };
};

export default {
    balanceChart: process(['account balance', 'SP500', 'nasdaq', 'russell2000']),
    unrealizedVsRealized: process(['unrealized return', 'realized return']),
    spyVsForPurchase: process(['forPurchase PM avg trend %', 'forPurchase PM weighted trend %']),
    pickToExecutionPerc: process(['pick to execution %'])
};