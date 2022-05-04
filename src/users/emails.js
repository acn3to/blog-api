const nodemailer = require("nodemailer");

class Email {
  async sendEmail() {
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5fe38692c6aa09",
        pass: "b0578b66dc5848",
      },
    });
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
