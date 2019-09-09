const { mapObject, prefixKeys } = require('underscore');

const data = {

  // RSI
  rsi30: `
    rsi-fitty-30min-rsilt5-under2-firstAlert-notWatchout-lunch-5000
    rsi-fitty-30min-rsilt5-under2-notWatchout-dinner-5000
    rsi-fitty-30min-rsilt15-under2-notWatchout-dinner-5000
    rsi-fitty-30min-rsilt25-under2-notWatchout-dinner-5000
  `,
  rsiDaily: `
    rsi-fitty-daily-rsilt20-firstAlert-notWatchout-lunch-5000
  `,
  rsi10: `
    rsi-fitty-10min-rsilt5-under2-firstAlert-notWatchout-initial-5000
    rsi-fitty-10min-rsilt5-under2-notWatchout-initial-5000
  `,

  // PENNYSCANS
  pennyscans: `
    pennyscan-hot-st-projectedVolume-firstAlert-shouldWatchout-initial-5000
    pennyscan-hot-st-projectedVolume-firstAlert-shouldWatchout-lunch-5000
    pennyscan-nowheres-projectedVolume-firstAlert-notWatchout-dinner-5000
    pennyscan-nowheres-ssFirstTwo-firstAlert-notWatchout-dinner-5000
    pennyscan-hot-st-zScoreInverseTrendPlusVol-firstAlert-shouldWatchout-initial-5000
    pennyscan-unfiltered-zScoreInverseTrendPlusVol-firstAlert-notWatchout-dinner-5000
    pennyscan-nowheres-zScoreInverseTrendPlusVol-firstAlert-notWatchout-lunch-5000
    pennyscan-droppers-worstSS-firstAlert-notWatchout-initial-5000
    pennyscan-droppers-worstSsTrendRatio-firstAlert-notWatchout-dinner-5000
    pennyscan-droppers-worstSS-firstAlert-shouldWatchout-initial-5000
    pennyscan-nowheres-worstSS-firstAlert-notWatchout-dinner-5000

    pennyscan-hot-st-projectedVolume-firstAlert-notWatchout-dinner-5000
    pennyscan-unfiltered-singleTopVolumeSS-firstAlert-notWatchout-lunch-5000
    pennyscan-droppers-worstSS-firstAlert-shouldWatchout-lunch-5000
  `,

  smoothKST: `
    smoothkst-fitty-10min-bearishSignal-under2-firstAlert-notWatchout-dinner-5000
    smoothkst-fitty-precededByRSI-10min-isSignalCross-under2-firstAlert-notWatchout-initial-5000
  `,
  sma: `
    sma-fitty-5min-bearishCross-under2-notWatchout-brunch-5000
    sma-fitty-10min-bearishCross-under2-firstAlert-notWatchout-lunch-5000
  `,
  ema: `
    ema-fitty-30min-bullishCross-under2-firstAlert-shouldWatchout-lunch-5000
    ema-fitty-30min-bearishCross-under2-shouldWatchout-lunch-5000
    ema-fitty-10min-bearishCross-under2-notWatchout-dinner-5000
  `,

  macd: `macd-fitty-30min-bearishSignal-under2-notWatchout-dinner-5000`,

  multiHits: `
    multi-hits-fitty-4count-under2-notWatchout-lunch-5000
    multi-hits-fitty-3count-under2-firstAlert-notWatchout-lunch-5000
  `

};

const asArrays = mapObject(data, str => str.split('\n').map(line => line.trim()).filter(Boolean));
const prefixed = prefixKeys(asArrays, 'sep2019-');

module.exports = prefixed;