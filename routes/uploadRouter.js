const express = require("express");
const upload = require("../config/multer");
const {
  uploadVideo,
  uploadDocument,
  uploadResource,
} = require("../controllers/uploadController");
const authenticate = require("../middlewares/authenticate");
const teacherOnly = require("../middlewares/teacherOnly");

const router = express.Router();

router.post(
  "/:courseId/sections/:sectionId/upload-video",
  authenticate,
  teacherOnly,
  upload.single("video"),
  uploadVideo
);
router.post(
  "/:courseId/sections/:sectionId/upload-document",
  authenticate,
  teacherOnly,
  upload.single("document"),
  uploadDocument
);
router.post(
  "/:courseId/sections/:sectionId/upload-resource",
  authenticate,
  teacherOnly,
  upload.single("resource"),
  uploadResource
);

module.exports = router;
