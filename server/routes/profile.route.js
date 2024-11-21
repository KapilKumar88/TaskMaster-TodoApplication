const express = require("express");
const router = express.Router();
const profileController = require("../controller/profile.controller");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware");
const {
  updateProfileValidation,
} = require("../validationSchema/profile-schema");

router.put(
  "/update-profile",
  isAuthenticated,
  updateProfileValidation,
  profileController.updateProfile
);
router.get("/user-profile", isAuthenticated, profileController.fetchProfile);

module.exports = router;
