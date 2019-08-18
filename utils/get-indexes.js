const request = require('request-promise');
const cheerio = require('cheerio');
const mapLimit = require('promise-map-limit');
const lookupMultiple = require('./lookup-multiple');
const { mapObject } = require('underscore');

const indexes = {
    sp500: 'SPY',
    nasdaq: 'QQQ',
    russell2000: 'IWM'
};

const getIndexPrice = async index => {
    const url = indexes[index];
    // console.log({ index, url })
    const res = await request(url);
    const $ = cheerio.load(res);
    const text = $('#quote-header-info > div:nth-child(3) > div > div span').first().text();
    return {
        index,
        price: Number(text.replace(/\,/g,''))
    };
};

let lastPrices = {};

module.exports = async () => {

    const lookups = await lookupMultiple(Object.values(indexes));

    return mapObject(indexes, ticker => lookups[ticker]);

    const asArray = await mapLimit(Object.values(indexes), 1, lookupMultiple);
    const response = asArray.reduce((acc, { index, price }) => ({
        ...acc,
        [index]: price ? price : (() => {
            console.log('retreiving from lastPrices because !price', index);
            return lastPrices[index];
        })()
    }), {});
    lastPrices = response;
    return response;
};