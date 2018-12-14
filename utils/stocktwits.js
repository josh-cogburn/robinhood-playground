const request = require('request-promise');
const { stocktwits: config } = require('../config');
const { proxy: proxyConfig } = require('../config');

const proxyUrl = `http://${proxyConfig.username}:${proxyConfig.password}@104.144.161.156:4444`;
const proxiedRequest = request.defaults({ proxy: proxyUrl });

const getToken = async (username, password) => {
    const options = {
        method: 'POST',
        uri: 'https://stocktwits.com/api/login',
        body: { user_session: { login: config.username , password: config.password }},
        json: true // Automatically stringifies the body to JSON
    };
    const response = await proxiedRequest(options);
    console.log(
        'stocktwits token',
        response.token
    );
    return response.token;
};

const postBearish = async (ticker, strategy) => {
    const body = `$${ticker} bearish because ${strategy}`;
    console.log(`stocktwits ${config.username}: posting ${body}`)
    return proxiedRequest({
        method: 'POST',
        uri: 'https://api.stocktwits.com/api/2/messages/create.json',
        headers: {
            'Authorization': `OAuth ${await getToken()}`
        },
        formData: {
            body,
            sentiment: 'bearish'
        },
    });
};

module.exports = {
    getToken,
    postBearish
};