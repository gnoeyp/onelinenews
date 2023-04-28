const nodemailer = require("nodemailer");

export const send = async (content) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.MAILER_EMAIL,
      clientId: process.env.MAILER_CLIENT_ID,
      clientSecret: process.env.MAILER_CLIENT_PWD,
      refreshToken: process.env.MAILER_REFTKN,
    },
  });

  return await transporter.sendMail({
    from: "NewFeed",
    to: "ephong93@gmail.com",
    subject: "Today's news",
    html: content,
  });
};
