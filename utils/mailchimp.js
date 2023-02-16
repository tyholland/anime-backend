const mailchimp = require('@mailchimp/mailchimp_marketing');
let emails;

const connectToMailchimp = () => {
  emails = mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER,
  });

  return emails;
};

module.exports.instance = () => {
  if (emails) {
    return emails;
  }

  return connectToMailchimp();
};
