const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    date: { type: String, index: true },
    closed: Boolean,
    totalBought: Number,
    percChange: Number,
    avgImpactPerc: Number,
    totalImpact: Number
});

const DateAnalysis = mongoose.model('DateAnalysis', schema, 'dateAnalysis');
module.exports = DateAnalysis;