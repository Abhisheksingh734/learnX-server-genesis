const express = require("express");

// -- controllers
const signup = require("./controllers/signup");
const signin = require("./controllers/signin");
const createCourse = require("./controllers/createCourse");
const authenticate = require("./controllers/authenticate");
const subscribe = require("./controllers/subscribe");
const teacherOnly = require("./controllers/teacherOnly");
const addSection = require("./controllers/addSection");
const getCourses = require("./controllers/getCourses");
const getUserProfile = require("./controllers/getUserProfile");
const getUserPublicProfile = require("./controllers/getUserPublicProfile");
const upload = require("./config/multer");
const {
  uploadVideo,
  uploadDocument,
  uploadResource,
} = require("./controllers/uploadVideo");

const dotenv = require("dotenv");

const connectDB = require("./config/db");
const app = express();
exports.app = app;

dotenv.config();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// app.use("/api/auth", authRoutes);

app.post("/signup", signup);
app.post("/signin", signin);
app.post("/createcourse", authenticate, teacherOnly, createCourse);

app.get("/user/profile", authenticate, getUserProfile);
app.get("/courses", getCourses);
app.get("/user/:userId/profile", getUserPublicProfile);

app.post("/:courseId/subscribe", authenticate, subscribe);
app.post(
  "/courses/:courseId/add-section",
  authenticate,
  teacherOnly,
  addSection
);

app.post(
  "/courses/:courseId/sections/:sectionId/upload-video",
  authenticate,
  teacherOnly,
  upload.single("video"),
  uploadVideo
);
app.post(
  "/courses/:courseId/sections/:sectionId/upload-document",
  authenticate,
  teacherOnly,
  upload.single("document"),
  uploadDocument
);
app.post(
  "/courses/:courseId/sections/:sectionId/upload-resource",
  authenticate,
  teacherOnly,
  upload.single("resource"),
  uploadResource
);

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
