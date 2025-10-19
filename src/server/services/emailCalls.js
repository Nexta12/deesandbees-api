
const transporter  = require("./emailServer");
const {OTPEmailTemplate } = require("./emailTemplate");


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
            "<https://happies.com/unsubscribe>, <mailto:unsubscribe@deesandbees.com>",
        },
      };

      await transporter.sendMail(mailOptions);
      console.log('Email Sent')
    } catch (err) {
      console.log(err)
    }
  },
 
};
