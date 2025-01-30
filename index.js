const express = require("express");
const morgan = require("morgan");

const dotenv = require("dotenv");

const connectDB = require("./config/db");
const app = express();

dotenv.config();
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//controller ---------------------
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRoutes");
const courseRouter = require("./routes/courseRouter");
const uploadRouter = require("./routes/uploadRouter");

// routers ------------------------------------------------------
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/upload", uploadRouter);

connectDB()
  .then(() => {
    console.log("Connection Established...");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Connection unsuccessful:", err.message);
  });

module.exports = app;
