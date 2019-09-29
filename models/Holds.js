const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    ticker: String,
    buys: [{
        date: String,
        fillPrice: Number,
        quantity: Number,
        strategy: String,
        relatedPick: { type: Schema.Types.ObjectId, ref: 'picks' },
        data: Schema.Types.Mixed
    }],
});

schema.statics.registerAlpacaFill = async function(fillData) {
    const {
        ticker,
        alpacaOrder,
        strategy,
        dateStr = (new Date()).toLocaleDateString().split('/').join('-'),
        PickDoc,
    } = fillData;
    const newBuy = {
        date: dateStr,
        fillPrice: Number(alpacaOrder.filled_avg_price),
        quantity: Number(alpacaOrder.filled_qty),
        strategy,
        relatedPick: PickDoc,
        data: fillData.data
    };
    strlog({ newBuy })
    const HoldDoc = await this.updateOne(
        { ticker },
        { $push: { buys: newBuy } },
        { upsert: true }
    );
    strlog({ HoldDoc });
    return HoldDoc;
};

const Hold = mongoose.model('Hold', schema, 'holds');
module.exports = Hold;