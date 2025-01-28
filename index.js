const express = require("express");
const User = require("./models/User");
const Course = require("./models/Course");
// const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authEmailValidator, authPasswordValidator } = require("./utils/auth");

const dotenv = require("dotenv");

const connectDB = require("./config/db");
const app = express();

dotenv.config();
app.use(express.json());
// app.use("/api/auth", authRoutes);

// authenticate - check the authorization token is valid or not

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403);

    req.user = user;
    next();
  });
};

const teacherOnly = async (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied!, Teachers Only" });
  }
  next();
};

const signup = async (req, res) => {
  try {
    // get data from req
    // console.log(req.body);
    const { name, email, password, role } = req.body;

    if (!authEmailValidator(email) || !authPasswordValidator(password)) {
      throw new Error("Invalid credentials");
    }
    // check if user exists

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("This user already exists blud", userExists);
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    // create user

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
    });

    await newUser.save();

    //generate token

    const data = { id: newUser._id, email: newUser.email, role: newUser.role };

    const token = jwt.sign(data, process.env.JWT_SECRET_KEY);

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Some error occurred", error: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!authEmailValidator(email) || !authPasswordValidator(password)) {
      throw new Error("Invalid credentials");
    }

    const userExists = await User.findOne({ email });

    if (!userExists) throw new Error("Invalid credentials"); // can let them know if user exixsts or not????

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      throw new Error("Invalid Credentials");
    }

    //generate token
    const data = {
      id: userExists._id,
      name: userExists,
      role: userExists.role,
    };
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY);

    res.status(201).json({
      id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      role: userExists.role,
      token,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Some Error was Occurred!", error: err.message });
  }
};

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
      totalLectures: sections.reduce(
        (total, section) => total + section.content.length,
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
app.post("/signup", signup);
app.post("/signin", signin);
app.post("/createcourse", authenticate, teacherOnly, createCourse);
app.post("/:courseId/subscribe", authenticate, subscribe);

connectDB()
  .then(() => {
    console.log("Connection Established...");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Connection unsuccessful:", err.message);
  });
