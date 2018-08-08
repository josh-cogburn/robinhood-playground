const shorting = [
    // for shorting
    'based-on-jump-gtEightOvernight-trending53-first1-5',
    'based-on-jump-gtEightOvernight-shouldWatchout-5',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt50-210',
    'low-float-high-volume-floatTimesfloatToVolume-trendgt30-6',
    'low-float-high-volume-floatTimesfloatToVolume-trendgt20-6',
];


const secondaryShorting = [
    'based-on-jump-gtEightOvernight-gt500kvolume-first1-5',
    'constant-risers-5minute-percUpHighClosePoints-140',
    'based-on-jump-gtEightOvernight-gt1milvolume-first1-0',
    'low-float-high-volume-floatTimesvolToAvgPoints-trendgt30-shouldWatchout-95',
    'low-float-high-volume-floatTimesabsVolPoints-trendgt20-shouldWatchout-25',
];

const secondaryLowCountShorting = [
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt40-150',
    'based-on-jump-gtEightOvernight-trending53-notWatchout-first1-fiveTo10-5',
    'low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt20-tenTo15-150',
    'low-float-high-volume-floatPoints-trenddowngt20-tenTo15-150',
    'low-float-high-volume-floatTimesabsVolPoints-trendgt30-fiveTo10-384'
];

const allShorts = [
    ...shorting,
    ...secondaryShorting,
    ...secondaryLowCountShorting
];

//////////////////////


const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const hothot = [
    'based-on-jump-up3overnight-trending35257-fiveTo10-5',
    'sudden-drops-last1trend-fiveTo10-32',    //
    'sudden-drops-last1trend-221',
    'sudden-drops-last1trend-first2-fiveTo10-14',
    'based-on-jump-up3overnight-trending35257-shouldWatchout-tenTo15-16',
    'based-on-jump-up3overnight-shouldWatchout-first3-fiveTo10-30',
    'based-on-jump-up3overnight-trending607-shouldWatchout-first2-tenTo15-5'
];

const longtermhot = [
    'based-on-jump-fourToEightOvernight-notWatchout-first2-fiveTo10-0',
    'constant-risers-5minute-percUpCloseOnly-filtered50-140',
    'based-on-jump-fourToEightOvernight-notWatchout-fiveTo10-0',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trend5to10-tenTo15-150',
    'dynamo-3000-bottom50tso-notWatchout-highestYP-fiveTo10-4',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trend5to10-fiveTo10-150',
    'dynamo-3000-bottom50tso-overall-highestYP-fiveTo10-4',
    'dynamo-3000-bottom50tso-trendingUp3010-lowestTSO-fiveTo10-4',
];

const realOldSchool = [
    'dynamo-3000-top50tso-trendingUp3010-lowestYP-fiveTo10-200',
    'sudden-drops-last3trend-first2-fiveTo10-328',
    'constant-risers-5minute-percUpHighClose-highovernightjumps-fiveTo10-198',
    'sudden-drops-last5trend-first2-fiveTo10-328',
    'dynamo-3000-top50tso-absvolume-100',
    'sudden-drops-last3trend-first1-328',
    'constant-risers-10minute-percUpCloseOnly-filtered60-100',
]

const honorableMentions105 = [
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-first1-tenTo15-16',
    'based-on-jump-down3overnight-trending607-notWatchout-first1-tenTo15-16',
    'based-on-jump-fourToEightOvernight-trending103-first3-tenTo15-16',
];

const honorableMentions3 = [ // 3 2
    "sudden-drops-last10trend-filter20-63",
    "sudden-drops-last3trend-filter10-63",
    "sudden-drops-last1trend-first1-fiveTo10-280",
    "low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt10-25",
    "based-on-jump-down3overnight-shouldWatchout-first1-fiveTo10-5"
];

const myPicks = [
    'low-float-high-volume-floatTimesabsVolPoints-trenddown3to10-6',
    'dynamo-3000-bottom50tso-trendingUp3010-lowestTSO-fiveTo10-4',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend3to5-6',
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-first1-tenTo15-16',
    'dynamo-3000-bottom50tso-notWatchout-lowestsharesToCap-40'  // hesitant
];

const twoPicks = [
    'low-float-high-volume-floatPoints-trenddowngt10-notWatchout-6',
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-notWatchout-25',
    'low-float-high-volume-absVolPoints-trenddown3to10-shouldWatchout-6',
    'low-float-high-volume-twoWeekVolToAvgPoints-notWatchout-fiveTo10-6',
    'low-float-high-volume-volTo2WeekPoints-trend10to15-shouldWatchout-384',
    'based-on-jump-fourToEightOvernight-trending53-notWatchout-ltneg50percmax-fiveTo10-30',
    'based-on-jump-fourToEightOvernight-trending53-notWatchout-ltneg50percmax-first1-fiveTo10-16',
    'based-on-jump-fourToEightOvernight-trending53-notWatchout-ltneg50percmax-fiveTo10-0',
    'low-float-high-volume-absVolPoints-trenddowngt10-fiveTo10-276',
    'based-on-jump-down5overnight-trending53-notWatchout-gtneg20percmax-5'

];

const morePicks = [
    'based-on-jump-down3overnight-trending53-notWatchout-ltneg50percmax-0',
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-notWatchout-25',
    'low-float-high-volume-absVolPoints-trenddown3to10-shouldWatchout-6',
    'low-float-high-volume-floatTimesabsVolPoints-trenddowngt10-notWatchout-6',
    'low-float-high-volume-twoWeekVolToAvgPoints-notWatchout-fiveTo10-6',
    'based-on-jump-down5overnight-trending35257-shouldWatchout-first1-fiveTo10-0',
    'based-on-jump-down5overnight-trending607-shouldWatchout-fiveTo10-0',
    'based-on-jump-down5overnight-trending35257-shouldWatchout-fiveTo10-0',
    'based-on-jump-down3overnight-trending53-notWatchout-ltneg50percmax-0',
    'low-float-high-volume-floatPoints-trenddown3to5-tenTo15-6'
];

const myListJune27 = [
    'based-on-jump-oneToFourOvernight-trending35257-shouldWatchout-first1-fiveTo10-16',
    'sudden-drops-last3trend-first1-280',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddown7to10-notWatchout-25',
    'based-on-jump-down3overnight-trending53-notWatchout-gtneg20percmax-first1-5',
    'low-float-high-volume-volTo2WeekPoints-trend5to10-shouldWatchout-fiveTo10-150',
    'sudden-drops-last10trend-filter10-221',
    'low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt10-fiveTo10-6',
    'dynamo-3000-overall-onlyWatchout-highestTSO-200',
    'up-streak-5days-gt3overnight-fiveTo10-189'
];

const myListJuly3 = [
    'sudden-drops-last3trend-first1-280',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-25',
    'dynamo-3000-overall-notWatchout-lowestTSO-fiveTo10-4',
    'low-float-high-volume-floatTimesabsVolPoints-trendgt20-notWatchout-fiveTo10-210',
    'low-float-high-volume-volToAvgPoints-fiveTo10-6'
];

const topPercUpJuly16 = [
    'low-float-high-volume-floatTimesfloatToVolume-trenddown3to10-shouldWatchout-fiveTo10-95',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-6',
    'based-on-jump-down3overnight-trending103-notWatchout-gtneg20percmax-first1-30' // less common
];


// multi days

const creme = [
    'low-float-high-volume-floatTimesfloatToVolume-trenddown5to7-fiveTo10-276',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddown5to7-notWatchout-fiveTo10-150', //limit6Down12Up
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-150',
];

const moderates = [
    'low-float-high-volume-floatPoints-trend10to15-384',
];

const occasionals = [
    'based-on-jump-gtEightOvernight-notWatchout-first1-tenTo15-0',
    'based-on-jump-down3overnight-trending53-notWatchout-gtneg20percmax-first1-30',
    'low-float-high-volume-floatPoints-trendgt10-384',  // can we buy 384 strats?
    'low-float-high-volume-absVolPoints-trend15to25-shouldWatchout-fiveTo10-384',
    'low-float-high-volume-volTo2WeekPoints-trenddown7to10-notWatchout-tenTo15-384',
];

const occasionalLowCount = [
    'low-float-high-volume-volTo2WeekPoints-trend15to25-fiveTo10-95',   // count 6
    'low-float-high-volume-twoWeekVolToAvgPoints-trend15to25-fiveTo10-95',   // count 6
    'sudden-drops-last3trend-filter10-221'
];

const keepAnEyeOn = [
    'dynamo-3000-bottom50tso-onlyWatchout-lowestYP-200',    // idk why i am including this
    'low-float-high-volume-volToAvgPoints-trenddown3to5-fifteenTo20-95',    // new
    'dynamo-3000-overall-onlyWatchout-highestTSO-tenTo15-100'
];



const aug2HighCounts = [
    'low-float-high-volume-floatPoints-trend10to15-shouldWatchout-315',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddown5to7-notWatchout-fiveTo10-150',
    'sudden-drops-last3trend-first2-388',
    'based-on-jump-down3overnight-trending35257-notWatchout-gtneg20percmax-first1-30',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-276',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown3to10-notWatchout-tenTo15-6',
    'constant-risers-10minute-percUpCloseOnly-filtered60-tenTo15-250',
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-384',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-6',
    'low-float-high-volume-twoWeekVolToAvgPoints-210',
];

const aug2LowCounts = [
    'based-on-jump-fourToEightOvernight-notWatchout-ltneg50percmax-first3-tenTo15-30',
    'based-on-jump-fourToEightOvernight-shouldWatchout-first3-fifteenTo20-30',
    'dynamo-3000-top50tso-notWatchout-lowestTSO-fifteenTo20-200',
    'dynamo-3000-bottom50tso-notWatchout-highestYP-fifteenTo20-260',
    'low-float-high-volume-floatTimesvolToAvgPoints-trenddown5to7-notWatchout-fifteenTo20-315',
    'based-on-jump-down5overnight-trending53-notWatchout-gtneg20percmax-16',
    'dynamo-3000-top50tso-trendingUp3010-fifteenTo20-351',
    'low-float-high-volume-floatPoints-trenddown3to10-shouldWatchout-fifteenTo20-276'
];

const aug7More = [
    'sudden-drops-last5trend-first1-221',
    'sudden-drops-last2trend-first1-280',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-150',
    'based-on-jump-down3overnight-trending53-notWatchout-ltneg50percmax-first2-30',
    'based-on-jump-down5overnight-notWatchout-gtneg20percmax-0',
]

const filteredDrops = [
    'sudden-drops-last10trend-filter10-221',
    'sudden-drops-last10trend-filter10-221',
    'sudden-drops-last3trend-filter10-221',
    'sudden-drops-last2trend-filter10-280',
    'sudden-drops-last30trend-filter20-280',
    'sudden-drops-last3trend-filter30-32',
    'sudden-drops-last5trend-filter30-280',
    'sudden-drops-last30trend-filter30-328',
    'sudden-drops-last10trend-filter30-280',
];

const aug7lowCounts = [
    ...filteredDrops,
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-25',
    'based-on-jump-down3overnight-trending53-notWatchout-ltneg50percmax-first2-30',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-tenTo15-276',
];

const aug7PerfectoLowCounts = [
    'sudden-drops-last3trend-filter10-221',
    'low-float-high-volume-twoWeekVolToAvgPoints-trend15to25-fiveTo10-95',
    'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first1-5',
    'low-float-high-volume-volTo2WeekPoints-fifteenTo20-6',
    'low-float-high-volume-volToAvgPoints-trenddown7to10-shouldWatchout-fifteenTo20-150',
]

const august2 = [
    ...aug2HighCounts,
    ...aug2HighCounts,
    ...aug2LowCounts
];


module.exports = {
    'wild n crazy': [
        'week-swings-tenTo15-1',  // wild
        'constant-risers-10minute-percUpHighClosePoints-300'  // crazy
    ],
    mySpecialSauce,
    hothot,
    longtermhot,
    honorableMentions105,
    honorableMentions3,
    myPicks,
    realOldSchool,
    twoPicks,
    morePicks,
    myListJune27,
    topPercUpJuly16,

    // multi day
    creme,
    moderates,
    occasionals,
    occasionalLowCount,
    keepAnEyeOn,

    shorting,
    secondaryShorting,
    secondaryLowCountShorting,
    allShorts,


    aug2HighCounts,
    aug2LowCounts,
    august2,

    aug7lowCounts,
    aug7More,

    filteredDrops,
    aug7PerfectoLowCounts
};
