const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://smt-echnology.vercel.app", "https://smtech24.com"],
  })
);
app.use(express.json());

app.post("/contact-us", async (req, res) => {
  const { name, email, company_name, service, category, message } = req.body;

  console.log(req.body);

  const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
      user: `${process.env.CPANEL_EMAIL}`,
      pass: `${process.env.CPANEL_EMAIL_PASS}`,
    },
    pool: true,
  });

  // Receive user Email
  const contactMailOptions = {
    from: "test@smtech24.com", // Correct sender address to match SMTP credentials
    to: `${process.env.CPANEL_EMAIL}`,
    subject: `Message from ${name}`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
    
        h2 {
          margin-bottom: 10px;
        }
    
        p {
          margin-bottom: 20px;
        }
    
        table {
          width: 100%;
          border-collapse: collapse;
        }
    
        th, td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
    
        th {
          background-color: #f2f2f2;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Contact Form Submission</h2>
        <p>A new message has been submitted via the contact form:</p>
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company Name</th>
            <th>Service</th>
            <th>Category</th>
            <th>Message</th>
          </tr>
          <tr>
            <td>Name</td>
            <td>${name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>${email}</td>
          </tr>
          <tr>
            <td>Company Name</td>
            <td>${company_name}</td>
          </tr>
          <tr>
            <td>Service</td>
            <td>${service}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>${category}</td>
          </tr>
          <tr>
            <td>Message</td>
            <td>${message}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
    `,
  };

  // Send user feedback Email
  const feedbackMailOptions = {
    from: "test@smtech24.com", // Correct sender address to match SMTP credentials
    to: email,
    subject: `Received your Information`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #e8f3f0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
    
        .logo {
          width: 100px;
          height: auto;
        }
    
        .content {
          margin-bottom: 20px;
        }
    
        .footer {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://i.ibb.co/d6X8Lky/download.png" alt="SM Tech Logo" class="logo">
        </div>
        <div class="content">
          <h2>Dear ${name},</h2>
          <p>Thank you for reaching out to us! Your message has been successfully received, and we appreciate the time you took to contact us.</p>
          <p>Our team is dedicated to providing prompt and helpful assistance, and we will review your inquiry as soon as possible. Rest assured, we prioritize each message we receive and strive to respond in a timely manner.</p>
          <p>If your inquiry is urgent or requires immediate attention, please feel free to contact us directly at [Your Contact Information].</p>
          <p>Once again, thank you for choosing to connect with us. We look forward to assisting you and addressing any questions or concerns you may have.</p>
          <p>Best Regards,</p>
          <p style="font-weight: bold;">SM Technology</p>
        </div>
        <div class="footer">
          <p>Follow us on social media:</p>
          <a href="#"><img src="https://i.ibb.co/8YxhTX8/facebook.png" alt="Facebook"></a>
          <a href="#"><img src="https://i.ibb.co/BL97S32/linkedin.png" alt="LinkedIn"></a>
          <p><a href="https://smtech24.com" style="color: #000; font-weight: bold;">SMTECH24.COM</a></p>
          <p>&copy; 2024 All rights reserved SMTECH24</p>
        </div>
      </div>
    </body>
    </html>
    
    `,
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
