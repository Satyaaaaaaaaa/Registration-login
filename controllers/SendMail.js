const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

async function sendMail(to, message) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: "OTP Verification",
      text: message,
    });

    console.log("Email sent successfully!");
    console.log(message);
    
  } catch (error) {
    console.error("Error sending email:", error.message);
  }

}

module.exports = sendMail;
