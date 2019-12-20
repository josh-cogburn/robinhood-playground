const sendEmail = require('../utils/send-email');
module.exports = async () => {
  sendEmail('testing', 'body');
}