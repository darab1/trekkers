const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.firstName = user.fullName.split(' ')[0];
    this.to = user.email;
    this.url = url;
    this.from = `Dimitris Arabatzis <${process.env.EMAIL_FROM}>`;
  }

  createTransporter() {
    // send emails using sendgrid when we 're in production
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    // send emails using mailtrap when we 're in develoopment
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  async sendEmail(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );
    const text = htmlToText(html);

    await this.createTransporter().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text
    });
  }

  async sendWelcome() {
    await this.sendEmail('welcome', 'Welcome to Trekkers!');
  }
};
