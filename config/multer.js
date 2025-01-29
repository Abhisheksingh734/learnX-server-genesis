const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    if (file.fieldname === "video") {
      folder = "uploads/videos/";
    } else if (file.fieldname === "document") {
      folder = "uploads/documents/";
    } else if (file.fieldname === "resource") {
      folder = "uploads/resources/";
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
  //   const allowedTypes = [
  //     "video/mp4",
  //     "video/mov",
  //     "video/avi",
  //     "application/pdf",
  //     "application/msword",
  //     "text",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   ];
  //   if (allowedTypes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Invalid file type. Only video files are allowed."), false);
  //   }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
});

module.exports = upload;
