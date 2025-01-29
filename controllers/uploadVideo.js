const Course = require("../models/Course");

const fs = require("fs");
const path = require("path");

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) throw Error("file is required");
    const { courseId, sectionId } = req.params;

    const videoUrl = `uploads/videos/${req.file.filename}`;

    //find course and update section content
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Add video to section content
    section.content.push({
      title: req.body.title || "Untitled Video",
      type: "video",
      url: videoUrl,
      description: req.body.description || "",
      details: {
        videoUrl: videoUrl,
        duration: req.body.duration || 0, // Duration in minutes
      },
      order: section.content.length + 1,
    });

    await course.save();
    res.status(201).json({ message: "Video uploaded successfully", videoUrl });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) throw Error("file is required");
    const { courseId, sectionId } = req.params;

    const documentUrl = `uploads/documents/${req.file.filename}`;

    //find course and update section content
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Add video to section content
    section.content.push({
      title: req.body.title || "Untitled Video",
      type: "document",
      url: documentUrl,
      description: req.body.description || "",
      details: {
        documentUrl: documentUrl,
        duration: req.body.duration || 0, // Duration in minutes
      },
      order: section.content.length + 1,
    });

    await course.save();
    res
      .status(201)
      .json({ message: "Document uploaded successfully", documentUrl });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const uploadResource = async (req, res) => {
  try {
    if (!req.file) throw Error("file is required");
    const { courseId, sectionId } = req.params;

    const fileUrl = `uploads/resource/${req.file.filename}`;

    console.log(req.file);
    //find course and update section content
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const section = course.sections.id(sectionId);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Add video to section content
    section.content.push({
      title: req.body.title || "Untitled Video",
      type: "resource",
      url: fileUrl,
      description: req.body.description || "",
      details: {
        fileUrl: fileUrl,
        duration: req.body.duration || 0, // Duration in minutes
      },
      order: section.content.length + 1,
    });

    await course.save();
    res.status(201).json({ message: "File uploaded successfully", fileUrl });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { uploadVideo, uploadDocument, uploadResource };
