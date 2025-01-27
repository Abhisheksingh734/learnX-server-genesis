const express = require("express");
const User = require("./models/User");
// const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const dotenv = require("dotenv");

const connectDB = require("./config/db");
const app = express();

dotenv.config();
app.use(express.json());
// app.use("/api/auth", authRoutes);

const signup = async (req, res) => {
  try {
    // get data from req
    // console.log(req.body);
    const { name, email, password, role } = req.body;

    // check if user exists

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("This user Already exists blud", userExists);
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
      .json({ message: "Internal server error", error: err.message });
  }
};

app.post("/signup", signup);

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
