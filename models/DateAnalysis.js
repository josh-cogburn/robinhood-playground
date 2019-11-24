const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    date: { type: String, index: true },
    closed: Boolean,
    totalBought: Number,
    percChange: Number,
    avgDayImpact: Number,
    totalImpact: Number,
    avgPickReturn: Number,
    avgMultiplierReturn: Number,
    totalPicks: Number,
    totalMultipliers: Number,
});

const DateAnalysis = mongoose.model('DateAnalysis', schema, 'dateAnalysis');
module.exports = DateAnalysis;