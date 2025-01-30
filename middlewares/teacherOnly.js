const teacherOnly = async (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied!, Teachers Only" });
  }
  next();
};

module.exports = teacherOnly;
