const path = require("path");
const { generateRandomNameForFile } = require("../helpers/common.helper");
const { hashValue, verifyHash } = require("../helpers/hash.helper");
const { sendResponse } = require("../helpers/requestHandler.helper");
const userService = require("../services/user.service");

/**
 * Description: Create a task
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON
 */
exports.fetchProfile = async (req, res, next) => {
  try {
    const result = await userService.findOne(
      {
        email: req.user.email,
      },
      {
        password: 0,
        emailVerificationToken: 0,
        refreshToken: 0,
        refreshTokenExpireAt: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        userType: 0,
      }
    );
    return sendResponse(res, true, 200, "Profile Fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const payload = req.validated;

    if (
      payload?.password &&
      payload?.current_password &&
      payload?.confirm_password
    ) {
      const result = await userService.findOne({
        email: req.user.email,
      });

      if (
        result === null ||
        !(await verifyHash(payload.current_password, result.password))
      ) {
        return sendResponse(res, false, 400, "Current password didn't matched");
      }

      await userService.updateUserById(req.user._id, {
        password: await hashValue(payload.password),
      });
    }

    if (
      payload?.name ||
      payload?.email_notification ||
      payload?.push_notification
    ) {
      await userService.updateUserById(req.user._id, {
        name: payload.name,
        notification: {
          emailNotification: payload?.email_notification,
          pushNotification: payload?.push_notification,
        },
      });
    }

    if (req.files?.profileImage) {
      const fileName = generateRandomNameForFile(req.files?.profileImage);
      const profileImagePath = path.join(
        __dirname,
        "..",
        "public",
        "images",
        fileName
      );
      console.log(profileImagePath, ">>>profileImagePath");
      req.files.profileImage.mv(profileImagePath);

      await userService.updateUserById(req.user._id, {
        profileImage: "/images/" + fileName,
      });
    }

    return sendResponse(res, true, 200, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};
