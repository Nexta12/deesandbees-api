
const { emailBaseTemplate } = require("./emailBaseTemplate");

exports.OTPEmailTemplate = ({ name, otp }) => {
  const content = `
    <h2>Hello ${name || "User"},</h2>
    <p class="message">Use the OTP below to verify your request. This code will expire in <b>10 minutes</b>.</p>
    <div class="otp-box">${otp}</div>
    <p class="message">If you did not request this, please ignore this email.</p>
  `;

  return emailBaseTemplate({
    title: "Your OTP Code",
    headerText: "Dees And Bees Verification",
    content,
  });
};

exports.NotificationEmailTemplate = ({ name, subject, message }) => {
  const content = `
    <h2>Hello ${name || "User"},</h2>
    <p class="message">${message}</p>
    <p style="margin-top: 30px;">Best regards,<br/>The Dees & Bees Global Team</p>
  `;

  return emailBaseTemplate({
    title: subject || "New Notification",
    headerText: "Dees And Bees Notification",
    content,
  });
};
