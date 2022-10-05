require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const nodemailer = require("nodemailer");

// for No 'Access-Control-Allow-Origin' error
app.use(cors());

app.post("/", (req, res) => {
  let emailTo = req.headers.email;
  let text = req.headers.text;

  text = decodeURIComponent(text);

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
    to: emailTo,
    subject: "Made-up purchase from Johannes Demissie",
    text: text,
  };

  // Use the Transporter.sendMail method
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
      res.json({ result: "Error", to: emailTo, message: text });
    } else {
      console.log("Email sent successfully");
      res.json({ result: "Success", to: emailTo, message: text });
    }
  });
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
