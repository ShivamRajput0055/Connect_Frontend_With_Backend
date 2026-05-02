const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/database.js");
const studentRouter = require("./routes/student.routes.js");
const { MulterError } = require("multer");
const cors = require("cors");
const path = require("path");
dotenv.config();
//cors options
const corsOptions = {
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
//in-built-middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//database connection
connectDB();
//.env variable's value
const PORT = process.env.PORT || 6500;
//user-built middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/student", cors(corsOptions), studentRouter);

//error-middleware
app.use((error, req, res, next) => {
  if (error instanceof MulterError) {
    return res
      .status(400)
      .send(`Image Error Found: ${error.message} : ${error.code}`);
  } else if (error) {
    return res.status(500).send(`Something went wrong : ${error.message}`);
  }
  next();
});
app.use("", (req, res, next) => {
  res.status(404).json({ message: "404! Page not Found." });
});

app.listen(PORT, () => {
  console.log(`App is listening at this url i.e, http://localhost:${PORT}`);
});

//creating object for cors
// const corsOptions = {
//   origin: "http://mydomain.com", // jis site ko allow karna hai
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // allowed methods
//   credentials: true, // cookies / auth headers allow
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
/*origin
👉 “Sirf yeh website hi meri API ko hit kar sakti hai”

methods
👉 “Yeh website in sab operations (get, create, update, delete) kar sakti hai”

credentials: true
👉 “Login/session wali info bhi bhejne do (cookies, tokens)”

allowedHeaders
👉 “Frontend request me kaunse headers bhej sakta hai (jaise auth token)”*/
