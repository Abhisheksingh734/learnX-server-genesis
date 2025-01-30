const express = require("express");

const {
  createCourse,
  getCourses,
  addSection,
  subscribe,
} = require("../controllers/courseController");
const authenticate = require("../middlewares/authenticate");
const teacherOnly = require("../middlewares/teacherOnly");

const router = express.Router();

router.get("/", getCourses);
router.post("/create", authenticate, teacherOnly, createCourse);
router.post("/:courseId/subscribe", authenticate, subscribe);
router.post("/:courseId/add-section", authenticate, teacherOnly, addSection);

module.exports = router;
