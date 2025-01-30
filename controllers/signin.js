const User = require("../models/User");
const Course = require("../models/Course");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authEmailValidator, authPasswordValidator } = require("../utils/auth");
const signin = async (req, res) => {
  try {
    console.log("entering signin");
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

module.exports = signin;
