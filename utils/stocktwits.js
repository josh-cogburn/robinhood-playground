const request = require('request-promise');
const { stocktwits: config } = require('../config');
const { proxy: proxyConfig } = require('../config');

const getProxy = () => {
    const { username, password, hosts } = proxyConfig;
    const randomHost = hosts[Math.round(hosts.length * Math.random())];
    return `http://${username}:${password}@${randomHost}`;
};

const getToken = async proxy => {
    const options = {
        method: 'POST',
        uri: 'https://stocktwits.com/api/login',
        body: { user_session: { login: config.username , password: config.password }},
        json: true,
        proxy
    };
    const response = await request(options);
    console.log(
        'stocktwits token',
        response.token
    );
    return response.token;
};

const postBearish = async (ticker, strategy) => {
    const proxy = getProxy();
    const token = await getToken(proxy);
    const body = `$${ticker} bearish because ${strategy}`;
    console.log(`stocktwits ${config.username}: posting ${body}`)
    return request({
        method: 'POST',
        uri: 'https://api.stocktwits.com/api/2/messages/create.json',
        headers: {
            'Authorization': `OAuth ${token}`
        },
        formData: {
            body,
            sentiment: 'bearish'
        },
        proxy
    });
};

module.exports = {
    getToken,
    postBearish
};