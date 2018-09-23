const mapLimit = require('promise-map-limit');
const getTrendAndSave = require('../../app-actions/get-trend-and-save');
const addOvernightJumpAndTSO = require('../../app-actions/add-overnight-jump-and-tso');
const getMultipleHistoricals = require('../../app-actions/get-multiple-historicals');

module.exports = {
    name: 'user-modules',
    rn: [1, 100, 200, 300],
    fn: async (Robinhood, min) => {
        console.log('running user=modules fool');
        const { 
            instruments: top100RHinstruments
        } = await Robinhood.url('https://api.robinhood.com/midlands/tags/tag/100-most-popular/');
        console.log({ top100RHinstruments});
        const detailedInstruments = await mapLimit(top100RHinstruments, 3, Robinhood.url);
        const onlyTickers = detailedInstruments.map(t => t.symbol);
        console.log('done getting instrument details');

        const trend = await getTrendAndSave(Robinhood);
        const trendOfTop100 = trend.filter(t => onlyTickers.includes(t.ticker));
        const withOvernightJump = await addOvernightJumpAndTSO(Robinhood, trendOfTop100);
        const onlyWithFundamentals = withOvernightJump.filter(stock => stock.fundamentals);
        console.log('trendOfTop100', trendOfTop100.length);
        console.log('--------');
        console.log('onlyWithFundamentals', onlyWithFundamentals, onlyWithFundamentals.length);
        // add historicals
        let allHistoricals = await getMultipleHistoricals(
            Robinhood,
            onlyWithFundamentals.map(buy => buy.ticker),
            `interval=day`
        );

        let withHistoricals = onlyWithFundamentals.map((buy, i) => ({
            ...buy,
            historicals: allHistoricals[i]
        }));

        console.log('--------');
        console.log('withHistoricals', JSON.stringify(withHistoricals, null, 2));
    }
}