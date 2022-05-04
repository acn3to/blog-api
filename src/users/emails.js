const nodemailer = require("nodemailer");

const productionEmailConfiguration = {
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
};

const testEmailConfiguration = () => ({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

function createEmailConfiguration() {
  if (process.env.NODE_ENV === "production") {
    return productionEmailConfiguration;
  } else {
    return testEmailConfiguration();
  }
}

class Email {
  async sendEmail() {
    const emailConfiguration = createEmailConfiguration();
    const transport = nodemailer.createTransport(emailConfiguration);
    transport.sendMail(this);
  }
}

class VerificationEmail extends Email {
  constructor(user, address) {
    super();
    this.from = '"Code Blog" <noreply@codeblog.com>';
    this.to = user.email;
    this.subject = "Email verification";
    this.text = `Hello! Verify your email: ${address}`;
    this.html = `<h1>Hello!</h1> Verify your email: <a href="${address}">${address}</a>`;
  }
}

module.exports = { VerificationEmail };
