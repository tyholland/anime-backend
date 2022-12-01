const nodemailer = require('nodemailer');
const { emailUsername, emailSMTPPassword } = require('../config');

module.exports.sendEmail = async (fromEmail, toEmail, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      service: 'SendinBlue',
      port: 587,
      auth: {
        user: emailUsername,
        pass: emailSMTPPassword,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
    });

    return true;
  } catch (error) {
    return false;
  }
};
