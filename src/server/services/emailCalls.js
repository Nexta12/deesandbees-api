
const transporter  = require("./emailServer");
const {OTPEmailTemplate, NotificationEmailTemplate } = require("./emailTemplate");


module.exports = {

  sendOTPemail: async (otpDetails) => {
    try {

      const mailOptions = {
        from: `"Dees And Bees" <${process.env.USER_EMAIL}>`,
        to: otpDetails.email,
        subject: "Your OTP Code",
        html: OTPEmailTemplate(otpDetails),
        headers: {
          "List-Unsubscribe":
            "<https://deesandbees.com/unsubscribe>, <mailto:unsubscribe@deesandbees.com>",
        },
      };

      await transporter.sendMail(mailOptions);
      console.log('Email Sent')
    } catch (err) {
      console.log(err)
    }
  },

  sendNotificationEmail: async (noticeDetails) => {
   try {
    const { to, name, subject, message } = noticeDetails;

    if (!to || !subject || !message) {
      throw new Error("Missing required email fields (to, subject, message).");
    }

    const mailOptions = {
      from: `"Dees And Bees" <${process.env.USER_EMAIL}>`,
      to,
      subject,
      html: NotificationEmailTemplate({ name, subject, message }),
      headers: {
        "List-Unsubscribe":
          "<https://deesandbees.com/unsubscribe>, <mailto:unsubscribe@deesandbees.com>",
      },
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Notification email sent to:", to);
  } catch (err) {
    console.error(err.message);
  }
  },
 
};
