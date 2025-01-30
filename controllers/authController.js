const User = require("../models/User");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { authEmailValidator, authPasswordValidator } = require("../utils/auth");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!authEmailValidator(email) || !authPasswordValidator(password)) {
      throw new Error("Invalid credentials");
    }
    // check if user exists

    const userExists = await User.findOne({ email });

    if (userExists) {
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

    if (!userExists) {
      throw new Error("Invalid credentials"); // can let them know if user exixsts or not????
    }

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
      .json({ message: "Invalid Credentials", error: err.message });
  }
};

module.exports = { signin, signup };
