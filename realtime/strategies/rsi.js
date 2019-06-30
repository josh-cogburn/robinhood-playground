const { RSI } = require('technicalindicators');

const getRSI = values => {
    return RSI.calculate({
        values,
        period: 14
    }) || [];
};

module.exports = {
    period: [5, 10, 30],
    // collections: 'all',
    handler: async ({ ticker, allPrices }) => {
        const allCurrents = allPrices.map(obj => obj.currentPrice);
        const mostRecent = allCurrents[allCurrents.length - 1];
        const rsiSeries = getRSI(allCurrents);
        const rsi = rsiSeries[rsiSeries.length - 1];
        console.log({ rsi })
        if (rsi < 30) {
            return {
                ticker,
                keys: {
                    ...(rsiKey = () => {
                        const num = [10, 15, 20, 25, 30].find(val => rsi < val);
                        const key = num ? `rsilt${num}` : 'fluke';
                        return { key: true };
                    })()
                },
                data: {
                    allPrices,
                    mostRecent,
                    rsiSeries,
                    rsi,
                }
            };
        }
    },
    pms: {
        
        rsilt20: strat => [
            'rsilt20',
            'rsilt15',
            'rsilt10',
        ].some(text => strat.includes(text)),

        shouldWatchout: strat => strat.includes('shouldWatchout'),
        notWatchout: strat => strat.includes('notWatchout'),

        firstAlerts: strat => strat.includes('firstAlert'),

        '30minute': strat => strat.includes('30min'),
        '10minute': strat => strat.includes('10min'),
        '5minute': strat => strat.includes('5min')
    }
};