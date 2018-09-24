const dates = ['9-24-2018'];
const min = [1, 95, 285, 380];

module.exports = dates.reduce((acc, date) => ({
    ...acc,
    ...min.reduce((minAcc, min) => ({
        ...minAcc,
        [`${date}-${min}`]: require(`./${date}-${min}`)
    }), {})
}), {});