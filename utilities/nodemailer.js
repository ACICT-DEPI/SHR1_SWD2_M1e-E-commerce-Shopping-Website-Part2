const nodemailer = require("nodemailer");
const emailTemplate = require("../templates/emailTemplate");
const { sendSuccessResponse, sendErrorResponse } = require("./sendResponse");

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

const sendMessageEmail = async ({ email, name, messageBody }) => {
  return await transporter.sendMail({
    from: `${email}`, // Sender's name and email
    to: process.env.EMAIL_ADDRESS, // Email address to send the contact form (e.g., your email)
    subject: `Message from ${name}`, // Subject line of the email
    html: `${messageBody}`, // Plain text body of the email
  });
};

module.exports = { sendPasswordResetEmail, sendMessageEmail };
