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
    // 'constant-risers-5minute-percUpHighClosePoints-140',
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

    // filtered 10s
    // usual suspects
    'sudden-drops-last10trend-filter10-221',
    'sudden-drops-last3trend-filter10-221',
    'sudden-drops-last2trend-filter10-280',

    // filter 20's

    'sudden-drops-last5trend-filter20-280',
    'sudden-drops-last5trend-filter20-280',
    'sudden-drops-last10trend-filter20-221',

    // very rare    - double power!
    'sudden-drops-last3trend-filter30-32',
    'sudden-drops-last3trend-filter30-32',

    'sudden-drops-last5trend-filter30-221',
    'sudden-drops-last5trend-filter30-221',

    'sudden-drops-last5trend-filter30-280',
    'sudden-drops-last5trend-filter30-280',

    'sudden-drops-last5trend-filter30-328',
    'sudden-drops-last5trend-filter30-328',
];

const moreCommonDrops = [
    // every dayers
    'sudden-drops-last3trend-first2-388',   // limit5 baby
    'sudden-drops-last5trend-first1-221',
    'sudden-drops-last3trend-first1-280',
];

const greatEverydayPerformers = [
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-276',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddown3to5-shouldWatchout-fiveTo10-276',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown3to5-315',
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

const qualityModerates = [
    'based-on-jump-down3overnight-trending53-notWatchout-ltneg50percmax-first1-30',
    'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first1-5',
];


// aug 9

const anyCountPerfectos = [

    // 'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0',
    // 'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-5',
    // 'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first1-5',
    // 'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-fiveTo10-0',
    // 'based-on-jump-gtEightOvernight-trending103-first1-tenTo15-30',
    'based-on-jump-gtEightOvernight-trending103-gt100kvolume-first1-tenTo15-30',
    // 'based-on-jump-down3overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-30',
    'based-on-jump-down8overnight-notWatchout-ltneg50percmax-first1-30',

    'low-float-high-volume-volTo2WeekPoints-fifteenTo20-6',
    'low-float-high-volume-floatPoints-trenddown7to10-shouldWatchout-tenTo15-6',

    // 'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-fifteenTo20-150',
    // 'low-float-high-volume-floatPoints-trenddown7to10-fifteenTo20-150',
    'low-float-high-volume-volTo2WeekPoints-trenddown7to10-shouldWatchout-fifteenTo20-210',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-fifteenTo20-210',

    'sudden-drops-last2trend-first2-100',

    'sudden-drops-last30trend-filter20-153',
    'sudden-drops-last3trend-filter10-221',
    'sudden-drops-last2trend-filter10-221',
    'sudden-drops-last10trend-filter20-221',
    'sudden-drops-last5trend-filter30-280',
    'sudden-drops-last3trend-filter20-280',
    'sudden-drops-last5trend-filter20-280',
    'sudden-drops-last10trend-filter20-290',
    'sudden-drops-last10trend-filter20-290',
    'sudden-drops-last10trend-filter30-328',



    'sudden-drops-last30trend-filter20-290',

    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-29',
    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-29',
    // 'technical-indicators-10minute-day-topSMAoverUnderHist-14',
    // 'technical-indicators-10minute-week-topSMAoverUnderHist-fiveTo10-159',
    // 'technical-indicators-5minute-day-topSMAoverUnderHist-fifteenTo20-87'
];

const moreaddsons = [
    'low-float-high-volume-volToAvgPoints-trenddowngt20-shouldWatchout-6',
    'based-on-jump-down8overnight-notWatchout-ltneg50percmax-first1-30',
    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-114',
    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-29',
    'technical-indicators-day-year-topOBV-29',
    'fizbiz-nanoEarlyRunners-first1-180'
];

const iwantthisPARTONE = [
    'low-float-high-volume-floatPoints-trenddowngt20-6',
    'dynamo-3000-bottom50tso-notWatchout-lowestYP-100',
    'constant-risers-10minute-percUpHighClose-lowovernightjumps-100',
    // 'low-float-high-volume-twoWeekVolToAvgPoints-trenddown7to10-fiveTo10-95',
    'dynamo-3000-bottom50tso-notWatchout-highestsharesToCap-100',
    // 'low-float-high-volume-floatTimesvolToAvgPoints-trenddown3to10-notWatchout-fiveTo10-25',
    'sudden-drops-last10trend-first1-fiveTo10-290',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddown7to10-notWatchout-25',
    'based-on-jump-down3overnight-trending53-notWatchout-ltneg50percmax-first2-30',
    'low-float-high-volume-floatPoints-trenddowngt30-276',
    'sudden-drops-last10trend-filter10-221',

    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend10to15-shouldWatchout-315',
    'technical-indicators-day-year-topSMAoverUnderLastTrade-tenTo15-320',

]

const iwantthisPARTTWO = [
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt50-tenTo15-384',
    'sudden-drops-last2trend-first2-290',
    'low-float-high-volume-floatPoints-trenddown5to7-shouldWatchout-fifteenTo20-25',
    // 'low-float-high-volume-floatTimesabsVolPoints-trenddown7to10-shouldWatchout-fifteenTo20-210',
    'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0',
    'based-on-jump-down3overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-30',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-6',
    // 'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-6'
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-276'
]

const iwantthis = [
    ...iwantthisPARTONE,
    ...iwantthisPARTTWO
];


const weekofaug27 = [
    'sudden-drops-last10trend-filter10-221',
    'sudden-drops-last30trend-filter20-153',
    'low-float-high-volume-floatPoints-trenddowngt20-6',
    'sudden-drops-last30trend-filter20-290',
    'sudden-drops-last2trend-filter10-221',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-fifteenTo20-210',
    'dynamo-3000-bottom50tso-notWatchout-lowestYP-100',
    'sudden-drops-last2trend-first2-290',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-276',
    'dynamo-3000-bottom50tso-notWatchout-highestsharesToCap-100',
    'based-on-jump-down3overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-30',
    'constant-risers-10minute-percUpHighClose-lowovernightjumps-100',
    'technical-indicators-day-year-topSMAoverUnderLastTrade-tenTo15-320',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend10to15-shouldWatchout-315',
    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-29',
    'based-on-jump-down8overnight-notWatchout-ltneg50percmax-first1-30',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-6',
    'sudden-drops-last10trend-filter20-290',
    'sudden-drops-last10trend-filter30-328',
    'sudden-drops-last5trend-filter30-280',
    'sudden-drops-last10trend-filter20-221',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-6',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-tenTo15-276'
];


const aug28basedonperfectos = [
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddown7to10-shouldWatchout-tenTo15-384',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-fifteenTo20-210',
    'sudden-drops-last5trend-first1-100',
    'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0',
    'low-float-high-volume-floatPoints-trenddown7to10-fifteenTo20-150',
    'sudden-drops-last30trend-first1-tenTo15-290',
    // 'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt20-notWatchout-210',
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt20-notWatchout-210',
    'technical-indicators-day-year-topSMAoverUnderLastTrade-tenTo15-29',
    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-320',
    'technical-indicators-10minute-week-topSMAoverUnderHist-fifteenTo20-29',
    'based-on-jump-down5overnight-trending103-notWatchout-first1-tenTo15-16',
    // 'low-float-high-volume-volToAvgPoints-trenddowngt10-shouldWatchout-fifteenTo20-276',
    'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-16',
    'based-on-jump-down3overnight-trending607-gt500kvolume-first1-tenTo15-5',
    'sudden-drops-last10trend-first1-fifteenTo20-360',
    'sudden-drops-last3trend-first2-fiveTo10-290',
    'ups-then-downs-prevClose-fifteenTo20-10',
    'up-streak-3to5days-gt3overnight-fifteenTo20-45',
    'based-on-jump-down8overnight-notWatchout-gtneg20percmax-first1-tenTo15-0',
    'based-on-jump-gtEightOvernight-trending103-shouldWatchout-first2-tenTo15-30',
    'based-on-jump-fourToEightOvernight-trending53-gt100kvolume-first3-fifteenTo20-5',
    'low-float-high-volume-absVolPoints-trend10to15-notWatchout-fiveTo10-25',
    'ups-then-downs-shiftedHist-fifteenTo20-380',
    'based-on-jump-fourToEightOvernight-gt1milvolume-fifteenTo20-16',
    'technical-indicators-5minute-day-topSMAoverUnderHist-tenTo15-320',
    'technical-indicators-day-year-topOBV-tenTo15-383',
    'up-streak-gt8days-gt1overnight-189',
    'based-on-jump-fourToEightOvernight-trending35257-shouldWatchout-first2-fifteenTo20-30',
    'up-streak-9days-fifteenTo20-45',
    'fizbiz-under5Target10Change2Vol200-first1-180'
];


// combined week of aug 27 and aug 28 perfectos

const combinedWeekOfAug27ANDAug28BasedOnPerfectosRealLowCounts = [
    // no counts in last 10
    "based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0",
    "low-float-high-volume-absVolPoints-trend10to15-notWatchout-fiveTo10-25",
    "based-on-jump-fourToEightOvernight-gt1milvolume-fifteenTo20-16",
    "based-on-jump-fourToEightOvernight-trending35257-shouldWatchout-first2-fifteenTo20-30",
    "low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-6",
    "sudden-drops-last10trend-filter20-290",
    "sudden-drops-last10trend-filter30-328",
    "sudden-drops-last5trend-filter30-280",
    "sudden-drops-last10trend-filter20-221",

    // real low
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-fifteenTo20-210",
    "low-float-high-volume-floatTimesfloatToVolume-trenddowngt20-notWatchout-210",
    "based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-16",
    "ups-then-downs-prevClose-fifteenTo20-10",
    "based-on-jump-gtEightOvernight-trending103-shouldWatchout-first2-tenTo15-30",
    "based-on-jump-fourToEightOvernight-trending53-gt100kvolume-first3-fifteenTo20-5",
    "up-streak-gt8days-gt1overnight-189",
    "sudden-drops-last30trend-filter20-290",
    "sudden-drops-last2trend-filter10-221",
    "based-on-jump-down8overnight-notWatchout-ltneg50percmax-first1-30"
];

const combinedWeekOfAug27ANDAug28BasedOnPerfectosLowAndMedCount = [
    // low
    "based-on-jump-down5overnight-trending103-notWatchout-first1-tenTo15-16",
    "based-on-jump-down3overnight-trending607-gt500kvolume-first1-tenTo15-5",
    "up-streak-3to5days-gt3overnight-fifteenTo20-45",
    "based-on-jump-down8overnight-notWatchout-gtneg20percmax-first1-tenTo15-0",
    "ups-then-downs-shiftedHist-fifteenTo20-380",
    "up-streak-9days-fifteenTo20-45",
    "sudden-drops-last10trend-filter10-221",
    "sudden-drops-last30trend-filter20-153",
    "low-float-high-volume-floatPoints-trenddowngt20-6",

    // med
    "low-float-high-volume-floatTimesvolTo2WeekPoints-trenddown7to10-shouldWatchout-tenTo15-384",
    "low-float-high-volume-floatPoints-trenddown7to10-fifteenTo20-150",
    "based-on-jump-down3overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-30",
    "low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-tenTo15-276"
];

const combinedWeekOfAug27ANDAug28BasedOnPerfectosHighCount = [
    // everydayers
    "sudden-drops-last5trend-first1-100",
    "sudden-drops-last30trend-first1-tenTo15-290",
    "technical-indicators-day-year-topSMAoverUnderLastTrade-tenTo15-29",
    "technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-320",
    "technical-indicators-10minute-week-topSMAoverUnderHist-fifteenTo20-29",
    "sudden-drops-last10trend-first1-fifteenTo20-360",
    "sudden-drops-last3trend-first2-fiveTo10-290",
    "technical-indicators-5minute-day-topSMAoverUnderHist-tenTo15-320",
    "technical-indicators-day-year-topOBV-tenTo15-383",
    "dynamo-3000-bottom50tso-notWatchout-lowestYP-100",
    "sudden-drops-last2trend-first2-290",
    "low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-276",
    "dynamo-3000-bottom50tso-notWatchout-highestsharesToCap-100",
    "constant-risers-10minute-percUpHighClose-lowovernightjumps-100",
    "technical-indicators-day-year-topSMAoverUnderLastTrade-tenTo15-320",
    "low-float-high-volume-floatTimesvolTo2WeekPoints-trend10to15-shouldWatchout-315",
    "technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-29",
    "low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-6"
];


const aug29LowCountsABQuality = [
    // GRADE A
    'sudden-drops-last10trend-filter30-328',
    'sudden-drops-last10trend-filter20-290',
    'sudden-drops-last5trend-first1-100',


    'sudden-drops-last30trend-filter20-290',
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt20-notWatchout-210',
    'sudden-drops-last10trend-filter20-221',
    'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0',
    'sudden-drops-last5trend-filter30-280',
    'based-on-jump-down3overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-30',
    'sudden-drops-last30trend-filter20-153',
    'based-on-jump-gtEightOvernight-trending103-shouldWatchout-first2-tenTo15-30',
    'fizbiz-under5Target10Change2Vol200-first1-180',
    'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-16',
    'based-on-jump-fourToEightOvernight-trending53-gt100kvolume-first3-fifteenTo20-5',
    'based-on-jump-down3overnight-trending607-gt500kvolume-first1-tenTo15-5',
    'based-on-jump-down5overnight-trending103-notWatchout-first1-tenTo15-16',
    'based-on-jump-fourToEightOvernight-gt1milvolume-fifteenTo20-16',
    'based-on-jump-fourToEightOvernight-trending35257-shouldWatchout-first2-fifteenTo20-30',
    'up-streak-gt8days-gt1overnight-189',
    'low-float-high-volume-absVolPoints-trend10to15-notWatchout-fiveTo10-25',
    'based-on-jump-down8overnight-notWatchout-ltneg50percmax-first1-30',

    // GRADE B
    'sudden-drops-last30trend-first1-tenTo15-290',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-fifteenTo20-210',
    'up-streak-3to5days-gt3overnight-fifteenTo20-45',
    'ups-then-downs-shiftedHist-fifteenTo20-380',
    'ups-then-downs-prevClose-fifteenTo20-10',
    'sudden-drops-last3trend-first2-fiveTo10-290',
    'sudden-drops-last2trend-first2-290',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-tenTo15-276',
    'based-on-jump-down8overnight-notWatchout-gtneg20percmax-first1-tenTo15-0',
    'sudden-drops-last2trend-filter10-221',
    'technical-indicators-5minute-day-topSMAoverUnderHist-tenTo15-320',

];

const aug29LowCountsGradeC = [
    // GRADE C = determined by lowest "max" subtracted from avgTrend of highestlimitplayout (see pm-sort-by-count)
    'technical-indicators-day-year-topSMAoverUnderLastTrade-tenTo15-29',
    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-29',
    'low-float-high-volume-floatPoints-trenddown7to10-fifteenTo20-150',
    'technical-indicators-10minute-week-topSMAoverUnderLastTrade-tenTo15-320',
    'sudden-drops-last10trend-first1-fifteenTo20-360',
    'technical-indicators-10minute-week-topSMAoverUnderHist-fifteenTo20-29',
    'technical-indicators-day-year-topSMAoverUnderLastTrade-tenTo15-320',
    'technical-indicators-day-year-topOBV-tenTo15-383',
    'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-6',
    'up-streak-9days-fifteenTo20-45',
    'low-float-high-volume-floatPoints-trenddowngt20-6'
];

const aug29MedHighCounts = [
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddown7to10-shouldWatchout-tenTo15-384',
    'sudden-drops-last10trend-filter10-221',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-notWatchout-276',
    'dynamo-3000-bottom50tso-notWatchout-lowestYP-100',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-shouldWatchout-6',
    'dynamo-3000-bottom50tso-notWatchout-highestsharesToCap-100',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend10to15-shouldWatchout-315',
    'constant-risers-10minute-percUpHighClose-lowovernightjumps-100'
];


const sepStars = [
    'sudden-drops-last5trend-filter10-100',
    'sudden-drops-last5trend-first1-fiveTo10-290',
    'low-float-high-volume-volToAvgPoints-trenddown7to10-shouldWatchout-fifteenTo20-95',
    'sudden-drops-last10trend-first1-fifteenTo20-360'
];
const sepHighlights = [

    // next-day-9

        // lowThirdMinCount5MagicScore
        'sudden-drops-last5trend-first1-100',
        'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-fifteenTo20-150',
        'low-float-high-volume-volToAvgPoints-trenddowngt10-notWatchout-6',

        // customCount3to5MagicScore
        'sudden-drops-last18trend-filter10-tenTo15-328',
        'sudden-drops-last5trend-filter10-100', // star
        'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0',
        'based-on-jump-down5overnight-trending103-notWatchout-ltneg50percmax-first2-5',

        // customCount5to8MagicScore
        'sudden-drops-last5trend-first1-100',
        'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt10-notWatchout-fifteenTo20-150',
        'sudden-drops-last3trend-first1-100',
        'sudden-drops-last30trend-filter10-tenTo15-328',
        'based-on-jump-gtEightOvernight-trending53-notWatchout-first1-tenTo15-5',
        'based-on-jump-gtEightOvernight-trending53-notWatchout-first1-tenTo15-16',
        'up-streak-3to5days-gt3overnight-fifteenTo20-45',

        // customCount8to11MagicScore
        'dynamo-3000-overall-onlyWatchout-highestTSO-fiveTo10-200',
        'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first2-16',
        'sudden-drops-last5trend-first1-fiveTo10-290',   // star
        'sudden-drops-last2trend-first1-fiveTo10-290',
        'based-on-jump-down3overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-16',
        'sudden-drops-last5trend-first2-fiveTo10-290',

        // customCount11to14MagicScore
        'low-float-high-volume-volToAvgPoints-trenddown7to10-shouldWatchout-fifteenTo20-95', // star
        'sudden-drops-last10trend-first1-fifteenTo20-360',  // star
        // 'sudden-drops-last10trend-first2-fifteenTo20-360',

];

const sepPerfectos = [

    // next-day-330

        // perfectos
        'based-on-jump-up3overnight-trending35257-ltneg50percmax-fiveTo10-5',
        'dynamo-3000-overall-onlyWatchout-highestTSO-fiveTo10-200',
        'sudden-drops-last3trend-filter20-280',
        'sudden-drops-last5trend-filter20-280',
        'dynamo-3000-overall-onlyWatchout-highestTSO-tenTo15-100',
        'low-float-high-volume-floatTimesfloatToVolume-trendgt50-tenTo15-384',
        'sudden-drops-last3trend-filter20-328',
        'sudden-drops-last18trend-filter10-tenTo15-328',
        'sudden-drops-last5trend-filter10-100',
        'sudden-drops-last5trend-first1-tenTo15-360',
        'low-float-high-volume-volToAvgPoints-trenddown7to10-shouldWatchout-fifteenTo20-150',
        'technical-indicators-10minute-week-topSMAoverUnderHist-fifteenTo20-29',
        'based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0',
        'sudden-drops-last10trend-first1-fifteenTo20-360',
        'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddown7to10-shouldWatchout-fifteenTo20-95',
        'based-on-jump-up3overnight-trending35257-shouldWatchout-first2-fiveTo10-30',
        'low-float-high-volume-volTo2WeekPoints-trenddown7to10-shouldWatchout-fifteenTo20-210',
        'sudden-drops-last3trend-first1-tenTo15-360',
        'sudden-drops-last5trend-filter30-280',
        'sudden-drops-last30trend-filter30-328',
        'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first2-16',
        'sudden-drops-last10trend-filter20-221',
        'sudden-drops-last18trend-filter30-328',
        'sudden-drops-last2trend-filter10-tenTo15-328',
        'low-float-high-volume-volTo2WeekPoints-trenddown7to10-shouldWatchout-tenTo15-6',
        'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-notWatchout-fifteenTo20-150',
        'sudden-drops-last5trend-filter30-328',
        'low-float-high-volume-volToAvgPoints-trendgt50-tenTo15-315',
        // 'low-float-high-volume-absVolPoints-trendgt50-shouldWatchout-tenTo15-315',
        'sudden-drops-last10trend-filter10-tenTo15-280',
        'sudden-drops-last3trend-filter20-221',
        'sudden-drops-last5trend-filter30-221',
        // 'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt10-notWatchout-fifteenTo20-150',
        'sudden-drops-last2trend-filter10-360',
        'based-on-jump-down5overnight-trending103-notWatchout-ltneg50percmax-5',
        'sudden-drops-last5trend-filter10-189',
        'based-on-jump-gtEightOvernight-trending607-first1-fifteenTo20-30',
        'sudden-drops-last1trend-filter10-360',
        'sudden-drops-last30trend-filter30-360',
        'sudden-drops-last30trend-filter20-290',
        'sudden-drops-last30trend-filter30-290',
        'based-on-jump-gtEightOvernight-trending53-notWatchout-first1-tenTo15-16',
        'sudden-drops-last10trend-filter30-221',
        'sudden-drops-last18trend-filter10-tenTo15-290',
        'low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt20-notWatchout-tenTo15-25',
        'sudden-drops-last3trend-filter10-100',
        'up-streak-3to5days-gt3overnight-fifteenTo20-45',
        'based-on-jump-fourToEightOvernight-trending53-notWatchout-ltneg50percmax-first1-fiveTo10-0',
        'based-on-jump-gtEightOvernight-trending53-notWatchout-tenTo15-16',
        'based-on-jump-down8overnight-trending53-notWatchout-ltneg50percmax-first2-5',
        'sudden-drops-last1trend-filter20-fiveTo10-14',
        'sudden-drops-last3trend-filter30-32',
        'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt30-notWatchout-150',
        'sudden-drops-last3trend-filter10-fiveTo10-14',
        'up-streak-7days-ltneg3overnight-189',
        'based-on-jump-gtEightOvernight-trending607-gt100kvolume-fifteenTo20-30',
        'based-on-jump-down8overnight-trending53-notWatchout-gtneg20percmax-first1-16',
        'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt30-notWatchout-fiveTo10-276',
        'based-on-jump-gtEightOvernight-trending103-first1-fifteenTo20-5',
        'based-on-jump-gtEightOvernight-trending607-notWatchout-gtneg20percmax-first1-fifteenTo20-0',
        'based-on-jump-fourToEightOvernight-trending53-gt100kvolume-first1-fifteenTo20-5',
        'based-on-jump-down8overnight-trending53-gt1milvolume-first2-fiveTo10-16',
        'low-float-high-volume-volToAvgPoints-trend10to15-notWatchout-fiveTo10-25',
        'based-on-jump-down3overnight-trending103-ltneg50percmax-first1-16',
        'low-float-high-volume-volToAvgPoints-trenddowngt30-notWatchout-fiveTo10-384',
        'low-float-high-volume-volTo2WeekPoints-trenddowngt30-notWatchout-210',
        'based-on-jump-down5overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-16',
        'sudden-drops-last5trend-first1-14',
        'sudden-drops-last1trend-filter10-fiveTo10-63',
        'sudden-drops-last10trend-filter20-290',
        'low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt30-notWatchout-384',
        'sudden-drops-last10trend-filter10-fiveTo10-280',
];



// sepPerfectos broken down by frequency


const sepPerfectosHigherCounts = [

    // high counts
    'sudden-drops-last10trend-first1-fifteenTo20-360',
    'sudden-drops-last3trend-first1-tenTo15-360',
    'sudden-drops-last5trend-first1-tenTo15-360',


    // middle counts
    'low-float-high-volume-volTo2WeekPoints-trenddown7to10-shouldWatchout-fifteenTo20-210',
    'low-float-high-volume-volToAvgPoints-trenddown7to10-shouldWatchout-fifteenTo20-150',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddown7to10-shouldWatchout-fifteenTo20-95',
    'technical-indicators-10minute-week-topSMAoverUnderHist-fifteenTo20-29',
]

const sepPerfectosRealLowCounts = [
    // realLowCounts
    "sudden-drops-last18trend-filter30-328",
    "sud`den-drops-last3trend-filter20-328",
    "sudden-drops-last30trend-filter30-328",
    "low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt30-notWatchout-384",
    "low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt30-notWatchout-150",
    "based-on-jump-down8overnight-trending53-notWatchout-gtneg20percmax-first1-16",
    "low-float-high-volume-volTo2WeekPoints-trenddowngt30-notWatchout-210",
    "sudden-drops-last10trend-filter20-290",
    "low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt20-notWatchout-tenTo15-25",
    "based-on-jump-gtEightOvernight-trending607-first1-fifteenTo20-30",
    "based-on-jump-gtEightOvernight-trending607-gt100kvolume-fifteenTo20-30",
    "based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first2-16",
    "sudden-drops-last18trend-filter10-tenTo15-328",
    "sudden-drops-last5trend-filter20-280",
    "based-on-jump-down5overnight-trending103-notWatchout-ltneg50percmax-5",
    "sudden-drops-last10trend-filter10-fiveTo10-280",
    "sudden-drops-last1trend-filter10-360",
    "up-streak-7days-ltneg3overnight-189",
    "low-float-high-volume-volToAvgPoints-trend10to15-notWatchout-fiveTo10-25",
    "based-on-jump-fourToEightOvernight-trending53-gt100kvolume-first1-fifteenTo20-5",
    "based-on-jump-fourToEightOvernight-trending53-notWatchout-ltneg50percmax-first1-fiveTo10-0",
    "sudden-drops-last30trend-filter30-360",

]

const sepPerfectosLowCounts = [


    // lowCounts
    "sudden-drops-last5trend-filter10-100",
    "sudden-drops-last5trend-filter10-189",
    "sudden-drops-last3trend-filter10-100",
    "sudden-drops-last30trend-filter20-290",
    "sudden-drops-last30trend-filter30-290",
    "sudden-drops-last18trend-filter10-tenTo15-290",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-notWatchout-fifteenTo20-150",
    "based-on-jump-down5overnight-notWatchout-ltneg50percmax-first1-fifteenTo20-16",
    "based-on-jump-gtEightOvernight-trending103-first1-fifteenTo20-5",
    // "up-streak-3to5days-gt3overnight-fifteenTo20-45",
    "sudden-drops-last2trend-filter10-360",


    'based-on-jump-down8overnight-trending53-gt500kvolume-fiveTo10-0',
    'sudden-drops-last5trend-filter20-388',
    // 'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt20-notWatchout-210',

];

const sepPerfectosLowerCounts = [
    ...sepPerfectosRealLowCounts,
    ...sepPerfectosLowCounts
];

const sepPerfectosMissing = [
    "based-on-jump-up3overnight-trending35257-ltneg50percmax-fiveTo10-5",
    "dynamo-3000-overall-onlyWatchout-highestTSO-fiveTo10-200",
    "sudden-drops-last3trend-filter20-280",
    "dynamo-3000-overall-onlyWatchout-highestTSO-tenTo15-100",
    "low-float-high-volume-floatTimesfloatToVolume-trendgt50-tenTo15-384",
    "based-on-jump-down3overnight-trending103-notWatchout-ltneg50percmax-first1-fiveTo10-0",
    "based-on-jump-up3overnight-trending35257-shouldWatchout-first2-fiveTo10-30",
    "sudden-drops-last5trend-filter30-280",
    "sudden-drops-last10trend-filter20-221",
    "sudden-drops-last2trend-filter10-tenTo15-328",
    // "low-float-high-volume-volTo2WeekPoints-trenddown7to10-shouldWatchout-tenTo15-6",
    "sudden-drops-last5trend-filter30-328",
    "low-float-high-volume-volToAvgPoints-trendgt50-tenTo15-315",
    "sudden-drops-last10trend-filter10-tenTo15-280",
    "sudden-drops-last3trend-filter20-221",
    "sudden-drops-last5trend-filter30-221",
    "based-on-jump-gtEightOvernight-trending53-notWatchout-first1-tenTo15-16",
    "sudden-drops-last10trend-filter30-221",
    // "based-on-jump-gtEightOvernight-trending53-notWatchout-tenTo15-16",
    "based-on-jump-down8overnight-trending53-notWatchout-ltneg50percmax-first2-5",
    "sudden-drops-last1trend-filter20-fiveTo10-14",
    "sudden-drops-last3trend-filter30-32",
    "sudden-drops-last3trend-filter10-fiveTo10-14",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt30-notWatchout-fiveTo10-276",
    "based-on-jump-gtEightOvernight-trending607-notWatchout-gtneg20percmax-first1-fifteenTo20-0",
    "based-on-jump-down8overnight-trending53-gt1milvolume-first2-fiveTo10-16",
    "based-on-jump-down3overnight-trending103-ltneg50percmax-first1-16",
    "low-float-high-volume-volToAvgPoints-trenddowngt30-notWatchout-fiveTo10-384",
    "sudden-drops-last5trend-first1-14",
    "sudden-drops-last1trend-filter10-fiveTo10-63"
];

const sepAdds = [
    'low-float-high-volume-volToAvgPoints-trend10to15-shouldWatchout-tenTo15-276',
]

const noGuarantees = [
    'based-on-jump-fourToEightOvernight-trending53-notWatchout-ltneg50percmax-first1-fiveTo10-0',
    'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first2-16',
    'based-on-jump-down5overnight-trending103-notWatchout-ltneg50percmax-5',
    'based-on-jump-gtEightOvernight-trending607-first1-fifteenTo20-30',
    'based-on-jump-gtEightOvernight-trending607-gt100kvolume-fifteenTo20-30',
    'up-streak-7days-ltneg3overnight-189',
    'sudden-drops-last18trend-filter30-328',
]

const unprovenFilter30Drops = [
    "sudden-drops-last5trend-filter30-280",
    // "sudden-drops-last30trend-filter30-328",
    // "sudden-drops-last18trend-filter30-328",
    // "sudden-drops-last5trend-filter30-328",
    // "sudden-drops-last5trend-filter30-221",
    // "sudden-drops-last10trend-filter30-328",
    // "sudden-drops-last30trend-filter30-360",
    // "sudden-drops-last30trend-filter30-290",
    "sudden-drops-last10trend-filter30-221",
    "sudden-drops-last3trend-filter30-32",
    // "sudden-drops-last50trend-filter30-290",
    "sudden-drops-last18trend-filter30-290",
    // "sudden-drops-last10trend-filter30-290",
    "sudden-drops-last3trend-filter30-tenTo15-14",
    "sudden-drops-last2trend-filter30-tenTo15-14"
];

const unprovenFilter20Drops = [
    "sudden-drops-last30trend-filter20-tenTo15-388",
    "sudden-drops-last10trend-filter20-fiveTo10-388",
    'sudden-drops-last5trend-filter20-388',
    // "sudden-drops-last18trend-filter20-fiveTo10-388",
    "sudden-drops-last50trend-filter20-tenTo15-388",
    // "sudden-drops-last5trend-filter20-fiveTo10-388",
    "sudden-drops-last10trend-filter20-360",
    "sudden-drops-last3trend-filter20-360",
    // "sudden-drops-last5trend-filter20-360",
    // "sudden-drops-last18trend-filter20-360",
    "sudden-drops-last18trend-filter20-tenTo15-328",
    // "sudden-drops-last30trend-filter20-tenTo15-328",
    // "sudden-drops-last50trend-filter20-tenTo15-328",
    "sudden-drops-last3trend-filter20-328",
    // "sudden-drops-last18trend-filter20-290",
    "sudden-drops-last10trend-filter20-290",
    // "sudden-drops-last30trend-filter20-290",
    "sudden-drops-last30trend-filter20-tenTo15-290",
    // "sudden-drops-last50trend-filter20-tenTo15-290",
    "sudden-drops-last10trend-filter20-tenTo15-280",
    // "sudden-drops-last18trend-filter20-tenTo15-280",
    "sudden-drops-last5trend-filter20-280",
    "sudden-drops-last3trend-filter20-280",
    "sudden-drops-last10trend-filter20-221",
    "sudden-drops-last3trend-filter20-221",
    "sudden-drops-last18trend-filter20-189",
    // "sudden-drops-last10trend-filter20-189",
    // "sudden-drops-last30trend-filter20-189",
    "sudden-drops-last30trend-filter20-fiveTo10-153",
    "sudden-drops-last5trend-filter20-fiveTo10-32",
    "sudden-drops-last1trend-filter20-fiveTo10-14",

    
];

const unprovenSuddenDropsLast2Filter10 = [
    "sudden-drops-last2trend-filter10-tenTo15-328",
    "sudden-drops-last2trend-filter10-360",
    "sudden-drops-last2trend-filter10-100",
    "sudden-drops-last2trend-filter10-189",
    "sudden-drops-last2trend-filter10-fifteenTo20-328",
    "sudden-drops-last2trend-filter10-fiveTo10-328"
];


const sep17MORE = [
    'sudden-drops-last30trend-filter20-189',
    'sudden-drops-last10trend-filter30-280',
    'low-float-high-volume-absVolPoints-trenddowngt30-notWatchout-315',
    'based-on-jump-gtEightOvernight-trending53-first1-tenTo15-0',
    'sudden-drops-last10trend-filter10-189',
    'based-on-jump-fourToEightOvernight-trending53-shouldWatchout-tenTo15-0',
];

const afterhoursdropsGAMBLES = [
    'sudden-drops-last30trend-filter10-fiveTo10-360',
    'sudden-drops-last18trend-filter10-tenTo15-360',
    'sudden-drops-last30trend-filter20-388',
    'sudden-drops-last5trend-filter10-388',
    'sudden-drops-last18trend-filter20-400',
    'sudden-drops-last10trend-filter10-400',
    'sudden-drops-last18trend-filter10-430',
    // 'sudden-drops-last30trend-filter10-fiveTo10-430',
    'sudden-drops-last18trend-filter10-470',
    'sudden-drops-last18trend-filter10-500',
];

const tripleDown = [
    'sudden-drops-last30trend-filter10-fiveTo10-360',
    // 'sudden-drops-last10trend-filter10-221',
    'sudden-drops-last30trend-filter20-189',
    'sudden-drops-last30trend-filter20-189',
    'low-float-high-volume-absVolPoints-trenddowngt30-notWatchout-315',
];

const singleDown = [
    'sudden-drops-last18trend-first1-fiveTo10-189',
    'spread-singleLargestSpreadAbs1milVolume-58',
    'spread-singleLargestSpreadAbs100kVolume-tenTo15-202',
    'constant-downers-10minute-percDownLowClosePoints-filtered80-tenTo15-77',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered80-fiveTo10-40',
];

const preMarketDrops = [
    'sudden-drops-last5trend-filter10-fiveTo10--50',
    'sudden-drops-last50trend-first1-fifteenTo20--10',
    'sudden-drops-last2trend-first1--30'
];

const hadAGoodDay = [
    'sudden-drops-last5trend-first1-100',
    'sudden-drops-last5trend-first2-fiveTo10-290',
    'sudden-drops-last3trend-first1-100',
];

const myImpressionAtTheMoment = [
    'constant-risers-5minute-percUpHighClose-filtered80-tenTo15-40',
    'constant-risers-10minute-percUpHighClose-filtered80-tenTo15-40',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered80-fiveTo10-40',
    'constant-risers-10minute-percUpCloseOnly-filtered80-100',
];

const bigdawgs = [

    // extra emphasis
    

    // anycountperfectos from spm
    "constant-risers-10minute-percUpHighClosePoints-filtered70-100",
    "sudden-drops-last30trend-first1-400",
    "sudden-drops-last2trend-first1--30",
    "sudden-drops-last3trend-filter10-100",
    "constant-risers-10minute-percUpHighClosePoints-filtered80-fiveTo10-40",
    "sudden-drops-last2trend-first2-400",
    "sudden-drops-last3trend-first2-500",
    "based-on-jump-down8overnight-trending53-gt500kvolume-first1-fiveTo10-0",
    "fizbiz-nanoEarlyRunners-first1-380",
    "sudden-drops-last10trend-first1-fiveTo10-470",
    "sudden-drops-last10trend-first2-fiveTo10--50",
    "based-on-jump-gtEightOvernight-trending103-notWatchout-gtneg20percmax-30",
    "sudden-drops-last5trend-first1--50",
    "sudden-drops-last5trend-filter10-400",
    "sudden-drops-last10trend-first1-500",
    "sudden-drops-last5trend-first1-fiveTo10--30",
    "sudden-drops-last18trend-filter30-280",
    "based-on-jump-down3overnight-trending35257-notWatchout-ltneg50percmax-fiveTo10-30",
    "low-float-high-volume-volTo2WeekPoints-trendgt30-tenTo15-384",
    "low-float-high-volume-absVolPoints-trendgt30-tenTo15-384",
    "low-float-high-volume-floatTimesvolToAvgPoints-trendgt30-tenTo15-384",
    "low-float-high-volume-floatTimesfloatToVolume-trendgt30-tenTo15-384",
    "low-float-high-volume-twoWeekVolToAvgPoints-trendgt30-tenTo15-384",
    "low-float-high-volume-floatPoints-trendgt30-tenTo15-384",
    "constant-risers-10minute-percUpCloseOnlyPoints-filtered70-198",
    "constant-risers-10minute-percUpHighClose-filtered70-198",
    "low-float-high-volume-floatTimesabsVolPoints-trenddowngt30-tenTo15-315",
    "low-float-high-volume-volToAvgPoints-trenddowngt30-notWatchout-tenTo15-315",
    "low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt30-notWatchout-tenTo15-315",
    "low-float-high-volume-floatTimesfloatToVolume-trenddowngt30-notWatchout-tenTo15-315",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt30-tenTo15-315",
    "sudden-drops-last18trend-filter10-tenTo15-360",
    "sudden-drops-last18trend-first1-fiveTo10-500",
    "sudden-drops-last10trend-first2-tenTo15-500",
    "sudden-drops-last50trend-first1-tenTo15-430",
    "based-on-jump-down3overnight-trending53-gt1milvolume-first3-fiveTo10-5",
    "based-on-jump-down8overnight-trending103-notWatchout-first1-tenTo15-30",
    "low-float-high-volume-floatTimesabsVolPoints-trendgt30-shouldWatchout-tenTo15-384",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt40-shouldWatchout-tenTo15-384",
    "low-float-high-volume-floatTimesabsVolPoints-trendgt40-tenTo15-384",
    "low-float-high-volume-volToAvgPoints-trendgt40-shouldWatchout-tenTo15-384",
    "low-float-high-volume-floatTimesfloatToVolume-trendgt40-shouldWatchout-tenTo15-384",
    "low-float-high-volume-volToAvgPoints-trendgt40-tenTo15-384",
    "sudden-drops-last1trend-first1-tenTo15--10",
    "constant-risers-5minute-percUpCloseOnlyPoints-filtered70-fiveTo10-40",
    "sudden-drops-last30trend-filter10-fifteenTo20-360",
    "based-on-jump-down8overnight-trending53-gt1milvolume-fiveTo10-16",
    "based-on-jump-gtEightOvernight-trending103-shouldWatchout-first1-fifteenTo20-16",
    "based-on-jump-gtEightOvernight-trending53-notWatchout-first1-tenTo15-0",
    "sudden-drops-last50trend-filter10-tenTo15-400",
    "based-on-jump-down8overnight-trending53-notWatchout-ltneg50percmax-first3-5",
    "based-on-jump-down8overnight-trending103-notWatchout-ltneg50percmax-16",
    "based-on-jump-gtEightOvernight-trending607-shouldWatchout-fifteenTo20-30",
    "based-on-jump-gtEightOvernight-trending53-gt100kvolume-first2-tenTo15-0",
    "sudden-drops-last1trend-first2--10",
    "spread-singleLargestSpreadPerc100kVolume-tenTo15-202",
    "constant-risers-10minute-percUpHighClosePoints-filtered70-fifteenTo20-80",
    "based-on-jump-gtEightOvernight-trending53-shouldWatchout-first3-tenTo15-0",
    "low-float-high-volume-absVolPoints-trenddowngt20-fifteenTo20-384",
    "low-float-high-volume-floatTimesfloatToVolume-trenddowngt20-fifteenTo20-384",
    "low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt20-fifteenTo20-384",
    "low-float-high-volume-twoWeekVolToAvgPoints-trenddowngt20-fifteenTo20-384",
    "low-float-high-volume-floatPoints-trenddowngt20-fifteenTo20-384",
    "low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt30-tenTo15-276",
    "low-float-high-volume-floatPoints-trenddowngt30-tenTo15-276",
    "based-on-jump-down8overnight-trending607-gt500kvolume-first2-tenTo15-0",
    "constant-downers-5minute-percDownLowClosePoints-filtered70-fifteenTo20-242",
    "based-on-jump-fourToEightOvernight-trending103-gt100kvolume-first1-fifteenTo20-5",
    "sudden-drops-last18trend-filter10-fifteenTo20-328",
    "sudden-drops-last30trend-filter10-fiveTo10-500",
    "sudden-drops-last5trend-first1-fifteenTo20--30",
    "sudden-drops-last50trend-filter20-tenTo15-280",
    "based-on-jump-down3overnight-trending103-gt100kvolume-first1-fifteenTo20-0",
    "spread-bidAskLastTradeSame-202",
    "constant-risers-10minute-percUpHighClose-filtered70-fiveTo10-250",
    "based-on-jump-down5overnight-trending103-gt1milvolume-first1-fiveTo10-0",
    "low-float-high-volume-floatTimesabsVolPoints-trenddowngt20-shouldWatchout-fiveTo10-95",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt20-shouldWatchout-fiveTo10-95",
    "low-float-high-volume-floatTimesfloatToVolume-trenddowngt20-shouldWatchout-fiveTo10-95",
    "low-float-high-volume-floatTimesvolToAvgPoints-trendgt20-notWatchout-tenTo15-150",
    "based-on-jump-gtEightOvernight-trending53-gt1milvolume-first1-tenTo15-16",
    "based-on-jump-down8overnight-trending35257-gt1milvolume-first1-fiveTo10-30",
    "low-float-high-volume-volTo2WeekPoints-trendgt40-shouldWatchout-tenTo15-276",
    "low-float-high-volume-floatPoints-trendgt40-shouldWatchout-tenTo15-276",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt40-tenTo15-276",
    "based-on-jump-fourToEightOvernight-trending103-notWatchout-ltneg50percmax-fiveTo10-5",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt20-notWatchout-fiveTo10-150",
    "low-float-high-volume-floatTimesabsVolPoints-trendgt20-notWatchout-fiveTo10-150",
    "low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt20-notWatchout-fifteenTo20-384",
    "low-float-high-volume-floatTimesabsVolPoints-trenddowngt20-notWatchout-fifteenTo20-384",
    "low-float-high-volume-volToAvgPoints-trenddowngt20-notWatchout-fifteenTo20-384",
    "based-on-jump-gtEightOvernight-trending53-gt100kvolume-first1-fifteenTo20-0",
    "based-on-jump-fourToEightOvernight-trending53-gt500kvolume-first2-fifteenTo20-16",
    "low-float-high-volume-absVolPoints-trendgt20-notWatchout-fifteenTo20-150",
    "based-on-jump-down8overnight-trending35257-gt500kvolume-tenTo15-0",
    "constant-risers-10minute-percUpCloseOnly-filtered80-fiveTo10-100",
    "based-on-jump-down3overnight-trending35257-gt1milvolume-fiveTo10-5",
    "based-on-jump-down8overnight-trending607-gt1milvolume-first1-tenTo15-0",
    "low-float-high-volume-absVolPoints-trenddowngt30-fiveTo10-150",
    "based-on-jump-gtEightOvernight-trending103-gt500kvolume-tenTo15-5",
    "constant-risers-10minute-percUpHighClose-filtered70-tenTo15-140",
    "low-float-high-volume-floatTimesabsVolPoints-trenddowngt20-fifteenTo20-276",
    "low-float-high-volume-volTo2WeekPoints-trenddowngt20-fifteenTo20-276",
    "low-float-high-volume-floatTimesfloatToVolume-trenddowngt20-notWatchout-fifteenTo20-276",
    "low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt20-notWatchout-fifteenTo20-276",
    "low-float-high-volume-floatPoints-trenddowngt20-notWatchout-fifteenTo20-276",

    
    // sudden-drops
    'sudden-drops-last3trend-filter10-100',
    'sudden-drops-last3trend-filter10-189',
    'sudden-drops-last10trend-filter10--10',
    'sudden-drops-last2trend-filter10-100',
    'sudden-drops-last5trend-filter10-400',
    'sudden-drops-last30trend-filter10-tenTo15-221',
    'sudden-drops-last30trend-filter10-400',
    'sudden-drops-last1trend-filter10-221',
    'sudden-drops-last50trend-filter10-400',
    'sudden-drops-last1trend-filter10-fiveTo10-14',
    'sudden-drops-last2trend-filter10-221',
    'sudden-drops-last3trend-filter10-221',
    'sudden-drops-last18trend-filter10-fifteenTo20-290',
    'sudden-drops-last18trend-filter10-tenTo15-360',
    'sudden-drops-last18trend-filter10-tenTo15-221',
    'sudden-drops-last10trend-filter10-fifteenTo20-290',
    'sudden-drops-last50trend-filter10-tenTo15-400',
    'sudden-drops-last30trend-filter10-fifteenTo20-360',
    'sudden-drops-last18trend-filter10-fifteenTo20-328',
    'sudden-drops-last30trend-filter10-fiveTo10-500',
    'sudden-drops-last50trend-filter10-fiveTo10-500',
    'sudden-drops-last10trend-filter10-tenTo15-221',
    'sudden-drops-last5trend-filter10--10',
    'sudden-drops-last18trend-filter10--10',
    'sudden-drops-last18trend-filter10-tenTo15-290',
    'sudden-drops-last10trend-filter10-fifteenTo20-328',
    'sudden-drops-last10trend-filter10-fifteenTo20-63',
    'sudden-drops-last30trend-filter10-tenTo15-388',
    'sudden-drops-last1trend-filter10-360',
    'sudden-drops-last50trend-filter10-tenTo15-470',
    'sudden-drops-last50trend-filter20-tenTo15-280',
    'sudden-drops-last30trend-filter10-fifteenTo20-280',
    'sudden-drops-last18trend-filter10-fifteenTo20-280',
    'sudden-drops-last10trend-filter10-tenTo15-360',

    // constant-risers
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered70-100',
    'constant-risers-10minute-percUpHighClosePoints-filtered70-100',
    'constant-risers-10minute-percUpHighClosePoints-filtered80-fiveTo10-40',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered80-fiveTo10-40',
    'constant-risers-10minute-percUpHighClosePoints-filtered70-198',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered70-198',
    'constant-risers-10minute-percUpHighClose-filtered70-198',
    'constant-risers-5minute-percUpCloseOnlyPoints-filtered70-fiveTo10-40',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered70-fiveTo10-40',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered70-fifteenTo20-80',
    'constant-risers-10minute-percUpHighClosePoints-filtered70-fifteenTo20-80',
    'constant-risers-10minute-percUpHighClose-filtered70-fiveTo10-250',
    'constant-risers-10minute-percUpHighClosePoints-filtered70-fiveTo10-250',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered70-fiveTo10-250',
    'constant-risers-10minute-percUpCloseOnly-filtered70-fiveTo10-250',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered70-tenTo15-140',
    'constant-risers-10minute-percUpHighClosePoints-filtered70-tenTo15-140',
    'constant-risers-10minute-percUpCloseOnly-filtered80-fiveTo10-100',
    'constant-risers-10minute-percUpHighClose-filtered80-fiveTo10-100',
    'constant-risers-10minute-percUpHighClose-filtered70-tenTo15-140'
]

const backToTheBasicsPeople = [
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-notWatchout-95',
    'based-on-jump-gtEightOvernight-trending607-shouldWatchout-first1-fiveTo10-30',
    'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-25',
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-shouldWatchout-25',
    'sudden-drops-last3trend-first1-500',
    'sudden-drops-last3trend-filter10-100',
    'based-on-jump-gtEightOvernight-trending607-shouldWatchout-first1-fiveTo10-30',
    'based-on-jump-gtEightOvernight-trending53-notWatchout-gtneg20percmax-first2-30',
];

const heavydutyhitters = [
    'low-float-high-volume-floatPoints-trenddowngt10-notWatchout-tenTo15-276',
    'based-on-jump-down8overnight-trending103-gt1milvolume-first3-16',
    'sudden-drops-last18trend-filter20-280',
    'low-float-high-volume-floatTimesfloatToVolume-trend10to15-fifteenTo20-150',
    'sudden-drops-last18trend-filter30-280'
];

const constantinople = [
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered70-fiveTo10-40',
    'constant-downers-10minute-percDownCloseOnly-filtered80-242',
];


const moreITELLYOUMORE = [
    'technical indicators-day-year-topSMAoverUnderHist-114',
    'sudden-drops-volumeGT1000000-last1trend-first1-280',
    'sudden-drops-shouldWatchout-last18trend-first1-fiveTo10-280',
    'low-float-high-volume-twoWeekVolToAvgPoints-shouldWatchout-fiveTo10-276',
    'sudden-drops-tsoAbsLT15-last18trend-first2-fiveTo10-280',
    'sudden-drops-bothtrendsAbsLT20-last30trend-filter10-221',
    'constant-risers-5minute-percUpHighClose-filtered60-fiveTo10-80',
    'low-float-high-volume-volTo2WeekPoints-notWatchout-6',
    'sudden-drops-shouldWatchout-bothtrendsAbsLT30-last18trend-first2-221'
];

const postMongoBigHitters = [
    // big hitters
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt20-276',
];

const postMongoTimes2 = [
    // x2
    'low-float-high-volume-floatPoints-trendgt5-shouldWatchout-fifteenTo20-95',
    'low-float-high-volume-absVolPoints-trenddowngt30-6',
    'sudden-drops-last50trend-filter20-360',
    'low-float-high-volume-volToAvgPoints-trenddowngt10-notWatchout-fiveTo10-150',
    'sudden-drops-last30trend-filter20-153',
    'based-on-jump-down5overnight-trending35257-shouldWatchout-first1-tenTo15-16',
];

const postMongoCount3 = [
    // count 3
    'sudden-drops-last50trend-filter20-360',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trenddowngt10-notWatchout-fiveTo10-150',
    'based-on-jump-down5overnight-trending35257-shouldWatchout-first3-tenTo15-30',
    'based-on-jump-down5overnight-shouldWatchout-first1-tenTo15-5',
    'based-on-jump-down5overnight-trending53-shouldWatchout-first2-tenTo15-16',
    'constant-risers-10minute-percUpCloseOnlyPoints-highovernightjumps-tenTo15-80'
];

const postMongo = [
    ...postMongoBigHitters,
    ...postMongoTimes2,
    ...postMongoCount3
];

const dec17 = [
    "sudden-drops-last10trend-filter10-328",
    "based-on-jump-down5overnight-shouldWatchout-first3-tenTo15-16",
    "sudden-drops-last30trend-first1-fiveTo10-328",
    "based-on-jump-down5overnight-shouldWatchout-tenTo15-16",
    "low-float-high-volume-floatTimesabsVolPoints-trenddown7to10-shouldWatchout-tenTo15-95",
    "low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-150",
    "sudden-drops-last3trend-first1-328",
    "based-on-jump-down3overnight-shouldWatchout-first1-fiveTo10-5"
];

const simpleAsThat = [
    'low-float-high-volume-absVolPoints-trenddowngt20-6'
];


const allTickerWatchers = [
    "ticker-watchers-under1-shouldWatchout-minorJump-morning",
    "ticker-watchers-under1-shouldWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under1-shouldWatchout-minorJump-later",
    "ticker-watchers-under1-shouldWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under1-shouldWatchout-minorJump-muchlater",
    "ticker-watchers-under1-shouldWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under1-shouldWatchout-morning",
    "ticker-watchers-under1-shouldWatchout-morning-failedHistorical",
    "ticker-watchers-under1-shouldWatchout-later",
    "ticker-watchers-under1-shouldWatchout-later-failedHistorical",
    "ticker-watchers-under1-shouldWatchout-muchlater",
    "ticker-watchers-under1-shouldWatchout-muchlater-failedHistorical",
    "ticker-watchers-under1-notWatchout-minorJump-morning",
    "ticker-watchers-under1-notWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under1-notWatchout-minorJump-later",
    "ticker-watchers-under1-notWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under1-notWatchout-minorJump-muchlater",
    "ticker-watchers-under1-notWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under1-notWatchout-morning",
    "ticker-watchers-under1-notWatchout-morning-failedHistorical",
    "ticker-watchers-under1-notWatchout-later",
    "ticker-watchers-under1-notWatchout-later-failedHistorical",
    "ticker-watchers-under1-notWatchout-muchlater",
    "ticker-watchers-under1-notWatchout-muchlater-failedHistorical",
    "ticker-watchers-under5-shouldWatchout-minorJump-morning",
    "ticker-watchers-under5-shouldWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under5-shouldWatchout-minorJump-later",
    "ticker-watchers-under5-shouldWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under5-shouldWatchout-minorJump-muchlater",
    "ticker-watchers-under5-shouldWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under5-shouldWatchout-morning",
    "ticker-watchers-under5-shouldWatchout-morning-failedHistorical",
    "ticker-watchers-under5-shouldWatchout-later",
    "ticker-watchers-under5-shouldWatchout-later-failedHistorical",
    "ticker-watchers-under5-shouldWatchout-muchlater",
    "ticker-watchers-under5-shouldWatchout-muchlater-failedHistorical",
    "ticker-watchers-under5-notWatchout-minorJump-morning",
    "ticker-watchers-under5-notWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under5-notWatchout-minorJump-later",
    "ticker-watchers-under5-notWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under5-notWatchout-minorJump-muchlater",
    "ticker-watchers-under5-notWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under5-notWatchout-morning",
    "ticker-watchers-under5-notWatchout-morning-failedHistorical",
    "ticker-watchers-under5-notWatchout-later",
    "ticker-watchers-under5-notWatchout-later-failedHistorical",
    "ticker-watchers-under5-notWatchout-muchlater",
    "ticker-watchers-under5-notWatchout-muchlater-failedHistorical",
    "ticker-watchers-under10-shouldWatchout-minorJump-morning",
    "ticker-watchers-under10-shouldWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under10-shouldWatchout-minorJump-later",
    "ticker-watchers-under10-shouldWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under10-shouldWatchout-minorJump-muchlater",
    "ticker-watchers-under10-shouldWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under10-shouldWatchout-morning",
    "ticker-watchers-under10-shouldWatchout-morning-failedHistorical",
    "ticker-watchers-under10-shouldWatchout-later",
    "ticker-watchers-under10-shouldWatchout-later-failedHistorical",
    "ticker-watchers-under10-shouldWatchout-muchlater",
    "ticker-watchers-under10-shouldWatchout-muchlater-failedHistorical",
    "ticker-watchers-under10-notWatchout-minorJump-morning",
    "ticker-watchers-under10-notWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under10-notWatchout-minorJump-later",
    "ticker-watchers-under10-notWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under10-notWatchout-minorJump-muchlater",
    "ticker-watchers-under10-notWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under10-notWatchout-morning",
    "ticker-watchers-under10-notWatchout-morning-failedHistorical",
    "ticker-watchers-under10-notWatchout-later",
    "ticker-watchers-under10-notWatchout-later-failedHistorical",
    "ticker-watchers-under10-notWatchout-muchlater",
    "ticker-watchers-under10-notWatchout-muchlater-failedHistorical",
    "ticker-watchers-under15-shouldWatchout-minorJump-morning",
    "ticker-watchers-under15-shouldWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under15-shouldWatchout-minorJump-later",
    "ticker-watchers-under15-shouldWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under15-shouldWatchout-minorJump-muchlater",
    "ticker-watchers-under15-shouldWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under15-shouldWatchout-morning",
    "ticker-watchers-under15-shouldWatchout-morning-failedHistorical",
    "ticker-watchers-under15-shouldWatchout-later",
    "ticker-watchers-under15-shouldWatchout-later-failedHistorical",
    "ticker-watchers-under15-shouldWatchout-muchlater",
    "ticker-watchers-under15-shouldWatchout-muchlater-failedHistorical",
    "ticker-watchers-under15-notWatchout-minorJump-morning",
    "ticker-watchers-under15-notWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under15-notWatchout-minorJump-later",
    "ticker-watchers-under15-notWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under15-notWatchout-minorJump-muchlater",
    "ticker-watchers-under15-notWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under15-notWatchout-morning",
    "ticker-watchers-under15-notWatchout-morning-failedHistorical",
    "ticker-watchers-under15-notWatchout-later",
    "ticker-watchers-under15-notWatchout-later-failedHistorical",
    "ticker-watchers-under15-notWatchout-muchlater",
    "ticker-watchers-under15-notWatchout-muchlater-failedHistorical",
    "ticker-watchers-under20-shouldWatchout-minorJump-morning",
    "ticker-watchers-under20-shouldWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under20-shouldWatchout-minorJump-later",
    "ticker-watchers-under20-shouldWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under20-shouldWatchout-minorJump-muchlater",
    "ticker-watchers-under20-shouldWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under20-shouldWatchout-morning",
    "ticker-watchers-under20-shouldWatchout-morning-failedHistorical",
    "ticker-watchers-under20-shouldWatchout-later",
    "ticker-watchers-under20-shouldWatchout-later-failedHistorical",
    "ticker-watchers-under20-shouldWatchout-muchlater",
    "ticker-watchers-under20-shouldWatchout-muchlater-failedHistorical",
    "ticker-watchers-under20-notWatchout-minorJump-morning",
    "ticker-watchers-under20-notWatchout-minorJump-morning-failedHistorical",
    "ticker-watchers-under20-notWatchout-minorJump-later",
    "ticker-watchers-under20-notWatchout-minorJump-later-failedHistorical",
    "ticker-watchers-under20-notWatchout-minorJump-muchlater",
    "ticker-watchers-under20-notWatchout-minorJump-muchlater-failedHistorical",
    "ticker-watchers-under20-notWatchout-morning",
    "ticker-watchers-under20-notWatchout-morning-failedHistorical",
    "ticker-watchers-under20-notWatchout-later",
    "ticker-watchers-under20-notWatchout-later-failedHistorical",
    "ticker-watchers-under20-notWatchout-muchlater",
    "ticker-watchers-under20-notWatchout-muchlater-failedHistorical"
];



const TWshouldWatchout = [
    'ticker-watchers-under1-shouldWatchout-minorJump-morning',
    'ticker-watchers-under1-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-minorJump-later',
    'ticker-watchers-under1-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under1-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-morning',
    'ticker-watchers-under1-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-later',
    'ticker-watchers-under1-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-muchlater',
    'ticker-watchers-under1-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-morning',
    'ticker-watchers-under5-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-later',
    'ticker-watchers-under5-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under5-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-morning',
    'ticker-watchers-under5-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-later',
    'ticker-watchers-under5-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-muchlater',
    'ticker-watchers-under5-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-morning',
    'ticker-watchers-under10-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-later',
    'ticker-watchers-under10-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under10-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-morning',
    'ticker-watchers-under10-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-later',
    'ticker-watchers-under10-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-muchlater',
    'ticker-watchers-under10-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-morning',
    'ticker-watchers-under15-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-later',
    'ticker-watchers-under15-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under15-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-morning',
    'ticker-watchers-under15-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-later',
    'ticker-watchers-under15-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-muchlater',
    'ticker-watchers-under15-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-morning',
    'ticker-watchers-under20-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-later',
    'ticker-watchers-under20-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under20-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-morning',
    'ticker-watchers-under20-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-later',
    'ticker-watchers-under20-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-muchlater',
    'ticker-watchers-under20-shouldWatchout-muchlater-failedHistorical' 
];

const TWnotWatchout = [ 
    'ticker-watchers-under1-notWatchout-minorJump-morning',
    'ticker-watchers-under1-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-later',
    'ticker-watchers-under1-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-muchlater',
    'ticker-watchers-under1-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under1-notWatchout-morning',
    'ticker-watchers-under1-notWatchout-morning-failedHistorical',
    'ticker-watchers-under1-notWatchout-later',
    'ticker-watchers-under1-notWatchout-later-failedHistorical',
    'ticker-watchers-under1-notWatchout-muchlater',
    'ticker-watchers-under1-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-morning',
    'ticker-watchers-under5-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-later',
    'ticker-watchers-under5-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-muchlater',
    'ticker-watchers-under5-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under5-notWatchout-morning',
    'ticker-watchers-under5-notWatchout-morning-failedHistorical',
    'ticker-watchers-under5-notWatchout-later',
    'ticker-watchers-under5-notWatchout-later-failedHistorical',
    'ticker-watchers-under5-notWatchout-muchlater',
    'ticker-watchers-under5-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-morning',
    'ticker-watchers-under10-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-later',
    'ticker-watchers-under10-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-muchlater',
    'ticker-watchers-under10-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under10-notWatchout-morning',
    'ticker-watchers-under10-notWatchout-morning-failedHistorical',
    'ticker-watchers-under10-notWatchout-later',
    'ticker-watchers-under10-notWatchout-later-failedHistorical',
    'ticker-watchers-under10-notWatchout-muchlater',
    'ticker-watchers-under10-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-morning',
    'ticker-watchers-under15-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-later',
    'ticker-watchers-under15-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-muchlater',
    'ticker-watchers-under15-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under15-notWatchout-morning',
    'ticker-watchers-under15-notWatchout-morning-failedHistorical',
    'ticker-watchers-under15-notWatchout-later',
    'ticker-watchers-under15-notWatchout-later-failedHistorical',
    'ticker-watchers-under15-notWatchout-muchlater',
    'ticker-watchers-under15-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-morning',
    'ticker-watchers-under20-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-later',
    'ticker-watchers-under20-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-muchlater',
    'ticker-watchers-under20-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under20-notWatchout-morning',
    'ticker-watchers-under20-notWatchout-morning-failedHistorical',
    'ticker-watchers-under20-notWatchout-later',
    'ticker-watchers-under20-notWatchout-later-failedHistorical',
    'ticker-watchers-under20-notWatchout-muchlater',
    'ticker-watchers-under20-notWatchout-muchlater-failedHistorical' ];

const TWminorJumps = [ 
    'ticker-watchers-under1-shouldWatchout-minorJump-morning',
    'ticker-watchers-under1-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-minorJump-later',
    'ticker-watchers-under1-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under1-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-morning',
    'ticker-watchers-under1-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-later',
    'ticker-watchers-under1-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-muchlater',
    'ticker-watchers-under1-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-morning',
    'ticker-watchers-under5-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-later',
    'ticker-watchers-under5-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under5-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-morning',
    'ticker-watchers-under5-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-later',
    'ticker-watchers-under5-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-muchlater',
    'ticker-watchers-under5-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-morning',
    'ticker-watchers-under10-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-later',
    'ticker-watchers-under10-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under10-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-morning',
    'ticker-watchers-under10-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-later',
    'ticker-watchers-under10-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-muchlater',
    'ticker-watchers-under10-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-morning',
    'ticker-watchers-under15-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-later',
    'ticker-watchers-under15-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under15-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-morning',
    'ticker-watchers-under15-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-later',
    'ticker-watchers-under15-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-muchlater',
    'ticker-watchers-under15-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-morning',
    'ticker-watchers-under20-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-later',
    'ticker-watchers-under20-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-muchlater',
    'ticker-watchers-under20-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-morning',
    'ticker-watchers-under20-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-later',
    'ticker-watchers-under20-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-muchlater',
    'ticker-watchers-under20-notWatchout-minorJump-muchlater-failedHistorical' 
];


const TWfailedHistorical = [ 
    'ticker-watchers-under1-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under1-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under1-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under1-notWatchout-morning-failedHistorical',
    'ticker-watchers-under1-notWatchout-later-failedHistorical',
    'ticker-watchers-under1-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under5-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under5-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under5-notWatchout-morning-failedHistorical',
    'ticker-watchers-under5-notWatchout-later-failedHistorical',
    'ticker-watchers-under5-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under10-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under10-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under10-notWatchout-morning-failedHistorical',
    'ticker-watchers-under10-notWatchout-later-failedHistorical',
    'ticker-watchers-under10-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under15-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under15-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under15-notWatchout-morning-failedHistorical',
    'ticker-watchers-under15-notWatchout-later-failedHistorical',
    'ticker-watchers-under15-notWatchout-muchlater-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-morning-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-later-failedHistorical',
    'ticker-watchers-under20-shouldWatchout-muchlater-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-morning-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-later-failedHistorical',
    'ticker-watchers-under20-notWatchout-minorJump-muchlater-failedHistorical',
    'ticker-watchers-under20-notWatchout-morning-failedHistorical',
    'ticker-watchers-under20-notWatchout-later-failedHistorical',
    'ticker-watchers-under20-notWatchout-muchlater-failedHistorical'
];








const tickerWatchersNotWatchout = [
    'ticker-watchers-under1-notWatchout-morning-5000',
    'ticker-watchers-under5-notWatchout-morning-5000',
    'ticker-watchers-under10-notWatchout-morning-5000',
    'ticker-watchers-under15-notWatchout-morning-5000',
    'ticker-watchers-under20-notWatchout-morning-5000',

    'ticker-watchers-under1-notWatchout-later-5000',
    'ticker-watchers-under5-notWatchout-later-5000',
    'ticker-watchers-under10-notWatchout-later-5000',
    'ticker-watchers-under15-notWatchout-later-5000',
    'ticker-watchers-under20-notWatchout-later-5000',

    'ticker-watchers-under1-notWatchout-muchlater-5000',
    'ticker-watchers-under5-notWatchout-muchlater-5000',
    'ticker-watchers-under10-notWatchout-muchlater-5000',
    'ticker-watchers-under15-notWatchout-muchlater-5000',
    'ticker-watchers-under20-notWatchout-muchlater-5000',
];

const tickerWatchersMinorJumps = [
    'ticker-watchers-under1-shouldWatchout-minorJump-morning-5000',
    'ticker-watchers-under5-shouldWatchout-minorJump-morning-5000',
    'ticker-watchers-under10-shouldWatchout-minorJump-morning-5000',
    'ticker-watchers-under15-shouldWatchout-minorJump-morning-5000',
    'ticker-watchers-under20-shouldWatchout-minorJump-morning-5000',

    'ticker-watchers-under1-shouldWatchout-minorJump-later-5000',
    'ticker-watchers-under5-shouldWatchout-minorJump-later-5000',
    'ticker-watchers-under10-shouldWatchout-minorJump-later-5000',
    'ticker-watchers-under15-shouldWatchout-minorJump-later-5000',
    'ticker-watchers-under20-shouldWatchout-minorJump-later-5000',

    'ticker-watchers-under1-shouldWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under5-shouldWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under10-shouldWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under15-shouldWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under20-shouldWatchout-minorJump-muchlater-5000',

    'ticker-watchers-under1-notWatchout-minorJump-morning-5000',
    'ticker-watchers-under5-notWatchout-minorJump-morning-5000',
    'ticker-watchers-under10-notWatchout-minorJump-morning-5000',
    'ticker-watchers-under15-notWatchout-minorJump-morning-5000',
    'ticker-watchers-under20-notWatchout-minorJump-morning-5000',

    'ticker-watchers-under1-notWatchout-minorJump-later-5000',
    'ticker-watchers-under5-notWatchout-minorJump-later-5000',
    'ticker-watchers-under10-notWatchout-minorJump-later-5000',
    'ticker-watchers-under15-notWatchout-minorJump-later-5000',
    'ticker-watchers-under20-notWatchout-minorJump-later-5000',

    'ticker-watchers-under1-notWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under5-notWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under10-notWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under15-notWatchout-minorJump-muchlater-5000',
    'ticker-watchers-under20-notWatchout-minorJump-muchlater-5000',
];

const tickerWatchersShouldWatchout = [
    'ticker-watchers-under1-shouldWatchout-morning-5000',
    'ticker-watchers-under5-shouldWatchout-morning-5000',
    'ticker-watchers-under10-shouldWatchout-morning-5000',
    'ticker-watchers-under15-shouldWatchout-morning-5000',
    'ticker-watchers-under20-shouldWatchout-morning-5000',

    'ticker-watchers-under1-shouldWatchout-later-5000',
    'ticker-watchers-under5-shouldWatchout-later-5000',
    'ticker-watchers-under10-shouldWatchout-later-5000',
    'ticker-watchers-under15-shouldWatchout-later-5000',
    'ticker-watchers-under20-shouldWatchout-later-5000',

    'ticker-watchers-under1-shouldWatchout-muchlater-5000',
    'ticker-watchers-under5-shouldWatchout-muchlater-5000',
    'ticker-watchers-under10-shouldWatchout-muchlater-5000',
    'ticker-watchers-under15-shouldWatchout-muchlater-5000',
    'ticker-watchers-under20-shouldWatchout-muchlater-5000',
]

const myTickerWatchers = [
    ...tickerWatchersNotWatchout
];

const stSentimentBearish = [

    // bad ones
    // lowest ... good keys
    // + highest bullishCount

    "best-st-sentiment-under5-lowest-bullBearScore--25",
    "best-st-sentiment-under5-lowest-bullBearScore-first2--25",
    "best-st-sentiment-under5-lowest-withSentiment--25",
    "best-st-sentiment-und er5-lowest-withSentiment-first2--25",
    "best-st-sentiment-under5-lowest-withSentAndVol--25",
    "best-st-sentiment-under5-lowest-withSentAndVol-first2--25",
    "best-st-sentiment-under5-lowest-mostRecentSentiment--25",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-first2--25",
    "best-st-sentiment-under5-lowest-todayVolumeChange--25",
    "best-st-sentiment-under5-lowest-todayVolumeChange-first2--25",
    "best-st-sentiment-under5-highest-bearishCount--25",
    "best-st-sentiment-under5-highest-bearishCount-first2--25",
    "best-st-sentiment-under5-lowest-bullishCount--25",
    "best-st-sentiment-under5-lowest-bullishCount-first2--25",
    "best-st-sentiment-sp500-lowest-bullBearScore--25",
    "best-st-sentiment-sp500-lowest-bullBearScore-first2--25",
    "best-st-sentiment-sp500-lowest-withSentiment--25",
    "best-st-sentiment-sp500-lowest-withSentiment-first2--25",
    "best-st-sentiment-sp500-lowest-withSentAndVol--25",
    "best-st-sentiment-sp500-lowest-withSentAndVol-first2--25",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment--25",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-first2--25",
    "best-st-sentiment-sp500-lowest-todayVolumeChange--25",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-first2--25",
    "best-st-sentiment-sp500-highest-bearishCount--25",
    "best-st-sentiment-sp500-highest-bearishCount-first2--25",
    "best-st-sentiment-sp500-lowest-bullishCount--25",
    "best-st-sentiment-sp500-lowest-bullishCount-first2--25",
    "best-st-sentiment-top100RH-lowest-bullBearScore--25",
    "best-st-sentiment-top100RH-lowest-bullBearScore-first2--25",
    "best-st-sentiment-top100RH-lowest-withSentiment--25",
    "best-st-sentiment-top100RH-lowest-withSentiment-first2--25",
    "best-st-sentiment-top100RH-lowest-withSentAndVol--25",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-first2--25",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment--25",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-first2--25",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange--25",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-first2--25",
    "best-st-sentiment-top100RH-highest-bearishCount--25",
    "best-st-sentiment-top100RH-highest-bearishCount-first2--25",
    "best-st-sentiment-top100RH-lowest-bullishCount--25",
    "best-st-sentiment-top100RH-lowest-bullishCount-first2--25",
    "best-st-sentiment-under5-lowest-bullBearScore-150",
    "best-st-sentiment-under5-lowest-bullBearScore-first2-150",
    "best-st-sentiment-under5-lowest-withSentiment-150",
    "best-st-sentiment-under5-lowest-withSentiment-first2-150",
    "best-st-sentiment-under5-lowest-withSentAndVol-150",
    "best-st-sentiment-under5-lowest-withSentAndVol-first2-150",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-150",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-first2-150",
    "best-st-sentiment-under5-lowest-todayVolumeChange-150",
    "best-st-sentiment-under5-lowest-todayVolumeChange-first2-150",
    "best-st-sentiment-under5-highest-bearishCount-150",
    "best-st-sentiment-under5-highest-bearishCount-first2-150",
    "best-st-sentiment-under5-lowest-bullishCount-150",
    "best-st-sentiment-under5-lowest-bullishCount-first2-150",
    "best-st-sentiment-sp500-lowest-bullBearScore-150",
    "best-st-sentiment-sp500-lowest-bullBearScore-first2-150",
    "best-st-sentiment-sp500-lowest-withSentiment-150",
    "best-st-sentiment-sp500-lowest-withSentiment-first2-150",
    "best-st-sentiment-sp500-lowest-withSentAndVol-150",
    "best-st-sentiment-sp500-lowest-withSentAndVol-first2-150",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-150",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-first2-150",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-150",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-first2-150",
    "best-st-sentiment-sp500-highest-bearishCount-150",
    "best-st-sentiment-sp500-highest-bearishCount-first2-150",
    "best-st-sentiment-sp500-lowest-bullishCount-150",
    "best-st-sentiment-sp500-lowest-bullishCount-first2-150",
    "best-st-sentiment-top100RH-lowest-bullBearScore-150",
    "best-st-sentiment-top100RH-lowest-bullBearScore-first2-150",
    "best-st-sentiment-top100RH-lowest-withSentiment-150",
    "best-st-sentiment-top100RH-lowest-withSentiment-first2-150",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-150",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-first2-150",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-150",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-first2-150",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-150",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-first2-150",
    "best-st-sentiment-top100RH-highest-bearishCount-150",
    "best-st-sentiment-top100RH-highest-bearishCount-first2-150",
    "best-st-sentiment-top100RH-lowest-bullishCount-150",
    "best-st-sentiment-top100RH-lowest-bullishCount-first2-150",
    "best-st-sentiment-under5-lowest-bullBearScore-300",
    "best-st-sentiment-under5-lowest-bullBearScore-first2-300",
    "best-st-sentiment-under5-lowest-withSentiment-300",
    "best-st-sentiment-under5-lowest-withSentiment-first2-300",
    "best-st-sentiment-under5-lowest-withSentAndVol-300",
    "best-st-sentiment-under5-lowest-withSentAndVol-first2-300",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-300",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-first2-300",
    "best-st-sentiment-under5-lowest-todayVolumeChange-300",
    "best-st-sentiment-under5-lowest-todayVolumeChange-first2-300",
    "best-st-sentiment-under5-highest-bearishCount-300",
    "best-st-sentiment-under5-highest-bearishCount-first2-300",
    "best-st-sentiment-under5-lowest-bullishCount-300",
    "best-st-sentiment-under5-lowest-bullishCount-first2-300",
    "best-st-sentiment-sp500-lowest-bullBearScore-300",
    "best-st-sentiment-sp500-lowest-bullBearScore-first2-300",
    "best-st-sentiment-sp500-lowest-withSentiment-300",
    "best-st-sentiment-sp500-lowest-withSentiment-first2-300",
    "best-st-sentiment-sp500-lowest-withSentAndVol-300",
    "best-st-sentiment-sp500-lowest-withSentAndVol-first2-300",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-300",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-first2-300",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-300",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-first2-300",
    "best-st-sentiment-sp500-highest-bearishCount-300",
    "best-st-sentiment-sp500-highest-bearishCount-first2-300",
    "best-st-sentiment-sp500-lowest-bullishCount-300",
    "best-st-sentiment-sp500-lowest-bullishCount-first2-300",
    "best-st-sentiment-top100RH-lowest-bullBearScore-300",
    "best-st-sentiment-top100RH-lowest-bullBearScore-first2-300",
    "best-st-sentiment-top100RH-lowest-withSentiment-300",
    "best-st-sentiment-top100RH-lowest-withSentiment-first2-300",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-300",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-first2-300",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-300",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-first2-300",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-300",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-first2-300",
    "best-st-sentiment-top100RH-highest-bearishCount-300",
    "best-st-sentiment-top100RH-highest-bearishCount-first2-300",
    "best-st-sentiment-top100RH-lowest-bullishCount-300",
    "best-st-sentiment-top100RH-lowest-bullishCount-first2-300",
    "best-st-sentiment-under5-lowest-bullBearScore-400",
    "best-st-sentiment-under5-lowest-bullBearScore-first2-400",
    "best-st-sentiment-under5-lowest-withSentiment-400",
    "best-st-sentiment-under5-lowest-withSentiment-first2-400",
    "best-st-sentiment-under5-lowest-withSentAndVol-400",
    "best-st-sentiment-under5-lowest-withSentAndVol-first2-400",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-400",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-first2-400",
    "best-st-sentiment-under5-lowest-todayVolumeChange-400",
    "best-st-sentiment-under5-lowest-todayVolumeChange-first2-400",
    "best-st-sentiment-under5-highest-bearishCount-400",
    "best-st-sentiment-under5-highest-bearishCount-first2-400",
    "best-st-sentiment-under5-lowest-bullishCount-400",
    "best-st-sentiment-under5-lowest-bullishCount-first2-400",
    "best-st-sentiment-sp500-lowest-bullBearScore-400",
    "best-st-sentiment-sp500-lowest-bullBearScore-first2-400",
    "best-st-sentiment-sp500-lowest-withSentiment-400",
    "best-st-sentiment-sp500-lowest-withSentiment-first2-400",
    "best-st-sentiment-sp500-lowest-withSentAndVol-400",
    "best-st-sentiment-sp500-lowest-withSentAndVol-first2-400",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-400",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-first2-400",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-400",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-first2-400",
    "best-st-sentiment-sp500-highest-bearishCount-400",
    "best-st-sentiment-sp500-highest-bearishCount-first2-400",
    "best-st-sentiment-sp500-lowest-bullishCount-400",
    "best-st-sentiment-sp500-lowest-bullishCount-first2-400",
    "best-st-sentiment-top100RH-lowest-bullBearScore-400",
    "best-st-sentiment-top100RH-lowest-bullBearScore-first2-400",
    "best-st-sentiment-top100RH-lowest-withSentiment-400",
    "best-st-sentiment-top100RH-lowest-withSentiment-first2-400",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-400",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-first2-400",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-400",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-first2-400",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-400",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-first2-400",
    "best-st-sentiment-top100RH-highest-bearishCount-400",
    "best-st-sentiment-top100RH-highest-bearishCount-first2-400",
    "best-st-sentiment-top100RH-lowest-bullishCount-400",
    "best-st-sentiment-top100RH-lowest-bullishCount-first2-400",
    "best-st-sentiment-under5-lowest-bullBearScore-600",
    "best-st-sentiment-under5-lowest-bullBearScore-first2-600",
    "best-st-sentiment-under5-lowest-withSentiment-600",
    "best-st-sentiment-under5-lowest-withSentiment-first2-600",
    "best-st-sentiment-under5-lowest-withSentAndVol-600",
    "best-st-sentiment-under5-lowest-withSentAndVol-first2-600",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-600",
    "best-st-sentiment-under5-lowest-mostRecentSentiment-first2-600",
    "best-st-sentiment-under5-lowest-todayVolumeChange-600",
    "best-st-sentiment-under5-lowest-todayVolumeChange-first2-600",
    "best-st-sentiment-under5-highest-bearishCount-600",
    "best-st-sentiment-under5-highest-bearishCount-first2-600",
    "best-st-sentiment-under5-lowest-bullishCount-600",
    "best-st-sentiment-under5-lowest-bullishCount-first2-600",
    "best-st-sentiment-sp500-lowest-bullBearScore-600",
    "best-st-sentiment-sp500-lowest-bullBearScore-first2-600",
    "best-st-sentiment-sp500-lowest-withSentiment-600",
    "best-st-sentiment-sp500-lowest-withSentiment-first2-600",
    "best-st-sentiment-sp500-lowest-withSentAndVol-600",
    "best-st-sentiment-sp500-lowest-withSentAndVol-first2-600",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-600",
    "best-st-sentiment-sp500-lowest-mostRecentSentiment-first2-600",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-600",
    "best-st-sentiment-sp500-lowest-todayVolumeChange-first2-600",
    "best-st-sentiment-sp500-highest-bearishCount-600",
    "best-st-sentiment-sp500-highest-bearishCount-first2-600",
    "best-st-sentiment-sp500-lowest-bullishCount-600",
    "best-st-sentiment-sp500-lowest-bullishCount-first2-600",
    "best-st-sentiment-top100RH-lowest-bullBearScore-600",
    "best-st-sentiment-top100RH-lowest-bullBearScore-first2-600",
    "best-st-sentiment-top100RH-lowest-withSentiment-600",
    "best-st-sentiment-top100RH-lowest-withSentiment-first2-600",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-600",
    "best-st-sentiment-top100RH-lowest-withSentAndVol-first2-600",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-600",
    "best-st-sentiment-top100RH-lowest-mostRecentSentiment-first2-600",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-600",
    "best-st-sentiment-top100RH-lowest-todayVolumeChange-first2-600",
    "best-st-sentiment-top100RH-highest-bearishCount-600",
    "best-st-sentiment-top100RH-highest-bearishCount-first2-600",
    "best-st-sentiment-top100RH-lowest-bullishCount-600",
    "best-st-sentiment-top100RH-lowest-bullishCount-first2-600"
];

const stSentimentBullish = [

    // good ones
    // highest ... good keys
    // + lowest bearishCount

    "best-st-sentiment-under5-highest-bullBearScore--25",
    "best-st-sentiment-under5-highest-bullBearScore-first2--25",
    "best-st-sentiment-under5-highest-withSentiment--25",
    "best-st-sentiment-under5-highest-withSentiment-first2--25",
    "best-st-sentiment-under5-highest-withSentAndVol--25",
    "best-st-sentiment-under5-highest-withSentAndVol-first2--25",
    "best-st-sentiment-under5-highest-mostRecentSentiment--25",
    "best-st-sentiment-under5-highest-mostRecentSentiment-first2--25",
    "best-st-sentiment-under5-highest-todayVolumeChange--25",
    "best-st-sentiment-under5-highest-todayVolumeChange-first2--25",
    "best-st-sentiment-under5-lowest-bearishCount--25",
    "best-st-sentiment-under5-lowest-bearishCount-first2--25",
    "best-st-sentiment-under5-highest-bullishCount--25",
    "best-st-sentiment-under5-highest-bullishCount-first2--25",
    "best-st-sentiment-sp500-highest-bullBearScore--25",
    "best-st-sentiment-sp500-highest-bullBearScore-first2--25",
    "best-st-sentiment-sp500-highest-withSentiment--25",
    "best-st-sentiment-sp500-highest-withSentiment-first2--25",
    "best-st-sentiment-sp500-highest-withSentAndVol--25",
    "best-st-sentiment-sp500-highest-withSentAndVol-first2--25",
    "best-st-sentiment-sp500-highest-mostRecentSentiment--25",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-first2--25",
    "best-st-sentiment-sp500-highest-todayVolumeChange--25",
    "best-st-sentiment-sp500-highest-todayVolumeChange-first2--25",
    "best-st-sentiment-sp500-lowest-bearishCount--25",
    "best-st-sentiment-sp500-lowest-bearishCount-first2--25",
    "best-st-sentiment-sp500-highest-bullishCount--25",
    "best-st-sentiment-sp500-highest-bullishCount-first2--25",
    "best-st-sentiment-top100RH-highest-bullBearScore--25",
    "best-st-sentiment-top100RH-highest-bullBearScore-first2--25",
    "best-st-sentiment-top100RH-highest-withSentiment--25",
    "best-st-sentiment-top100RH-highest-withSentiment-first2--25",
    "best-st-sentiment-top100RH-highest-withSentAndVol--25",
    "best-st-sentiment-top100RH-highest-withSentAndVol-first2--25",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment--25",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-first2--25",
    "best-st-sentiment-top100RH-highest-todayVolumeChange--25",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-first2--25",
    "best-st-sentiment-top100RH-lowest-bearishCount--25",
    "best-st-sentiment-top100RH-lowest-bearishCount-first2--25",
    "best-st-sentiment-top100RH-highest-bullishCount--25",
    "best-st-sentiment-top100RH-highest-bullishCount-first2--25",
    "best-st-sentiment-under5-highest-bullBearScore-150",
    "best-st-sentiment-under5-highest-bullBearScore-first2-150",
    "best-st-sentiment-under5-highest-withSentiment-150",
    "best-st-sentiment-under5-highest-withSentiment-first2-150",
    "best-st-sentiment-under5-highest-withSentAndVol-150",
    "best-st-sentiment-under5-highest-withSentAndVol-first2-150",
    "best-st-sentiment-under5-highest-mostRecentSentiment-150",
    "best-st-sentiment-under5-highest-mostRecentSentiment-first2-150",
    "best-st-sentiment-under5-highest-todayVolumeChange-150",
    "best-st-sentiment-under5-highest-todayVolumeChange-first2-150",
    "best-st-sentiment-under5-lowest-bearishCount-150",
    "best-st-sentiment-under5-lowest-bearishCount-first2-150",
    "best-st-sentiment-under5-highest-bullishCount-150",
    "best-st-sentiment-under5-highest-bullishCount-first2-150",
    "best-st-sentiment-sp500-highest-bullBearScore-150",
    "best-st-sentiment-sp500-highest-bullBearScore-first2-150",
    "best-st-sentiment-sp500-highest-withSentiment-150",
    "best-st-sentiment-sp500-highest-withSentiment-first2-150",
    "best-st-sentiment-sp500-highest-withSentAndVol-150",
    "best-st-sentiment-sp500-highest-withSentAndVol-first2-150",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-150",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-first2-150",
    "best-st-sentiment-sp500-highest-todayVolumeChange-150",
    "best-st-sentiment-sp500-highest-todayVolumeChange-first2-150",
    "best-st-sentiment-sp500-lowest-bearishCount-150",
    "best-st-sentiment-sp500-lowest-bearishCount-first2-150",
    "best-st-sentiment-sp500-highest-bullishCount-150",
    "best-st-sentiment-sp500-highest-bullishCount-first2-150",
    "best-st-sentiment-top100RH-highest-bullBearScore-150",
    "best-st-sentiment-top100RH-highest-bullBearScore-first2-150",
    "best-st-sentiment-top100RH-highest-withSentiment-150",
    "best-st-sentiment-top100RH-highest-withSentiment-first2-150",
    "best-st-sentiment-top100RH-highest-withSentAndVol-150",
    "best-st-sentiment-top100RH-highest-withSentAndVol-first2-150",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-150",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-first2-150",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-150",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-first2-150",
    "best-st-sentiment-top100RH-lowest-bearishCount-150",
    "best-st-sentiment-top100RH-lowest-bearishCount-first2-150",
    "best-st-sentiment-top100RH-highest-bullishCount-150",
    "best-st-sentiment-top100RH-highest-bullishCount-first2-150",
    "best-st-sentiment-under5-highest-bullBearScore-300",
    "best-st-sentiment-under5-highest-bullBearScore-first2-300",
    "best-st-sentiment-under5-highest-withSentiment-300",
    "best-st-sentiment-under5-highest-withSentiment-first2-300",
    "best-st-sentiment-under5-highest-withSentAndVol-300",
    "best-st-sentiment-under5-highest-withSentAndVol-first2-300",
    "best-st-sentiment-under5-highest-mostRecentSentiment-300",
    "best-st-sentiment-under5-highest-mostRecentSentiment-first2-300",
    "best-st-sentiment-under5-highest-todayVolumeChange-300",
    "best-st-sentiment-under5-highest-todayVolumeChange-first2-300",
    "best-st-sentiment-under5-lowest-bearishCount-300",
    "best-st-sentiment-under5-lowest-bearishCount-first2-300",
    "best-st-sentiment-under5-highest-bullishCount-300",
    "best-st-sentiment-under5-highest-bullishCount-first2-300",
    "best-st-sentiment-sp500-highest-bullBearScore-300",
    "best-st-sentiment-sp500-highest-bullBearScore-first2-300",
    "best-st-sentiment-sp500-highest-withSentiment-300",
    "best-st-sentiment-sp500-highest-withSentiment-first2-300",
    "best-st-sentiment-sp500-highest-withSentAndVol-300",
    "best-st-sentiment-sp500-highest-withSentAndVol-first2-300",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-300",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-first2-300",
    "best-st-sentiment-sp500-highest-todayVolumeChange-300",
    "best-st-sentiment-sp500-highest-todayVolumeChange-first2-300",
    "best-st-sentiment-sp500-lowest-bearishCount-300",
    "best-st-sentiment-sp500-lowest-bearishCount-first2-300",
    "best-st-sentiment-sp500-highest-bullishCount-300",
    "best-st-sentiment-sp500-highest-bullishCount-first2-300",
    "best-st-sentiment-top100RH-highest-bullBearScore-300",
    "best-st-sentiment-top100RH-highest-bullBearScore-first2-300",
    "best-st-sentiment-top100RH-highest-withSentiment-300",
    "best-st-sentiment-top100RH-highest-withSentiment-first2-300",
    "best-st-sentiment-top100RH-highest-withSentAndVol-300",
    "best-st-sentiment-top100RH-highest-withSentAndVol-first2-300",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-300",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-first2-300",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-300",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-first2-300",
    "best-st-sentiment-top100RH-lowest-bearishCount-300",
    "best-st-sentiment-top100RH-lowest-bearishCount-first2-300",
    "best-st-sentiment-top100RH-highest-bullishCount-300",
    "best-st-sentiment-top100RH-highest-bullishCount-first2-300",
    "best-st-sentiment-under5-highest-bullBearScore-400",
    "best-st-sentiment-under5-highest-bullBearScore-first2-400",
    "best-st-sentiment-under5-highest-withSentiment-400",
    "best-st-sentiment-under5-highest-withSentiment-first2-400",
    "best-st-sentiment-under5-highest-withSentAndVol-400",
    "best-st-sentiment-under5-highest-withSentAndVol-first2-400",
    "best-st-sentiment-under5-highest-mostRecentSentiment-400",
    "best-st-sentiment-under5-highest-mostRecentSentiment-first2-400",
    "best-st-sentiment-under5-highest-todayVolumeChange-400",
    "best-st-sentiment-under5-highest-todayVolumeChange-first2-400",
    "best-st-sentiment-under5-lowest-bearishCount-400",
    "best-st-sentiment-under5-lowest-bearishCount-first2-400",
    "best-st-sentiment-under5-highest-bullishCount-400",
    "best-st-sentiment-under5-highest-bullishCount-first2-400",
    "best-st-sentiment-sp500-highest-bullBearScore-400",
    "best-st-sentiment-sp500-highest-bullBearScore-first2-400",
    "best-st-sentiment-sp500-highest-withSentiment-400",
    "best-st-sentiment-sp500-highest-withSentiment-first2-400",
    "best-st-sentiment-sp500-highest-withSentAndVol-400",
    "best-st-sentiment-sp500-highest-withSentAndVol-first2-400",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-400",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-first2-400",
    "best-st-sentiment-sp500-highest-todayVolumeChange-400",
    "best-st-sentiment-sp500-highest-todayVolumeChange-first2-400",
    "best-st-sentiment-sp500-lowest-bearishCount-400",
    "best-st-sentiment-sp500-lowest-bearishCount-first2-400",
    "best-st-sentiment-sp500-highest-bullishCount-400",
    "best-st-sentiment-sp500-highest-bullishCount-first2-400",
    "best-st-sentiment-top100RH-highest-bullBearScore-400",
    "best-st-sentiment-top100RH-highest-bullBearScore-first2-400",
    "best-st-sentiment-top100RH-highest-withSentiment-400",
    "best-st-sentiment-top100RH-highest-withSentiment-first2-400",
    "best-st-sentiment-top100RH-highest-withSentAndVol-400",
    "best-st-sentiment-top100RH-highest-withSentAndVol-first2-400",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-400",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-first2-400",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-400",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-first2-400",
    "best-st-sentiment-top100RH-lowest-bearishCount-400",
    "best-st-sentiment-top100RH-lowest-bearishCount-first2-400",
    "best-st-sentiment-top100RH-highest-bullishCount-400",
    "best-st-sentiment-top100RH-highest-bullishCount-first2-400",
    "best-st-sentiment-under5-highest-bullBearScore-600",
    "best-st-sentiment-under5-highest-bullBearScore-first2-600",
    "best-st-sentiment-under5-highest-withSentiment-600",
    "best-st-sentiment-under5-highest-withSentiment-first2-600",
    "best-st-sentiment-under5-highest-withSentAndVol-600",
    "best-st-sentiment-under5-highest-withSentAndVol-first2-600",
    "best-st-sentiment-under5-highest-mostRecentSentiment-600",
    "best-st-sentiment-under5-highest-mostRecentSentiment-first2-600",
    "best-st-sentiment-under5-highest-todayVolumeChange-600",
    "best-st-sentiment-under5-highest-todayVolumeChange-first2-600",
    "best-st-sentiment-under5-lowest-bearishCount-600",
    "best-st-sentiment-under5-lowest-bearishCount-first2-600",
    "best-st-sentiment-under5-highest-bullishCount-600",
    "best-st-sentiment-under5-highest-bullishCount-first2-600",
    "best-st-sentiment-sp500-highest-bullBearScore-600",
    "best-st-sentiment-sp500-highest-bullBearScore-first2-600",
    "best-st-sentiment-sp500-highest-withSentiment-600",
    "best-st-sentiment-sp500-highest-withSentiment-first2-600",
    "best-st-sentiment-sp500-highest-withSentAndVol-600",
    "best-st-sentiment-sp500-highest-withSentAndVol-first2-600",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-600",
    "best-st-sentiment-sp500-highest-mostRecentSentiment-first2-600",
    "best-st-sentiment-sp500-highest-todayVolumeChange-600",
    "best-st-sentiment-sp500-highest-todayVolumeChange-first2-600",
    "best-st-sentiment-sp500-lowest-bearishCount-600",
    "best-st-sentiment-sp500-lowest-bearishCount-first2-600",
    "best-st-sentiment-sp500-highest-bullishCount-600",
    "best-st-sentiment-sp500-highest-bullishCount-first2-600",
    "best-st-sentiment-top100RH-highest-bullBearScore-600",
    "best-st-sentiment-top100RH-highest-bullBearScore-first2-600",
    "best-st-sentiment-top100RH-highest-withSentiment-600",
    "best-st-sentiment-top100RH-highest-withSentiment-first2-600",
    "best-st-sentiment-top100RH-highest-withSentAndVol-600",
    "best-st-sentiment-top100RH-highest-withSentAndVol-first2-600",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-600",
    "best-st-sentiment-top100RH-highest-mostRecentSentiment-first2-600",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-600",
    "best-st-sentiment-top100RH-highest-todayVolumeChange-first2-600",
    "best-st-sentiment-top100RH-lowest-bearishCount-600",
    "best-st-sentiment-top100RH-lowest-bearishCount-first2-600",
    "best-st-sentiment-top100RH-highest-bullishCount-600",
    "best-st-sentiment-top100RH-highest-bullishCount-first2-600"
];

const filterStSentiment = stSent => key => stSent.filter(s => s.includes(key));
  

// bullish pms
const filterBullish = filterStSentiment(stSentimentBullish);

const stSentimentUnder5Bullish = filterBullish('under5');
const stSentimentSP500Bullish = filterBullish('sp500');
const stSentimentTop100RHBullish = filterBullish('top100RH');

const stSentimentHighestBullBearScore = filterBullish('bullBearScore');
const stSentimentHighestWithSentiment = filterBullish('withSentiment');
const stSentimentHighestWithSentAndVol = filterBullish('withSentAndVol');
const stSentimentHighestMostRecentSentiment = filterBullish('mostRecentSentiment');
const stSentimentHighestTodayVolumeChange = filterBullish('todayVolumeChange');
const stSentimentHighestBullish = filterBullish('bullishCount');
const stSentimentLowestBearish = filterBullish('bearishCount');


// bearish pms
const filterBearish = filterStSentiment(stSentimentBearish);

const stSentimentUnder5Bearish = filterBearish('under5');
const stSentimentSP500Bearish = filterBearish('sp500');
const stSentimentTop100RHBearish = filterBearish('top100RH');

const stSentimentLowestBullBearScore = filterBearish('bullBearScore');
const stSentimentLowestWithSentiment = filterBearish('withSentiment');
const stSentimentLowestWithSentAndVol = filterBearish('withSentAndVol');
const stSentimentLowestMostRecentSentiment = filterBearish('mostRecentSentiment');
const stSentimentLowestTodayVolumeChange = filterBearish('todayVolumeChange');
const stSentimentLowestBullish = filterBearish('bullishCount');
const stSentimentHighestBearish = filterBearish('bearishCount');


const fourForFives = [
    'sudden-drops-last1trend-first1-100',
    'low-float-high-volume-twoWeekVolToAvgPoints-trendgt30-315',
    'based-on-jump-down5overnight-trending103-notWatchout-16',
    'dynamo-3000-bottom50tso-notWatchout-100',
    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-shouldWatchout-25',
    'based-on-jump-down3overnight-trending103-5',
];
const threeForFours = [
    'constant-downers-5minute-percDownCloseOnly-lowovernightjumps-309',
    'based-on-jump-down5overnight-trending53-notWatchout-ltneg50percmax-30',
    'based-on-jump-fourToEightOvernight-trending53-shouldWatchout-16',
];

const fiveForTens = [
    'based-on-jump-oneToFourOvernight-gt500kvolume-first1-5',
    'sudden-drops-last2trend-first2-100',
    'based-on-jump-down5overnight-trending35257-first1-fiveTo10-30',
    'sudden-drops-last30trend-first2-fiveTo10-280',
    'sudden-drops-last2trend-first2-290',
    'sudden-drops-last1trend-first1-14',
];

const portalPepper = [
    'low-float-high-volume-floatPoints-trenddown7to10-notWatchout-95',
    'based-on-jump-down3overnight-trending103-first2-0'
];

const blueMoons = [
    'low-float-high-volume-absVolPoints-trendgt50-shouldWatchout-tenTo15-315',
    'low-float-high-volume-volToAvgPoints-trendgt50-tenTo15-315',
    
    'based-on-jump-down5overnight-trending35257-gt1milvolume-fiveTo10-0',
    'low-float-high-volume-floatPoints-trenddowngt20-tenTo15-25',
    'based-on-jump-fourToEightOvernight-trending35257-gt500kvolume-5',
    // 'low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt20-notWatchout-tenTo15-25',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddowngt10-notWatchout-tenTo15-25',
    'low-float-high-volume-floatPoints-trenddowngt30-notWatchout-150',
    'based-on-jump-down5overnight-gt1milvolume-fiveTo10-0',
    'low-float-high-volume-floatPoints-trenddowngt10-notWatchout-tenTo15-25',
    'based-on-jump-down3overnight-trending35257-notWatchout-ltneg50percmax-fiveTo10-5',
    'low-float-high-volume-floatPoints-trenddowngt20-tenTo15-95',
    'sudden-drops-last3trend-filter10-fiveTo10-280',
    'sudden-drops-last30trend-filter30-388',
    'based-on-jump-down5overnight-notWatchout-ltneg50percmax-first1-tenTo15-0',
    'sudden-drops-last18trend-filter30-290',
];

const lilMore = [
    'based-on-jump-down5overnight-trending35257-shouldWatchout-tenTo15-16',
    'sudden-drops-last18trend-filter10-fiveTo10-360',
    'sudden-drops-last5trend-filter10-360',
    'low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt10-tenTo15-6',
    'sudden-drops-last50trend-filter20-360',
    'low-float-high-volume-floatPoints-trenddowngt10-tenTo15-25',
    'sudden-drops-last5trend-filter10-290',
    'based-on-jump-down5overnight-trending35257-shouldWatchout-first1-fiveTo10-0',
    'sudden-drops-last3trend-filter10-290',
    'sudden-drops-last30trend-filter20-fiveTo10-388'
];

const aGreatStrategy = [
    'low-float-high-volume-volToAvgPoints-shouldWatchout-fiveTo10-150'
];

const coupleNothers = [
    'low-float-high-volume-volToAvgPoints-trendup1to3-shouldWatchout-150',
    'low-float-high-volume-volToAvgPoints-trendgt10-150',
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
    aug7PerfectoLowCounts,


    qualityModerates,
    moreCommonDrops,
    greatEverydayPerformers,

    filteredDrops,


    anyCountPerfectos,
    moreaddsons,

    iwantthisPARTONE,
    iwantthisPARTTWO,
    iwantthis,


    weekofaug27,

    aug28basedonperfectos,
    combinedWeekOfAug27ANDAug28BasedOnPerfectosRealLowCounts,
    combinedWeekOfAug27ANDAug28BasedOnPerfectosLowAndMedCount,
    combinedWeekOfAug27ANDAug28BasedOnPerfectosHighCount,


    aug29LowCountsABQuality,
    aug29LowCountsGradeC,
    aug29MedHighCounts,

    sepPerfectos,

    // broken down by count in last 15 days
    sepPerfectosHigherCounts,
    sepPerfectosLowerCounts,
    sepPerfectosRealLowCounts,
    sepPerfectosLowCounts,

    sepPerfectosMissing,

    sepHighlights,
    sepStars,

    sepAdds,


    noGuarantees,
    unprovenFilter30Drops,
    unprovenFilter20Drops,
    unprovenSuddenDropsLast2Filter10,

    sep17MORE,
    afterhoursdropsGAMBLES,
    tripleDown,
    singleDown,
    preMarketDrops,
    hadAGoodDay,
    myImpressionAtTheMoment,


    bigdawgs,
    backToTheBasicsPeople,
    heavydutyhitters,
    constantinople,
    moreITELLYOUMORE,


    postMongo,
    postMongoBigHitters,
    postMongoTimes2,
    postMongoCount3,


    dec17,

    simpleAsThat,
    

    // ST SENTIMENT

    // bullish pms
    stSentimentBullish,

        // grouped by stock group
        stSentimentUnder5Bullish,
        stSentimentSP500Bullish,
        stSentimentTop100RHBullish,

        // grouped by sentiment key
        stSentimentHighestBullBearScore,
        stSentimentHighestWithSentiment,
        stSentimentHighestWithSentAndVol,
        stSentimentHighestMostRecentSentiment,
        stSentimentHighestTodayVolumeChange,
        stSentimentHighestBullish,
        stSentimentLowestBearish,


    // bearish pms
    stSentimentBearish,

        // grouped by stock group
        stSentimentUnder5Bearish,
        stSentimentSP500Bearish,
        stSentimentTop100RHBearish,

        // grouped by sentiment key
        stSentimentLowestBullBearScore,
        stSentimentLowestWithSentiment,
        stSentimentLowestWithSentAndVol,
        stSentimentLowestMostRecentSentiment,
        stSentimentLowestTodayVolumeChange,
        stSentimentLowestBullish,
        stSentimentHighestBearish,

    

    // fors

    fourForFives,
    threeForFours,
    fiveForTens,
    portalPepper,


    blueMoons,
    lilMore,

    aGreatStrategy,
    coupleNothers,


    tickerWatchersNotWatchout,
    tickerWatchersShouldWatchout,
    tickerWatchersMinorJumps,

    myTickerWatchers,


    allTickerWatchers,
    TWnotWatchout,
    TWshouldWatchout,
    TWminorJumps,
    TWfailedHistorical,


};
