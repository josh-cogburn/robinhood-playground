const { KST } = require('technicalindicators');

const getKST = (values, ticker) => {
    values = (values || []).filter(Boolean);
    const kstSeries = KST.calculate({
        values,
        ROCPer1: 17,
        ROCPer2: 12,
        ROCPer3: 20,
        ROCPer4: 25,
        SMAROCPer1: 6,
        SMAROCPer2: 5,
        SMAROCPer3: 1,
        SMAROCPer4: 1,
        signalPeriod: 8
    });
    if (!kstSeries || kstSeries.length < 2) {
        return {};
    }
    const [secondToLast, lastVal] = kstSeries.slice(-2);
    const isSignalCross = (
        secondToLast.kst < secondToLast.signal &&
        lastVal.kst > lastVal.signal
    );
    const isZeroCross = (
        secondToLast.kst < 0 &&
        lastVal.kst > 0
    );
    const isLow = (() => {
        const isBelowZero = val => val < 0;
        const isBelowLowerQuarter = (() => {
            const kstVals = kstSeries
                .map(({ kst, signal }) => [kst, signal])
                .flatten()
                .filter(Boolean)
            const max = Math.max(...kstVals);
            const min = Math.min(...kstVals);
            const diff = max - min;
            const lowQuarter = min + (diff * .3);
            // console.log({ min, max, diff, lowQuarter, lastVal, secondToLast})
            return val => val < lowQuarter;
        })();
        const bothTestsPass = val => [isBelowZero, isBelowLowerQuarter].every(
            test => test(val)
        );
        return [lastVal, secondToLast]
            .map(({ kst, signal }) => [kst, signal])
            .flatten()
            .every(bothTestsPass)
    })();
    // if (isSignalCross || isZeroCross) {
    //     console.log({
    //         values,
    //         ticker,
    //         secondToLast,
    //         lastVal,
    //         isSignalCross,
    //         isZeroCross,
    //         isLow,
    //         kstSeries
    //     });
    // }
    return {
        kstSeries,
        isSignalCross,
        isZeroCross,
        isLow
    };
};


module.exports = {
    period: [5, 10, 30],
    // collections: 'all',
    handler: async ({ ticker, allPrices }) => {
        const allCurrents = allPrices.map(obj => obj.currentPrice);
        const { kstSeries, isSignalCross, isZeroCross, isLow } = getKST(allCurrents, ticker);
        if (isSignalCross || isZeroCross) {
            return {
                ticker,
                keys: {
                    isSignalCross,
                    isZeroCross,
                    isLow
                },
                data: {
                    allCurrents,
                    mostRecent: allPrices[allPrices.length - 1],
                    kstSeries,
                }
            };
        }
    },
    pms: {
        signalCrosses: 'isSignalCross',
        zeroCrosses: 'isZeroCross',
        isLow: 'isLow',

        shouldWatchout: 'shouldWatchout',
        notWatchout: 'notWatchout',

        firstAlerts: 'firstAlert',

        '30minute': '30min',
        '10minute': '10min',
        '5minute': '5min',

        options30minNotWatchout: ['options', '30min', 'notWatchout'],

        zeroAndOnezeroCrosses30Min: ['zeroAndOne', '30min', 'isZeroCross'],
        zeroAndOnesignalCrossesislow30Min: ['zeroAndOne', '30min', 'isSignalCross', 'isLow'],

        optionszeroCrosses30Min: ['options', '30min', 'isZeroCross'],
        optionssignalCrossesislow30Min: ['options', '30min', 'isSignalCross', 'isLow'],
        
    }
};