const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const {
  loginValidation,
  registerValidation,
  refreshTokenValidation,
  emailValidation,
  emailVerificationValidation,
  resetPasswordValidation,
} = require("../validationSchema/auth-schema");

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.post(
  "/refreshToken",
  refreshTokenValidation,
  authController.refreshToken
);
router.post(
  "/verify-email",
  emailVerificationValidation,
  authController.verifyEmail
);
router.post(
  "/resend-email-verification",
  emailValidation,
  authController.resendEmailVerificationMail
);
router.post("/forgot-password", emailValidation, authController.forgotPassword);
router.post(
  "/reset-password",
  resetPasswordValidation,
  authController.resetPassword
);

module.exports = router;
