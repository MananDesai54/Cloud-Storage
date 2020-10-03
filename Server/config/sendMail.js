const nodeMailer = require("nodemailer");

module.exports = (user) => {
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
    text: "test",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.log(err.message);
    console.log(info);
  });
};
