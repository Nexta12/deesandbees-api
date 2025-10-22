// emailBaseTemplate.js

exports.emailBaseTemplate = ({ title, headerText, content }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }
      .header {
        background: #ff7b00;
        color: #ffffff;
        padding: 20px 40px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        letter-spacing: 1px;
      }
      .content {
        padding: 30px 40px;
        color: #333333;
        text-align: center;
      }
      .content h2 {
        color: #222222;
        margin-bottom: 10px;
        font-size: 20px;
      }
      .footer {
        background: #f9fafb;
        padding: 20px 40px;
        font-size: 13px;
        color: #777777;
        text-align: center;
      }
      .footer a {
        color: #ff7b00;
        text-decoration: none;
      }
      .otp-box {
        display: inline-block;
        background: #f0f0f0;
        border: 2px dashed #ff7b00;
        border-radius: 8px;
        padding: 15px 25px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #222222;
        margin: 20px 0;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>${headerText}</h1>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Dees And Bees. All rights reserved.</p>
        <p>
          Need help? Contact us at 
          <a href="mailto:info@deesandbees.com">info@deesandbees.com</a>
        </p>
      </div>
    </div>
  </body>
  </html>`;
};
