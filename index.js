require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const nodemailer = require("nodemailer");

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
  console.log(process.env.MAIL_USERNAME);

  // Create a Transporter object
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  // Create a MailOptions Object
  let mailOptions = {
    from: `${process.env.MAIL_USERNAME}@gmail.com`,
    to: "test-le2l6wnh2@srv1.mail-tester.com",
    subject: "Nodemailer Project",
    text: "Hi from your nodemailer project",
  };

  // Use the Transporter.sendMail method
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
});
