const Course = require("../models/Course");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from the database
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses); // Send courses as response
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: err.message });
  }
};

module.exports = getCourses;
