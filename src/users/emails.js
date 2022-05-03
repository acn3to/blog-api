const nodemailer = require("nodemailer");

async function sendEmail(user) {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5fe38692c6aa09",
      pass: "b0578b66dc5848",
    },
  });

  await transport.sendMail({
    from: '"Code Blog" <noreply@codeblog.com>',
    to: user.email,
    subject: "Welcome!",
    text: "Hey, there! Welcome new user.",
    html: "<h1>Welcome!</h1> <p>Welcome new user.</p>",
  });
}

module.exports = { sendEmail };
