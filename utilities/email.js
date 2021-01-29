const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  await transporter.sendMail({
    from: '"Dimitris Arabatzis" <dimitris@outlook.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  });
};

module.exports = sendEmail;
