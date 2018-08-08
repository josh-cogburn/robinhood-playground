const dayOrder = [
    'next',
    'second',
    'third',
    'fourth'
];

const isBreakdownKey = string =>
    dayOrder.some(day => string.startsWith(day) && string.includes('-day'));

const compareTwoBreakdowns = (a, b) => {
    const [aDay, _, aMinute] = a.split('-');
    const [bDay, __, bMinute] = b.split('-');
    if (aDay !== bDay) {
        return dayOrder.indexOf(aDay) > dayOrder.indexOf(bDay) ? 1 : -1;
    }
    return aMinute - bMinute;
};
const orderBreakdownKeys = keys => keys.sort(compareTwoBreakdowns);

module.exports = {
    dayOrder,
    isBreakdownKey,
    compareTwoBreakdowns,
    orderBreakdownKeys
};
