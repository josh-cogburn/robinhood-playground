const myStSents = [
    'under5-highest-bullBearScore-first2--25',
    'under5-highest-bullishCount-first2--25',
    'under5-highest-bullBearScore-first2-80',
    'under5-highest-bullishCount-first2-80',
    'under5-highest-bullBearScore-first2-130',
    'under5-highest-bullishCount-first2-130',
    'under5-highest-bullBearScore-first2-190',
    'under5-highest-bullishCount-first2-190',
    'under5-highest-bullBearScore-first2-270',
    'under5-highest-bullishCount-first2-270',
];
module.exports = {
    ...require('./ticker-watchers'),
    ...require('./ask-watchers'),
    myStSents
}