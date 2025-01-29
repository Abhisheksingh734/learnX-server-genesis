const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sections: {
      type: [
        {
          title: { type: String, required: true },
          order: { type: Number, required: true },
          content: [
            {
              title: { type: String, required: true },
              type: {
                type: String,
                required: true,
                enum: ["video", "document", "quiz", "assignment", "resource"],
              },
              url: String,
              description: String,
              // Different content types can have different properties
              details: {
                // For videos
                videoUrl: String,
                duration: Number, // in minutes
                // For documents/resources
                fileUrl: String,
                fileType: String, // pdf, doc, etc.
                // For assignments
                instructions: String,
                dueDate: Date,
                // For quizzes
                questions: [
                  {
                    question: String,
                    options: [String],
                    correctAnswer: Number,
                  },
                ],
              },
              order: { type: Number, required: true },
            },
          ],
        },
      ],
      default: [],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    prerequisites: [String],
    whatYouWillLearn: [String],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
