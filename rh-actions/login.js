const { credentials } = require('../config');
const retryPromise = require('../utils/retry-promise');
const cacheThis = require('../utils/cache-this');

module.exports = () => {
    return new Promise((resolve) => {
        console.log('initializing Robinhood');
        const Robinhood = require('robinhood')(credentials, () => {

            // promisfy all functions
            Object.keys(Robinhood).forEach(key => {
                console.log('key', key);
                const origFn = Robinhood[key];
                Robinhood[key] = cacheThis(retryPromise((...callArgs) => {
                    return new Promise((resolve, reject) => {
                        origFn.apply(null, [...callArgs, (error, response, body) => {
                            return (error || !body) ? reject(error) : resolve(body);
                        }]);
                    });
                }), 1000 * 60);
            });

            console.log('Robinhood initialized');
            resolve(Robinhood);
        });
    });
};
