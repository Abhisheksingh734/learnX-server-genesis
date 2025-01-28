const User = require("../models/User");
const Course = require("../models/Course");

const subscribe = async (req, res) => {
  // get the course id

  try {
    const courseId = req.params.courseId;

    // check if user already subsribed to that course

    const s_user = await User.findById(req.user.id);

    //check if course is of the user.
    console.log(req.user);

    const s_course = await Course.findById(courseId);
    console.log(s_course);
    if (s_user.id === s_course.instructor) {
      return res
        .status(401)
        .json({ message: "Cannot subscribe to own course" });
    }

    if (s_user.courses.some((x) => x == courseId)) {
      return res
        .status(400)
        .json({ message: "Already Subscirbed to the Course!" });
    }
    // push to users courses.

    s_user.courses.push(courseId);

    await s_user.save();

    res.status(201).json({ message: "Subscribed" });
  } catch (err) {
    res
      .status(501)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = subscribe;
