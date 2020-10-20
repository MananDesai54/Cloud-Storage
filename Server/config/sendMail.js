const nodeMailer = require("nodemailer");

const verifyHtml = (token) => `
  <div class="mail" style="padding:10px;background: #36393f;width: 90%;font-family: Verdana, Geneva, Tahoma, sans-serif;color: #eee;">
    <h1>Hey there, Welcome to Buckiee.</h1>
    <p>
      Before accessing to all amazing features of Buckiee first confirm you
      email by pressing the below button.
    </p>
    <a href="http://localhost:5000/api/auth/verification/${token}" style="text-decoration:none;padding: 10px;outline: none;border: none;border-radius: 5px;background: #7289da;color: #eee;
    font-size: 18px;cursor: pointer;">Confirm</a>
  </div>
`;

const forgotPasswordHtml = (token) => `
  <div class="mail" style="padding:10px;background: #36393f;width: 90%;font-family: Verdana, Geneva, Tahoma, sans-serif;color: #eee;">
    <h1>Hey there..!</h1>
    <p>
      Click the button below to reset your password
    </p>
    <a href="http://localhost:5000/api/users/request-reset-password/${token}" style="text-decoration:none;padding: 10px;outline: none;border: none;border-radius: 5px;background: #7289da;color: #eee;
    font-size: 18px;cursor: pointer;">Reset Password</a>
  </div>
`;

module.exports = async (token, email, subject, verify) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: subject,
    html: verify ? verifyHtml(token) : forgotPasswordHtml(token),
  };

  let info = await transporter.sendMail(mailOptions);
  return info;
};
