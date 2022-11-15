require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// for No 'Access-Control-Allow-Origin' error
app.use(cors());

app.post("/", async (req, res) => {
  let emailTo = req.headers.email;
  let text = req.headers.text;
  var accessToken;

  text = decodeURIComponent(text);

  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  try {
    accessToken = await oAuth2Client.getAccessToken();
  } catch (error) {
    accessToken = 'not working';
    console.log("accessToken error: " + error);
  }

  if (accessToken != 'not working') {
    // Create a Transporter object
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
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
  } else {
    res.json({ result: "Error", to: emailTo, message: text });
  }

  
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
