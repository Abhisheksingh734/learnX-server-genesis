const express = require("express");

const {
  getUserProfile,
  getUserPublicProfile,
} = require("../controllers/userController");

const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/profile", authenticate, getUserProfile);
router.get("/:userId/profile", getUserPublicProfile);

module.exports = router;
