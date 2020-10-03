require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./config/dbConfig");
const morgan = require("morgan");
const passport = require("passport");
const expressSession = require("express-session");
const cors = require("cors");
const sendMail = require("./config/sendMail");

const app = express();
const PORT = process.env.PORT || 5000;
connectToDatabase();

//passport config
require("./config/passport")(passport);

//cors
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  express.json({
    extended: false,
  })
);

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json("API running.");
});
app.get("/dashboard", (req, res) => {
  res.json("Dashboard");
});

//router
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/cloud", require("./routes/cloudRoutes"));

sendMail();

app.listen(PORT, () => console.log(`Server is running at 127.0.0.1:${PORT}/`));
