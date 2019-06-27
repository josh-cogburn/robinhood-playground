const gmailSend = require('gmail-send');
const { gmail: credentials } = require('../config');

const send = gmailSend({
  user: credentials.username,
  pass: credentials.password
});

module.exports = (subject, text, to = credentials.username, files = []) => new Promise((resolve, reject) => {
    console.log(`sending email...to ${to}...`);
    console.log('subject', subject, 'text', text);
    send({
        subject: `robinhood-playground: ${subject}`,
        text,
        to,
        files
    }, (err, res) => err ? reject(err) : resolve(res));
});
