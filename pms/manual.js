const highVolumePicks = [
    'high-volume-tscPosLt3-absVolume-5',
    'high-volume-tscPosLt3-volumeTo2Week-5',
    'high-volume-tscPosLt3-twoWeekToAvg-5',
    'high-volume-tscPosLt3-volumeToAvg-5',

    'high-volume-tscLt3-absVolume-5',
    'high-volume-tscLt3-volumeTo2Week-5',
    'high-volume-tscLt3-twoWeekToAvg-5',
    'high-volume-tscLt3-volumeToAvg-5',

    'high-volume-tscPosLt3-absVolume-60',
    'high-volume-tscPosLt3-volumeTo2Week-60',
    'high-volume-tscPosLt3-twoWeekToAvg-60',
    'high-volume-tscPosLt3-volumeToAvg-60',

    'high-volume-tscLt3-absVolume-60',
    'high-volume-tscLt3-volumeTo2Week-60',
    'high-volume-tscLt3-twoWeekToAvg-60',
    'high-volume-tscLt3-volumeToAvg-60',
];

const newHighPicks = [
    'new-highs-highestThirtyFiveTo90Ratio-lowestfiveTo35ratio-0',
    'new-highs-overall-lowestfiveTo35ratio-0',
    'new-highs-lowestThirtyFiveTo90RatioSma180Up-highestfiveTo35ratio-0',

    'new-highs-highestThirtyFiveTo90Ratio-lowestfiveTo35ratio-90',
    'new-highs-overall-lowestfiveTo35ratio-90',
    'new-highs-lowestThirtyFiveTo90RatioSma180Up-highestfiveTo35ratio-90',

    'new-highs-top100RH-overall-lowestfiveTo35ratio-0',
    'new-highs-top100RH-overall-lowestfiveTo35ratio-90',
    
    'new-highs-top100RH-highestThirtyFiveTo90RatioSma180Up-lowestfiveTo35ratio-0',
    'new-highs-top100RH-highestThirtyFiveTo90RatioSma180Up-lowestfiveTo35ratio-90',
];

const feelingGoodInTheNeighborhood = [
    ...highVolumePicks,
    ...newHighPicks,
];
module.exports = {
    ...require('./ticker-watchers'),
    // ...require('./ask-watchers'),
    ...require('./best-st-sentiment'),
    ...require('./ema-crossovers'),

    feelingGoodInTheNeighborhood,
        highVolumePicks,
        newHighPicks
};