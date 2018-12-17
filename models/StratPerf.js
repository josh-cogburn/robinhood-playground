const mongoose = require('mongoose');
const { Schema } = mongoose;

const { orderBreakdownKeys } = require('../utils/breakdown-key-compares');

const schema = new Schema({
    date: { type: String, index: true },
    stratMin: { type: String, index: true },
    perfs: [{
        period: String,
        avgTrend: Number
    }]
});

schema.statics.getUniqueDates = async function() {
    const response = await this.distinct('date');
    return response.sort((a, b) => new Date(a) - new Date(b));
}

schema.statics.getByDate = async function(date) {
    console.log('getting strat-perfs for day', date);
    const recs = await this.find({ date });
    const byBreakdown = {};
    recs.forEach(rec => {
        rec.perfs.forEach(({ period, avgTrend }) => {
            byBreakdown[period] = (byBreakdown[period] || []).concat(
                {
                    strategyName: rec.stratMin,
                    avgTrend,
                }
            );
        });
    });

    return byBreakdown;
};  

const StratPerf = mongoose.model('StratPerf', schema, 'stratPerfs');
module.exports = StratPerf;