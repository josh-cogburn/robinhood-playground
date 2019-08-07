const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    timestamp: { type : Date, default: Date.now },
    date: { type: String, index: true },
    strategyName: String,
    min: Number,
    picks: [{
        ticker: String,
        price: Number
    }],
    data: Schema.Types.Mixed,
    keys: Schema.Types.Mixed,
    isRecommended: Schema.Types.Boolean
});

schema.statics.getUniqueDates = async function() {
    const response = await this.distinct('date');
    return response.sort((a, b) => new Date(a) - new Date(b));
};

schema.statics.getRecentRecommendations = async function() {
    return this.find({ 
        isRecommended: true,
        timestamp: { $gt: new Date(Date.now() - 24*60*60 * 1000) }
    }).lean();
};

const Pick = mongoose.model('Pick', schema, 'picks');
module.exports = Pick;