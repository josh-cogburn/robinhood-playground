const colors = ['green', 'orange', 'yellow', 'pink', 'blue' ];

const fields = {
    'S&P500': d => d.sp500Trend,
    'unrealized return': d => d.holdReturn.percentage,
    'realized return': d => d.sellReturn.percentage,
    'forPurchase PM': d => d.forPurchase.avgTrend,
    'account balance': d => d.accountBalance
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
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dayReports.map(fields[key])
    }));
    console.log(datasets, Object.keys(fields))
    return {
        labels: dayReports.map(day => day.date),
        datasets
    };
};

export default {
    balanceChart: process(['account balance']),
    unrealizedVsRealized: process(['unrealized return', 'realized return']),
    sp500VsForPurchase: process(['forPurchase PM', 'S&P500'])
};