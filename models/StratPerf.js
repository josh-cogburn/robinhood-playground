const mongoose = require('mongoose');

const schema = {
    date: { type: String, index: true },
    stratMin: { type: String, index: true },
    perfs: [{
        period: String,
        avgTrend: Number
    }]
};

const StratPerf = mongoose.model('StratPerf', schema, 'stratPerfs');
module.exports = StratPerf;