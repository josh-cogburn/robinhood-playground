const stratsOfInterest = require('../strats-of-interest');
const protectedModules = [
    'sudden-drops',
    'best-st-sentiment'
];
module.exports = strat => {
    const explicitListed = () => stratsOfInterest.includes(strat);
    const isProtected = () => protectedModules.some(
        test => strat.includes(test)
    );
    return [explicitListed, isProtected].some(t => t());
};