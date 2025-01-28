const express = require("express");

// -- controllers
const signup = require("./controllers/signup");
const signin = require("./controllers/signin");
const createCourse = require("./controllers/createCourse");
const authenticate = require("./controllers/authenticate");
const subscribe = require("./controllers/subscribe");
const teacherOnly = require("./controllers/teacherOnly");

const dotenv = require("dotenv");

const connectDB = require("./config/db");
const app = express();
exports.app = app;

dotenv.config();
app.use(express.json());
// app.use("/api/auth", authRoutes);

app.post("/signup", signup);
app.post("/signin", signin);
app.post("/createcourse", authenticate, teacherOnly, createCourse);
app.post("/:courseId/subscribe", authenticate, subscribe);

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
