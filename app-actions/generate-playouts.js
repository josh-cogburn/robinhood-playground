const StratPerf = require('../models/StratPerf');

const generatePlayouts = async (strategy, day) => {
    const foundPerf = await StratPerf.findOne({
        stratMin: strategy,
        date: day
    });
    console.log('generatePlayouts', {
        strategy,
        day,
        found: !!foundPerf
    })
    if (!foundPerf || !foundPerf.perfs) return [];

    console.log(Object.keys(foundPerf));
    // console.log('found', foundPerf)
    console.log('herehere', JSON.stringify(foundPerf, null, 2))
    // const playouts = [];
    console.log('perfs');
    // if (!foundPerf || !foundPerf.perfs) return [];
    // console.log({
    //     stratPerf,
    //     strategy,
    //     day
    // })
    // Object.keys(stratPerf).forEach(breakdown => {
    //     const foundPerf = stratPerf[breakdown].find(t => t.strategyName === strategy);
    //     foundPerf && playouts.push(foundPerf.avgTrend);
    // });
    const foundTrends = foundPerf.toObject().perfs.map(p => p.avgTrend);
    console.log({ foundPerf, foundTrends });
    return foundTrends;
};

module.exports = generatePlayouts;