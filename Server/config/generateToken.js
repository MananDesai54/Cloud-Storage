const jwt = require("jsonwebtoken");

module.exports = function (user) {
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  console.log(token.exp, new Date().getTime() / 1000, "h");
  return token;
};

// const token = jwt.sign({ user: "Manan" }, process.env.JWT_SECRET_KEY, {
//   expiresIn: "1d",
// });
// console.log(token);

// console.log(
//   jwt.decode(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiTWFuYW4iLCJpYXQiOjE2MDI2MDk3NDEsImV4cCI6MTYwMjY5NjE0MX0.3iFQbFlGESjeavnS_SeVz4sLmxWPHE9-A0g0mX4Vbfg",
//     process.env.JWT_SECRET_KEY
//   ).exp <
//     new Date().getTime() / 1000
// );
