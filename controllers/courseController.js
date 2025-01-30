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

const addSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Section title is required" });
    }
    // find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    //check if instructor own the course
    if (course.instructor.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this course" });
    }

    // Check for duplicate order
    if (order) {
      const existingSection = course.sections.find(
        (section) => section.order === order
      );
      if (existingSection) {
        // If duplicate order found, shift all sections with same or higher order
        course.sections.forEach((section) => {
          if (section.order >= order) {
            section.order += 1;
          }
        });
      }
    }

    // create sction
    const newSection = {
      title,
      order: order || course.sections.length + 1,
      content: [],
    };

    // add section to the course
    course.sections.push(newSection);

    course.sections.sort((a, b) => a.order - b.order);
    await course.save();

    res
      .status(201)
      .json({ message: "Section added successfully", section: newSection });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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

module.exports = { createCourse, subscribe, addSection, getCourses };
