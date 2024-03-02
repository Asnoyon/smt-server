const express = require("express");
const cors = require("cors");
require("dotenv").config();
const nodmailer = require("nodemailer");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.post("/contact-us", (req, res) => {
  const { email, name, message, category, subCategory } = req.body;

  const transporter = nodmailer.createTransport({
    host: `${process.env.SMTP}`,
    port: 400,
    secure: false,
    auth: {
      user: `${process.env.CPANEL_EMAIL}`,
      pass: `${process.env.CPANEL_EMAIL_PASS}`,
    },
  });

  // Send user feedback Email
  const feedbackMailOptions = {
    from: `${process.env.SMTP}`,
    to: email,
    subject: `Recived your Ticket`,
    html: `<p>Thank your for rechingout</p>`,
  };

  // Resive user Email

  transporter.sendMail(feedbackMailOptions, (error, info) => {
    if (error) {
      console.log(`Error sending email ${error}`);
    } else {
      console.log(`Message Sended success fully ${info.response}`);
    }
  });

  const contactMailOptions = {
    from: email,
    to: `${process.env.CPANEL_EMAIL}`,
    subject: `message came from SMT contact from sender ${name}`,
    htmml: `<p>'${email}', '${name}'</p>`,
  };

  transporter.sendMail(contactMailOptions, (error, info) => {
    if (error) {
      console.log(`Errro happen for ${error}`);
      res.status(500).send({ message: "Error Sending Email" });
    } else {
      console.log("Email Sended Successfully");
      res.status(200).send({
        message: "Thank you for reaching out. We will contact you shortly.",
      });
    }
  });
});
app.get("/", (req, res) => {
  res.status(200).send({ messgae: "OK" });
});

app.listen(port, () => {
  console.log(`my server is running port ${port}`);
});
