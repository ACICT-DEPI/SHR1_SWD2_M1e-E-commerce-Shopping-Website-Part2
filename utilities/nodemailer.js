const nodemailer = require("nodemailer");
const emailTemplate = require("../templates/emailTemplate");

// Configure your SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send reset password email
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const htmlContent = emailTemplate(resetLink);
    await transporter.sendMail({
      from: "Trade Sphere",
      to: email,
      subject: "Password Reset Request",
      html: htmlContent, // html body
    });
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendPasswordResetEmail;
