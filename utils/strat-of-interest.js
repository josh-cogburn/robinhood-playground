const exactMatches = require('../strats-of-interest');
const keywordMatches = [
    // 'sudden-drops',
    'best-st-sentiment'
];
const functionMatches = [
    (s, numPicks) => s.includes('sudden-drops') && numPicks === 1
];
module.exports = (strat, numPicks) => {
    const matchesExact = () => exactMatches.includes(strat);
    const matchesKeyword = () => keywordMatches.some(
        test => strat.includes(test)
    );
    const matchesFunction = () => functionMatches.some(fn => fn(strat, numPicks))
    return [matchesKeyword, matchesFunction, matchesExact].some(t => t());
};