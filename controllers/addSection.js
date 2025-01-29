const Course = require("../models/Course");

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

module.exports = addSection;
