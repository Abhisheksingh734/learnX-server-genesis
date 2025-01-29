const User = require("../models/User");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { authEmailValidator, authPasswordValidator } = require("../utils/auth");

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

module.exports = signup;
