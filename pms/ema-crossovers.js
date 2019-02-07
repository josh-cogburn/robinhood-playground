const allEmaCrossoverWatchers = [
    "ema-crossover-watchers-premarket-sma180trendingUp-5000",
    "ema-crossover-watchers-premarket-sma180trendingUp-highVol-5000",
    "ema-crossover-watchers-premarket-sma180trendingUp-lowVol-5000",
    "ema-crossover-watchers-premarket-5000",
    "ema-crossover-watchers-premarket-highVol-5000",
    "ema-crossover-watchers-premarket-lowVol-5000",
    "ema-crossover-watchers-initial-sma180trendingUp-5000",
    "ema-crossover-watchers-initial-sma180trendingUp-highVol-5000",
    "ema-crossover-watchers-initial-sma180trendingUp-lowVol-5000",
    "ema-crossover-watchers-initial-5000",
    "ema-crossover-watchers-initial-highVol-5000",
    "ema-crossover-watchers-initial-lowVol-5000",
    "ema-crossover-watchers-breakfast-sma180trendingUp-5000",
    "ema-crossover-watchers-breakfast-sma180trendingUp-highVol-5000",
    "ema-crossover-watchers-breakfast-sma180trendingUp-lowVol-5000",
    "ema-crossover-watchers-breakfast-5000",
    "ema-crossover-watchers-breakfast-highVol-5000",
    "ema-crossover-watchers-breakfast-lowVol-5000",
    "ema-crossover-watchers-lunch-sma180trendingUp-5000",
    "ema-crossover-watchers-lunch-sma180trendingUp-highVol-5000",
    "ema-crossover-watchers-lunch-sma180trendingUp-lowVol-5000",
    "ema-crossover-watchers-lunch-5000",
    "ema-crossover-watchers-lunch-highVol-5000",
    "ema-crossover-watchers-lunch-lowVol-5000",
    "ema-crossover-watchers-dinner-sma180trendingUp-5000",
    "ema-crossover-watchers-dinner-sma180trendingUp-highVol-5000",
    "ema-crossover-watchers-dinner-sma180trendingUp-lowVol-5000",
    "ema-crossover-watchers-dinner-5000",
    "ema-crossover-watchers-dinner-highVol-5000",
    "ema-crossover-watchers-dinner-lowVol-5000",
    "ema-crossover-watchers-afterhours-sma180trendingUp-5000",
    "ema-crossover-watchers-afterhours-sma180trendingUp-highVol-5000",
    "ema-crossover-watchers-afterhours-sma180trendingUp-lowVol-5000",
    "ema-crossover-watchers-afterhours-5000",
    "ema-crossover-watchers-afterhours-highVol-5000",
    "ema-crossover-watchers-afterhours-lowVol-5000"
];

const allEmaLastTrades = [
    "ema-crossover-last-trade-trendingUp180SMA-24",
    "ema-crossover-last-trade-trendingUp180SMA-100",
    "ema-crossover-last-trade-trendingUp180SMA-200",
    "ema-crossover-last-trade-trendingUp180SMA-330",
    "ema-crossover-last-trade-trendingUp180SMA-360",
    "ema-crossover-last-trade-trendingUp180SMA-380",
    "ema-crossover-last-trade-allOthers-24",
    "ema-crossover-last-trade-allOthers-100",
    "ema-crossover-last-trade-allOthers-200",
    "ema-crossover-last-trade-allOthers-330",
    "ema-crossover-last-trade-allOthers-360",
    "ema-crossover-last-trade-allOthers-380"
];

const allEmaTrendingUp180SMA = allEmaLastTrades.filter(s => s.includes('trendingUp180SMA'));

module.exports = { 
    allEmaCrossoverWatchers,
    allEmaLastTrades,
    allEmaTrendingUp180SMA
};