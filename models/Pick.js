const mongoose = require('mongoose');

const schema = {
    date: String,
    strategyName: String,
    min: Number,
    picks: [{
        ticker: String,
        price: Number
    }]
};

const Pick = mongoose.model('Pick', schema);
module.exports = Pick;