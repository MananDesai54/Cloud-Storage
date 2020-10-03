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

module.exports = (token) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: "manan5401desai@gmail.com",
    subject: "Test",
    html: verifyHtml(token),
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err.message);
    console.log("Mail sent.");
  });
};
