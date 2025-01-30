const User = require("../models/User");

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

module.exports = getUserPublicProfile;
