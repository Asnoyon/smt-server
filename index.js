const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
  {
    origin: ['http://localhost:3000'],
  }
));
app.use(express.json());

app.post("/contact-us", async (req, res) => {
  const { name, email } = req.body;

  console.log(req.body);

  const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
      user: `${process.env.CPANEL_EMAIL}`,
      pass: `${process.env.CPANEL_EMAIL_PASS}`,
    },
  });

  // Receive user Email
  const contactMailOptions = {
    from: "test@smtech24.com", // Correct sender address to match SMTP credentials
    to: `${process.env.CPANEL_EMAIL}`,
    subject: `Message from ${name}`,
    html: `<p>Email: ${email}<br>Name: ${name}</p>`,
  };

  // Send user feedback Email
  const feedbackMailOptions = {
    from: "test@smtech24.com", // Correct sender address to match SMTP credentials
    to: email,
    subject: `Received your Ticket`,
    html: `<p>Thank you for reaching out.</p>`,
  };

  try {
    // Send feedback email
    const feedbackInfo = await transporter.sendMail(feedbackMailOptions);
    console.log(`Feedback Email sent successfully: ${feedbackInfo.response}`);

    // Send contact email
    const contactInfo = await transporter.sendMail(contactMailOptions);
    console.log("Contact Email sent successfully");

    // Respond to client
    res.status(200).send({
      success: true,
      message: "Thank you for reaching out. We will contact you shortly.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ success: false, message: "Error Sending Email" });
  }
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "OK" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
