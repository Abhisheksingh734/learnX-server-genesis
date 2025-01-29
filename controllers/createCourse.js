const User = require("../models/User");
const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      level,
      category,
      prerequisites,
      whatYouWillLearn,
      sections,
    } = req.body;

    const course = await new Course({
      title,
      description,
      instructor: req.user.id,
      price,
      level,
      category,
      prerequisites,
      whatYouWillLearn,
      sections,
      totalLectures: (sections || []).reduce(
        (total, section) => total + (section.content || []).length,
        0
      ),
    });

    await course.save();
    const user = await User.findById(req.user.id);

    user.courses.push(course._id);

    await user.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = createCourse;
