const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

// userId

const getUserPublicProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User doesnot exist" });
    }

    res.status(201).json(user);
  } catch (err) {
    res
      .status(501)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

module.exports = { getUserProfile, getUserPublicProfile };
